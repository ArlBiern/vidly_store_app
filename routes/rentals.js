const express = require("express");
const router = express.Router();
//const Fawn = require("fawn");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort({ dateOut: -1 });
  res.send(rental);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid customer id");
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send("Invalid movie id");
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();
  movie.numberInStock--;
  await movie.save();

  // Fawn usage - but this package has volnurelabilities!!!
  /* try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
  } catch (ex) {
    res.status(500).send("Something failed");
  } */

  res.send(rental);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    res.send(rental);
  } catch (ex) {
    return res.status(404).send("The rental with the given ID was not found.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    res.send(rental);
  } catch (ex) {
    return res.status(404).send("The rental with the given ID was not found.");
  }
});

module.exports = router;
