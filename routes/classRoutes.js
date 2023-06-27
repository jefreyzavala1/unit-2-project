const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const teacherController = require("../controllers/teacherController");

router.post("/", teacherController.auth, classController.createClass);
router.get("/:id", classController.getClass);
router.get("/", classController.getAllClasses);
router.put("/:id", teacherController.auth, classController.updateClass);
router.delete("/:id", teacherController.auth, classController.deleteClass);

module.exports = router;
