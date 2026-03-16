const mongoose = require("mongoose");

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  await mongoose.connect(mongoUri);
};

module.exports = connectDatabase;
