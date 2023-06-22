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
      timestamps: false,
    }
  );
  demand_history.associate = (models) => {
    demand_history.belongsTo(models.sku_mapping, {
      foreignKey: "sku",
      targetKey: "sku",
    });
  };
  return demand_history;
};
