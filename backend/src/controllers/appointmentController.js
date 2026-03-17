const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

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

    const doctor = await Doctor.findById(doctorId).populate("hospital");
    if (!doctor) {
      return res.status(404).json({ code: "DOCTOR_NOT_FOUND", message: "Doctor not found." });
    }

    const appointment = await Appointment.create({
      patient: req.patient._id,
      doctor: doctor._id,
      hospital: doctor.hospital._id,
      patientName,
      patientAge,
      patientPhone,
      patientEmail,
      medicalNotes,
      appointmentDate,
      timeSlot
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor")
      .populate("hospital");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ code: "APPOINTMENT_CREATE_FAILED", message: "Unable to create appointment." });
  }
};

exports.listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.patient._id })
      .populate("doctor")
      .populate("hospital")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ code: "APPOINTMENT_LIST_FAILED", message: "Unable to fetch appointments." });
  }
};
