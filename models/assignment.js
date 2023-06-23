const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  name: { type: String },
  completed: { type: Boolean },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
