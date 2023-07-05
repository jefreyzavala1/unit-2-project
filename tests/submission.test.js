const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(8000, () => console.log("Lets get ready to test"));
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Assignment = require("../models/assignment");
const Class = require("../models/class");
const Submission = require("../models/submission");
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

describe("Test the subject endpoints", () => {
  test("It should create a submission", async () => {
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
    const newClass = new Class({
      name: "Donna",
      teacher: teacher._id,
      subject: subject._id,
    });
    await newClass.save();
    const student = new Student({
      first_name: "Jefrey",
      last_name: "Zavala",
      email: "jefrey@gmail.com",
      username: "jefrey",
      password: "test123",
      className: newClass._id,
    });
    await student.save();

    const assignment = new Assignment({
      name: "Project 2",
      subject: subject._id,
      description: "Build an api",
    });
    await assignment.save();
    const token = await student.generateAuthToken();
    const response = await request(app)
      .post(`/submissions/assignments/${assignment._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    await Submission.deleteMany();
  });
  test("It shoudl get all submissions", async () => {
    const subject = await Subject.findOne({ name: "SEI" });
    const assignment = await Assignment.findOne({ name: "Project 2" });
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const newClass = new Class({
      name: "Frances",
      teacher: teacher._id,
      subject: subject._id,
    });
    await newClass.save();
    const student1 = await Student.findOne({ username: "jefrey" });
    const student2 = new Student({
      first_name: "Jun",
      last_name: "Baek",
      email: "junbaek@gmail.com",
      username: "junb",
      password: "test123",
      className: newClass._id,
    });
    await student2.save();

    const submission1 = new Submission({
      assignment: assignment._id,
      submitted: true,
      student: student1._id,
    });
    await submission1.save();

    const submission2 = new Submission({
      assignment: assignment._id,
      submitted: true,
      student: student2._id,
    });
    await submission2.save();

    const token = await teacher.generateAuthToken();
    const response = await request(app)
      .get("/submissions/assignments")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("It should get submissions based on assignment", async () => {
    const subject = await Subject.findOne({ name: "SEI" });
    const assignment1 = await Assignment.findOne({ name: "Project 2" });
    const teacher = await Teacher.findOne({ username: "arthurb" });

    const token = await teacher.generateAuthToken();
    const response = await request(app)
      .get(`/submissions/assignments/${assignment1._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  test("It should get a student's submission", async () => {
    const student = await Student.findOne({ username: "jefrey" });
    const assignment = await Assignment.findOne({ name: "project 2" });

    const token = await student.generateAuthToken();
    const response = await request(app)
      .get("/submissions/student/Assignments")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveLength(1);
  });
});
