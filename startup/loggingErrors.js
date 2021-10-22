const { logger } = require("../middleware/error");
require("express-async-errors");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log("We got uncought EXCEPTION!!!");
    logger.log({
      level: "error",
      message: ex.message,
    });
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    console.log("We got unhandled REJECTION!!!");
    logger.log({
      level: "error",
      message: ex.message,
    });
    process.exit(1);
  });
};
