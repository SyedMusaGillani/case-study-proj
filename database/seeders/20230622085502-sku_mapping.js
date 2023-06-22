"use strict";
const path = require("path");
const csv = require("csvtojson");
const csvFilePath = path.join(__dirname, "..", "..", "data", "sku_mapping.csv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = await csv().fromFile(csvFilePath);
    await queryInterface.bulkInsert("sku_mapping", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sku_mapping", null, {});
  },
};
