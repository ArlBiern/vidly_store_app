const express = require("express");
const router = express.Router();
const {
  Customer,
  validateCustomer,
  validateCustomerUpdate,
} = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold || false,
  });

  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const customerToUpdate = await Customer.findById(req.params.id);

  const { error } = validateCustomerUpdate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name || customerToUpdate.name,
      phone: req.body.phone || customerToUpdate.phone,
      isGold: req.body.isGold || customerToUpdate.isGold,
    },
    { new: true }
  );

  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  }

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  res.send(customer);
});

module.exports = router;
