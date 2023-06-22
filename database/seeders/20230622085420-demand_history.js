"use strict";
const path = require("path");
const csv = require("csvtojson");
const { convertDateStringToDate } = require("../../utils/convertStringToDate");
const csvFilePath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "demand_history.csv"
);

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
    await queryInterface.bulkInsert("demand_history", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("demand_history", null, {});
  },
};
