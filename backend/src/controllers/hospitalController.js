const Hospital = require("../models/Hospital");

exports.listHospitals = async (req, res) => {
  const hospitals = await Hospital.find().sort({ name: 1 });
  res.json(hospitals);
};
