"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint("sku_mapping", {
      fields: ["sku"],
      type: "unique",
      name: "sku_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("sku_mapping", "sku_unique");
  },
};
