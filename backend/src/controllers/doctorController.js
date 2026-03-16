const Doctor = require("../models/Doctor");

exports.listDoctors = async (req, res) => {
  const { query = "", specialty = "" } = req.query;

  const doctors = await Doctor.find({
    ...(specialty && specialty !== "all" ? { specialty: new RegExp(`^${specialty}$`, "i") } : {}),
    ...(query
      ? {
          $or: [
            { name: new RegExp(query, "i") },
            { specialty: new RegExp(query, "i") }
          ]
        }
      : {})
  }).populate("hospital");

  const filteredDoctors = doctors.filter((doctor) => {
    if (!query) {
      return true;
    }

    return (
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
      doctor.hospital.name.toLowerCase().includes(query.toLowerCase())
    );
  });

  res.json(filteredDoctors);
};

exports.getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate("hospital");

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found." });
  }

  res.json(doctor);
};
