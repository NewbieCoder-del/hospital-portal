const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

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
    const { name, age, phone, email, password, medicalNotes } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password are required." });
    }

    const existingPatient = await Patient.findOne({
      $or: [{ phone }, ...(email ? [{ email }] : [])]
    });
    if (existingPatient) {
      return res.status(409).json({ message: "Patient already exists. Please log in." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      name,
      age,
      phone,
      email,
      passwordHash,
      medicalNotes
    });

    res.status(201).json({
      token: signToken(patient),
      patient: serializePatient(patient)
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to register patient." });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const patient = await Patient.findOne({ phone });

    if (!patient) {
      return res.status(401).json({ message: "Invalid phone or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid phone or password." });
    }

    res.json({
      token: signToken(patient),
      patient: serializePatient(patient)
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to log in." });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ patient: serializePatient(req.patient) });
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      email,
      medicalNotes,
      medicalHistory,
      insuranceInformation
    } = req.body;

    req.patient.name = name ?? req.patient.name;
    req.patient.age = age === "" ? null : age ?? req.patient.age;
    req.patient.phone = phone ?? req.patient.phone;
    req.patient.email = email ?? req.patient.email;
    req.patient.medicalNotes = medicalNotes ?? req.patient.medicalNotes;
    req.patient.medicalHistory = medicalHistory ?? req.patient.medicalHistory;
    req.patient.insuranceInformation =
      insuranceInformation ?? req.patient.insuranceInformation;

    await req.patient.save();

    res.json({ patient: serializePatient(req.patient) });
  } catch (error) {
    res.status(500).json({ message: "Unable to update profile." });
  }
};
