module.exports = (sequelize, DataTypes) => {
  const demand_history = sequelize.define(
    "demand_history",
    {
      order_id: DataTypes.STRING,
      sku: DataTypes.STRING,
      order_placed_datetime: DataTypes.DATE,
    },
    {
      freezeTableName: true,
    }
  );

  return demand_history;
};
