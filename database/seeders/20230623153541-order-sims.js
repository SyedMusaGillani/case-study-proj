"use strict";
const path = require("path");
const csv = require("csvtojson");
const { convertDateStringToDate } = require("../../utils/convertStringToDate");
const csvFilePath = path.join(__dirname, "..", "..", "outputs", "Task1.csv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = await csv({
      colParser: {
        order_placed_datetime: function (item) {
          return convertDateStringToDate(item);
        },
      },
    }).fromFile(csvFilePath);
    await queryInterface.bulkInsert("order_sims", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("order_sims", null, {});
  },
};
