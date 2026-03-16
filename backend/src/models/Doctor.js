const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
    rating: { type: Number, default: 4.5 },
    yearsOfExperience: { type: Number, default: 10 },
    availableToday: { type: Boolean, default: true },
    estimatedWaitMinutes: { type: Number, default: 20 },
    timeSlots: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
