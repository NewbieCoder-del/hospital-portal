const Hospital = require("../models/Hospital");

exports.listHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ code: "HOSPITAL_LIST_FAILED", message: "Unable to fetch hospitals." });
  }
};
