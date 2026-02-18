import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  });
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  });
}

onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes("dashboard.html")) {
    if (!user) window.location.href = "login.html";
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
