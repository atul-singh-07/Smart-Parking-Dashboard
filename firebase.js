/**
 * js/firebase.js
 * Firebase initialization — single source of truth.
 * Import this module wherever Firebase services are needed.
 */

import { initializeApp }             from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }                   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase }               from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDPPCKJM6WQvsVFisQ5SbqBgvWuSt9AYtQ",
  authDomain:        "smart-parking-system-1cf2a.firebaseapp.com",
  databaseURL:       "https://smart-parking-system-1cf2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "smart-parking-system-1cf2a",
  storageBucket:     "smart-parking-system-1cf2a.firebasestorage.app",
  messagingSenderId: "1006250338223",
  appId:             "1:1006250338223:web:fd1d57aadeb59c4827315a"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getDatabase(app);

export { app, auth, db };
