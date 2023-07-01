const Submission = require("../models/submission");
const Student = require("../models/student");
const { json } = require("body-parser");
exports.createSubmission = async function (req, res) {
  try {
    const studentAssignment = await Student.findOne({
      _id: req.user._id,
    });
    console.log(studentAssignment);

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
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.showAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({});
    await submissions.populate("assignment student");
    res.json(submissions);
  } catch (error) {}
};


exports.showSubmissionBasedOneAssignment = asy