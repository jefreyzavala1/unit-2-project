const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    name: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
