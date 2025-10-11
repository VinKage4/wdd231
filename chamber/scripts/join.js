// Mobile menu (same pattern as other pages)
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
function setMenu(open){ primaryNav?.classList.toggle('open', open); navToggle?.setAttribute('aria-expanded', String(open)); }
navToggle?.addEventListener('click', () => setMenu(!primaryNav.classList.contains('open')));
primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Footer dates
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Hidden timestamp: when the form loads
const ts = document.getElementById('timestamp');
if (ts) ts.value = new Date().toISOString();

// Open/close membership modals
document.querySelectorAll('[data-open-modal]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sel = link.getAttribute('href');
    const dlg = document.querySelector(sel);
    if (dlg && typeof dlg.showModal === 'function') {
      dlg.showModal();
    } else if (dlg) {
      dlg.setAttribute('open', ''); // basic fallback
    }
  });
});
document.querySelectorAll('dialog').forEach(dlg => {
  dlg.addEventListener('click', (e) => {
    const rect = dlg.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) dlg.close(); // click backdrop closes
  });
});