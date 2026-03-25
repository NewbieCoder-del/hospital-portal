const { getDb } = require("../config/firebase");

exports.uploadRecord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Please upload a file." });
    }

    const db = getDb();
    const recordRef = db.collection("medicalRecords").doc();
    const record = {
      _id: recordRef.id,
      patient: req.patient._id,
      patientId: req.patient._id,
      recordType: req.body.recordType || "Medical Record",
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      createdAt: new Date().toISOString()
    };

    await recordRef.set({
      patientId: record.patientId,
      recordType: record.recordType,
      originalName: record.originalName,
      filePath: record.filePath,
      mimeType: record.mimeType,
      createdAt: record.createdAt
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ code: "RECORD_UPLOAD_FAILED", message: "Unable to upload record." });
  }
};

exports.listRecords = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection("medicalRecords")
      .where("patientId", "==", req.patient._id)
      .get();

    const records = snapshot.docs
      .map((doc) => ({
        _id: doc.id,
        patient: doc.data().patientId,
        ...doc.data()
      }))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    res.json(records);
  } catch (error) {
    res.status(500).json({ code: "RECORD_LIST_FAILED", message: "Unable to fetch records." });
  }
};
