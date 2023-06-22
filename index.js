const db = require("./database/models/index");

const Task1 = async () => {
  const data = await db.demand_history.findAll({
    limit: 30,
    raw: true,
    nested: true,
    include: [{ model: db.sku_mapping, attributes: { exclude: ["sku"] } }],
  });
  console.log("data", data);
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
