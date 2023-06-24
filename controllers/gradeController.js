const Grade = require("../models/grade");

exports.createGrade = async (req, res) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.json(res.json);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getGrade = async function (req, res) {
  try {
    const grade = await Grade.findOne({ _id: req.params.id });
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.json(grade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateGrade = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const grade = await Grade.findOne({ _id: req.params.id });
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
    await Grade.findOneAndRemove({ _id: req.params.id });
    res.json({ message: "grade deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
