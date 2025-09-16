const yearEl = document.getElementById('currentyear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const lastMod = document.getElementById('lastModified');
if (lastMod) lastMod.textContent = `Last Modification: ${document.lastModified}`;
