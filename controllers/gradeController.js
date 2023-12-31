const Assignment = require("../models/assignment");
const Grade = require("../models/grade");

exports.createGrade = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const { student, assignment, score } = req.body;

    const grade = new Grade({
      student,
      assignment,
      score,
    });

    await grade.save();
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getGrade = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const grade = await Grade.findOne({ _id: req.params.id });
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllGrades = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const grades = await Grade.find({});
    res.json(grades);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStudentGrades = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const studentId = req.user._id;
    const grades = await Grade.find({ student: studentId });
    res.json(grades);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateGrade = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const updates = Object.keys(req.body);
    const grade = await Grade.findOne({ _id: req.params.id });
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    updates.forEach((update) => {
      grade[update] = req.body[update];
    });
    await grade.save();
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteGrade = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    await Grade.findOneAndRemove({ _id: req.params.id });
    res.json({ message: "grade deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
