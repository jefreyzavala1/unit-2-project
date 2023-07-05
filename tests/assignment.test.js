const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3004, () => console.log("Lets get ready to test"));
const Class = require("../models/class");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Assignment = require("../models/assignment");
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

describe("Test the assignments endpoints", () => {
  test("It should create an assignment", async () => {
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
      .post("/assignments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "assignment1",
        subject: subject._id,
        description: "complete project",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("assignment1");
  });

  test("It should get an assignment", async () => {
    const assignment = await Assignment.findOne({ name: "assignment1" });

    const response = await request(app).get(`/assignments/${assignment._id}`);

    expect(response.statusCode).toBe(200);
  });

  test("It should get all assignments", async () => {
    const subject = await Subject.findOne({ name: "SEI" });
    const assignmentData1 = {
      name: "Assignment 1",
      subject: subject._id,
      description: "Complete exercises 1-10",
    };

    const assignmentData2 = {
      name: "Assignment 2",
      subject: subject._id,
      description: "Write a research paper",
    };

    const assignment1 = new Assignment(assignmentData1);
    const assignment2 = new Assignment(assignmentData2);
    await assignment1.save();
    await assignment2.save();
    const response = await request(app).get("/assignments");

    expect(response.statusCode).toBe(200);
  });

  //   test("It should get all completed assignments", async () => {
  //     const subject = await Subject.findOne({ name: "SEI" });
  //     const assignmentData1 = {
  //       name: "Assignment 1",
  //       subject: subject._id,
  //       description: "Complete exercises 1-10",
  //       completed: true,
  //     };

  //     const assignmentData2 = {
  //       name: "Assignment 2",
  //       subject: subject._id,
  //       description: "Write a research paper",
  //       completed: true,
  //     };

  //     const assignmentData3 = {
  //       name: "Assignment 3",
  //       subject: subject._id,
  //       description: "Read chapters 1-5",
  //       completed: false,
  //     };

  //     const assignment1 = new Assignment(assignmentData1);
  //     const assignment2 = new Assignment(assignmentData2);
  //     const assignment3 = new Assignment(assignmentData3);
  //     await assignment1.save();
  //     await assignment2.save();
  //     await assignment3.save();

  //     const response = await request(app).get("/assignments/completed");

  //     expect(response.statusCode).toBe(200);
  //   });
});
