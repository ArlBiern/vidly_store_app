const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 22,
    trim: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(9).max(22).required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

function validateCustomerUpdate(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    phone: Joi.string().min(9).max(22),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
module.exports.validateCustomerUpdate = validateCustomerUpdate;
