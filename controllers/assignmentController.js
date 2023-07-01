const Assignment = require("../models/assignment");
const Student = require("../models/student");
const Subject = require("../models/subject");
exports.createAssignment = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    let subject = await Subject.findOne({ name: req.body.subject });
    if (!subject) {
      subject = await Subject.create({ name: req.body.subject });
      await subject.save();
    }
    req.body.subject = subject._id;
    const assignment = new Assignment(req.body);
    await assignment.save();

    const students = await Student.find({});
    for (const student of students) {
      await student.listOfAssignments.addToSet(assignment._id);
      student.save();
    }

    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAssigments = async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    res.json(assignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCompletedAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ completed: true });
    res.json(assignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllIncompleteAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ completed: false });
    res.json(assignments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const updates = Object.keys(req.body);
    const assignment = await Assignment.findOne({ _id: req.params.id });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    updates.forEach((update) => (assignment[update] = req.body[update]));
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const assignment = await Assignment.findOneAndRemove({
      _id: req.params.id,
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "assignment deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
