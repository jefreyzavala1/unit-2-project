const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.auth, subjectController.createSubject);
router.get("/:id", teacherController.auth, subjectController.showSubject);
router.get("/", teacherController.auth, subjectController.showAllSubjects);
router.put("/:id", teacherController.auth, subjectController.updateSubject);
router.delete("/:id", teacherController.auth, subjectController.deleteSubject);

module.exports = router;
