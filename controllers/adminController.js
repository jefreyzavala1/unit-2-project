require("dotenv").config();
const Admin = require("../models/admin");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, proces.env.SECRET);
    const admin = await Admin.findOne({ _id: data._id });
    if (!admin) {
      throw new Error();
    }
    req.user = admin;
    next();
  } catch (error) {
    res.status(401).send("Not authorized");
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.json({ admin, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });

    if (!admin || !(await bcrypt.compare(req.body.password, admin.password))) {
      res.status(400).send("Invalid login Credentials");
    } else {
      const token = await admin.generateAuthToken();
      res.json({ admin, token });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const admin = await Admin.findOne({ _id: red.params.id });
    updates.forEach((update) => (admin[update] = req.body[update]));
    await admin.save();
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });
    if (!admin) {
      throw new Error("Admin not found");
    }
    await admin.remove();
    res.json({ message: "Admin successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.params.id });
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    await teacher.remove();
    res.json({ message: "Teacher successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.params.id });
    if (!teacher) {
      throw new Error("Student not found");
    }
    await teacher.remove();
    res.json({ message: "Student successfully deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    req.user.isLoggedIn = false;
    await req.user.save();
    res.json({ message: "User successfully logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
