const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const seedDatabase = require("./utils/seedData");
const { getFirebaseStatus, getFirebaseInitializationError } = require("./config/firebase");

const port = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, "..", "uploads");
const requiredEnvKeys = ["JWT_SECRET"];

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

  try {
    await seedDatabase();
  } catch (error) {
    console.error(`Firestore seed skipped: ${error.message}`);
  }

  const firebaseError = getFirebaseInitializationError();
  if (firebaseError) {
    console.error(`Firebase status: unavailable (${firebaseError.message})`);
  }

  app.listen(port, () => {
    console.log(
      `CareConnect backend running on http://localhost:${port} (database: ${getFirebaseStatus()})`
    );
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
