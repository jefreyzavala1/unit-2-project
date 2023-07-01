const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const teacherController = require("../controllers/teacherController");
const submissionController = require("../controllers/submissionController");

router.post(
  "/assignments/:id",
  studentController.auth,
  submissionController.createSubmission
);
router.get(
  "/assignments/",
  teacherController.auth,
  submissionController.showAllSubmissions
);

router.get(
  "/assignments/:id",
  teacherController.auth,
  submissionController.showSubmissionBasedOnAssignment
);

router.get(
  "/student/Assignments",
  studentController.auth,
  submissionController.studentViewsTheirSubmissions
);
module.exports = router;
