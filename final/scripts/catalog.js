import { loadJSON } from './modules/fetcher.js';
import { getPrefs, savePrefs } from './modules/store.js';
import { cardHTML, modalHTML } from './modules/templating.js';
import { applyFilters } from './modules/filters.js';
import { wireModals } from './modules/modal.js';
import { loadCatalog } from './catalog.js';
document.addEventListener('DOMContentLoaded', loadCatalog);

const grid = document.getElementById('grid');
const modalHost = document.getElementById('modalHost');
const form = document.getElementById('filters');

// restore saved prefs
const prefs = getPrefs();
for (const k of ['q','type','platform','grade','max']) if (prefs[k]) form.elements[k].value = prefs[k];

const all = await loadProducts();
render();

form.addEventListener('input', () => {
  const f = Object.fromEntries(new FormData(form).entries());
  savePrefs(f);
  render(f);
});

async function loadProducts(){
  try{
    const data = await loadJSON('data/products.json');
    if (!Array.isArray(data) || data.length < 1) throw new Error('No data');
    return data;
  }catch(e){
    grid.innerHTML = `<p role="alert">Could not load catalog.</p>`;
    return [];
  }
}

function render(f = Object.fromEntries(new FormData(form).entries())){
  const list = applyFilters(all, f);
  grid.innerHTML = list.map(cardHTML).join('');
  modalHost.innerHTML = list.map(modalHTML).join('');
  wireModals(document);
}
