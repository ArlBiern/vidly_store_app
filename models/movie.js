const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
    trim: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(200).required(),
    numberInStock: Joi.number().min(0).max(100).required(),
    dailyRentalRate: Joi.number().min(0).max(100).required(),
    genreId: Joi.string().required(),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
