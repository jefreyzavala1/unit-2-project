const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

router.post("/", assignmentController.createAssignment);
router.get("/:id", assignmentController.getAssignment);
router.put("/:id", assignmentController.updateAssignment);
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
