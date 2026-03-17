const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const {
  validateSignupPayload,
  validateLoginPayload,
  validateProfilePayload
} = require("../utils/authValidation");

const signToken = (patient) =>
  jwt.sign({ patientId: patient._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const serializePatient = (patient) => ({
  id: patient._id,
  name: patient.name,
  age: patient.age,
  phone: patient.phone,
  email: patient.email || "",
  medicalNotes: patient.medicalNotes || "",
  medicalHistory: patient.medicalHistory || "",
  insuranceInformation: patient.insuranceInformation || "",
  familyProfiles: patient.familyProfiles || [],
  medicineReminders: patient.medicineReminders || []
});

exports.register = async (req, res) => {
  try {
    const { errors, value } = validateSignupPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: errors.join(" ") });
    }

    const existingPatient = await Patient.findOne({
      $or: [
        { phoneNormalized: value.phoneNormalized },
        ...(value.emailNormalized ? [{ emailNormalized: value.emailNormalized }] : [])
      ]
    });
    if (existingPatient) {
      return res.status(409).json({ code: "PATIENT_EXISTS", message: "Patient already exists. Please log in." });
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const patient = await Patient.create({
      name: value.name,
      age: value.age,
      phone: value.phone,
      phoneNormalized: value.phoneNormalized,
      email: value.email,
      emailNormalized: value.emailNormalized || undefined,
      passwordHash,
      medicalNotes: value.medicalNotes
    });

    res.status(201).json({
      token: signToken(patient),
      patient: serializePatient(patient)
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ code: "PATIENT_EXISTS", message: "Patient already exists. Please log in." });
    }
    return res.status(500).json({ code: "REGISTER_FAILED", message: "Unable to register patient." });
  }
};

exports.login = async (req, res) => {
  try {
    const { errors, value } = validateLoginPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: errors.join(" ") });
    }

    const patient = await Patient.findOne({ phoneNormalized: value.phoneNormalized });

    if (!patient) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid phone or password." });
    }

    const isPasswordValid = await bcrypt.compare(value.password, patient.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid phone or password." });
    }

    res.json({
      token: signToken(patient),
      patient: serializePatient(patient)
    });
  } catch (error) {
    return res.status(500).json({ code: "LOGIN_FAILED", message: "Unable to log in." });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ patient: serializePatient(req.patient) });
};

exports.updateProfile = async (req, res) => {
  try {
    const { errors, value } = validateProfilePayload(req.body, req.patient);
    if (errors.length) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: errors.join(" ") });
    }

    const conflict = await Patient.findOne({
      _id: { $ne: req.patient._id },
      $or: [
        { phoneNormalized: value.phoneNormalized },
        ...(value.emailNormalized ? [{ emailNormalized: value.emailNormalized }] : [])
      ]
    });
    if (conflict) {
      return res.status(409).json({ code: "PROFILE_CONFLICT", message: "Phone or email is already in use." });
    }

    req.patient.name = value.name;
    req.patient.age = value.age;
    req.patient.phone = value.phone;
    req.patient.phoneNormalized = value.phoneNormalized;
    req.patient.email = value.email;
    req.patient.emailNormalized = value.emailNormalized || undefined;
    req.patient.medicalNotes = value.medicalNotes;
    req.patient.medicalHistory = value.medicalHistory;
    req.patient.insuranceInformation = value.insuranceInformation;

    await req.patient.save();

    res.json({ patient: serializePatient(req.patient) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ code: "PROFILE_CONFLICT", message: "Phone or email is already in use." });
    }
    return res.status(500).json({ code: "PROFILE_UPDATE_FAILED", message: "Unable to update profile." });
  }
};
