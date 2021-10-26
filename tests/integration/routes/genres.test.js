const app = require("../../../index");
let request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("api/genres", () => {
  afterEach(async () => {
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should response with a 200 status code", async () => {
      const res = await request(app).get("/api/genres");
      expect(res.statusCode).toBe(200);
    });

    it("should specify json in the contnent type header", async () => {
      const res = await request(app).get("/api/genres");
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
      //or:
      //expect(response.headers["content-type"]).toMatch(/json/);
    });

    it("should return genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(app).get("/api/genres");
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy;
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy;
    });
  });

  describe("GET /:id", () => {
    it("should return genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(app).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 code status if invalid id is passed", async () => {
      const res = await request(app).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return 404 code status if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(app).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let genreName;

    beforeEach(() => {
      token = new User().generateAuthToken();
      genreName = "genre1";
    });

    const exec = () => {
      return request(app)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      genreName = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      genreName = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid ", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid ", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let genreName;

    beforeEach(() => {
      token = new User().generateAuthToken();
      genreName = "newGenre";
    });

    const exec = async (isAdmin, wrongId) => {
      if (isAdmin) {
        const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
        const user = new User(payload);
        token = user.generateAuthToken();
      }

      const genre = new Genre({ name: "genre1" });
      await genre.save();

      let genreId = wrongId ? "1" : genre._id;

      return request(app)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    it("should return 401 if bad token is provided", async () => {
      token = "";
      const res = await exec(false);
      expect(res.status).toBe(401);
    });

    it("should return 403 if it is not an admin", async () => {
      const res = await exec(false);
      expect(res.status).toBe(403);
    });

    it("should return 404 if genre id is not valid", async () => {
      const res = await exec(true, true);
      expect(res.status).toBe(404);
    });

    it("should update genre if id is valid and it is changed by admin", async () => {
      const res = await exec(true);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "newGenre");
    });

    it("should return 400 if genre is less than 3 characters", async () => {
      genreName = "12";
      const res = await exec(true);

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      genreName = new Array(52).join("a");
      const res = await exec(true);

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /:id", () => {
    let token;

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    const exec = async (isAdmin, wrongId) => {
      if (isAdmin) {
        const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
        const user = new User(payload);
        token = user.generateAuthToken();
      }

      const genre = new Genre({ name: "genre1" });
      await genre.save();

      let genreId = wrongId ? "1" : genre._id;

      return request(app)
        .delete("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send(genre);
    };

    it("should return 401 if bad token is provided", async () => {
      token = "";
      const res = await exec(false);
      expect(res.status).toBe(401);
    });

    it("should return 403 if it is not an admin", async () => {
      const res = await exec(false);
      expect(res.status).toBe(403);
    });

    it("should return 404 if genre id is not valid", async () => {
      const res = await exec(true, true);
      expect(res.status).toBe(404);
    });

    it("should delete genre if id is valid and it is changed by admin", async () => {
      const res = await exec(true);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
