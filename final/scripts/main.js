const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('primary-nav');
function setMenu(open){ nav?.classList.toggle('open', open); toggle?.setAttribute('aria-expanded', String(open)); }
toggle?.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

document.getElementById('year')?.append(new Date().getFullYear());
document.getElementById('lastModified')?.append(document.lastModified);