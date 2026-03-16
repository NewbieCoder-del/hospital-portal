const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const patient = await Patient.findById(payload.patientId);

    if (!patient) {
      return res.status(401).json({ message: "Invalid session." });
    }

    req.patient = patient;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed." });
  }
};

module.exports = requireAuth;
