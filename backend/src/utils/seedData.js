const { getDb } = require("../config/firebase");

const hospitalSeed = [
  {
    name: "Apollo Hospital",
    location: "Bannerghatta Road",
    specialties: ["Cardiology", "Neurology", "Orthopedic"],
    rating: 4.8,
    distanceKm: 2.1,
    emergencyContact: "+91 80444 41000"
  },
  {
    name: "Manipal Hospital",
    location: "Old Airport Road",
    specialties: ["Orthopedic", "General Physician", "ENT"],
    rating: 4.7,
    distanceKm: 4.2,
    emergencyContact: "+91 80444 91000"
  },
  {
    name: "Fortis Hospital",
    location: "Bannerghatta Road",
    specialties: ["Dermatology", "Cardiology", "Pediatrics"],
    rating: 4.6,
    distanceKm: 3.4,
    emergencyContact: "+91 80444 62000"
  },
  {
    name: "Narayana Health",
    location: "Bommasandra",
    specialties: ["Cardiac Care", "Oncology", "Nephrology"],
    rating: 4.7,
    distanceKm: 8.5,
    emergencyContact: "+91 80444 22000"
  },
  {
    name: "Columbia Asia Hospital",
    location: "Hebbal",
    specialties: ["General Physician", "Dermatology", "Gastroenterology"],
    rating: 4.5,
    distanceKm: 6.3,
    emergencyContact: "+91 80444 12000"
  },
  {
    name: "Sakra World Hospital",
    location: "Marathahalli",
    specialties: ["Orthopedic", "Neurology", "Emergency Care"],
    rating: 4.6,
    distanceKm: 5.2,
    emergencyContact: "+91 80444 51000"
  }
];

const doctorSeed = [
  {
    name: "Dr Ravi Kumar",
    specialty: "Cardiologist",
    hospitalName: "Apollo Hospital",
    rating: 4.8,
    yearsOfExperience: 18,
    estimatedWaitMinutes: 20,
    timeSlots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"]
  },
  {
    name: "Dr Meera Sharma",
    specialty: "Dermatologist",
    hospitalName: "Fortis Hospital",
    rating: 4.7,
    yearsOfExperience: 13,
    estimatedWaitMinutes: 15,
    timeSlots: ["10:30 AM", "12:00 PM", "3:00 PM", "5:00 PM"]
  },
  {
    name: "Dr Arjun Patel",
    specialty: "Orthopedic",
    hospitalName: "Manipal Hospital",
    rating: 4.6,
    yearsOfExperience: 15,
    estimatedWaitMinutes: 25,
    timeSlots: ["9:30 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
  }
];

const seedHospitals = async (db) => {
  const snapshot = await db.collection("hospitals").limit(1).get();
  if (!snapshot.empty) {
    const full = await db.collection("hospitals").get();
    return full.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  }

  const created = [];
  for (const hospital of hospitalSeed) {
    const ref = db.collection("hospitals").doc();
    const data = { ...hospital, createdAt: new Date().toISOString() };
    await ref.set(data);
    created.push({ _id: ref.id, ...data });
  }

  return created;
};

const seedDoctors = async (db, hospitals) => {
  const snapshot = await db.collection("doctors").limit(1).get();
  if (!snapshot.empty) {
    return;
  }

  const hospitalMap = hospitals.reduce((map, hospital) => {
    map[hospital.name] = hospital._id;
    return map;
  }, {});

  for (const doctor of doctorSeed) {
    const ref = db.collection("doctors").doc();
    await ref.set({
      name: doctor.name,
      specialty: doctor.specialty,
      hospitalId: hospitalMap[doctor.hospitalName] || null,
      rating: doctor.rating,
      yearsOfExperience: doctor.yearsOfExperience,
      estimatedWaitMinutes: doctor.estimatedWaitMinutes,
      timeSlots: doctor.timeSlots,
      availableToday: true,
      createdAt: new Date().toISOString()
    });
  }
};

const seedDatabase = async () => {
  const db = getDb();
  const hospitals = await seedHospitals(db);
  await seedDoctors(db, hospitals);
};

module.exports = seedDatabase;
