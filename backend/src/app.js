const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recordRoutes = require("./routes/recordRoutes");
const authController = require("./controllers/authController");
const doctorController = require("./controllers/doctorController");
const hospitalController = require("./controllers/hospitalController");
const appointmentController = require("./controllers/appointmentController");
const recordController = require("./controllers/recordController");
const requireAuth = require("./middleware/auth");
const multer = require("multer");

const app = express();
const upload = multer({ dest: path.join(__dirname, "..", "uploads") });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/records", recordRoutes);

// Route aliases requested for simpler integrations.
app.post("/signup", authController.register);
app.post("/login", authController.login);
app.get("/doctors", doctorController.listDoctors);
app.get("/hospitals", hospitalController.listHospitals);
app.post("/book-appointment", requireAuth, appointmentController.createAppointment);
app.get("/appointments", requireAuth, appointmentController.listAppointments);
app.post("/upload-record", requireAuth, upload.single("recordFile"), recordController.uploadRecord);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "index.html"));
});

module.exports = app;
