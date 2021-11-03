const app = require("../../../index");
let request = require("supertest");
const { Customer } = require("../../../models/customer");

const mongoose = require("mongoose");

describe("/api/customers", () => {
  afterEach(async () => {
    await Customer.remove({});
  });

  describe("GET /", () => {
    it("should specify json in the contnent type header", async () => {
      const res = await request(app).get("/api/customers");
      expect(res.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    it("should return genres", async () => {
      await Customer.collection.insertMany([
        { name: "123", phone: "123456789" },
        { name: "321", phone: "987654321" },
      ]);

      const res = await request(app).get("/api/customers");
      console.log(res.body.length);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "123")).toBeTruthy;
      expect(res.body.some((g) => g.name === "321")).toBeTruthy;
    });

    /* describe("GET /:id", () => {
      it("should return customer if valid id is passed", async () => {
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
    }); */
  });
});
