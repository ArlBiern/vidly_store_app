const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Invalid e-mail or password");
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(400).send("Invalid e-mail or password");
  }

  const token = user.generateAuthToken();

  res.send(token);
});

const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .min(5)
      .max(255)
      //.regex(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
      .email()
      .required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
};

module.exports = router;
