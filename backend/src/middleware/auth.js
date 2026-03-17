const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const requireAuth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ code: "CONFIG_ERROR", message: "JWT configuration is missing." });
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ code: "AUTH_REQUIRED", message: "Authentication required." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findById(payload.patientId);

    if (!patient) {
      return res.status(401).json({ code: "INVALID_SESSION", message: "Invalid session." });
    }

    req.patient = patient;
    next();
  } catch (error) {
    return res.status(401).json({ code: "AUTH_FAILED", message: "Authentication failed." });
  }
};

module.exports = requireAuth;
