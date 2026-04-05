/**
 * js/auth.js
 * Authentication logic: register, login, logout, session guard.
 * Uses Firebase Auth + localStorage for session persistence.
 */

import { auth, db }                           from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, set }                           from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { showToast, setButtonLoading }        from './ui.js';

/* ─── SESSION HELPERS ────────────────────────────────────── */

export function saveSession(user) {
  localStorage.setItem('sp_user', JSON.stringify({
    uid:   user.uid,
    name:  user.displayName || 'User',
    email: user.email
  }));
}

export function getSession() {
  try { return JSON.parse(localStorage.getItem('sp_user')); }
  catch { return null; }
}

export function clearSession() {
  localStorage.removeItem('sp_user');
}

/**
 * Guard: redirect to login.html if no session.
 * Call on protected pages (booking, map, dashboard).
 */
export function requireAuth() {
  if (!getSession()) {
    window.location.href = 'login.html';
  }
}

/**
 * Guard: redirect to booking.html if already logged in.
 * Call on login.html.
 */
export function redirectIfLoggedIn() {
  if (getSession()) {
    window.location.href = 'booking.html';
  }
}

/* ─── REGISTER ───────────────────────────────────────────── */
export async function register(name, email, password, btn) {
  if (!name || !email || !password) {
    showToast('Please fill in all fields.', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', 'error');
    return;
  }

  const restore = setButtonLoading(btn, 'Creating Account…');

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Store in Realtime DB
    await set(ref(db, 'users/' + user.uid), {
      name, email,
      role:      'user',
      createdAt: Date.now()
    });

    saveSession(user);
    showToast('Account created! Redirecting…', 'success');
    setTimeout(() => window.location.href = 'booking.html', 1200);

  } catch (err) {
    showToast(friendlyError(err.code), 'error');
  } finally {
    restore();
  }
}

/* ─── LOGIN ──────────────────────────────────────────────── */
export async function login(email, password, btn) {
  if (!email || !password) {
    showToast('Please enter email and password.', 'error');
    return;
  }

  const restore = setButtonLoading(btn, 'Logging In…');

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    saveSession(cred.user);
    showToast('Welcome back! Redirecting…', 'success');
    setTimeout(() => window.location.href = 'booking.html', 1000);

  } catch (err) {
    showToast(friendlyError(err.code), 'error');
  } finally {
    restore();
  }
}

/* ─── LOGOUT ─────────────────────────────────────────────── */
export async function logout() {
  try {
    await signOut(auth);
  } catch (_) {}
  clearSession();
  window.location.href = 'login.html';
}

/* ─── ERROR MESSAGES ─────────────────────────────────────── */
function friendlyError(code) {
  const map = {
    'auth/email-already-in-use':    'This email is already registered.',
    'auth/invalid-email':           'Invalid email address.',
    'auth/weak-password':           'Password is too weak.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password.',
    'auth/invalid-credential':      'Invalid email or password.',
    'auth/too-many-requests':       'Too many attempts. Try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.'
  };
  return map[code] || 'Something went wrong. Please try again.';
}
