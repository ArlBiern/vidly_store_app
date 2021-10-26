const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  // we do not use eariler created customer schema, because probably we would not need all its properties
  customer: {
    type: new mongoose.Schema({
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
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 200,
        trim: true,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

// Add static method named lookup
rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    customerId: customerId,
    movieId: movieId,
  });
};

// Add instance methods
rentalSchema.methods.saveDataAndFee = function () {
  this.dateReturned = new Date();
  this.rentalFee =
    moment().diff(this.dateOut, "days") * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

// Joi validates what "client" sends to server, only customer ID and movie ID we would need from him
// rest of the parameters will be set on the backend
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
