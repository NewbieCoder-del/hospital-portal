const { getDb } = require("../config/firebase");

exports.listHospitals = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection("hospitals").get();
    const hospitals = snapshot.docs
      .map((doc) => ({ _id: doc.id, ...doc.data() }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ code: "HOSPITAL_LIST_FAILED", message: "Unable to fetch hospitals." });
  }
};
