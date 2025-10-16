// ------------------------ Header menu ------------------------
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');
function setMenu(open){ primaryNav?.classList.toggle('open', open); navToggle?.setAttribute('aria-expanded', String(open)); }
navToggle?.addEventListener('click', () => setMenu(!primaryNav.classList.contains('open')));
primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ------------------------ Footer dates ------------------------
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

// ------------------------ Visitor message (localStorage) ------------------------
(function visitMessage(){
  const KEY = 'discover.lastVisit';
  const now = Date.now();
  const prev = Number(localStorage.getItem(KEY));

  let msg = "Welcome! Let us know if you have any questions.";
  if (prev) {
    const diffMs = now - prev;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMs < 1000 * 60 * 60 * 24) {
      msg = "Back so soon! Awesome!";
    } else {
      msg = `You last visited ${days} ${days === 1 ? 'day' : 'days'} ago.`;
    }
  }
  document.getElementById('visitMsg').textContent = msg;
  localStorage.setItem(KEY, String(now));

  // dismiss button
  document.getElementById('dismissMsg')?.addEventListener('click', () => {
    document.getElementById('visitorMessage').style.display = 'none';
  });
})();

// ------------------------ Cards (JSON -> DOM) ------------------------
const container = document.querySelector('.discover-grid');

(async function loadCards(){
  try{
    const res = await fetch('data/discover.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    container.innerHTML = items.map(toCard).join('');
    wireToggles();
  }catch(err){
    console.error(err);
    container.innerHTML = `<p role="alert">Sorry, we couldn’t load the discover items.</p>`;
  }
})();

function toCard(item){
  // area class maps to named grid area (area-a … area-h)
  const areaClass = `area-${(item.area||'').toLowerCase()}`;
  const img = item.image;
  return `
    <article class="dcard ${areaClass}">
      <h2>${item.title}</h2>
      <figure class="dmedia">
        <img src="${img}" alt="${item.title}" width="300" height="200" loading="lazy" />
      </figure>
      <address class="daddr">${item.address}</address>
      <p class="ddesc">${item.description}</p>
      <div class="dactions">
        <button class="btn-ghost learn-btn" type="button" aria-expanded="false">Learn more</button>
        <div class="more" hidden>
          <p>Interested in visiting or partnering? <a href="join.html">Join the chamber</a> to network and be featured.</p>
        </div>
      </div>
    </article>
  `;
}

function wireToggles(){
  document.querySelectorAll('.learn-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const more = btn.parentElement.querySelector('.more');
      const isOpen = more.hasAttribute('hidden') ? false : true;
      more.toggleAttribute('hidden', isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.textContent = isOpen ? 'Learn more' : 'Hide';
    });
  });
}