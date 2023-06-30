const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.auth, assignmentController.createAssignment);
router.get("/:id", assignmentController.getAssignment);
router.get("/", assignmentController.getAllAssigments);
router.get(
  "/completed",
  teacherController.auth,
  assignmentController.getAllCompletedAssignments
);

router.get(
  "/incomplete",
  teacherController.auth,
  assignmentController.getAllIncompleteAssignments
);
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
