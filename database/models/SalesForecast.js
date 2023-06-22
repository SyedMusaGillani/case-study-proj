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

  return sales_forecast;
};
