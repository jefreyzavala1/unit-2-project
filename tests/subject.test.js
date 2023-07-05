const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const server = app.listen(3006, () => console.log("Lets get ready to test"));
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

describe("Test the subject endpoints", () => {
  test("It should create a new subject", async () => {
    const teachers = await Teacher.find({});
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
      .post("/subjects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "SEI",
        description:
          "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual("SEI");
  });

  test("It should get a subject by ID", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const token = await teacher.generateAuthToken();
    const subject = new Subject({
      name: "SEI",
      description:
        "An interactive website for students currently enrolled in the General Assembly Software Engineering Immersive Remote Flex Program",
    });
    await subject.save();
    const response = await request(app)
      .get(`/subjects/${subject._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  test("It should get all subjects", async () => {
    const teacher = await Teacher.findOne({ username: "arthurb" });
    const token = await teacher.generateAuthToken();

    const subject1 = new Subject({
      name: "Math",
      description: "Study of numbers",
    });

    const subject2 = new Subject({
      name: "CS",
      description: "Data structures",
    });

    await Subject.insertMany([subject1, subject2]);

    const response = await request(app)
      .get("/subjects")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});
