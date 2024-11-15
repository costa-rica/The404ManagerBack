// /models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("./connection"); // Import connection

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
    // timestamps: false,
  }
);

module.exports = User;
