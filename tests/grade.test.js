const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3000, () => console.log("Lets get ready to test"));
const Class = require("../models/class");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Assignment = require("../models/assignment");
const Student = require("../models/student");
const Grade = require("../models/grade");
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
  test("It should create a grade", async () => {
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
    const token = await teacher.generateAuthToken();
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
      description: "Build an API",
    });
    await assignment.save();

    const response = await request(app)
      .post("/grades")
      .set("Authorization", `Bearer ${token}`)
      .send({
        student: student._id,
        assignment: assignment._id,
        score: 80,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.student).toBe(student._id.toString());
    expect(response.body.assignment).toBe(assignment._id.toString());
    expect(response.body.score).toBe(80);
  });

  test("It should get all grades", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const token = await teacher.generateAuthToken();

    const student1 = await Student.findOne({ username: "jefrey" });

    const foundClass = await Class.findOne({ name: "Donna" });

    const assignment = await Assignment.findOne({ name: "Project 2" });

    const student2 = new Student({
      first_name: "Graehm",
      last_name: "fazio",
      email: "gfazio@gmail.com",
      username: "gfazio",
      password: "test123",
      className: foundClass._id,
    });

    const newGrade1 = new Grade({
      student: student1._id,
      assignment: assignment._id,
      score: 85,
    });
    await newGrade1.save();

    const newGrade2 = new Grade({
      student: student2._id,
      assignment: assignment._id,
      score: 90,
    });
    await newGrade2.save();

    const response = await request(app)
      .get("/grades")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

  test("It should get student grades", async () => {
    const student = await Student.findOne({ username: "jefrey" });

    const token = await student.generateAuthToken();
    const subject = await Subject.findOne({ name: "SEI" });
    const assignment = new Assignment({
      name: "Project 1",
      subject: subject._id,
      description: "Build a Game",
    });
    await assignment.save();

    const newGrade = new Grade({
      student: student._id,
      assignment: assignment._id,
      score: 80,
    });
    await newGrade.save();
    const response = await request(app)
      .get("/grades/student")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

  test("It should update a grade", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const student = await Student.findOne({ username: "jefrey" });
    const subject = await Subject.findOne({ name: "SEI" });
    const assignment = new Assignment({
      name: "Project 3",
      subject: subject._id,
      description: "Build a full stack app",
    });
    await assignment.save();
    const token = await teacher.generateAuthToken();
    const newGrade = new Grade({
      student: student._id,
      assignment: assignment._id,
      score: 70,
    });
    await newGrade.save();

    const response = await request(app)
      .put(`/grades/${newGrade._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        score: 80,
      });

    expect(response.statusCode).toBe(200);
  });

  test("It should delete a grade", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const student = await Student.findOne({ username: "jefrey" });
    const subject = await Subject.findOne({ name: "SEI" });
    const assignment = new Assignment({
      name: "Project 4",
      subject: subject._id,
      description: "Build a mobile app",
    });
    await assignment.save();
    const token = await teacher.generateAuthToken();

    const newGrade = new Grade({
      student: student._id,
      assignment: assignment._id,
      score: 80,
    });
    await newGrade.save();

    const response = await request(app)
      .delete(`/grades/${newGrade._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("grade deleted");
  });
});
