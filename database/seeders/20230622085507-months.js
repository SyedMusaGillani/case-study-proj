"use strict";
const path = require("path");
const csv = require("csvtojson");
const { convertDateStringToDate } = require("../../utils/convertStringToDate");
const csvFilePath = path.join(__dirname, "..", "..", "data", "months.csv");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = await csv({
      colParser: {
        month: function (item) {
          return convertDateStringToDate(item, true);
        },
      },
    }).fromFile(csvFilePath);
    await queryInterface.bulkInsert("months", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("months", null, {});
  },
};
