const dayjs = require("dayjs");
const db = require("./database/models/index");
const { saveConsoleTableToCsv } = require("./utils/writer");
const { insertOrderSimsData } = require("./utils/insertOrderSims");
const { insertMatchListsData } = require("./utils/insertMatchLists");

const Task1 = async () => {
  const date = await db.demand_history.findAll({
    attributes: ["order_placed_datetime"],
    limit: 1,
    order: [["order_placed_datetime", "DESC"]],
    raw: true,
    nested: true,
    include: [{ model: db.sku_mapping, attributes: [] }],
  });
  const specificDatetime = new Date(date[0].order_placed_datetime);

  const forecastWithSkuNumbersForEachMonth = await db.demand_history.findAll({
    where: {
      order_placed_datetime: {
        [db.Sequelize.Op.gte]: db.Sequelize.literal(
          `TIMESTAMP '${specificDatetime.toISOString()}' - INTERVAL '30 days'`
        ),
      },
    },
    attributes: [
      "demand_history.sku",
      [
        db.Sequelize.fn("COUNT", db.Sequelize.col("demand_history.sku")),
        "count",
      ],
    ],
    group: [
      ["demand_history.sku"],
      ["sku_mapping.planning_level"],
      ["sku_mapping.sales_forecast.month"],
      ["sku_mapping.sales_forecast.id"],
    ],
    order: [
      [db.sku_mapping, db.sales_forecast, "month", "ASC"],
      ["sku", "ASC"],
    ],
    raw: true,
    nested: true,
    include: [
      {
        model: db.sku_mapping,
        attributes: ["planning_level"],
        required: true,
        include: [
          {
            model: db.sales_forecast,
            attributes: ["month"],
            required: true,
          },
        ],
      },
    ],
  });

  const totalOrdersEachMonth = {};
  forecastWithSkuNumbersForEachMonth.forEach((forecast) => {
    const month = forecast["sku_mapping.sales_forecast.month"];
    if (!totalOrdersEachMonth[month]) totalOrdersEachMonth[month] = 0;
    totalOrdersEachMonth[month] += parseInt(forecast.count);
  });

  const months = await db.months.findAll({
    raw: true,
  });

  const ordersPerDay = {};
  Object.entries(totalOrdersEachMonth).forEach(([month, orders]) => {
    const { days } = months.find((m) => m.month === month);
    if (!ordersPerDay[month]) ordersPerDay[month] = { dayOrders: 0 };
    ordersPerDay[month]["dayOrders"] += orders / days;
    ordersPerDay[month]["totalOrders"] = orders;
  });

  const dateTimes = {};
  Object.entries(ordersPerDay).forEach(
    ([month, { dayOrders, totalOrders }]) => {
      if (!dateTimes[month]) dateTimes[month] = [];
      let orderCount = 0;
      const orderInterval = 24 / dayOrders;
      const startDate = dayjs(month).startOf("month");
      const endDate = dayjs(month).endOf("month");
      let currentDatetime = startDate;

      while (currentDatetime.isBefore(endDate) && orderCount < totalOrders) {
        dateTimes[month].push(currentDatetime.format("MM-DD-YYYY HH:mm:ss"));
        currentDatetime = currentDatetime.add(orderInterval, "hour");
        orderCount++;
      }
      while (orderCount < totalOrders) {
        dateTimes[month].push(currentDatetime.format("MM-DD-YYYY HH:mm:ss"));
        currentDatetime = currentDatetime.add(1, "hour");
        orderCount++;
      }
    }
  );

  const orderSIMOutput = [];
  const orderPrefix = "orderSIM";
  forecastWithSkuNumbersForEachMonth.forEach((forecast, index) => {
    let dateTimesCount = 0;
    const count = parseInt(forecast.count);
    const month = forecast["sku_mapping.sales_forecast.month"];
    for (let i = 0; i < count; i++, dateTimesCount++) {
      const sku = forecast.sku;
      const orderId = `${orderPrefix}${dateTimesCount + 1}`;
      const order_placed_datetime = dateTimes[month].at(dateTimesCount);
      orderSIMOutput.push({
        sku,
        orderId,
        order_placed_datetime,
      });
    }
  });

  await saveConsoleTableToCsv(orderSIMOutput, "Task1.csv");
  await insertOrderSimsData(db.sequelize.getQueryInterface());
};

const Task2 = async () => {
  const data = await db.sequelize.query(
    `
  SELECT o."orderId", i.inventory_id, o.sku, o.order_placed_datetime,
    i.warehouse_arrival_datetime
    FROM order_sims o
    JOIN inventory_on_hand i ON o.sku = i.sku
    WHERE o.order_placed_datetime = (
      SELECT MIN(order_placed_datetime)
      FROM order_sims
      WHERE sku = o.sku
    )
    AND i.warehouse_arrival_datetime = (
      SELECT MIN(warehouse_arrival_datetime)
      FROM inventory_on_hand
      WHERE sku = i.sku
    );
`,
    { type: db.Sequelize.QueryTypes.SELECT }
  );
  await saveConsoleTableToCsv(data, "Task2.csv");
  await insertMatchListsData(db.sequelize.getQueryInterface());
};

async function main() {
  console.clear();
  await Task1();
  await Task2();
}

main()
  .then(() => {
    db.sequelize.close();
    process.exit(0);
  })
  .catch((e) => {
    console.error("An error occured", e);
    db.sequelize.close();
    process.exit(1);
  });
