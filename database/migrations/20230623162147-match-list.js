"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("match_list", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orderId: Sequelize.STRING,
      inventory_id: Sequelize.STRING,
      sku: Sequelize.STRING,
      orderId: Sequelize.STRING,
      order_placed_datetime: Sequelize.DATE,
      warehouse_arrival_datetime: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("match_list");
  },
};
