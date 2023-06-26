require("dotenv").config();
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.SECRET);
    const student = await Student.findOne({ _id: data._id });
    if (!student) {
      throw new Error();
    }
    req.user = student;
    next();
  } catch (error) {
    res.status(401).send("Not authorized");
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    const token = await student.generateAuthToken();
    res.json({ student, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ username: req.body.username });
    if (
      !student ||
      !(await bcrypt.compare(req.body.password, student.password))
    ) {
      res.status(400).send("Invalid login credentials");
    } else {
      const token = await student.generateAuthToken();
      res.json({ student, token });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const student = await Student.findOne({ _id: req.params.id });
    updates.forEach((update) => (student[update] = req.body[update]));
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logoutStudent = async (req, res) => {
  try {
    req.user.isLoggedIn = false;
    await req.user.save();
    res.json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
