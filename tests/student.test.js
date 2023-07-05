const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(8080, () => console.log("Lets get ready to test"));
const Teacher = require("../models/teacher");
const Subject = require("../models/subject");
const Class = require("../models/class");
const Student = require("../models/student");
const Assignment = require("../models/assignment");
const { updateStudent } = require("../controllers/studentController");
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
    const subject = new Subject({
      name: "SEI",
      description:
        "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
    });
    await subject.save();
    const teacher = new Teacher({
      first_name: "Arthur",
      last_name: "Bernier",
      email: "arthurjr3@gmail.com",
      username: "arthurbjr3",
      password: "test1233",
      subject: subject._id,
    });
    await teacher.save();

    const donnaClass = new Class({
      name: "Donna",
      teacher: teacher._id,
      subject: subject._id,
    });

    await donnaClass.save();
    const response = await request(app).post("/students").send({
      first_name: "Jefrey",
      last_name: "Zavala",
      email: "jz@gmail.com",
      username: "jefreyz",
      password: "test123",
      className: "Donna",
    });

    expect(response.status).toBe(200);
    expect(response.body.student.username).toEqual("jefreyz");
    expect(response.body.student.className).toEqual(donnaClass._id.toString());
  });

  test("It should allow a student to login", async () => {
    const response = await request(app)
      .post("/students/login")
      .send({ username: "jefreyz", password: "test123" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("student");
    expect(response.body).toHaveProperty("token");
  });

  test("It should update a student", async () => {
    const student = await Student.findOne({ username: "jefreyz" });
    const token = await student.generateAuthToken();

    const response = await request(app)
      .put(`/students/${student._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "jefreyza" });

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toEqual("jefreyza");
  });

  test("It should get student's assignments", async () => {
    const student = await Student.findOne({ username: "jefreyza" });
    const subject = await Subject.findOne({ name: "SEI" });
    const assignment = new Assignment({
      name: "Project 2",
      subject: subject._id,
      description: "Build an API",
    });
    await assignment.save();

    student.listOfAssignments.push(assignment._id);
    await student.save();

    const token = await student.generateAuthToken();
    console.log(student);
    const response = await request(app)
      .get("/students/assignments")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject([
      {
        _id: assignment._id.toString(),
        name: "Project 2",
        description: "Build an API",
        subject: subject._id.toString(),
      },
    ]);
  });

  test("It should log out a student", async () => {
    const student = await Student.findOne({ username: "jefreyza" });
    const token = await student.generateAuthToken();
    const response = await request(app)
      .post("/students/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    const updatedStudent = await Student.findOne({ username: "jefreyza" });
    expect(updatedStudent.isLoggedIn).toBe(false);
  });
});
