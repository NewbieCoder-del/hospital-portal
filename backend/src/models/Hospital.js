const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    specialties: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    distanceKm: { type: Number, default: 3.5 },
    emergencyContact: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
