const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3005, () => console.log("Lets get ready to test"));
const Class = require("../models/class");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Assignment = require("../models/assignment");
const Student = require("../models/student");
const Grade = require("../models/grade");
const Admin = require("../models/admin");
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

describe("Test the admin endpoints", () => {
  test("It should create an admin", async () => {
    const response = await request(app).post("/admin").send({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      username: "johndoe",
      password: "test123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.admin.username).toBe("johndoe");
  });

  test("It should log in an admin", async () => {
    const response = await request(app)
      .post("/admin/login")
      .send({ username: "johndoe", password: "test123" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("admin");
    expect(response.body).toHaveProperty("token");
  });

  test("It should update an admin", async () => {
    const admin = await Admin.findOne({ username: "johndoe" });

    const token = await admin.generateAuthToken();

    const response = await request(app)
      .put(`/admin/${admin._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_name: "John",
        last_name: "Smith",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.first_name).toEqual("John");
    expect(response.body.last_name).toEqual("Smith");
  });

  test("It should delete an admin", async () => {
    const admin = await Admin.findOne({ username: "johndoe" });

    const token = await admin.generateAuthToken();

    const response = await request(app)
      .delete(`/admin/${admin._id}`)
      .set("Authorization", `Bearer ${token}`);
    console.log(admin);
    expect(response.statusCode).toBe(200);
  });

  // test("It should delete a teacher and class", async () => {
  //   const subject = new Subject({
  //     name: "SEI",
  //     description:
  //       "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
  //   });
  //   await subject.save();

  //   const teacher = new Teacher({
  //     first_name: "Arthur",
  //     last_name: "Bernier",
  //     email: "arthur@gmail.com",
  //     username: "arthurb",
  //     password: "test123",
  //     subject: subject._id,
  //   });
  //   await teacher.save();
  //   const admin = new Admin({
  //     first_name: "John",
  //     last_name: "Doe",
  //     email: "johndoe1@example.com",
  //     username: "johndoe1",
  //     password: "test123",
  //   });
  //   await admin.save();
  //   const newClass = new Class({
  //     name: "Frances",
  //     teacher: teacher._id,
  //     subject: subject._id,
  //   });
  //   await newClass.save();
  //   const token = await admin.generateAuthToken();
  //   const response = await request(app)
  //     .delete(`/teacher/${teacher._id}`)
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.statusCode).toBe(200);
  // });

  // test("Its should delete a student and update the class", async () => {
  //   const subject = new Subject({
  //     name: "SEI",
  //     description:
  //       "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
  //   });
  //   await subject.save();

  //   const teacher = new Teacher({
  //     first_name: "Arthur",
  //     last_name: "Bernier",
  //     email: "arthur@gmail.com",
  //     username: "arthurb",
  //     password: "test123",
  //     subject: subject._id,
  //   });
  //   await teacher.save();
  //   const newClass = new Class({
  //     name: "Donna",
  //     teacher: teacher._id,
  //     subject: subject._id,
  //   });
  //   await newClass.save();
  //   const student = new Student({
  //     first_name: "Jefrey",
  //     last_name: "Zavala",
  //     email: "jz@gmail.com",
  //     username: "jefreyz",
  //     password: "test123",
  //     className: newClass._id,
  //   });

  //   await student.save();
  //   const admin = new Admin({
  //     first_name: "John",
  //     last_name: "Doe",
  //     email: "johndoe1@example.com",
  //     username: "johndoe1",
  //     password: "test123",
  //   });
  //   await admin.save();
  //   const token = admin.generateAuthToken();

  //   const response = await request(app)
  //     .delete(`/admin/student/${student._id}`)
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.statusCode).toBe(200);
  // });
});
