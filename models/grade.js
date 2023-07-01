const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    score: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Grade = new mongoose.model("Grade", gradeSchema);

module.exports = Grade;
