const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Vidly app in progres...");
});

module.exports = router;
