const PHONE_REGEX = /^[0-9]{10,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
};

const normalizePhone = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[^\d]/g, "");
};

const validatePassword = (value) => {
  if (typeof value !== "string" || value.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return "";
};

const validateSignupPayload = (payload = {}) => {
  const errors = [];
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const phoneNormalized = normalizePhone(payload.phone);
  const emailNormalized = normalizeEmail(payload.email);
  const password = payload.password;

  if (!name) errors.push("Name is required.");
  if (!PHONE_REGEX.test(phoneNormalized)) errors.push("Phone must contain 10 to 15 digits.");
  if (emailNormalized && !EMAIL_REGEX.test(emailNormalized)) errors.push("Email format is invalid.");

  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);

  return {
    errors,
    value: {
      name,
      age: payload.age === "" || payload.age == null ? null : Number(payload.age),
      phone: typeof payload.phone === "string" ? payload.phone.trim() : "",
      phoneNormalized,
      email: emailNormalized || "",
      emailNormalized: emailNormalized || "",
      password,
      medicalNotes: typeof payload.medicalNotes === "string" ? payload.medicalNotes.trim() : ""
    }
  };
};

const validateLoginPayload = (payload = {}) => {
  const errors = [];
  const identifierRaw =
    typeof payload.phone === "string" && payload.phone.trim()
      ? payload.phone.trim()
      : typeof payload.email === "string" && payload.email.trim()
        ? payload.email.trim()
        : "";
  const phoneNormalized = normalizePhone(identifierRaw);
  const emailNormalized = normalizeEmail(identifierRaw);
  const password = payload.password;

  if (!PHONE_REGEX.test(phoneNormalized) && !EMAIL_REGEX.test(emailNormalized)) {
    errors.push("Provide a valid phone number or email.");
  }
  if (!password) errors.push("Password is required.");

  return {
    errors,
    value: {
      identifier: identifierRaw,
      phoneNormalized,
      emailNormalized,
      password
    }
  };
};

const validateProfilePayload = (payload = {}, currentPatient) => {
  const errors = [];
  const name = payload.name == null ? currentPatient.name : String(payload.name).trim();
  const phoneRaw = payload.phone == null ? currentPatient.phone : String(payload.phone).trim();
  const phoneNormalized =
    payload.phone == null ? currentPatient.phoneNormalized : normalizePhone(phoneRaw);
  const emailRaw = payload.email == null ? currentPatient.email || "" : String(payload.email);
  const emailNormalized =
    payload.email == null
      ? currentPatient.emailNormalized || ""
      : normalizeEmail(emailRaw);

  if (!name) errors.push("Name is required.");
  if (!PHONE_REGEX.test(phoneNormalized)) errors.push("Phone must contain 10 to 15 digits.");
  if (emailNormalized && !EMAIL_REGEX.test(emailNormalized)) errors.push("Email format is invalid.");

  return {
    errors,
    value: {
      name,
      age: payload.age === "" ? null : payload.age ?? currentPatient.age,
      phone: phoneRaw,
      phoneNormalized,
      email: emailNormalized || "",
      emailNormalized: emailNormalized || "",
      medicalNotes: payload.medicalNotes ?? currentPatient.medicalNotes,
      medicalHistory: payload.medicalHistory ?? currentPatient.medicalHistory,
      insuranceInformation: payload.insuranceInformation ?? currentPatient.insuranceInformation
    }
  };
};

module.exports = {
  normalizePhone,
  normalizeEmail,
  validateSignupPayload,
  validateLoginPayload,
  validateProfilePayload
};
