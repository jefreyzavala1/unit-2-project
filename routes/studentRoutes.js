const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const teacherController = require("../controllers/teacherController");

router.post("/", studentController.createStudent);
router.post("/login", studentController.loginStudent);
router.put("/:id", studentController.auth, studentController.updateStudent);
router.delete("/:id", teacherController.auth, studentController.deleteStudent);
router.post("/logout", studentController.auth, studentController.logoutStudent);

module.exports = router;
