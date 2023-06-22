"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint("demand_history", {
      fields: ["sku"],
      type: "foreign key",
      name: "fkey_sku",
      references: {
        table: "sku_mapping",
        fields: ["sku"],
      },
      onDelete: "cascade",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint("demand_history", "fkey_sku");
  },
};
