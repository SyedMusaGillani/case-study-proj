module.exports = (sequelize, DataTypes) => {
  const sku_mapping = sequelize.define(
    "sku_mapping",
    {
      sku: DataTypes.STRING,
      planning_level: DataTypes.STRING,
      lead_time_in_days: DataTypes.NUMBER,
      minimum_order_quantity: DataTypes.NUMBER,
      cost_of_goods_sold: DataTypes.NUMBER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  sku_mapping.associate = (models) => {
    sku_mapping.hasMany(models.demand_history, {
      foreignKey: "sku",
      sourceKey: "sku",
    });
    sku_mapping.belongsTo(models.sales_forecast, {
      foreignKey: "planning_level",
      targetKey: "planning_level",
    });
  };
  return sku_mapping;
};
