const Class = require("../models/class");

exports.createClass = async function (req, res) {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.json(res.json);
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
    res.json(newClass);
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
