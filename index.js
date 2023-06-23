const dayjs = require("dayjs");
const db = require("./database/models/index");

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
    order: [[db.sku_mapping, db.sales_forecast, "month", "ASC"]],
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
    if (!ordersPerDay[month]) ordersPerDay[month] = 0;
    ordersPerDay[month] += parseFloat((orders / days).toFixed(2));
  });

  const dateTimes = {};
  Object.entries(ordersPerDay).forEach(([month, dayOrders]) => {
    if (!dateTimes[month]) dateTimes[month] = [];
    const orderInterval = parseInt((24 / dayOrders).toFixed(2));
    const startDate = dayjs(month).startOf("month");
    const endDate = dayjs(month).endOf("month");
    let currentDatetime = startDate;

    while (currentDatetime.isBefore(endDate)) {
      dateTimes[month].push(currentDatetime.toDate());

      currentDatetime = currentDatetime.add(orderInterval, "hour");
    }
  });
};

async function main() {
  await Task1();
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
