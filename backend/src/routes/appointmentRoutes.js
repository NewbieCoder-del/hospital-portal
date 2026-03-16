const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, appointmentController.createAppointment);
router.get("/", requireAuth, appointmentController.listAppointments);

module.exports = router;
