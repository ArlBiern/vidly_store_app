const home = require("../routes/home");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const { errorHandle } = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/", home);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(errorHandle);

  app.use(function (req, res, next) {
    res.status(404).send("Bad path - please check it");
  });
};
