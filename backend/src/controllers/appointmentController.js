const { getDb } = require("../config/firebase");

const hydrateAppointment = async (db, appointment) => {
  const [doctorSnapshot, hospitalSnapshot] = await Promise.all([
    appointment.doctorId ? db.collection("doctors").doc(appointment.doctorId).get() : null,
    appointment.hospitalId ? db.collection("hospitals").doc(appointment.hospitalId).get() : null
  ]);

  const doctor = doctorSnapshot?.exists
    ? { _id: doctorSnapshot.id, ...doctorSnapshot.data() }
    : null;
  const hospital = hospitalSnapshot?.exists
    ? { _id: hospitalSnapshot.id, ...hospitalSnapshot.data() }
    : null;

  return {
    _id: appointment._id,
    patient: appointment.patientId,
    doctor,
    hospital,
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

exports.createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      patientName,
      patientAge,
      patientPhone,
      patientEmail,
      medicalNotes
    } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({ code: "VALIDATION_ERROR", message: "Doctor, date, and time slot are required." });
    }

    const db = getDb();
    const doctorSnapshot = await db.collection("doctors").doc(doctorId).get();
    if (!doctorSnapshot.exists) {
      return res.status(404).json({ code: "DOCTOR_NOT_FOUND", message: "Doctor not found." });
    }

    const doctor = doctorSnapshot.data();
    const appointmentRef = db.collection("appointments").doc();
    const appointment = {
      _id: appointmentRef.id,
      patientId: req.patient._id,
      doctorId,
      hospitalId: doctor.hospitalId,
      patientName,
      patientAge,
      patientPhone,
      patientEmail: patientEmail || "",
      medicalNotes: medicalNotes || "",
      appointmentDate,
      timeSlot,
      status: "upcoming",
      createdAt: new Date().toISOString()
    };

    await appointmentRef.set({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      hospitalId: appointment.hospitalId,
      patientName: appointment.patientName,
      patientAge: appointment.patientAge,
      patientPhone: appointment.patientPhone,
      patientEmail: appointment.patientEmail,
      medicalNotes: appointment.medicalNotes,
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
      createdAt: appointment.createdAt
    });

    const hydrated = await hydrateAppointment(db, appointment);
    res.status(201).json(hydrated);
  } catch (error) {
    res.status(500).json({ code: "APPOINTMENT_CREATE_FAILED", message: "Unable to create appointment." });
  }
};

exports.listAppointments = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection("appointments")
      .where("patientId", "==", req.patient._id)
      .get();

    const appointments = snapshot.docs
      .map((doc) => ({ _id: doc.id, ...doc.data() }))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

    const hydratedAppointments = await Promise.all(
      appointments.map((appointment) => hydrateAppointment(db, appointment))
    );

    res.json(hydratedAppointments);
  } catch (error) {
    res.status(500).json({ code: "APPOINTMENT_LIST_FAILED", message: "Unable to fetch appointments." });
  }
};
