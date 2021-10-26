const app = require("../../../index");
let request = require("supertest");

describe("GET /", () => {
  it("should respond with status code 200 on page load", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
