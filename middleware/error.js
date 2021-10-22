const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "error",
    }),
  ],
});

const errorHandle = function (err, req, res, next) {
  logger.log({
    level: "error",
    message: err.message,
  });
  res.status(500).send(err.message);
};

module.exports.errorHandle = errorHandle;
module.exports.logger = logger;
