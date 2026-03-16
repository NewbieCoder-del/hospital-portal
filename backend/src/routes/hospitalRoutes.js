const express = require("express");
const hospitalController = require("../controllers/hospitalController");

const router = express.Router();

router.get("/", hospitalController.listHospitals);

module.exports = router;
