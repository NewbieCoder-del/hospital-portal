const Doctor = require("../models/Doctor");

exports.listDoctors = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ code: "DOCTOR_LIST_FAILED", message: "Unable to fetch doctors." });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("hospital");

    if (!doctor) {
      return res.status(404).json({ code: "DOCTOR_NOT_FOUND", message: "Doctor not found." });
    }

    return res.json(doctor);
  } catch (error) {
    return res.status(500).json({ code: "DOCTOR_FETCH_FAILED", message: "Unable to fetch doctor details." });
  }
};
