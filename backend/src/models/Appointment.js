const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientPhone: { type: String, required: true },
    patientEmail: { type: String, default: "" },
    medicalNotes: { type: String, default: "" },
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, default: "upcoming" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
