const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    recordType: { type: String, required: true },
    originalName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
