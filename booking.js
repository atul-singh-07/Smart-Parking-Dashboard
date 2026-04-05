/**
 * js/booking.js
 * Smart booking: auto-assign free slot, prevent double-booking,
 * store booking metadata, time-based billing logic.
 */

import { db }                                     from './firebase.js';
import { getSession }                             from './auth.js';
import { showToast, setButtonLoading }            from './ui.js';
import {
  ref, get, set, update, onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const PARKING_PATH = 'locations/ambience_mall';

/* ─── RATE (₹ per hour) ──────────────────────────────────── */
const HOURLY_RATE = 50;

/* ─── LOAD AVAILABLE SLOTS ───────────────────────────────── */

/**
 * Populate the slot <select> with only available slots.
 * Shows a live badge for each.
 */
export function loadAvailableSlots(selectEl, statusEl) {
  const parkingRef = ref(db, PARKING_PATH);

  onValue(parkingRef, snapshot => {
    const data = snapshot.val();
    if (!data || !data.slots) {
      if (statusEl) statusEl.textContent = 'Could not load slot data.';
      return;
    }

    // Clear existing options
    selectEl.innerHTML = '<option value="">— Select a slot —</option>';

    let hasAvailable = false;
    const slots = data.slots;

    Object.entries(slots).forEach(([key, occupied]) => {
      if (!occupied) {
        hasAvailable = true;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `Slot ${key.replace('slot','').toUpperCase()} — Available`;
        selectEl.appendChild(opt);
      }
    });

    if (!hasAvailable) {
      selectEl.innerHTML = '<option value="">🔴 Parking is FULL</option>';
      if (statusEl) {
        statusEl.textContent = '⚠️ All slots are currently occupied. Please check back shortly.';
        statusEl.className = 'booking-status error';
      }
      showToast('Parking lot is full!', 'error');
    } else {
      if (statusEl) statusEl.textContent = '';
    }
  });
}

/* ─── AUTO-ASSIGN NEAREST FREE SLOT ─────────────────────── */
async function getAutoSlot() {
  const snap = await get(ref(db, `${PARKING_PATH}/slots`));
  if (!snap.exists()) return null;
  const slots = snap.val();
  // Return first free slot key
  for (const [key, occupied] of Object.entries(slots)) {
    if (!occupied) return key;
  }
  return null; // All full
}

/* ─── BOOK A SLOT ────────────────────────────────────────── */

/**
 * Book a specific or auto-assigned slot.
 * @param {string|null} slotKey  null = auto-assign
 * @param {HTMLElement} btn
 */
export async function bookSlot(slotKey, btn) {
  const user = getSession();
  if (!user) {
    showToast('Please log in to book a slot.', 'error');
    setTimeout(() => window.location.href = 'login.html', 1200);
    return;
  }

  const restore = setButtonLoading(btn, 'Booking…');

  try {
    // Auto-assign if not specified
    if (!slotKey) {
      slotKey = await getAutoSlot();
      if (!slotKey) {
        showToast('Parking is full! No slots available.', 'error');
        return;
      }
    }

    // Double-booking check
    const slotSnap = await get(ref(db, `${PARKING_PATH}/slots/${slotKey}`));
    if (slotSnap.val() === 1 || slotSnap.val() === true) {
      showToast('This slot was just taken. Please pick another.', 'error');
      return;
    }

    const now = Date.now();
    const bookingId = `${user.uid}_${now}`;

    // Write atomically
    const updates = {};
    updates[`${PARKING_PATH}/slots/${slotKey}`] = 1;
    updates[`bookings/${bookingId}`] = {
      uid:       user.uid,
      userName:  user.name,
      slotKey,
      startTime: now,
      endTime:   null,
      status:    'active',
      amount:    null
    };
    // Decrement available count
    const totalSnap = await get(ref(db, `${PARKING_PATH}/availableSlots`));
    const available = (totalSnap.val() || 1) - 1;
    updates[`${PARKING_PATH}/availableSlots`] = Math.max(0, available);

    await update(ref(db), updates);

    // Save booking id in session for checkout later
    localStorage.setItem('sp_active_booking', JSON.stringify({ bookingId, slotKey, startTime: now }));

    showToast(`Slot ${slotKey.replace('slot','').toUpperCase()} booked successfully! 🎉`, 'success');
    renderBookingConfirmation(slotKey, now);

  } catch (err) {
    console.error(err);
    showToast('Booking failed. Please try again.', 'error');
  } finally {
    restore();
  }
}

/* ─── CHECKOUT ───────────────────────────────────────────── */
export async function checkOut(btn) {
  const active = JSON.parse(localStorage.getItem('sp_active_booking') || 'null');
  if (!active) {
    showToast('No active booking found.', 'error');
    return;
  }

  const restore = setButtonLoading(btn, 'Checking Out…');

  try {
    const { bookingId, slotKey, startTime } = active;
    const endTime = Date.now();
    const hours   = Math.max(1/60, (endTime - startTime) / 3600000); // minimum 1 min
    const amount  = Math.ceil(hours * HOURLY_RATE);

    const updates = {};
    updates[`${PARKING_PATH}/slots/${slotKey}`] = 0;
    updates[`bookings/${bookingId}/endTime`]    = endTime;
    updates[`bookings/${bookingId}/status`]     = 'completed';
    updates[`bookings/${bookingId}/amount`]     = amount;

    const totalSnap = await get(ref(db, `${PARKING_PATH}/availableSlots`));
    const available = (totalSnap.val() || 0) + 1;
    const totalSlots = (await get(ref(db, `${PARKING_PATH}/totalSlots`))).val() || 2;
    updates[`${PARKING_PATH}/availableSlots`] = Math.min(totalSlots, available);

    await update(ref(db), updates);
    localStorage.removeItem('sp_active_booking');

    showToast(`Checked out! Duration: ${formatDuration(endTime - startTime)} | Fare: ₹${amount}`, 'success', 6000);
    renderCheckoutSummary(slotKey, startTime, endTime, amount);

  } catch (err) {
    console.error(err);
    showToast('Checkout failed. Please try again.', 'error');
  } finally {
    restore();
  }
}

/* ─── UI HELPERS ─────────────────────────────────────────── */

function renderBookingConfirmation(slotKey, startTime) {
  const el = document.getElementById('booking-result');
  if (!el) return;
  el.innerHTML = `
    <div class="booking-confirm">
      <div class="confirm-icon">✅</div>
      <h3>Booking Confirmed</h3>
      <p>Slot: <strong>${slotKey.replace('slot','Slot ').toUpperCase()}</strong></p>
      <p>Time: <strong>${new Date(startTime).toLocaleTimeString()}</strong></p>
      <p class="fare-note">Rate: ₹${HOURLY_RATE}/hour</p>
      <button class="btn btn-outline btn-full" id="checkout-btn" style="margin-top:16px">
        🚪 Check Out & Pay
      </button>
    </div>`;
  document.getElementById('checkout-btn')?.addEventListener('click', e => checkOut(e.currentTarget));
}

function renderCheckoutSummary(slotKey, startTime, endTime, amount) {
  const el = document.getElementById('booking-result');
  if (!el) return;
  el.innerHTML = `
    <div class="booking-confirm">
      <div class="confirm-icon">🧾</div>
      <h3>Receipt</h3>
      <p>Slot: <strong>${slotKey.replace('slot','Slot ').toUpperCase()}</strong></p>
      <p>Duration: <strong>${formatDuration(endTime - startTime)}</strong></p>
      <p>Total Fare: <strong style="color:var(--gold)">₹${amount}</strong></p>
      <a href="booking.html" class="btn btn-primary btn-full" style="margin-top:16px">Book Again</a>
    </div>`;
}

function formatDuration(ms) {
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins/60)}h ${mins%60}m`;
}

/* ─── RESTORE ACTIVE BOOKING ON PAGE LOAD ────────────────── */
export function restoreActiveBooking() {
  const active = JSON.parse(localStorage.getItem('sp_active_booking') || 'null');
  if (!active) return;
  renderBookingConfirmation(active.slotKey, active.startTime);
}
