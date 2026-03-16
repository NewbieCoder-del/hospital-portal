const MedicalRecord = require("../models/MedicalRecord");

exports.uploadRecord = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file." });
  }

  const record = await MedicalRecord.create({
    patient: req.patient._id,
    recordType: req.body.recordType || "Medical Record",
    originalName: req.file.originalname,
    filePath: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype
  });

  res.status(201).json(record);
};

exports.listRecords = async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.patient._id }).sort({ createdAt: -1 });
  res.json(records);
};
