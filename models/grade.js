const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  score: { type: Number },
});
