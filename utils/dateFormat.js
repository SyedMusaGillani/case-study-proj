const dayjs = require("dayjs");

module.exports = {
  checkAndConvertDateFormat(dateString) {
    const formatRegex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/;

    if (formatRegex.test(dateString)) {
      return dateString;
    } else {
      const parsedDate = dayjs(dateString);
      return parsedDate.format("MM-DD-YYYY HH:mm:ss");
    }
  },
};
