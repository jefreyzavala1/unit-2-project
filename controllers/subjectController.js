const Subject = require("../models/subject");

exports.createSubject = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const subject = new Subject(req.body);
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.showSubject = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const subject = await Subject.findOne({ _id: req.params.id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.showAllSubjects = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateSubject = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const updates = Object.keys(req.body);
    const subject = await Subject.findOne({ _id: req.params.id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    updates.forEach((update) => (subject[update] = req.body[update]));
    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSubject = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const subject = await Subject.findOneAndRemove({ _id: req.params.id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ message: "subject deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
