/**
 * js/map.js
 * Live parking map: listens to Firebase and updates slot cards in real-time.
 */

import { db }             from './firebase.js';
import { ref, onValue }   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { showToast }      from './ui.js';

const PARKING_PATH = 'locations/ambience_mall';

/**
 * Initialise the live map.
 * Expects the DOM to contain elements:
 *   #map-grid   — container for slot cards
 *   #stat-total, #stat-available, #stat-occupied — counters
 *   #parking-status — full/partial banner
 */
export function initMap() {
  const parkingRef = ref(db, PARKING_PATH);

  onValue(parkingRef, snapshot => {
    const data = snapshot.val();
    if (!data) {
      document.getElementById('map-grid').innerHTML =
        '<p style="color:var(--text-muted);text-align:center">No data available.</p>';
      return;
    }

    const total     = data.totalSlots     ?? Object.keys(data.slots ?? {}).length;
    const available = data.availableSlots ?? Object.values(data.slots ?? {}).filter(v => !v).length;
    const occupied  = total - available;

    // Update counters
    setCounter('stat-total',     total);
    setCounter('stat-available', available);
    setCounter('stat-occupied',  occupied);

    // Status banner
    const banner = document.getElementById('parking-status');
    if (banner) {
      if (available === 0) {
        banner.textContent = '🔴 Parking is FULL';
        banner.className   = 'parking-banner full';
        showToast('Parking lot is currently full!', 'error');
      } else if (available <= Math.ceil(total * 0.25)) {
        banner.textContent = `⚠️ Almost full — only ${available} slot(s) left`;
        banner.className   = 'parking-banner warning';
      } else {
        banner.textContent = `🟢 ${available} of ${total} slots available`;
        banner.className   = 'parking-banner ok';
      }
    }

    // Render slot cards
    renderSlots(data.slots ?? {});

  }, err => {
    console.error('Firebase map error:', err);
    showToast('Failed to connect to parking data.', 'error');
  });
}

/* ─── RENDER SLOTS ───────────────────────────────────────── */
function renderSlots(slots) {
  const grid = document.getElementById('map-grid');
  if (!grid) return;

  grid.innerHTML = '';

  Object.entries(slots).forEach(([key, occupied], idx) => {
    const num   = key.replace('slot', '');
    const label = occupied ? 'Occupied' : 'Available';
    const cls   = occupied ? 'slot-occupied' : 'slot-available';
    const icon  = occupied ? '🚗' : '📦';
    const delay = idx * 80;

    grid.innerHTML += `
      <div class="slot-card ${cls}" style="animation-delay:${delay}ms" id="map-${key}">
        <div class="slot-number">P${num}</div>
        <div class="slot-icon">${icon}</div>
        <div class="slot-label">${label}</div>
        ${!occupied ? `<a href="booking.html" class="slot-book-btn">Book Now</a>` : ''}
      </div>`;
  });
}

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function setCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  const step  = target > current ? 1 : -1;
  let   value = current;
  const timer = setInterval(() => {
    value += step;
    el.textContent = value;
    if (value === target) clearInterval(timer);
  }, 40);
}
