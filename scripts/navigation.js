const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
if (menuToggle && primaryNav){
  menuToggle.addEventListener('click', () => {
    const open = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!primaryNav.contains(e.target) && !menuToggle.contains(e.target)){
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
    }
  });
}