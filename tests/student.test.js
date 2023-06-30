const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3000, () => console.log("Lets get ready to test"));
const Teacher = require("../models/teacher");
const Subject = require("../models/subject");
const Class = require("../models/class");
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  mongoServer.stop();
  server.close();
});

describe("Test the students endpoints", () => {
  test("It should create a new student", async () => {
    const donnaClass = await Class.create({ name: "Donna" });
    const response = await request(app).post("/students").send({
      first_name: "Jefrey",
      last_name: "Zavala",
      email: "jz@gmail.com",
      username: "jefreyz",
      password: "test123",
      className: "Donna",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("student");
    expect(response.body).toHaveProperty("token");
  });
});
