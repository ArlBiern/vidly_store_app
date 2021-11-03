const app = require("../../../index");
let request = require("supertest");
const mongoose = require("mongoose");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const { Movie } = require("../../../models/movie");
const moment = require("moment");

describe("/api/returns", () => {
  let customerId;
  let movieId;
  let genreId;
  let rental;
  let token;
  let movie;

  beforeEach(async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "123",
        phone: "123456789",
      },
      movie: {
        _id: movieId,
        title: "12",
        dailyRentalRate: 1,
      },
    });
    await rental.save();

    movie = new Movie({
      _id: movieId,
      title: "12",
      numberInStock: 10,
      dailyRentalRate: 1,
      genre: {
        name: "12345",
      },
    });
    await movie.save();
  });

  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
  });

  const exec = () => {
    return request(app)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if client id is not provided", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movie id is not provided", async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental was found to the given customeId and movie ID", async () => {
    await Rental.remove({});
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if rental was already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the return date if input is valid", async () => {
    const res = await exec();

    const rentalFromDB = await Rental.findById(rental._id);
    const timeDifference = new Date() - rentalFromDB.dateReturned;
    expect(timeDifference).toBeLessThan(10000);
  });

  it("should set the rental fee if input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalFromDB = await Rental.findById(rental._id);
    expect(rentalFromDB.rentalFee).toBe(7);
  });

  it("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDB = await Movie.findById(movieId);

    expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return rental in the body of the response if input is valid", async () => {
    const res = await exec();
    const rentalInDB = await Rental.findById(rental._id);

    /* expect(res.body).toHaveProperty("dateOut");
    expect(res.body).toHaveProperty("dateReturned");
    expect(res.body).toHaveProperty("rentalFee");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("movie"); */

    // Shorter way:
    console.log(Object.keys(res.body));
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
