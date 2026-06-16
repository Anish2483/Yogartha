// =====================================================
// YOGARTHA — Firebase Configuration & Connection Manager
// =====================================================

const FIREBASE_CONFIG = {
 apiKey: "AIzaSyA9KaRPByf5gYAdwn5OVrrGzKWZnCqljb4",
 authDomain: "yogartha-3a5cd.firebaseapp.com",
 databaseURL: "https://yogartha-3a5cd-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "yogartha-3a5cd",
 storageBucket: "yogartha-3a5cd.firebasestorage.app",
 messagingSenderId: "368140864352",
 appId: "1:368140864352:web:3e61f21dd17209ebc16c05"
};

// Admin login email
const ADMIN_EMAIL = "yogartha.yoga@gmail.com";

// ---- Initialize Firebase (compat SDK v8) ----
if (typeof firebase !== "undefined" && !firebase.apps.length) {
 firebase.initializeApp(FIREBASE_CONFIG);
}

// =====================================================
// YOGARTHA — Firebase Connection Manager
// Wraps all Firebase reads with:
//   1. In-memory session cache (no redundant reads)
//   2. Retry with exponential back-off (max 3 attempts)
//   3. Offline / connection-lost detection
//   4. Graceful fallback — static content stays visible
// =====================================================
const YG = (function () {

 const _cache = {};          // session-level cache keyed by Firebase path
 const _pendingCallbacks = {}; // callbacks waiting for the same path

 // Exponential back-off retry
 function _fetchWithRetry(ref, path, attempts, resolve, reject) {
  ref.once("value")
   .then(snap => {
    _cache[path] = snap.val();
    resolve(snap.val());
   })
   .catch(err => {
    if (attempts > 1) {
     const delay = (4 - attempts) * 1200; // 1.2s, 2.4s
     setTimeout(() => _fetchWithRetry(ref, path, attempts - 1, resolve, reject), delay);
    } else {
     reject(err);
    }
   });
 }

 /**
  * YG.get(path) → Promise<value|null>
  * Reads once from Firebase, with cache + retry.
  * If the same path is already in-flight, shares the same promise.
  */
 function get(path) {
  // 1. Return from cache immediately if available
  if (_cache.hasOwnProperty(path)) {
   return Promise.resolve(_cache[path]);
  }

  // 2. If already fetching this path, return shared promise
  if (_pendingCallbacks[path]) {
   return _pendingCallbacks[path];
  }

  // 3. Bail out gracefully if Firebase is not ready
  if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
   return Promise.resolve(null);
  }

  // 4. Fetch with retry and cache result
  const promise = new Promise((resolve, reject) => {
   const ref = firebase.database().ref(path);
   _fetchWithRetry(ref, path, 3, resolve, reject);
  }).finally(() => {
   delete _pendingCallbacks[path]; // remove from in-flight tracker
  });

  _pendingCallbacks[path] = promise;
  return promise;
 }

 /**
  * YG.isOnline() → Boolean
  * Quick check of navigator.onLine (browsers report this accurately).
  */
 function isOnline() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
 }

 /**
  * YG.monitorConnection(onOnline, onOffline)
  * Listens for browser online/offline events.
  * Also monitors Firebase .info/connected for true RTD connectivity.
  */
 function monitorConnection(onOnline, onOffline) {
  window.addEventListener("online",  () => { if (onOnline)  onOnline();  });
  window.addEventListener("offline", () => { if (onOffline) onOffline(); });

  // Firebase realtime connection state
  if (typeof firebase !== "undefined" && firebase.apps && firebase.apps.length) {
   firebase.database().ref(".info/connected").on("value", snap => {
    if (snap.val() === true) { if (onOnline)  onOnline();  }
    else                     { if (onOffline) onOffline(); }
   });
  }
 }

 /**
  * YG.invalidate(path)
  * Clear one cache entry — useful after an admin write so the next
  * read pulls fresh data instead of returning the old cached value.
  */
 function invalidate(path) {
  delete _cache[path];
 }

 return { get, isOnline, monitorConnection, invalidate };

})();
