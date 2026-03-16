const express = require("express");
const multer = require("multer");
const path = require("path");
const requireAuth = require("../middleware/auth");
const recordController = require("../controllers/recordController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
  }
});

const upload = multer({ storage });

router.get("/", requireAuth, recordController.listRecords);
router.post("/", requireAuth, upload.single("recordFile"), recordController.uploadRecord);

module.exports = router;
