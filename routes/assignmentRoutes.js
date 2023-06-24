const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.auth, assignmentController.createAssignment);
router.get("/:id", assignmentController.getAssignment);
router.get("/", assignmentController.getAllAssigments);
router.put(
  "/:id",
  teacherController.auth,
  assignmentController.updateAssignment
);
router.delete(
  "/:id",
  teacherController.auth,
  assignmentController.deleteAssignment
);

module.exports = router;
