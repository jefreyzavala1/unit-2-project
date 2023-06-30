const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
