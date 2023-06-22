require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: "postgres",
    seederStorage: "json",
    seederStoragePath: "sequelizeData.json",
  },
  test: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
  production: {
    url: process.env.DB_URL,
    dialect: "postgres",
  },
};
