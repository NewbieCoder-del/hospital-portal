const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

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
const authRateLimit = require("./middleware/authRateLimit");
const requestLogger = require("./middleware/requestLogger");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const multer = require("multer");

const app = express();
const upload = multer({ dest: path.join(__dirname, "..", "uploads") });
const frontendDir = path.join(__dirname, "..", "..");

const parseAllowedOrigins = () =>
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = parseAllowedOrigins();

app.use(requestLogger);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      const corsError = new Error("CORS origin not allowed.");
      corsError.statusCode = 403;
      corsError.expose = true;
      return callback(corsError);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["X-Request-Id"]
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.static(frontendDir));

app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/records", recordRoutes);

// Route aliases requested for simpler integrations.
app.post("/signup", authRateLimit, authController.register);
app.post("/login", authRateLimit, authController.login);
app.get("/doctors", doctorController.listDoctors);
app.get("/hospitals", hospitalController.listHospitals);
app.post("/book-appointment", requireAuth, appointmentController.createAppointment);
app.get("/appointments", requireAuth, appointmentController.listAppointments);
app.post("/upload-record", requireAuth, upload.single("recordFile"), recordController.uploadRecord);

app.get("/api/health", (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    database: dbStates[mongoose.connection.readyState] || "unknown",
    timestamp: new Date().toISOString()
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
