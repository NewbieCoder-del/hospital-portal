const { getDb } = require("../config/firebase");

const hydrateAppointment = async (db, appointment) => {
  const [doctorSnapshot, hospitalSnapshot] = await Promise.all([
    appointment.doctorId ? db.collection("doctors").doc(appointment.doctorId).get() : null,
    appointment.hospitalId ? db.collection("hospitals").doc(appointment.hospitalId).get() : null
  ]);

  return {
    _id: appointment._id,
    patient: appointment.patientId,
    doctor: doctorSnapshot?.exists ? { _id: doctorSnapshot.id, ...doctorSnapshot.data() } : null,
    hospital: hospitalSnapshot?.exists ? { _id: hospitalSnapshot.id, ...hospitalSnapshot.data() } : null,
    patientName: appointment.patientName,
    patientAge: appointment.patientAge,
    patientPhone: appointment.patientPhone,
    patientEmail: appointment.patientEmail || "",
    medicalNotes: appointment.medicalNotes || "",
    appointmentDate: appointment.appointmentDate,
    timeSlot: appointment.timeSlot,
    status: appointment.status || "upcoming",
    createdAt: appointment.createdAt
  };
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const db = getDb();
    const [appointmentSnapshot, recordSnapshot] = await Promise.all([
      db.collection("appointments").where("patientId", "==", req.patient._id).get(),
      db.collection("medicalRecords").where("patientId", "==", req.patient._id).get()
    ]);

    const appointmentsRaw = appointmentSnapshot.docs
      .map((doc) => ({ _id: doc.id, ...doc.data() }))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

    const appointments = await Promise.all(
      appointmentsRaw.map((appointment) => hydrateAppointment(db, appointment))
    );

    const records = recordSnapshot.docs
      .map((doc) => ({ _id: doc.id, ...doc.data(), patient: doc.data().patientId }))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

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

    const db = getDb();
    const familyProfiles = Array.isArray(req.patient.familyProfiles) ? [...req.patient.familyProfiles] : [];
    familyProfiles.push({
      relation,
      name,
      age: age ?? null,
      medicalNotes: medicalNotes || ""
    });

    await db.collection("patients").doc(req.patient._id).update({ familyProfiles });
    req.patient.familyProfiles = familyProfiles;

    res.status(201).json(familyProfiles);
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

    const db = getDb();
    const medicineReminders = Array.isArray(req.patient.medicineReminders) ? [...req.patient.medicineReminders] : [];
    medicineReminders.push({
      medicineName,
      dosage,
      timeOfDay
    });

    await db.collection("patients").doc(req.patient._id).update({ medicineReminders });
    req.patient.medicineReminders = medicineReminders;

    res.status(201).json(medicineReminders);
  } catch (error) {
    res.status(500).json({ code: "REMINDER_SAVE_FAILED", message: "Unable to save medicine reminder." });
  }
};
