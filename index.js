const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const app = express();
require("./startup/loggingErrors")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
