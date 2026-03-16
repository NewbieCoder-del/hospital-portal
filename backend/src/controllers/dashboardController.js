const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");

exports.getDashboardSummary = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.patient._id })
    .populate("doctor")
    .populate("hospital")
    .sort({ createdAt: -1 });

  const records = await MedicalRecord.find({ patient: req.patient._id }).sort({ createdAt: -1 });

  const upcomingAppointments = appointments.filter((appointment) => appointment.status === "upcoming");
  const pastAppointments = appointments.filter((appointment) => appointment.status !== "upcoming");

  res.json({
    patient: {
      name: req.patient.name,
      age: req.patient.age,
      phone: req.patient.phone,
      email: req.patient.email || "",
      medicalNotes: req.patient.medicalNotes || "",
      medicalHistory: req.patient.medicalHistory || "",
      insuranceInformation: req.patient.insuranceInformation || "",
      familyProfiles: req.patient.familyProfiles || [],
      medicineReminders: req.patient.medicineReminders || []
    },
    upcomingAppointments,
    pastAppointments,
    records
  });
};

exports.addFamilyProfile = async (req, res) => {
  const { relation, name, age, medicalNotes } = req.body;

  if (!relation || !name) {
    return res.status(400).json({ message: "Relation and name are required." });
  }

  req.patient.familyProfiles.push({
    relation,
    name,
    age,
    medicalNotes
  });

  await req.patient.save();
  res.status(201).json(req.patient.familyProfiles);
};

exports.addMedicineReminder = async (req, res) => {
  const { medicineName, dosage, timeOfDay } = req.body;

  if (!medicineName || !dosage || !timeOfDay) {
    return res.status(400).json({ message: "Medicine name, dosage, and time are required." });
  }

  req.patient.medicineReminders.push({
    medicineName,
    dosage,
    timeOfDay
  });

  await req.patient.save();
  res.status(201).json(req.patient.medicineReminders);
};
