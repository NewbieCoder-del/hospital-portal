const mongoose = require("mongoose");

const familyProfileSchema = new mongoose.Schema(
  {
    relation: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, default: null },
    medicalNotes: { type: String, default: "" }
  },
  { _id: true }
);

const medicineReminderSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, required: true },
    timeOfDay: { type: String, required: true }
  },
  { _id: true }
);

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, default: null },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    medicalNotes: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    insuranceInformation: { type: String, default: "" },
    familyProfiles: [familyProfileSchema],
    medicineReminders: [medicineReminderSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
