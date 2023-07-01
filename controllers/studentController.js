require("dotenv").config();
const Student = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Class = require("../models/class");
const Assignment = require("../models/assignment");
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
    const className = req.body.className;
    const foundClass = await Class.findOne({ name: className });

    if (!foundClass) {
      throw new Error("Class not found");
    }

    student.className = foundClass._id;
    foundClass.students.addToSet(student._id);
    await student.save();
    await foundClass.save();
    res.json({ student });
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
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const updates = Object.keys(req.body);
    const student = await Student.findOne({ _id: req.params.id });
    updates.forEach((update) => (student[update] = req.body[update]));
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyAssignments = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const studentAssignment = await Student.findOne({
      _id: req.user._id,
    }).populate("listOfAssignments");

    res.json(studentAssignment.listOfAssignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markAssignmentAsComplete = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const studentAssignment = await Student.findOne({
      _id: req.user._id,
    }).populate("listOfAssignments");

    const findAssignmentInArray = studentAssignment.listOfAssignments;
    for (const assignment of findAssignmentInArray) {
      if (assignment._id.toString() === req.params.id) {
        const updatedAssignment = new Assignment({
          name: assignment.name,
          subject: assignment.subject,
          description: assignment.description,
          completed: true,
          user: req.user._id,
        });

        await updatedAssignment.save();

        const index = studentAssignment.listOfAssignments.findIndex(
          (a) => a._id.toString() === req.params.id
        );
        studentAssignment.listOfAssignments.splice(
          index,
          1,
          updatedAssignment._id
        );
        await studentAssignment.populate("listOfAssignments").execPopulate();

        await studentAssignment.save();

        break;
      }
    }

    res.json(studentAssignment);
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
