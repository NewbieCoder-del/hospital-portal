const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../config/firebase");
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
  age: patient.age ?? null,
  phone: patient.phone,
  email: patient.email || "",
  medicalNotes: patient.medicalNotes || "",
  medicalHistory: patient.medicalHistory || "",
  insuranceInformation: patient.insuranceInformation || "",
  familyProfiles: patient.familyProfiles || [],
  medicineReminders: patient.medicineReminders || []
});

const queryPatientByPhone = async (db, phoneNormalized) => {
  const snapshot = await db
    .collection("patients")
    .where("phoneNormalized", "==", phoneNormalized)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { _id: doc.id, ...doc.data() };
};

const queryPatientByEmail = async (db, emailNormalized) => {
  const snapshot = await db
    .collection("patients")
    .where("emailNormalized", "==", emailNormalized)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { _id: doc.id, ...doc.data() };
};

exports.register = async (req, res) => {
  try {
    const { errors, value } = validateSignupPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: errors.join(" ") });
    }

    const db = getDb();
    const existingByPhone = await queryPatientByPhone(db, value.phoneNormalized);
    if (existingByPhone) {
      return res.status(409).json({ code: "PATIENT_EXISTS", message: "Patient already exists. Please log in." });
    }

    if (value.emailNormalized) {
      const existingByEmail = await queryPatientByEmail(db, value.emailNormalized);
      if (existingByEmail) {
        return res.status(409).json({ code: "PATIENT_EXISTS", message: "Patient already exists. Please log in." });
      }
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const patientRef = db.collection("patients").doc();
    const patient = {
      _id: patientRef.id,
      name: value.name,
      age: value.age,
      phone: value.phone,
      phoneNormalized: value.phoneNormalized,
      email: value.email || "",
      emailNormalized: value.emailNormalized || "",
      passwordHash,
      medicalNotes: value.medicalNotes || "",
      medicalHistory: "",
      insuranceInformation: "",
      familyProfiles: [],
      medicineReminders: [],
      createdAt: new Date().toISOString()
    };

    await patientRef.set({
      name: patient.name,
      age: patient.age,
      phone: patient.phone,
      phoneNormalized: patient.phoneNormalized,
      email: patient.email,
      emailNormalized: patient.emailNormalized,
      passwordHash: patient.passwordHash,
      medicalNotes: patient.medicalNotes,
      medicalHistory: patient.medicalHistory,
      insuranceInformation: patient.insuranceInformation,
      familyProfiles: patient.familyProfiles,
      medicineReminders: patient.medicineReminders,
      createdAt: patient.createdAt
    });

    return res.status(201).json({
      token: signToken(patient),
      patient: serializePatient(patient)
    });
  } catch (error) {
    return res.status(500).json({ code: "REGISTER_FAILED", message: "Unable to register patient." });
  }
};

exports.login = async (req, res) => {
  try {
    const { errors, value } = validateLoginPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: errors.join(" ") });
    }

    const db = getDb();
    let patient = null;

    if (value.phoneNormalized) {
      patient = await queryPatientByPhone(db, value.phoneNormalized);
    }
    if (!patient && value.emailNormalized) {
      patient = await queryPatientByEmail(db, value.emailNormalized);
    }

    if (!patient) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid phone or password." });
    }

    const isPasswordValid = await bcrypt.compare(value.password, patient.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ code: "INVALID_CREDENTIALS", message: "Invalid phone or password." });
    }

    return res.json({
      token: signToken(patient),
      patient: serializePatient(patient)
    });
  } catch (error) {
    return res.status(500).json({ code: "LOGIN_FAILED", message: "Unable to log in." });
  }
};

exports.getProfile = async (req, res) => {
  return res.json({ patient: serializePatient(req.patient) });
};

exports.updateProfile = async (req, res) => {
  try {
    const { errors, value } = validateProfilePayload(req.body, req.patient);
    if (errors.length) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: errors.join(" ") });
    }

    const db = getDb();
    const existingByPhone = await queryPatientByPhone(db, value.phoneNormalized);
    if (existingByPhone && existingByPhone._id !== req.patient._id) {
      return res.status(409).json({ code: "PROFILE_CONFLICT", message: "Phone or email is already in use." });
    }

    if (value.emailNormalized) {
      const existingByEmail = await queryPatientByEmail(db, value.emailNormalized);
      if (existingByEmail && existingByEmail._id !== req.patient._id) {
        return res.status(409).json({ code: "PROFILE_CONFLICT", message: "Phone or email is already in use." });
      }
    }

    const updatedPatient = {
      ...req.patient,
      name: value.name,
      age: value.age,
      phone: value.phone,
      phoneNormalized: value.phoneNormalized,
      email: value.email || "",
      emailNormalized: value.emailNormalized || "",
      medicalNotes: value.medicalNotes || "",
      medicalHistory: value.medicalHistory || "",
      insuranceInformation: value.insuranceInformation || ""
    };

    await db.collection("patients").doc(req.patient._id).set(updatedPatient);

    return res.json({ patient: serializePatient(updatedPatient) });
  } catch (error) {
    return res.status(500).json({ code: "PROFILE_UPDATE_FAILED", message: "Unable to update profile." });
  }
};
