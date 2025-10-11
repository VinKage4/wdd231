// Reuse simple header/footer helpers
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
function setMenu(open){ primaryNav?.classList.toggle('open', open); navToggle?.setAttribute('aria-expanded', String(open)); }
navToggle?.addEventListener('click', () => setMenu(!primaryNav.classList.contains('open')));
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Read GET params and render required fields
const params = new URLSearchParams(location.search);
const required = [
  ["First Name", "first"],
  ["Last Name", "last"],
  ["Email", "email"],
  ["Mobile", "mobile"],
  ["Organization", "organization"],
  ["Timestamp", "timestamp"]
];

const list = document.getElementById('submissionList');
list.innerHTML = required.map(([label, key]) => {
  const val = params.get(key) || "—";
  return `<li><strong>${label}:</strong> ${escapeHTML(val)}</li>`;
}).join("");

// small HTML escape helper
function escapeHTML(s){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}