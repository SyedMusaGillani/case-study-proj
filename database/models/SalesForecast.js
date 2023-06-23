module.exports = (sequelize, DataTypes) => {
  const sales_forecast = sequelize.define(
    "sales_forecast",
    {
      planning_level: DataTypes.STRING,
      month: DataTypes.DATEONLY,
      forecasted_sales: DataTypes.NUMBER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  sales_forecast.associate = (models) => {
    sales_forecast.hasMany(models.sku_mapping, {
      foreignKey: "planning_level",
      sourceKey: "planning_level",
    });
  };
  return sales_forecast;
};
