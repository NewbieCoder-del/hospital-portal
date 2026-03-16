const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/summary", requireAuth, dashboardController.getDashboardSummary);
router.post("/family-profiles", requireAuth, dashboardController.addFamilyProfile);
router.post("/medicine-reminders", requireAuth, dashboardController.addMedicineReminder);

module.exports = router;
