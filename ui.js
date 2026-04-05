/**
 * js/ui.js
 * Shared UI utilities: toasts, spinners, navbar highlight, mobile menu.
 */

/* ─── TOAST ──────────────────────────────────────────────── */

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration  ms before auto-dismiss
 */
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ─── BUTTON LOADING STATE ───────────────────────────────── */

/**
 * Set a button into loading state (shows spinner + disables).
 * Returns a restore function to call when done.
 */
export function setButtonLoading(btn, loadingText = 'Loading…') {
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> ${loadingText}`;
  return () => {
    btn.disabled = false;
    btn.innerHTML = original;
  };
}

/* ─── NAVBAR ─────────────────────────────────────────────── */

/** Highlight the nav link matching the current page. */
export function highlightActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });
}

/** Wire up mobile hamburger toggle. */
export function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

/* ─── MODAL ──────────────────────────────────────────────── */
export function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

export function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

/* ─── INIT (auto-runs on import) ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav();
  initMobileNav();
});
