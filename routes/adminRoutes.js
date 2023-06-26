const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);
router.put("/:id", adminController.auth, adminController.updateAdmin);
router.delete("/:id", adminController.auth, adminController.deleteAdmin);
router.delete(
  "/teacher/:id",
  adminController.auth,
  adminController.deleteTeacher
);
router.delete(
  "/student/:id",
  adminController.auth,
  adminController.deleteStudent
);

router.post("/logout", adminController.auth, adminController.logoutAdmin);

module.exports = router;
