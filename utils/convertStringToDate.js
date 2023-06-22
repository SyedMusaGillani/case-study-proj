const dayjs = require("dayjs");

module.exports = {
  convertDateStringToDate(dateString, dateOnly = false) {
    const formattedDate = dayjs(
      dateString,
      dateOnly ? "M/D/YYYY" : "M/D/YYYY H:mm:ss"
    ).toDate();
    return formattedDate;
  },
};
