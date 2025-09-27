/* ---------- Mobile nav: open/close, close on link + Esc ---------- */
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

function setMenu(open) {
  document.body.classList.toggle('nav-open', open);
  navToggle?.setAttribute('aria-expanded', String(open));
}

navToggle?.addEventListener('click', () => {
  const open = !document.body.classList.contains('nav-open');
  setMenu(open);
});

primaryNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

/* ---------- Footer dates ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

/* ---------- Directory rendering ---------- */
const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

const savedView = localStorage.getItem('directoryView') || 'grid';
applyView(savedView);

gridBtn.addEventListener('click', () => applyView('grid'));
listBtn.addEventListener('click', () => applyView('list'));

function applyView(mode) {
  directoryEl.classList.toggle('grid', mode === 'grid');
  directoryEl.classList.toggle('list', mode === 'list');
  gridBtn.classList.toggle('active', mode === 'grid');
  listBtn.classList.toggle('active', mode === 'list');
  gridBtn.setAttribute('aria-pressed', String(mode === 'grid'));
  listBtn.setAttribute('aria-pressed', String(mode === 'list'));
  localStorage.setItem('directoryView', mode);
}

/* ---------- Fetch + render members with diagnostics ---------- */
(async function loadMembers() {
  const DATA_URL = new URL('./data/members.json', window.location.href).toString();

  // inline SVG placeholder for broken/missing logos
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="120">
         <rect width="100%" height="100%" fill="#f3f4f6"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
               font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
           Logo unavailable
         </text>
       </svg>`
    );

  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} @ ${DATA_URL}`);

    const text = await res.text();
    let members;
    try {
      members = JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON in data/members.json: ${e.message}`);
    }
    if (!Array.isArray(members)) throw new Error('JSON root must be an array []');

    // Render
    directoryEl.innerHTML = members.map(m => toCardHTML(m, PLACEHOLDER)).join('');
  } catch (err) {
    console.error('Failed to load members:', err);
    directoryEl.innerHTML = `
      <article class="card" style="padding:1rem">
        <h2 class="bar">Directory error</h2>
        <div class="body">
          <p role="alert">We couldn’t load the directory.</p>
          <p class="meta">${err.message}</p>
        </div>
      </article>`;
  }
})();

function toCardHTML(m, PLACEHOLDER) {
  const lvl = membershipLabel(m.membership);
  const logoName = (m.logo || '').trim();
  const logoPath = new URL(`./images/members/${logoName}`, window.location.href).toString();
  const phoneHref = m.phone ? `tel:${m.phone.replace(/[^0-9+]/g, '')}` : '';

  return `
  <article class="card">
    <h2 class="bar">${m.name}
      <span class="badge ${lvl.toLowerCase()}">${lvl}</span>
    </h2>
    <div class="media">
      <img src="${logoPath}"
           alt="${m.name} logo"
           loading="lazy" width="280" height="120"
           onerror="this.onerror=null; this.src='${PLACEHOLDER}';" />
    </div>
    <div class="body">
      <h3>${m.tagline || 'Pokémon TCG Retailer'}</h3>
      ${m.address ? `<div class="meta">${m.address}</div>` : ''}
      ${m.phone ? `<div class="meta">${m.phone}</div>` : ''}
    </div>
    <div class="actions">
      <a href="${m.website}" target="_blank" rel="noopener">Visit Website</a>
      ${phoneHref ? `<a href="${phoneHref}">Call</a>` : ''}
    </div>
  </article>`;
}

function membershipLabel(n) {
  const map = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
  return map[n] || 'Member';
}