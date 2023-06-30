const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    submitted: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model("Submission", submissionSchema);
module.exports = Submission;
