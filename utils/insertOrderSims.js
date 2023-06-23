"use strict";
const path = require("path");
const csv = require("csvtojson");
const { convertDateStringToDate } = require("./convertStringToDate");
const csvFilePath = path.join(__dirname, "..", "outputs", "Task1.csv");

module.exports = {
  async insertOrderSimsData(queryInterface) {
    const data = await csv({
      colParser: {
        order_placed_datetime: function (item) {
          return convertDateStringToDate(item);
        },
      },
    }).fromFile(csvFilePath);
    await queryInterface.bulkInsert("order_sims", data);
  },

  async removeOrderSimsData(queryInterface) {
    await queryInterface.bulkDelete("order_sims", null, {});
  },
};
