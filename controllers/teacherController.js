require("dotenv").config();
const Teacher = require("../models/teacher");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Subject = require("../models/subject");
exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.SECRET);
    const teacher = await Teacher.findOne({ _id: data._id });
    if (!teacher) {
      throw new Error();
    }
    req.user = teacher;
    next();
  } catch (error) {
    res.status(401).send("Not authorized");
  }
};

exports.createTeacher = async (req, res) => {
  try {
    let subject = await Subject.findOne({ name: req.body.subject });
    if (!subject) {
      subject = await Subject.create({ name: req.body.subject });
      await subject.save();
    }
    req.body.subject = subject._id;
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.json({ teacher });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ username: req.body.username });
    if (
      !teacher ||
      !(await bcrypt.compare(req.body.password, teacher.password))
    ) {
      res.status(400).json({ message: "Invalid login credentials" });
    } else {
      const token = await teacher.generateAuthToken();
      res.json({ teacher, token });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    let subject = await Subject.findOne({ name: req.body.subject });
    if (!subject) {
      subject = await Subject.create({ name: req.body.subject });
      await subject.save();
    }
    req.body.subject = subject._id;
    const updates = Object.keys(req.body);
    const teacher = await Teacher.findOne({ _id: req.params.id });
    updates.forEach((update) => (teacher[update] = req.body[update]));
    await teacher.save();
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logoutTeacher = async (req, res) => {
  try {
    req.user.isLoggedIn = false;
    await req.user.save();
    res.json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
