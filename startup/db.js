const mongoose = require("mongoose");
const db_debugger = require("debug")("app");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db)
    .then(() => db_debugger(`Connected to ${db}...`))
    //.then(() => console.log("connected"))
    .catch((err) => console.error("Could not connect to MongoDB"));
};
