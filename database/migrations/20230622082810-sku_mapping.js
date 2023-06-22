"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sku_mapping", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sku: Sequelize.STRING,
      planning_level: Sequelize.STRING,
      lead_time_in_days: Sequelize.INTEGER,
      minimum_order_quantity: Sequelize.INTEGER,
      cost_of_goods_sold: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sku_mapping");
  },
};
