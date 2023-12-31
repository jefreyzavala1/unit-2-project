const Submission = require("../models/submission");
const Student = require("../models/student");
exports.createSubmission = async function (req, res) {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const studentAssignment = await Student.findOne({
      _id: req.user._id,
    });

    studentAssignment.listOfAssignments.pull(req.params.id);

    await studentAssignment.save();
    const submission = new Submission({
      assignment: req.params.id,
      submitted: true,
      student: req.user._id,
    });
    req.user.listOfSubmissions
      ? req.user.listOfSubmissions.addToSet({ _id: submission._id })
      : (req.user.listOfSubmissions = [{ _id: submission._id }]);
    await req.user.save();
    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.showAllSubmissions = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const submissions = await Submission.find({})
      .populate("assignment")
      .populate("student");
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.showSubmissionBasedOnAssignment = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate("assignment")
      .populate("student");
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.studentViewsTheirSubmissions = async (req, res) => {
  try {
    if (!req.user.isLoggedIn) {
      return res.status(400).json({ message: "Please Log in" });
    }
    const submissions = await Submission.find({ student: req.user._id });
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
