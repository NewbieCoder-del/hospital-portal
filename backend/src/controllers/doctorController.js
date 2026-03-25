const { getDb } = require("../config/firebase");

const buildHospitalMap = (hospitalDocs) =>
  hospitalDocs.reduce((map, hospital) => {
    map[hospital._id] = hospital;
    return map;
  }, {});

const toDoctorResponse = (doctorDoc, hospitalMap) => ({
  _id: doctorDoc._id,
  name: doctorDoc.name,
  specialty: doctorDoc.specialty,
  rating: doctorDoc.rating ?? 4.5,
  yearsOfExperience: doctorDoc.yearsOfExperience ?? 10,
  availableToday: doctorDoc.availableToday ?? true,
  estimatedWaitMinutes: doctorDoc.estimatedWaitMinutes ?? 20,
  timeSlots: doctorDoc.timeSlots || [],
  hospital: hospitalMap[doctorDoc.hospitalId]
    ? { ...hospitalMap[doctorDoc.hospitalId] }
    : null
});

exports.listDoctors = async (req, res) => {
  try {
    const { query = "", specialty = "" } = req.query;
    const db = getDb();

    const [doctorSnapshot, hospitalSnapshot] = await Promise.all([
      db.collection("doctors").get(),
      db.collection("hospitals").get()
    ]);

    const hospitals = hospitalSnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
    const hospitalMap = buildHospitalMap(hospitals);
    const doctors = doctorSnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));

    const specialtyLower = specialty.toLowerCase();
    const queryLower = query.toLowerCase();

    const filteredDoctors = doctors
      .filter((doctor) => {
        if (!specialty || specialtyLower === "all") return true;
        return String(doctor.specialty || "").toLowerCase() === specialtyLower;
      })
      .map((doctor) => toDoctorResponse(doctor, hospitalMap))
      .filter((doctor) => {
        if (!queryLower) return true;
        return (
          String(doctor.name || "").toLowerCase().includes(queryLower) ||
          String(doctor.specialty || "").toLowerCase().includes(queryLower) ||
          String(doctor.hospital?.name || "").toLowerCase().includes(queryLower)
        );
      });

    res.json(filteredDoctors);
  } catch (error) {
    res.status(500).json({ code: "DOCTOR_LIST_FAILED", message: "Unable to fetch doctors." });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const db = getDb();
    const doctorSnapshot = await db.collection("doctors").doc(req.params.id).get();

    if (!doctorSnapshot.exists) {
      return res.status(404).json({ code: "DOCTOR_NOT_FOUND", message: "Doctor not found." });
    }

    const doctor = { _id: doctorSnapshot.id, ...doctorSnapshot.data() };
    const hospitalSnapshot = doctor.hospitalId
      ? await db.collection("hospitals").doc(doctor.hospitalId).get()
      : null;
    const hospital = hospitalSnapshot?.exists
      ? { _id: hospitalSnapshot.id, ...hospitalSnapshot.data() }
      : null;

    return res.json({
      ...toDoctorResponse(doctor, hospital ? { [hospital._id]: hospital } : {}),
      hospital
    });
  } catch (error) {
    return res.status(500).json({ code: "DOCTOR_FETCH_FAILED", message: "Unable to fetch doctor details." });
  }
};
