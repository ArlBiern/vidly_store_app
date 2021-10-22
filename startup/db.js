const mongoose = require("mongoose");
const db_debugger = require("debug")("app");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => db_debugger("Database is running"))
    //.then(() => console.log("connected"))
    .catch((err) => console.error("Could not connect to MongoDB"));
};
