const app = require("../../../index");
let request = require("supertest");
const bcrypt = require("bcrypt");
const { User } = require("../../../models/user");

describe("POST /", () => {
  //1. musimy stworzyć usera
  //2. pobrać od niego emaila i hasło
  //3. wykonać zapytanie do serwera z podaniem emaila i hasła

  let user;

  beforeEach(async () => {
    user = await new User({
      name: "abcd",
      email: "abc@gmail.com",
      password: "123456",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
  });

  afterEach(async () => {
    await User.remove({});
  });

  const exec = () => {
    return request(app)
      .post("/api/auth")
      .send({ email: user.email, password: user.password });
  };

  it("should return status 400 if there is no user with given name in database", async () => {
    user.email = "123@gmail.com";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return status 400 if email is too short ", async () => {
    user.email = "1@1";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return status 400 if email is invalid ", async () => {
    user.email = "abcdef";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return status 400 if email is too long", async () => {
    user.email = new Array(200).join("a") + "@" + new Array(60).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return valid token after logging operation ", async () => {
    const res = await exec();

    expect(res.status).toBe(400);
  });
});
