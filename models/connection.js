// /models/index.js
const { Sequelize } = require("sequelize");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${process.env.SQLITE_STORAGE_PATH}/404serverManagerDb.sqlite`,
});

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("Connection to SQLite database successful!"))
  .catch((err) => console.error("Unable to connect to SQLite database:", err));

module.exports = sequelize;
