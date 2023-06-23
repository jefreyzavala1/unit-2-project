const mongoose = require("mongoose");
const Student = require("./student");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Student;
