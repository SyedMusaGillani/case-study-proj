module.exports = (sequelize, DataTypes) => {
  const months = sequelize.define(
    "months",
    {
      month: DataTypes.DATEONLY,
      days: DataTypes.NUMBER,
    },
    {
      freezeTableName: true,
    }
  );

  return months;
};
