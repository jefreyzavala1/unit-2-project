const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.createTeacher);
router.post("/login", teacherController.loginTeacher);
router.put("/:id", teacherController.auth, teacherController.updateTeacher);
router.delete("/:id", teacherController.auth, teacherController.deleteTeacher);
router.post("/logout", teacherController.auth, teacherController.logoutTeacher);
module.exports = router;
