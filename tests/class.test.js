const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3003, () => console.log("Lets get ready to test"));
const Class = require("../models/class");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
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

describe("Test the grades endpoints", () => {
  test("It should create a new grade", async () => {
    const subject = new Subject({
      name: "SEI",
      description:
        "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
    });
    await subject.save();

    const teacher = new Teacher({
      first_name: "Arthur",
      last_name: "Bernier",
      email: "arthur@gmail.com",
      username: "arthurb",
      password: "test123",
      subject: subject._id,
    });
    await teacher.save();

    const token = await teacher.generateAuthToken();

    const response = await request(app)
      .post("/classes")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Donna", teacher: teacher._id, subject: subject._id });

    expect(response.statusCode).toBe(200);
  });

  test("It should return an error if user is not logged in", async () => {
    const subject = await Subject.findOne({ name: "SEI" });
    const teacher = await Teacher.findOne({ username: "arthurb" });

    const response = await request(app)
      .post("/classes")
      .send({ name: "Frances", teacher: teacher._id, subject: subject._id });

    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Not authorized");
  });

  test("It should get a class by ID", async () => {
    const subject = await Subject.findOne({ name: "SEI" });
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const token = await teacher.generateAuthToken();
    const foundClass = await Class.findOne({ name: "Donna" });

    const response = await request(app)
      .get(`/classes/${foundClass._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("Donna");
    expect(response.body.teacher._id).toEqual(teacher._id.toString());
  });

  test("It should get all classes", async () => {
    const subject = await Subject.findOne({ name: "SEI" });
    const teacher = await Teacher.findOne({ username: "arthurb" });

    const token = await teacher.generateAuthToken();
    const newClass = new Class({
      name: "Frances",
      teacher: teacher._id,
      subject: subject._id,
    });
    await newClass.save();

    const response = await request(app)
      .get("/classes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toEqual("Donna");
    expect(response.body[1].name).toEqual("Frances");
  });

  test("It should update a class", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const subject = await Subject.findOne({ name: "SEI" });
    const token = await teacher.generateAuthToken();
    const newClass = new Class({
      name: "Data Structures",
      teacher: teacher._id,
      subject: subject._id,
    });
    await newClass.save();

    const response = await request(app)
      .put(`/classes/${newClass._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Data structures and algorithms" });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Data structures and algorithms");
  });
  test("It should delete a class", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const subject = await Subject.create({ name: "Math" });
    const token = await teacher.generateAuthToken();
    const newClass = new Class({
      name: "Math Class",
      teacher: teacher._id,
      subject: subject._id,
    });
    await newClass.save();
    const response = await request(app)
      .delete(`/classes/${newClass._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("class deleted");
  });
});
