const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3000, () => console.log("Lets get ready to test"));
const Teacher = require("../models/teacher");
const Subject = require("../models/subject");
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
    const response = await request(app).post("/teachers").send({
      first_name: "Jefrey",
      last_name: "Zavala",
      email: "jz@gmail.com",
      username: "jefreyz",
      password: "test123",
      class: "Donna",
    });

    const createClass = new Class({name:"Donna"});
    

    console.log(response.body);
  });
});
