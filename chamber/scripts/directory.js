// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  document.body.classList.toggle('nav-open');
});

// Footer dates
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// Directory rendering
const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

// Restore preferred view
const savedView = localStorage.getItem('directoryView') || 'grid';
applyView(savedView);

// Toggle controls
gridBtn.addEventListener('click', () => applyView('grid'));
listBtn.addEventListener('click', () => applyView('list'));

function applyView(mode){
  directoryEl.classList.toggle('grid', mode === 'grid');
  directoryEl.classList.toggle('list', mode === 'list');
  gridBtn.classList.toggle('active', mode === 'grid');
  listBtn.classList.toggle('active', mode === 'list');
  gridBtn.setAttribute('aria-pressed', String(mode === 'grid'));
  listBtn.setAttribute('aria-pressed', String(mode === 'list'));
  localStorage.setItem('directoryView', mode);
}

// Fetch + render members
(async function loadMembers(){
  try{
    const res = await fetch('data/members.json');
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();
    renderMembers(members);
  }catch(err){
    console.error('Failed to load members:', err);
    directoryEl.innerHTML = `<p role="alert">Sorry, we couldn’t load the directory.</p>`;
  }
})();

function renderMembers(members){
  directoryEl.innerHTML = members.map(toCardHTML).join('');
}

function toCardHTML(m){
  const lvl = membershipLabel(m.membership);
  const logo = `images/members/${m.logo}`;
  const phoneHref = m.phone ? `tel:${m.phone.replace(/[^0-9+]/g,'')}` : null;

  return `
  <article class="card">
    <h2 class="bar">${m.name}
      <span class="badge ${lvl.toLowerCase()}">${lvl}</span>
    </h2>
    <div class="media">
      <img src="${logo}" alt="${m.name} logo" loading="lazy" width="280" height="120" />
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

function membershipLabel(n){
  const map = {1:'Member', 2:'Silver', 3:'Gold'};
  return map[n] || 'Member';
}
