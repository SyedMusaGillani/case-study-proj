"use strict";
const path = require("path");
const csv = require("csvtojson");
const { convertDateStringToDate } = require("./convertStringToDate");
const csvFilePath = path.join(__dirname, "..", "outputs", "Task2.csv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async insertMatchListsData(queryInterface) {
    const data = await csv({
      colParser: {
        order_placed_datetime: function (item) {
          return convertDateStringToDate(item);
        },
        warehouse_arrival_datetime: function (item) {
          return convertDateStringToDate(item);
        },
      },
    }).fromFile(csvFilePath);
    await queryInterface.bulkInsert("match_list", data);
  },

  async removeMatchListsData(queryInterface) {
    await queryInterface.bulkDelete("match_list", null, {});
  },
};
