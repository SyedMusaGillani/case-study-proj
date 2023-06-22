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

  const data = await db.demand_history.findAll({
    where: {
      order_placed_datetime: {
        [db.Sequelize.Op.gte]: db.Sequelize.literal(
          `TIMESTAMP '${specificDatetime.toISOString()}' - INTERVAL '30 days'`
        ),
      },
    },
    raw: true,
    nested: true,
    include: [
      {
        model: db.sku_mapping,
        attributes: { exclude: ["sku"] },
        required: true,
      },
    ],
  });
  console.table(data);
  console.log("total number of records", data.length);
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
