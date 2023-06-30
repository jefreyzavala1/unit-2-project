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

module.exports = router;
