const express = require("express");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.getProfile);
router.put("/profile", requireAuth, authController.updateProfile);

module.exports = router;
