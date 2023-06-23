const fs = require("fs");
const path = require("path");
const { createObjectCsvWriter } = require("csv-writer");
const { checkAndConvertDateFormat } = require("./dateFormat");

module.exports = {
  async saveConsoleTableToCsv(tableData, filePath) {
    const folderPath = "outputs";
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      const csvData = tableData.map((row) => {
        const csvRow = {};
        Object.entries(row).forEach(([key, value]) => {
          if (key.includes("datetime")) {
            const val = checkAndConvertDateFormat(value);
            csvRow[key] = val;
          } else csvRow[key] = value;
        });
        return csvRow;
      });

      const csvWriter = createObjectCsvWriter({
        path: path.join(folderPath, filePath),
        header: Object.keys(tableData[0]).map((key) => ({
          id: key,
          title: key,
        })),
      });

      await csvWriter.writeRecords(csvData);

      console.log(
        `CSV file '${path.join(
          folderPath,
          filePath
        )}' has been created successfully.`
      );
    } catch (error) {
      console.error("Error occurred while creating the CSV file:", error);
    }
  },
};
