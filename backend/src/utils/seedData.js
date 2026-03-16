const Doctor = require("../models/Doctor");
const Hospital = require("../models/Hospital");

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
  { name: "Dr Ravi Kumar", specialty: "Cardiologist", hospitalName: "Apollo Hospital", rating: 4.8, yearsOfExperience: 18, estimatedWaitMinutes: 20, timeSlots: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
  { name: "Dr Meera Sharma", specialty: "Dermatologist", hospitalName: "Fortis Hospital", rating: 4.7, yearsOfExperience: 13, estimatedWaitMinutes: 15, timeSlots: ["10:30 AM", "12:00 PM", "3:00 PM", "5:00 PM"] },
  { name: "Dr Arjun Patel", specialty: "Orthopedic", hospitalName: "Manipal Hospital", rating: 4.6, yearsOfExperience: 15, estimatedWaitMinutes: 25, timeSlots: ["9:30 AM", "11:00 AM", "2:00 PM", "4:00 PM"] }
];

const seedDatabase = async () => {
  const hospitalCount = await Hospital.countDocuments();
  if (hospitalCount === 0) {
    await Hospital.insertMany(hospitalSeed);
  }

  const doctorCount = await Doctor.countDocuments();
  if (doctorCount === 0) {
    const hospitals = await Hospital.find();
    const hospitalMap = hospitals.reduce((map, hospital) => {
      map[hospital.name] = hospital;
      return map;
    }, {});

    await Doctor.insertMany(
      doctorSeed.map((doctor) => ({
        name: doctor.name,
        specialty: doctor.specialty,
        hospital: hospitalMap[doctor.hospitalName]._id,
        rating: doctor.rating,
        yearsOfExperience: doctor.yearsOfExperience,
        estimatedWaitMinutes: doctor.estimatedWaitMinutes,
        timeSlots: doctor.timeSlots,
        availableToday: true
      }))
    );
  }
};

module.exports = seedDatabase;
