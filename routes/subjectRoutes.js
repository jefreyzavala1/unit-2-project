const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.auth, subjectController.createSubject);
router.get("/:id", subjectController.showSubject);
router.get("/", subjectController.showAllSubjects);
router.put("/:id", teacherController.auth, subjectController.updateSubject);
router.delete("/:id", teacherController.auth, subjectController.deleteSubject);

module.exports = router;
