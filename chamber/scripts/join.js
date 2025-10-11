// ------------------------ Mobile menu ------------------------
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

function setMenu(open) {
  primaryNav?.classList.toggle('open', open);
  navToggle?.setAttribute('aria-expanded', String(open));
}
navToggle?.addEventListener('click', () => setMenu(!primaryNav.classList.contains('open')));
primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ------------------------ Footer dates ------------------------
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// ------------------------ Hidden timestamp ------------------------
const ts = document.getElementById('timestamp');
if (ts) ts.value = new Date().toISOString();

// ------------------------ Modals & "See benefits" ------------------------
document.querySelectorAll('[data-open-modal]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // 1) Auto-select the membership level if data-level is present
    const level = link.dataset.level; // "NP" | "Bronze" | "Silver" | "Gold"
    if (level) {
      const radio = document.querySelector(`input[name="membership"][value="${level}"]`);
      if (radio) radio.checked = true;
    }

    // 2) Open the corresponding <dialog>
    const sel = link.getAttribute('href');
    const dlg = document.querySelector(sel);
    if (!dlg) return;

    if (typeof dlg.showModal === 'function') {
      dlg.showModal();
      // move focus to the first focusable control inside for a11y
      const btn = dlg.querySelector('button, [href], input, select, textarea');
      btn?.focus();
    } else {
      // very old browsers fallback
      dlg.setAttribute('open', '');
    }
  });
});

// Click on the backdrop closes the dialog (when supported)
document.querySelectorAll('dialog').forEach(dlg => {
  dlg.addEventListener('click', (e) => {
    const r = dlg.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside && typeof dlg.close === 'function') dlg.close();
  });
});