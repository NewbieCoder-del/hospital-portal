const admin = require("firebase-admin");

let firestore = null;
let initializationError = null;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : "";

const initializeFirebase = () => {
  if (firestore || initializationError) {
    return;
  }

  try {
    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase credentials are not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
      );
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
    }

    firestore = admin.firestore();
  } catch (error) {
    initializationError = error;
    console.error(`Firebase initialization failed: ${error.message}`);
  }
};

initializeFirebase();

const getDb = () => {
  if (!firestore) {
    throw initializationError || new Error("Firebase Firestore is unavailable.");
  }
  return firestore;
};

const getFirebaseStatus = () => {
  if (firestore) return "connected";
  return "disconnected";
};

const getFirebaseInitializationError = () => initializationError;

module.exports = {
  admin,
  getDb,
  getFirebaseStatus,
  getFirebaseInitializationError
};
