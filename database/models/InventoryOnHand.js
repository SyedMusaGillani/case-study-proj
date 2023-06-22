module.exports = (sequelize, DataTypes) => {
  const inventory_on_hand = sequelize.define(
    "inventory_on_hand",
    {
      inventory_id: DataTypes.STRING,
      sku: DataTypes.STRING,
      warehouse_arrival_datetime: DataTypes.DATE,
    },
    {
      freezeTableName: true,
    }
  );

  return inventory_on_hand;
};
