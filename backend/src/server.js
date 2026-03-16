const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDatabase = require("./config/db");
const seedDatabase = require("./utils/seedData");

const port = process.env.PORT || 5000;
const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const startServer = async () => {
  await connectDatabase();
  await seedDatabase();

  app.listen(port, () => {
    console.log(`CareConnect backend running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
