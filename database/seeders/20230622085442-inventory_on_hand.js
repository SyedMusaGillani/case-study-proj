"use strict";
const path = require("path");
const csv = require("csvtojson");
const { convertDateStringToDate } = require("../../utils/convertStringToDate");
const csvFilePath = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "inventory_on_hand.csv"
);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = await csv({
      colParser: {
        warehouse_arrival_datetime: function (item) {
          return convertDateStringToDate(item);
        },
      },
    }).fromFile(csvFilePath);
    await queryInterface.bulkInsert("inventory_on_hand", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("inventory_on_hand", null, {});
  },
};
