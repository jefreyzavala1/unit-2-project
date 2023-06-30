const Class = require("../models/class");

exports.createClass = async (req, res) => {
  try {
    req.body.teacher = req.user.id;
    req.body.subject = req.user.subject;
    const newClass = new Class(req.body);
    await newClass.save();
    await newClass.populate("teacher subject");
    res.json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const foundClass = await Class.findOne({ _id: classId });
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    await foundClass.populate("teacher");
    await foundClass.populate("subject");
    await foundClass.populate("students");
    res.json(foundClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({})
      .populate("teacher")
      .populate("subject")
      .populate({
        path: "students",
        populate: {
          path: "listOfAssignments",
        },
      });

    res.json(classes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.updateClass = async function (req, res) {
  try {
    const updates = Object.keys(req.body);
    const foundClass = await Class.findOne({ _id: req.params.id });
    updates.forEach((update) => (foundClass[update] = req.body[update]));
    await foundClass.save();
    res.json(foundClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteClass = async function (req, res) {
  try {
    await Class.findOneAndRemove({ _id: req.params.id });
    res.json({ message: "class deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
