/* -------- Header: mobile menu (same behavior as directory) -------- */
const navToggle = document.getElementById('nav-toggle');
const primaryNav = document.getElementById('primary-nav');

function setMenu(open){
  primaryNav?.classList.toggle('open', open);
  navToggle?.setAttribute('aria-expanded', String(open));
}
navToggle?.addEventListener('click', () => setMenu(!primaryNav.classList.contains('open')));
primaryNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* -------- Footer dates -------- */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

/* ==================== WEATHER (OpenWeatherMap) ==================== */
/* Set your city and API key */
const OWM_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const LOCATION = 'Provo,US'; // change to your chamber city, e.g., 'Brasilia,BR'

async function loadWeather(){
  try{
    const q = encodeURIComponent(LOCATION);
    const curURL = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=imperial&appid=${OWM_KEY}`;
    const fcURL  = `https://api.openweathermap.org/data/2.5/forecast?q=${q}&units=imperial&appid=${OWM_KEY}`;

    const [curRes, fcRes] = await Promise.all([fetch(curURL), fetch(fcURL)]);
    if(!curRes.ok) throw new Error(`Weather: HTTP ${curRes.status}`);
    if(!fcRes.ok)  throw new Error(`Forecast: HTTP ${fcRes.status}`);

    const cur = await curRes.json();
    const fc  = await fcRes.json();

    // Current
    document.getElementById('wxTemp').textContent = `${Math.round(cur.main.temp)}°F`;
    document.getElementById('wxDesc').textContent = cur.weather?.[0]?.description ?? '—';
    document.getElementById('wxCity').textContent = `${cur.name}`;

    // Forecast: pick around noon for next 3 distinct days
    const byDay = {};
    for(const item of fc.list){
      const [date, time] = item.dt_txt.split(' ');
      if(!byDay[date] || time.startsWith('12:')) byDay[date] = item; // keep noon if present
    }
    const days = Object.keys(byDay).slice(0, 4); // includes possibly today
    const next3 = days.filter(d => d !== new Date().toISOString().slice(0,10)).slice(0,3);

    const ul = document.getElementById('forecastList');
    ul.innerHTML = next3.map(d => {
      const it = byDay[d];
      const label = new Date(d).toLocaleDateString(undefined, { weekday:'short' });
      const t = Math.round(it.main.temp);
      const desc = it.weather?.[0]?.main ?? '';
      return `<li>${label}: <strong>${t}°F</strong> <span class="meta">${desc}</span></li>`;
    }).join('');
  }catch(err){
    console.error(err);
    document.getElementById('forecastList').innerHTML = `<li>Weather unavailable</li>`;
  }
}
loadWeather();

/* ==================== SPOTLIGHTS (Gold/Silver) ==================== */
async function loadSpotlights(){
  // inline placeholder if a logo fails
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='280' height='120'>
      <rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle'
      text-anchor='middle' font-family='Arial,sans-serif' font-size='14' fill='#9ca3af'>Logo unavailable</text></svg>`);

  try{
    const res = await fetch('data/members.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();

    // Only Silver (2) or Gold (3)
    const eligible = all.filter(m => Number(m.membership) >= 2);
    if(eligible.length === 0) throw new Error('No Gold/Silver members found');

    // Shuffle and take 3 (or 2 if only 2 available)
    const picks = [...eligible].sort(() => Math.random() - 0.5).slice(0, Math.min(3, eligible.length));

    const wrap = document.getElementById('spotlights');
    wrap.innerHTML = picks.map(m => {
      const lvl = {2:'Silver', 3:'Gold'}[m.membership] || 'Member';
      const logo = `images/members/${(m.logo||'').trim()}`;
      const phoneHref = m.phone ? `tel:${m.phone.replace(/[^0-9+]/g,'')}` : '';
      return `
        <article class="card">
          <h3 class="bar">${m.name}<span class="badge ${lvl.toLowerCase()}">${lvl}</span></h3>
          <div class="media">
            <img src="${logo}" alt="${m.name} logo" loading="lazy" width="280" height="120"
                 onerror="this.onerror=null; this.src='${PLACEHOLDER}'" />
          </div>
          <div class="body">
            <p><strong>${m.tagline || 'Pokémon TCG Business'}</strong></p>
            ${m.address ? `<div class="meta">${m.address}</div>` : ''}
            ${m.phone ? `<div class="meta">${m.phone}</div>` : '<div class="meta">See website</div>'}
          </div>
          <div class="actions">
            <a href="${m.website}" target="_blank" rel="noopener">Visit Website</a>
            ${phoneHref ? `<a href="${phoneHref}">Call</a>` : ''}
          </div>
        </article>`;
    }).join('');
  }catch(err){
    console.error('Spotlights error:', err);
    document.getElementById('spotlights').innerHTML =
      `<p role="alert">Spotlights unavailable.</p>`;
  }
}
loadSpotlights();
/* ==================== WEATHER (Salt Lake City, UT) ==================== */
const OWM_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // <-- keep your key here

// Salt Lake City, Utah (Temple Square area)
const OWM = { lat: 40.7608, lon: -111.8910, name: 'Salt Lake City, UT' };

async function loadWeather(){
  try{
    const base = `lat=${OWM.lat}&lon=${OWM.lon}&units=imperial&appid=${OWM_KEY}`;
    const curURL = `https://api.openweathermap.org/data/2.5/weather?${base}`;
    const fcURL  = `https://api.openweathermap.org/data/2.5/forecast?${base}`;

    const [curRes, fcRes] = await Promise.all([fetch(curURL), fetch(fcURL)]);
    if(!curRes.ok) throw new Error(`Weather: HTTP ${curRes.status}`);
    if(!fcRes.ok)  throw new Error(`Forecast: HTTP ${fcRes.status}`);

    const cur = await curRes.json();
    const fc  = await fcRes.json();

    // Current
    document.getElementById('wxTemp').textContent = `${Math.round(cur.main.temp)}°F`;
    document.getElementById('wxDesc').textContent = cur.weather?.[0]?.description ?? '—';
    document.getElementById('wxCity').textContent = OWM.name;

    // Forecast — choose around noon for the next 3 distinct days
    const byDay = {};
    for(const item of fc.list){
      const [date, time] = item.dt_txt.split(' ');
      if(!byDay[date] || time.startsWith('12:')) byDay[date] = item;
    }
    const todayISO = new Date().toISOString().slice(0,10);
    const next3Dates = Object.keys(byDay).filter(d => d > todayISO).slice(0,3);

    const ul = document.getElementById('forecastList');
    ul.innerHTML = next3Dates.map(d => {
      const it = byDay[d];
      const label = new Date(d).toLocaleDateString(undefined, { weekday:'short' });
      const t = Math.round(it.main.temp);
      const desc = it.weather?.[0]?.main ?? '';
      return `<li>${label}: <strong>${t}°F</strong> <span class="meta">${desc}</span></li>`;
    }).join('');
  }catch(err){
    console.error(err);
    document.getElementById('forecastList').innerHTML = `<li>Weather unavailable</li>`;
  }
}
loadWeather();