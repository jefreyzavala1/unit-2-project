const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(8080, () => console.log("Lets get ready to test"));
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

describe("Test the teachers endpoints", () => {
  test("It should create a new teacher", async () => {
    const response = await request(app).post("/teachers").send({
      first_name: "Arthur",
      last_name: "Bernier",
      email: "arthur@gmail.com",
      username: "arthurb",
      password: "test123",
      subject: "SEI",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("teacher");
    expect(response.body.teacher.username).toEqual("arthurb");
    expect(response.body).toHaveProperty("token");
  });

  test("It should allow a teacher to login", async () => {
    const subject = await Subject.create({
      name: "SEI",
      description:
        "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
    });
    await subject.save();

    const teacher = new Teacher({
      first_name: "Arthur",
      last_name: "Bernier",
      email: "arthurjr@gmail.com",
      username: "arthurbjr",
      password: "test123",
      subject: subject._id,
    });
    await teacher.save();
    const response = await request(app)
      .post("/teachers/login")
      .send({ username: "arthurbjr", password: "test123" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("teacher");
    expect(response.body).toHaveProperty("token");
    expect(response.body.teacher.username).toEqual(teacher.username);
  });

  test("It should update a teacher", async () => {
    const subject = await Subject.create({
      name: "SEI",
      description:
        "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
    });
    await subject.save();
    const teacher = new Teacher({
      first_name: "arthur",
      last_name: "bernier",
      email: "arthurbernier@gmail.com",
      username: "arthurjr",
      password: "test123",
      subject: subject._id,
    });
    await teacher.save();
    const token = await teacher.generateAuthToken();

    const response = await request(app)
      .put(`/teachers/${teacher._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        last_name: "bernier jr",
        email: "arthurbernierjr@gmail.com",
        subject: subject._id,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.last_name).toEqual("bernier jr");
    expect(response.body.email).toEqual("arthurbernierjr@gmail.com");
  });

  test("It should log out a teacher", async () => {
    const subject = await Subject.create({
      name: "SEI",
      description:
        "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
    });
    await subject.save();
    const teacher = new Teacher({
      first_name: "arthur",
      last_name: "bernier",
      email: "arthurbernier1@gmail.com",
      username: "arthurjr1",
      password: "test123",
      subject: subject._id,
    });
    await teacher.save();
    const token = await teacher.generateAuthToken();
    const response = await request(app)
      .post("/teachers/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("User successfully logged out");
  });
});
