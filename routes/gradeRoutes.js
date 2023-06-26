const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");
const teacherController = require("../controllers/teacherController");
const studentController = require("../controllers/studentController");

router.post("/", teacherController.auth, gradeController.createGrade);

router.get("/", teacherController.auth, gradeController.getAllGrades);

router.get(
  "/student",
  studentController.auth,
  gradeController.getStudentGrades
);

router.get("/:id", teacherController.auth, gradeController.getGrade);
router.put("/:id", teacherController.auth, gradeController.updateGrade);
router.delete("/:id", teacherController.auth, gradeController.deleteGrade);

module.exports = router;
