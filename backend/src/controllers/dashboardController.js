const Appointment = require("../models/Appointment");
const MedicalRecord = require("../models/MedicalRecord");

exports.getDashboardSummary = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ code: "DASHBOARD_FETCH_FAILED", message: "Unable to load dashboard." });
  }
};

exports.addFamilyProfile = async (req, res) => {
  try {
    const { relation, name, age, medicalNotes } = req.body;

    if (!relation || !name) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Relation and name are required." });
    }

    req.patient.familyProfiles.push({
      relation,
      name,
      age,
      medicalNotes
    });

    await req.patient.save();
    res.status(201).json(req.patient.familyProfiles);
  } catch (error) {
    res.status(500).json({ code: "FAMILY_PROFILE_SAVE_FAILED", message: "Unable to save family profile." });
  }
};

exports.addMedicineReminder = async (req, res) => {
  try {
    const { medicineName, dosage, timeOfDay } = req.body;

    if (!medicineName || !dosage || !timeOfDay) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Medicine name, dosage, and time are required." });
    }

    req.patient.medicineReminders.push({
      medicineName,
      dosage,
      timeOfDay
    });

    await req.patient.save();
    res.status(201).json(req.patient.medicineReminders);
  } catch (error) {
    res.status(500).json({ code: "REMINDER_SAVE_FAILED", message: "Unable to save medicine reminder." });
  }
};
