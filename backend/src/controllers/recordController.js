const MedicalRecord = require("../models/MedicalRecord");

exports.uploadRecord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Please upload a file." });
    }

    const record = await MedicalRecord.create({
      patient: req.patient._id,
      recordType: req.body.recordType || "Medical Record",
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ code: "RECORD_UPLOAD_FAILED", message: "Unable to upload record." });
  }
};

exports.listRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.patient._id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ code: "RECORD_LIST_FAILED", message: "Unable to fetch records." });
  }
};
