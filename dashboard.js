import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPPCKJM6WQvsVFisQ5SbqBgvWuSt9AYtQ",
  authDomain: "smart-parking-system-1cf2a.firebaseapp.com",
  databaseURL: "https://smart-parking-system-1cf2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-parking-system-1cf2a",
  storageBucket: "smart-parking-system-1cf2a.firebasestorage.app",
  messagingSenderId: "1006250338223",
  appId: "1:1006250338223:web:fd1d57aadeb59c4827315a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to slot1
const slotRef = ref(database, "slot1");

onValue(slotRef, (snapshot) => {
  const value = snapshot.val();

  const slotElement = document.getElementById("slot1");
  const availableElement = document.getElementById("available");

  if (value === 1) {
    slotElement.textContent = "❌ Occupied";
    slotElement.className = "status occupied";
    availableElement.textContent = "0";
    availableElement.className = "status occupied";
  } else {
    slotElement.textContent = "✅ Available";
    slotElement.className = "status available";
    availableElement.textContent = "1";
    availableElement.className = "status available";
  }
});
