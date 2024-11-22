require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var statusRouter = require("./routes/status");

var app = express();
const cors = require("cors");
app.use(cors());

const sequelize = require("./models/connection"); // Import connection
// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    console.log(`${process.env.SQLITE_STORAGE_PATH}/404serverManagerDb.sqlite`);
  })
  .catch((error) => console.error("Error creating database tables:", error));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/status", statusRouter);

module.exports = app;
