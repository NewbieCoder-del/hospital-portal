const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("./app");
const connectDatabase = require("./config/db");
const seedDatabase = require("./utils/seedData");

const port = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, "..", "uploads");
const requiredEnvKeys = ["MONGODB_URI", "JWT_SECRET"];

const validateEnv = () => {
  const missing = requiredEnvKeys.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters.");
  }
};

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const startServer = async () => {
  validateEnv();
  await connectDatabase();
  await seedDatabase();

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  app.listen(port, () => {
    console.log(`CareConnect backend running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
