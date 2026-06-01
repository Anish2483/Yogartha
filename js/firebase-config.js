// =====================================================
// YOGARTHA — Firebase Configuration
// =====================================================
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyA9KaRPByf5gYAdwn5OVrrGzKWZnCqljb4",
  authDomain:        "yogartha-3a5cd.firebaseapp.com",
  databaseURL:       "https://yogartha-3a5cd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "yogartha-3a5cd",
  storageBucket:     "yogartha-3a5cd.firebasestorage.app",
  messagingSenderId: "368140864352",
  appId:             "1:368140864352:web:3e61f21dd17209ebc16c05"
};

// Admin login email
const ADMIN_EMAIL = "yogartha.yoga@gmail.com";

// Initialize Firebase (using compat SDK v8 — no import needed)
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
