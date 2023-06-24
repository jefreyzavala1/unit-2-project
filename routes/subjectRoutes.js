const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");

router.post("/", subjectController.createSubject);
router.get("/:id", subjectController.showSubject);
router.get("/", subjectController.showAllSubjects);
router.put("/:id", subjectController.updateSubject);
router.delete("/:id", subjectController.deleteSubject);

module.exports = router;
