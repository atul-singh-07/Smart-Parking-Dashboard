import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPPCKJM6WQvsVFisQ5SbqBgvWuSt9AYtQ",
  authDomain: "smart-parking-system-1cf2a.firebaseapp.com",
  databaseURL: "https://smart-parking-system-1cf2a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-parking-system-1cf2a",
  storageBucket: "smart-parking-system-1cf2a.firebasestorage.app",
  messagingSenderId: "1006250338223",
  appId: "1:1006250338223:web:fd1d57aadeb59c4827315a"
};

export const app = initializeApp(firebaseConfig);
