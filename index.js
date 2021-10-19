const express = require("express");
const mongoose = require("mongoose");
const db_debugger = require("debug")("app");

const home = require("./routes/home");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => db_debugger("Database is running"))
  //.then(() => console.log("connected"))
  .catch((err) => console.error("Could not connect to MongoDB"));

const app = express();

app.use(express.json());
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
