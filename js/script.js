const detectBackendOrigin = () => {
  const configuredOrigin =
    window.CARECONNECT_API_ORIGIN || localStorage.getItem("careconnectApiOrigin") || "";
  if (configuredOrigin) {
    return configuredOrigin.replace(/\/+$/, "");
  }

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  return "http://localhost:5000";
};

const BACKEND_ORIGIN = detectBackendOrigin();
const API_BASE = `${BACKEND_ORIGIN}/api`;

const toBackendUrl = (value = "") => {
  if (!value) return BACKEND_ORIGIN;
  return /^https?:\/\//i.test(value) ? value : `${BACKEND_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

const STORAGE_KEYS = {
  authToken: "authToken",
  authPatient: "authPatient",
  seniorMode: "seniorMode",
  highContrastMode: "highContrastMode",
  language: "appLanguage",
  lastAppointment: "lastAppointment"
};

const symptomMap = {
  headache: "General Physician",
  fever: "General Physician",
  "chest pain": "Cardiologist",
  "skin rash": "Dermatologist",
  "joint pain": "Orthopedic"
};

const translations = {
  en: { home: "Home", findDoctor: "Find Doctor", hospitals: "Hospitals", dashboard: "Dashboard", records: "Records", seniorMode: "Senior Mode", contrastMode: "High Contrast", language: "Language", logout: "Log Out", profile: "Profile", emergencyHelp: "Emergency Help", emergencyTitle: "Emergency support", ambulance: "Ambulance", close: "Close", chatbotOpen: "Chat Assistant", chatbotTitle: "Care Assistant", chatbotSend: "Send", chatbotPlaceholder: "Type: Find cardiologist", fastBooking: "Book in 3 simple steps", profileSaved: "Profile saved successfully.", loginNeeded: "Please log in first.", reminderSaved: "Medicine reminder saved.", familySaved: "Family profile saved.", noDoctors: "No matching doctors found right now." },
  kn: { home: "ಮುಖಪುಟ", findDoctor: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ", hospitals: "ಆಸ್ಪತ್ರೆಗಳು", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", records: "ದಾಖಲೆಗಳು", seniorMode: "ಹಿರಿಯರ ಮೋಡ್", contrastMode: "ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್", language: "ಭಾಷೆ", logout: "ಲಾಗ್ ಔಟ್", profile: "ಪ್ರೊಫೈಲ್", emergencyHelp: "ತುರ್ತು ಸಹಾಯ", emergencyTitle: "ತುರ್ತು ಸಹಾಯ", ambulance: "ಆಂಬುಲೆನ್ಸ್", close: "ಮುಚ್ಚಿ", chatbotOpen: "ಚಾಟ್ ಸಹಾಯಕ", chatbotTitle: "ಕೇರ್ ಸಹಾಯಕ", chatbotSend: "ಕಳುಹಿಸಿ", chatbotPlaceholder: "ಟೈಪ್ ಮಾಡಿ: cardiologist ಹುಡುಕಿ", fastBooking: "3 ಸರಳ ಹಂತಗಳಲ್ಲಿ ಬುಕ್ ಮಾಡಿ", profileSaved: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಿದೆ.", loginNeeded: "ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ.", reminderSaved: "ಔಷಧಿ ನೆನಪಿನಿಕೆ ಉಳಿಸಲಾಗಿದೆ.", familySaved: "ಕುಟುಂಬ ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಿದೆ.", noDoctors: "ಈಗ ಹೊಂದುವ ವೈದ್ಯರು ಸಿಗಲಿಲ್ಲ." },
  hi: { home: "होम", findDoctor: "डॉक्टर खोजें", hospitals: "अस्पताल", dashboard: "डैशबोर्ड", records: "रिकॉर्ड्स", seniorMode: "सीनियर मोड", contrastMode: "हाई कॉन्ट्रास्ट", language: "भाषा", logout: "लॉग आउट", profile: "प्रोफाइल", emergencyHelp: "आपात सहायता", emergencyTitle: "आपात सहायता", ambulance: "एम्बुलेंस", close: "बंद करें", chatbotOpen: "चैट सहायक", chatbotTitle: "केयर सहायक", chatbotSend: "भेजें", chatbotPlaceholder: "टाइप करें: cardiologist खोजें", fastBooking: "3 आसान चरणों में बुक करें", profileSaved: "प्रोफाइल सेव हो गई।", loginNeeded: "कृपया पहले लॉग इन करें।", reminderSaved: "दवा रिमाइंडर सेव हो गया।", familySaved: "परिवार प्रोफाइल सेव हो गई।", noDoctors: "अभी कोई मिलते हुए डॉक्टर नहीं मिले।" },
  ta: { home: "முகப்பு", findDoctor: "மருத்துவர் தேடல்", hospitals: "மருத்துவமனைகள்", dashboard: "டாஷ்போர்டு", records: "பதிவுகள்", seniorMode: "மூத்தோர் முறை", contrastMode: "உயர் எதிரொலி", language: "மொழி", logout: "வெளியேறு", profile: "சுயவிவரம்", emergencyHelp: "அவசர உதவி", emergencyTitle: "அவசர உதவி", ambulance: "ஆம்புலன்ஸ்", close: "மூடு", chatbotOpen: "அரட்டை உதவி", chatbotTitle: "பராமரிப்பு உதவி", chatbotSend: "அனுப்பு", chatbotPlaceholder: "எழுதவும்: cardiologist தேடு", fastBooking: "3 எளிய படிகளில் பதிவு செய்யுங்கள்", profileSaved: "சுயவிவரம் சேமிக்கப்பட்டது.", loginNeeded: "முதலில் உள்நுழையவும்.", reminderSaved: "மருந்து நினைவூட்டல் சேமிக்கப்பட்டது.", familySaved: "குடும்ப சுயவிவரம் சேமிக்கப்பட்டது.", noDoctors: "பொருந்தும் மருத்துவர் இப்போது இல்லை." },
  te: { home: "హోమ్", findDoctor: "డాక్టర్ వెతుకు", hospitals: "ఆసుపత్రులు", dashboard: "డాష్‌బోర్డ్", records: "రికార్డులు", seniorMode: "సీనియర్ మోడ్", contrastMode: "హై కాన్ట్రాస్ట్", language: "భాష", logout: "లాగ్ అవుట్", profile: "ప్రొఫైల్", emergencyHelp: "అత్యవసర సహాయం", emergencyTitle: "అత్యవసర సహాయం", ambulance: "అంబులెన్స్", close: "మూసివేయి", chatbotOpen: "చాట్ సహాయకుడు", chatbotTitle: "కేర్ సహాయకుడు", chatbotSend: "పంపండి", chatbotPlaceholder: "టైప్ చేయండి: cardiologist కనుగొను", fastBooking: "3 సరళ దశల్లో బుక్ చేయండి", profileSaved: "ప్రొఫైల్ సేవ్ అయింది.", loginNeeded: "దయచేసి ముందుగా లాగిన్ చేయండి.", reminderSaved: "మందుల గుర్తు సేవ్ అయింది.", familySaved: "కుటుంబ ప్రొఫైల్ సేవ్ అయింది.", noDoctors: "ఇప్పుడే సరిపడే డాక్టర్లు లేరు." }
};

const pageTranslationValues = {
  en: { homeTitle: "Find Doctors and Book Appointments Easily", homeSubtitle: "Senior-friendly healthcare access in Bangalore" },
  kn: { homeTitle: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ ಮತ್ತು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ", homeSubtitle: "ಬೆಂಗಳೂರುದಲ್ಲಿ ಹಿರಿಯರಿಗೆ ಸುಲಭವಾದ ಆರೋಗ್ಯ ಸೇವೆ" },
  hi: { homeTitle: "डॉक्टर खोजें और आसानी से अपॉइंटमेंट बुक करें", homeSubtitle: "बैंगलोर में वरिष्ठ नागरिकों के लिए सरल स्वास्थ्य सेवा" },
  ta: { homeTitle: "மருத்துவரை தேடி நேரத்தை எளிதாக பதிவு செய்யுங்கள்", homeSubtitle: "பெங்களூரில் மூத்தோருக்கான எளிய சுகாதார சேவை" },
  te: { homeTitle: "డాక్టర్లను కనుగొని సులభంగా అపాయింట్మెంట్ బుక్ చేయండి", homeSubtitle: "బెంగళూరులో వృద్ధులకు సులభమైన ఆరోగ్య సేవలు" }
};

const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.authToken) || "";
const getLanguage = () => localStorage.getItem(STORAGE_KEYS.language) || "en";
const t = (key) => translations[getLanguage()]?.[key] || translations.en[key] || key;
const getStoredPatient = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.authPatient) || "null");
  } catch (error) {
    return null;
  }
};

const setStoredPatient = (patient) => localStorage.setItem(STORAGE_KEYS.authPatient, JSON.stringify(patient));
const showAlert = (message) => window.alert(message);

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const getNextDateString = () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  return next.toISOString().split("T")[0];
};

const fetchJSON = async (url, options = {}) => {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    const message =
      "Unable to reach the server. Please verify backend is running and accessible.";
    throw new Error(message);
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    const requestId = response.headers.get("x-request-id");
    const details = requestId ? ` Request ID: ${requestId}.` : "";
    throw new Error((data.message || "Something went wrong.") + details);
  }

  return data;
};

const renderToolbarUserActions = () => {
  const authArea = document.getElementById("toolbar-auth-actions");
  if (!authArea) return;

  const patient = getStoredPatient();
  authArea.innerHTML = patient
    ? `<a class="icon-button" href="patient-profile.html">${t("profile")}</a><button class="toggle-button" id="logout-button" type="button">${t("logout")}</button>`
    : '<a class="icon-button" href="login.html">Login</a><a class="icon-button" href="signup.html">Signup</a>';

  document.getElementById("logout-button")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authPatient);
    window.location.href = "index.html";
  });
};

const createAccessibilityToolbar = () => {
  if (document.querySelector(".accessibility-bar")) return;

  const toolbar = document.createElement("section");
  toolbar.className = "accessibility-bar";
  toolbar.innerHTML = `
    <div class="toolbar-group">
      <button class="toggle-button" id="senior-mode-toggle" type="button">${t("seniorMode")}</button>
      <button class="toggle-button" id="contrast-mode-toggle" type="button">${t("contrastMode")}</button>
      <label class="toolbar-label" for="language-switcher">${t("language")}</label>
      <select id="language-switcher" class="toolbar-select">
        <option value="en">English</option>
        <option value="kn">Kannada</option>
        <option value="hi">Hindi</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
      </select>
    </div>
    <div class="toolbar-group"><span>${t("fastBooking")}</span></div>
    <div class="toolbar-group" id="toolbar-auth-actions"></div>
  `;

  document.body.insertBefore(toolbar, document.querySelector(".site-header"));
  document.getElementById("language-switcher").value = getLanguage();
  renderToolbarUserActions();
};

const applyAccessibilityModes = () => {
  const seniorMode = localStorage.getItem(STORAGE_KEYS.seniorMode) === "true";
  const highContrast = localStorage.getItem(STORAGE_KEYS.highContrastMode) === "true";
  document.body.classList.toggle("senior-mode", seniorMode);
  document.body.classList.toggle("high-contrast", highContrast);
  document.getElementById("senior-mode-toggle")?.classList.toggle("is-active", seniorMode);
  document.getElementById("contrast-mode-toggle")?.classList.toggle("is-active", highContrast);
};

const applyTranslations = () => {
  const nav = document.querySelectorAll(".main-nav a");
  if (nav[0]) nav[0].textContent = t("home");
  if (nav[1]) nav[1].textContent = t("findDoctor");
  if (nav[2]) nav[2].textContent = t("hospitals");
  if (nav[3]) nav[3].textContent = t("dashboard");
  if (nav[4]) nav[4].textContent = t("records");

  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname === "") {
    const values = pageTranslationValues[getLanguage()] || pageTranslationValues.en;
    const title = document.querySelector(".hero h1");
    const subtitle = document.querySelector(".hero .hero-subtitle");
    if (title) title.textContent = values.homeTitle;
    if (subtitle) subtitle.textContent = values.homeSubtitle;
  }
};

const accessibilityModes = () => {
  createAccessibilityToolbar();
  applyAccessibilityModes();
  applyTranslations();

  document.getElementById("senior-mode-toggle")?.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEYS.seniorMode, String(!(localStorage.getItem(STORAGE_KEYS.seniorMode) === "true")));
    applyAccessibilityModes();
  });

  document.getElementById("contrast-mode-toggle")?.addEventListener("click", () => {
    localStorage.setItem(STORAGE_KEYS.highContrastMode, String(!(localStorage.getItem(STORAGE_KEYS.highContrastMode) === "true")));
    applyAccessibilityModes();
  });

  document.getElementById("language-switcher")?.addEventListener("change", (event) => {
    localStorage.setItem(STORAGE_KEYS.language, event.target.value);
    window.location.reload();
  });
};

const renderEmergencyOverlay = async () => {
  const body = document.getElementById("emergency-overlay-body");
  if (!body) return;

  try {
    const hospitals = await fetchJSON(`${API_BASE}/hospitals`);
    const nearest = hospitals.slice().sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999)).slice(0, 3);
    body.innerHTML = `<p><strong>${t("ambulance")}:</strong> 108</p>${nearest.map((hospital) => `
      <article class="utility-card">
        <h3>${hospital.name}</h3>
        <p>${hospital.location}</p>
        <p><strong>Distance:</strong> ${hospital.distanceKm || "Nearby"} km</p>
        <p><strong>Emergency:</strong> ${hospital.emergencyContact || "Front desk"}</p>
      </article>
    `).join("")}`;
  } catch (error) {
    body.innerHTML = `<p><strong>${t("ambulance")}:</strong> 108</p><article class="utility-card"><h3>Apollo Emergency</h3><p>Bannerghatta Road</p></article><article class="utility-card"><h3>Fortis Emergency</h3><p>Bannerghatta Road</p></article><article class="utility-card"><h3>Manipal Emergency</h3><p>Old Airport Road</p></article>`;
  }
};

const emergencyMode = () => {
  if (document.querySelector(".emergency-fab")) return;

  const fab = document.createElement("button");
  fab.className = "emergency-fab";
  fab.type = "button";
  fab.textContent = t("emergencyHelp");

  const overlay = document.createElement("div");
  overlay.className = "overlay-backdrop overlay-hidden";
  overlay.innerHTML = `
    <div class="overlay-panel" role="dialog" aria-modal="true" aria-labelledby="emergency-title">
      <h2 id="emergency-title">${t("emergencyTitle")}</h2>
      <div id="emergency-overlay-body"><p>Loading nearby hospitals...</p></div>
      <div class="action-buttons">
        <a class="primary-button" href="booking.html">Quick appointment booking</a>
        <button class="secondary-button" id="close-emergency-overlay" type="button">${t("close")}</button>
      </div>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(overlay);

  fab.addEventListener("click", async () => {
    overlay.classList.remove("overlay-hidden");
    await renderEmergencyOverlay();
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.id === "close-emergency-overlay") {
      overlay.classList.add("overlay-hidden");
    }
  });
};

const renderAuthStatus = (message, isError = false) => {
  const authStatus = document.getElementById("auth-status");
  if (!authStatus) return;
  authStatus.textContent = message;
  authStatus.classList.toggle("error-text", isError);
  authStatus.classList.toggle("success-text", !isError);
};

const updateProfileStatus = (message, isError = false) => {
  ["profile-status-text", "profile-page-status"].forEach((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("error-text", isError);
    node.classList.toggle("success-text", !isError);
  });
};

const ensurePatientProfile = async () => {
  if (!getAuthToken()) return null;

  try {
    const data = await fetchJSON(`${API_BASE}/auth/me`);
    setStoredPatient(data.patient);
    return data.patient;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authPatient);
    return null;
  }
};

const syncPatientProfileFields = (patient, familyProfile = null) => {
  const source = familyProfile
    ? {
        name: familyProfile.name || "",
        age: familyProfile.age || "",
        phone: patient?.phone || "",
        email: patient?.email || "",
        medicalNotes: familyProfile.medicalNotes || ""
      }
    : {
        name: patient?.name || "",
        age: patient?.age || "",
        phone: patient?.phone || "",
        email: patient?.email || "",
        medicalNotes: patient?.medicalNotes || ""
      };

  const fields = {
    "patient-name": source.name,
    "patient-age": source.age,
    "phone-number": source.phone,
    "patient-email": source.email,
    "medical-notes": source.medicalNotes
  };

  Object.entries(fields).forEach(([id, value]) => {
    const input = document.getElementById(id);
    if (input) input.value = value;
  });

  if (patient) {
    updateProfileStatus(`Profile ready for ${source.name || patient.name}. Select date and time to finish booking.`);
  }
};

const patientAuthentication = () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const data = await fetchJSON(`${API_BASE}/auth/register`, {
          method: "POST",
          body: JSON.stringify({
            name: document.getElementById("register-name")?.value.trim(),
            age: document.getElementById("register-age")?.value ? Number(document.getElementById("register-age").value) : "",
            phone: document.getElementById("register-phone")?.value.trim(),
            email: document.getElementById("register-email")?.value.trim(),
            password: document.getElementById("register-password")?.value,
            medicalNotes: document.getElementById("register-notes")?.value.trim()
          })
        });

        localStorage.setItem(STORAGE_KEYS.authToken, data.token);
        setStoredPatient(data.patient);
        renderToolbarUserActions();
        renderAuthStatus(`Welcome ${data.patient.name}.`);
        if (window.location.pathname.endsWith("signup.html")) {
          window.location.href = "patient-profile.html";
        }
      } catch (error) {
        renderAuthStatus(error.message, true);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        const data = await fetchJSON(`${API_BASE}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            phone: document.getElementById("login-phone")?.value.trim(),
            password: document.getElementById("login-password")?.value
          })
        });

        localStorage.setItem(STORAGE_KEYS.authToken, data.token);
        setStoredPatient(data.patient);
        renderToolbarUserActions();
        renderAuthStatus(`Logged in as ${data.patient.name}.`);
        if (window.location.pathname.endsWith("login.html")) {
          window.location.href = "dashboard.html";
        }
      } catch (error) {
        renderAuthStatus(error.message, true);
      }
    });
  }

  const patient = getStoredPatient();
  if (patient) {
    renderAuthStatus(`Logged in as ${patient.name}.`);
  }
};

const patientProfile = async () => {
  const form = document.getElementById("patient-profile-form");
  if (!form) return;

  const patient = await ensurePatientProfile();
  if (!patient) {
    updateProfileStatus(t("loginNeeded"), true);
    return;
  }

  const setValue = (id, value) => {
    const input = document.getElementById(id);
    if (input) input.value = value || "";
  };

  setValue("profile-name", patient.name);
  setValue("profile-age", patient.age);
  setValue("profile-phone", patient.phone);
  setValue("profile-email", patient.email);
  setValue("profile-medical-history", patient.medicalHistory);
  setValue("profile-medical-notes", patient.medicalNotes);
  setValue("profile-insurance", patient.insuranceInformation);
  updateProfileStatus("Your saved profile is loaded below.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const data = await fetchJSON(`${API_BASE}/auth/profile`, {
        method: "PUT",
        body: JSON.stringify({
          name: document.getElementById("profile-name").value.trim(),
          age: document.getElementById("profile-age").value ? Number(document.getElementById("profile-age").value) : "",
          phone: document.getElementById("profile-phone").value.trim(),
          email: document.getElementById("profile-email").value.trim(),
          medicalHistory: document.getElementById("profile-medical-history").value.trim(),
          medicalNotes: document.getElementById("profile-medical-notes").value.trim(),
          insuranceInformation: document.getElementById("profile-insurance").value.trim()
        })
      });

      setStoredPatient(data.patient);
      updateProfileStatus(t("profileSaved"));
    } catch (error) {
      updateProfileStatus(error.message, true);
    }
  });
};

const buildDoctorCard = (doctor, compact = false) => `
  <article class="doctor-card">
    <h3><a href="doctor-profile.html?id=${doctor._id}">${doctor.name}</a></h3>
    <p class="doctor-meta"><strong>Specialty:</strong> ${doctor.specialty}</p>
    <p class="doctor-meta"><strong>Hospital:</strong> ${doctor.hospital?.name || ""}</p>
    <p class="doctor-meta"><strong>Rating:</strong> ${doctor.rating} / 5</p>
    <p class="doctor-meta"><strong>Available today:</strong> ${doctor.availableToday ? "Yes" : "No"}</p>
    <p class="doctor-meta"><strong>Estimated wait:</strong> ${doctor.estimatedWaitMinutes || 20} minutes</p>
    ${compact ? "" : `<a class="primary-button" href="booking.html?doctorId=${doctor._id}&hospitalId=${doctor.hospital?._id || ""}&doctor=${encodeURIComponent(doctor.name)}&hospital=${encodeURIComponent(doctor.hospital?.name || "")}">Book Appointment</a>`}
    <button class="secondary-button quick-book-button" type="button" data-doctor-id="${doctor._id}" data-hospital-id="${doctor.hospital?._id || ""}" data-doctor="${doctor.name}" data-hospital="${doctor.hospital?.name || ""}" data-time="${doctor.timeSlots?.[0] || "10:00 AM"}">Quick Book</button>
  </article>
`;

const quickBookAppointment = () => {
  document.querySelectorAll(".quick-book-button").forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";

    button.addEventListener("click", async () => {
      const patient = await ensurePatientProfile();
      if (!patient) {
        showAlert("Please log in once to use Quick Book.");
        window.location.href = "login.html";
        return;
      }

      try {
        const appointment = await fetchJSON(`${API_BASE}/appointments`, {
          method: "POST",
          body: JSON.stringify({
            doctorId: button.dataset.doctorId,
            appointmentDate: getNextDateString(),
            timeSlot: button.dataset.time || "10:00 AM",
            patientName: patient.name,
            patientAge: patient.age,
            patientPhone: patient.phone,
            patientEmail: patient.email || "",
            medicalNotes: patient.medicalNotes || ""
          })
        });

        localStorage.setItem(STORAGE_KEYS.lastAppointment, JSON.stringify({
          doctor: appointment.doctor.name,
          hospital: appointment.hospital.name,
          date: formatDate(appointment.appointmentDate),
          time: appointment.timeSlot
        }));

        window.location.href = "confirmation.html";
      } catch (error) {
        showAlert(error.message);
      }
    });
  });
};

const renderDoctorCards = (doctors) => {
  const results = document.getElementById("doctor-results");
  const emptyState = document.getElementById("doctor-empty-state");
  if (!results) return;

  results.innerHTML = "";
  if (!doctors.length) {
    if (emptyState) {
      emptyState.textContent = t("noDoctors");
      emptyState.hidden = false;
    }
    return;
  }

  if (emptyState) emptyState.hidden = true;
  results.innerHTML = doctors.map((doctor) => buildDoctorCard(doctor)).join("");
  quickBookAppointment();
};

const renderSuggestedDoctors = async (specialty) => {
  const results = document.getElementById("symptom-doctor-results");
  if (!results || !specialty) return;

  try {
    const doctors = await fetchJSON(`${API_BASE}/doctors?specialty=${encodeURIComponent(specialty)}`);
    results.innerHTML = doctors.length
      ? doctors.slice(0, 3).map((doctor) => buildDoctorCard(doctor, true)).join("")
      : `<article class="doctor-card"><p>${t("noDoctors")}</p></article>`;
    quickBookAppointment();
  } catch (error) {
    results.innerHTML = `<article class="doctor-card"><p>${error.message}</p></article>`;
  }
};

const symptomChecker = () => {
  const input = document.getElementById("search-input");
  const box = document.getElementById("symptom-suggestions");
  if (!input || !box) return;

  input.addEventListener("input", async () => {
    const value = input.value.trim().toLowerCase();
    const matches = Object.entries(symptomMap).filter(([symptom]) => value.includes(symptom));
    box.innerHTML = "";

    if (!matches.length) {
      box.hidden = true;
      const results = document.getElementById("symptom-doctor-results");
      if (results) results.innerHTML = "";
      return;
    }

    matches.forEach(([symptom, specialty]) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "suggestion-pill";
      pill.textContent = `${symptom} -> ${specialty}`;
      pill.addEventListener("click", async () => {
        input.value = specialty;
        box.hidden = true;
        await renderSuggestedDoctors(specialty);
      });
      box.appendChild(pill);
    });

    box.hidden = false;
    await renderSuggestedDoctors(matches[0][1]);
  });
};

const voiceSearch = () => {
  const button = document.getElementById("voice-search-button");
  const input = document.getElementById("search-input");
  if (!button || !input) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    button.disabled = true;
    button.textContent = "No Mic";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  button.addEventListener("click", () => recognition.start());
  recognition.addEventListener("result", async (event) => {
    const transcript = event.results[0][0].transcript.trim();
    input.value = transcript;

    if (/hospital/i.test(transcript)) {
      window.location.href = "hospitals.html";
      return;
    }

    if (/book appointment/i.test(transcript)) {
      window.location.href = "doctor-search.html";
      return;
    }

    const match = Object.entries(symptomMap).find(([symptom]) => transcript.toLowerCase().includes(symptom));
    if (match) {
      await renderSuggestedDoctors(match[1]);
    }
  });
};

const quickSpecialtyShortcuts = () => {
  document.querySelectorAll(".specialty-card").forEach((card) => {
    const specialty = card.dataset.specialty || card.querySelector("h3")?.textContent?.trim();
    card.tabIndex = 0;
    const open = () => specialty && (window.location.href = `doctor-search.html?query=${encodeURIComponent(specialty)}`);

    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
};

const doctorSearchFilter = () => {
  const homeForm = document.getElementById("quick-search-form");
  const homeInput = document.getElementById("search-input");
  const form = document.getElementById("doctor-search-form");
  const input = document.getElementById("doctor-search-input");
  const specialty = document.getElementById("specialty-filter");

  if (homeForm && homeInput) {
    homeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = homeInput.value.trim();
      const mapped = Object.entries(symptomMap).find(([symptom]) => value.toLowerCase().includes(symptom))?.[1] || value;
      if (mapped) window.location.href = `doctor-search.html?query=${encodeURIComponent(mapped)}`;
    });
  }

  if (!form || !input || !specialty) return;

  const loadDoctors = async () => {
    const params = new URLSearchParams(window.location.search);
    const query = input.value.trim() || params.get("query") || "";
    if (!input.value && params.get("query")) input.value = params.get("query");

    try {
      const doctors = await fetchJSON(`${API_BASE}/doctors?query=${encodeURIComponent(query)}&specialty=${encodeURIComponent(specialty.value)}`);
      renderDoctorCards(doctors);
    } catch (error) {
      showAlert(error.message);
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    loadDoctors();
  });
  input.addEventListener("input", loadDoctors);
  specialty.addEventListener("change", loadDoctors);
  loadDoctors();
};

const loadHospitals = async () => {
  const grid = document.querySelector(".hospitals-grid");
  if (!grid || !window.location.pathname.endsWith("hospitals.html")) return;

  try {
    const hospitals = await fetchJSON(`${API_BASE}/hospitals`);
    grid.innerHTML = hospitals.map((hospital) => `
      <article class="hospital-card card">
        <h3>${hospital.name}</h3>
        <p class="hospital-meta"><strong>Location:</strong> ${hospital.location}</p>
        <p class="hospital-meta"><strong>Specialties:</strong> ${hospital.specialties.join(", ")}</p>
        <p class="hospital-meta"><strong>Rating:</strong> ${hospital.rating} / 5</p>
        <p class="hospital-meta"><strong>Distance:</strong> ${hospital.distanceKm || "Nearby"} km</p>
        <a class="primary-button" href="doctor-search.html?query=${encodeURIComponent(hospital.name)}">View Doctors</a>
      </article>
    `).join("");
  } catch (error) {
    grid.innerHTML = `<article class="hospital-card card"><p>${error.message}</p></article>`;
  }
};

const loadDoctorProfile = async () => {
  const title = document.getElementById("profile-title");
  if (!title) return;

  const params = new URLSearchParams(window.location.search);
  let doctorId = params.get("id");

  try {
    if (!doctorId) {
      const doctors = await fetchJSON(`${API_BASE}/doctors`);
      doctorId = doctors[0]?._id;
    }
    if (!doctorId) return;

    const doctor = await fetchJSON(`${API_BASE}/doctors/${doctorId}`);
    title.textContent = doctor.name;
    document.getElementById("profile-specialty").textContent = doctor.specialty;
    document.getElementById("profile-hospital").textContent = doctor.hospital.name;
    document.getElementById("profile-experience").textContent = `${doctor.yearsOfExperience} years`;
    document.getElementById("profile-rating").textContent = `${doctor.rating} / 5`;

    const info = document.querySelector(".doctor-profile-info");
    if (info && !info.querySelector(".wait-time-text")) {
      const wait = document.createElement("p");
      wait.className = "wait-time-text";
      wait.innerHTML = `<strong>Estimated wait:</strong> ${doctor.estimatedWaitMinutes || 20} minutes`;
      info.appendChild(wait);
    }

    const slots = document.querySelector(".time-slots");
    if (slots) {
      slots.innerHTML = doctor.timeSlots.map((slot) => `
        <a class="time-slot-button" href="booking.html?doctorId=${doctor._id}&hospitalId=${doctor.hospital._id}&doctor=${encodeURIComponent(doctor.name)}&hospital=${encodeURIComponent(doctor.hospital.name)}&time=${encodeURIComponent(slot)}">${slot}</a>
      `).join("");
    }

    const bookLink = document.getElementById("profile-book-link");
    if (bookLink) {
      bookLink.href = `booking.html?doctorId=${doctor._id}&hospitalId=${doctor.hospital._id}&doctor=${encodeURIComponent(doctor.name)}&hospital=${encodeURIComponent(doctor.hospital.name)}`;
    }

    const quickButton = document.getElementById("profile-quick-book-button");
    if (quickButton) {
      quickButton.dataset.doctorId = doctor._id;
      quickButton.dataset.hospitalId = doctor.hospital._id;
      quickButton.dataset.time = doctor.timeSlots?.[0] || "10:00 AM";
    }

    quickBookAppointment();
  } catch (error) {
    showAlert(error.message);
  }
};

const populateFamilyMemberSelect = (patient) => {
  const select = document.getElementById("family-member-select");
  if (!select) return;

  select.innerHTML = '<option value="">Use main patient profile</option>';
  (patient?.familyProfiles || []).forEach((member, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${member.relation}: ${member.name}`;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const member = select.value ? patient.familyProfiles?.[Number(select.value)] : null;
    syncPatientProfileFields(patient, member);
  });
};

const autofillBookingForm = async () => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const patient = await ensurePatientProfile();
  if (patient) {
    syncPatientProfileFields(patient);
    populateFamilyMemberSelect(patient);
  } else {
    updateProfileStatus(t("loginNeeded"), true);
  }

  const params = new URLSearchParams(window.location.search);
  document.getElementById("selected-doctor").textContent = params.get("doctor") || "Choose from doctor list";
  document.getElementById("selected-hospital").textContent = params.get("hospital") || "Choose from doctor list";
  document.getElementById("selected-doctor-id").value = params.get("doctorId") || "";
  document.getElementById("selected-hospital-id").value = params.get("hospitalId") || "";

  const dateInput = document.getElementById("appointment-date");
  const timeInput = document.getElementById("time-slot");
  if (dateInput && !dateInput.value) dateInput.value = getNextDateString();
  if (timeInput && params.get("time")) timeInput.value = params.get("time");
};

const submitBookingForm = () => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const patient = await ensurePatientProfile();
    if (!patient) {
      showAlert(t("loginNeeded"));
      window.location.href = "login.html";
      return;
    }

    const doctorId = document.getElementById("selected-doctor-id").value;
    if (!doctorId) {
      showAlert("Please select a doctor first.");
      window.location.href = "doctor-search.html";
      return;
    }

    try {
      const appointment = await fetchJSON(`${API_BASE}/appointments`, {
        method: "POST",
        body: JSON.stringify({
          doctorId,
          appointmentDate: document.getElementById("appointment-date").value,
          timeSlot: document.getElementById("time-slot").value,
          patientName: document.getElementById("patient-name").value.trim(),
          patientAge: Number(document.getElementById("patient-age").value),
          patientPhone: document.getElementById("phone-number").value.trim(),
          patientEmail: document.getElementById("patient-email").value.trim(),
          medicalNotes: document.getElementById("medical-notes").value.trim()
        })
      });

      localStorage.setItem(STORAGE_KEYS.lastAppointment, JSON.stringify({
        doctor: appointment.doctor.name,
        hospital: appointment.hospital.name,
        date: formatDate(appointment.appointmentDate),
        time: appointment.timeSlot
      }));

      window.location.href = "confirmation.html";
    } catch (error) {
      showAlert(error.message);
    }
  });
};

const loadConfirmation = () => {
  const appointment = JSON.parse(localStorage.getItem(STORAGE_KEYS.lastAppointment) || "null");
  if (!appointment) return;

  [["confirmation-doctor", appointment.doctor], ["confirmation-hospital", appointment.hospital], ["confirmation-date", appointment.date], ["confirmation-time", appointment.time]].forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  });
};

const renderFamilyMembers = (familyProfiles = []) => {
  const list = document.getElementById("family-members-list");
  if (!list) return;
  list.innerHTML = familyProfiles.length
    ? familyProfiles.map((member) => `
      <article class="doctor-card">
        <h3>${member.relation}</h3>
        <p class="doctor-meta"><strong>Name:</strong> ${member.name}</p>
        <p class="doctor-meta"><strong>Age:</strong> ${member.age || "Not added"}</p>
        <p class="doctor-meta"><strong>Medical notes:</strong> ${member.medicalNotes || "No notes added"}</p>
      </article>
    `).join("")
    : `<article class="doctor-card"><p>No family profiles added yet.</p></article>`;
};

const renderMedicineReminders = (reminders = []) => {
  const list = document.getElementById("medicine-reminders-list");
  if (!list) return;
  list.innerHTML = reminders.length
    ? reminders.map((reminder) => `
      <article class="doctor-card">
        <h3>${reminder.medicineName}</h3>
        <p class="doctor-meta"><strong>Dosage:</strong> ${reminder.dosage}</p>
        <p class="doctor-meta"><strong>Time:</strong> ${reminder.timeOfDay}</p>
      </article>
    `).join("")
    : `<article class="doctor-card"><p>No reminders added yet.</p></article>`;
};

const renderAppointments = (container, appointments, fallback) => {
  if (!container) return;
  container.innerHTML = appointments.length
    ? appointments.map((appointment) => `
      <article class="doctor-card">
        <h3>${appointment.doctor?.name || "Doctor"}</h3>
        <p class="doctor-meta"><strong>Hospital:</strong> ${appointment.hospital?.name || ""}</p>
        <p class="doctor-meta"><strong>Date:</strong> ${formatDate(appointment.appointmentDate)}</p>
        <p class="doctor-meta"><strong>Time:</strong> ${appointment.timeSlot}</p>
      </article>
    `).join("")
    : `<article class="doctor-card"><p>${fallback}</p></article>`;
};

const loadDashboard = async () => {
  const summaryPanel = document.getElementById("patient-summary-panel");
  if (!summaryPanel) return;

  const patient = await ensurePatientProfile();
  if (!patient) {
    summaryPanel.innerHTML = "<p>Please log in from the homepage to load your dashboard.</p>";
    return;
  }

  try {
    const summary = await fetchJSON(`${API_BASE}/dashboard/summary`);
    setStoredPatient(summary.patient);

    summaryPanel.innerHTML = `
      <p><strong>Name:</strong> ${summary.patient.name}</p>
      <p><strong>Age:</strong> ${summary.patient.age || "Not provided"}</p>
      <p><strong>Phone:</strong> ${summary.patient.phone}</p>
      <p><strong>Email:</strong> ${summary.patient.email || "Not provided"}</p>
      <p><strong>Medical history:</strong> ${summary.patient.medicalHistory || "Not provided"}</p>
      <p><strong>Insurance:</strong> ${summary.patient.insuranceInformation || "Not provided"}</p>
      <p><a class="secondary-button" href="patient-profile.html">Update Profile</a></p>
    `;

    renderAppointments(document.getElementById("upcoming-appointments-list"), summary.upcomingAppointments, "No upcoming appointments.");
    renderAppointments(document.querySelector('[aria-labelledby="past-title"] .dashboard-cards'), summary.pastAppointments, "No past appointments yet.");
    renderFamilyMembers(summary.patient.familyProfiles || []);
    renderMedicineReminders(summary.patient.medicineReminders || []);
  } catch (error) {
    summaryPanel.innerHTML = `<p>${error.message}</p>`;
  }
};

const caregiverMode = () => {
  const form = document.getElementById("family-member-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const familyProfiles = await fetchJSON(`${API_BASE}/dashboard/family-profiles`, {
        method: "POST",
        body: JSON.stringify({
          relation: document.getElementById("family-role").value,
          name: document.getElementById("family-name").value.trim(),
          age: document.getElementById("family-age").value ? Number(document.getElementById("family-age").value) : "",
          medicalNotes: document.getElementById("family-notes").value.trim()
        })
      });

      form.reset();
      renderFamilyMembers(familyProfiles);
      showAlert(t("familySaved"));
    } catch (error) {
      showAlert(error.message);
    }
  });
};

const medicineReminderSystem = () => {
  const form = document.getElementById("medicine-reminder-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const reminders = await fetchJSON(`${API_BASE}/dashboard/medicine-reminders`, {
        method: "POST",
        body: JSON.stringify({
          medicineName: document.getElementById("medicine-name").value.trim(),
          dosage: document.getElementById("medicine-dosage").value.trim(),
          timeOfDay: document.getElementById("medicine-time").value
        })
      });

      form.reset();
      renderMedicineReminders(reminders);
      showAlert(t("reminderSaved"));
    } catch (error) {
      showAlert(error.message);
    }
  });
};

const loadRecords = async () => {
  const grid = document.getElementById("records-grid");
  const emptyState = document.getElementById("records-empty-state");
  if (!grid) return;

  const patient = await ensurePatientProfile();
  if (!patient) return;

  try {
    const records = await fetchJSON(`${API_BASE}/records`);
    if (!records.length) {
      grid.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = records.map((record) => `
      <article class="record-card">
        <h3>${record.recordType}</h3>
        <p class="doctor-meta">${record.originalName}</p>
        <a class="primary-button" href="${toBackendUrl(record.filePath)}" download>Download</a>
      </article>
    `).join("");
  } catch (error) {
    grid.innerHTML = `<article class="record-card"><p>${error.message}</p></article>`;
  }
};

const medicalRecordStorage = () => {
  document.querySelectorAll(".record-input").forEach((input) => {
    input.addEventListener("change", async () => {
      const patient = await ensurePatientProfile();
      if (!patient) {
        showAlert(t("loginNeeded"));
        window.location.href = "login.html";
        return;
      }

      const file = input.files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("recordType", input.dataset.recordType || "Medical Record");
        formData.append("recordFile", file);
        await fetchJSON(`${API_BASE}/records`, { method: "POST", body: formData });
        input.value = "";
        await loadRecords();
      } catch (error) {
        showAlert(error.message);
      }
    });
  });
};

const aiChatAssistant = () => {
  if (document.querySelector(".chatbot-toggle")) return;

  const toggle = document.createElement("button");
  toggle.className = "chatbot-toggle";
  toggle.type = "button";
  toggle.textContent = t("chatbotOpen");

  const panel = document.createElement("section");
  panel.className = "chatbot-panel chatbot-hidden";
  panel.innerHTML = `
    <div class="chatbot-header">
      <h2>${t("chatbotTitle")}</h2>
      <button id="chatbot-close" class="icon-button" type="button">${t("close")}</button>
    </div>
    <div class="chatbot-messages" id="chatbot-messages">
      <p class="chatbot-message bot">Hello. I can help with doctors, bookings, hospitals, and emergency support.</p>
    </div>
    <form id="chatbot-form" class="chatbot-form">
      <input id="chatbot-input" type="text" placeholder="${t("chatbotPlaceholder")}">
      <button type="submit">${t("chatbotSend")}</button>
    </form>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const open = () => panel.classList.remove("chatbot-hidden");
  toggle.addEventListener("click", open);
  document.querySelector(".ai-button")?.addEventListener("click", open);
  document.getElementById("chatbot-close")?.addEventListener("click", () => panel.classList.add("chatbot-hidden"));

  document.getElementById("chatbot-form")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.getElementById("chatbot-input");
    const messages = document.getElementById("chatbot-messages");
    const text = input.value.trim();
    if (!text || !messages) return;

    const addMessage = (content, role) => {
      const node = document.createElement("p");
      node.className = `chatbot-message ${role}`;
      node.textContent = content;
      messages.appendChild(node);
      messages.scrollTop = messages.scrollHeight;
    };

    addMessage(text, "user");
    const lower = text.toLowerCase();
    let reply = "Please ask about doctors, bookings, hospitals, or emergency help.";
    if (lower.includes("doctor") || lower.includes("cardio")) reply = "Use Find Doctor and tap Quick Book for the fastest appointment path.";
    if (lower.includes("book")) reply = "Booking is simple: choose doctor, select time, confirm.";
    if (lower.includes("hospital")) reply = "Open Hospitals to see major Bangalore hospitals and then tap View Doctors.";
    if (lower.includes("emergency")) reply = "Use Emergency Help for 108 Ambulance and nearby hospitals.";
    addMessage(reply, "bot");
    input.value = "";
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  accessibilityModes();
  emergencyMode();
  aiChatAssistant();
  patientAuthentication();
  symptomChecker();
  voiceSearch();
  quickSpecialtyShortcuts();
  doctorSearchFilter();
  await patientProfile();
  await autofillBookingForm();
  submitBookingForm();
  quickBookAppointment();
  await loadDoctorProfile();
  await loadHospitals();
  loadConfirmation();
  await loadDashboard();
  caregiverMode();
  medicineReminderSystem();
  await loadRecords();
  medicalRecordStorage();
});
