const { createObjectCsvWriter } = require("csv-writer");

module.exports = {
  async saveConsoleTableToCsv(tableData, filePath) {
    try {
      const csvData = tableData.map((row) => {
        const csvRow = {};
        Object.entries(row).forEach(([key, value]) => {
          csvRow[key] = value;
        });
        return csvRow;
      });

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: Object.keys(tableData[0]).map((key) => ({
          id: key,
          title: key,
        })),
      });

      await csvWriter.writeRecords(csvData);

      console.log(`CSV file '${filePath}' has been created successfully.`);
    } catch (error) {
      console.error("Error occurred while creating the CSV file:", error);
    }
  },
};
