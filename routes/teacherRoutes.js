const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.createTeacher);
router.post("/login", teacherController.loginTeacher);
router.put("/:id", teacherController.auth, teacherController.updateTeacher);
router.post("/logout", teacherController.auth, teacherController.logoutTeacher);

module.exports = router;
