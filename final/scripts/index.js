(async () => {
  const grid = document.getElementById('featuredGrid');
  try {
    const res = await fetch('data/products.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const all = await res.json();
    const picks = [...all].sort(() => Math.random() - 0.5).slice(0, 6);
    grid.innerHTML = picks.map(c => `
      <article class="card">
        <img src="${c.img}" alt="${c.name}" loading="lazy" width="320" height="320">
        <h3>${c.name}</h3>
        <p class="meta">${c.type === 'Card' ? `${c.grade} • ${c.series}` : `${c.platform}`}</p>
        <p class="price">$${c.price.toFixed(2)}</p>
        <a class="btn" href="catalog.html">View</a>
      </article>`).join('');
  } catch (e) {
    console.error(e);
    grid.innerHTML = `<p role="alert">Featured items unavailable.</p>`;
  }
})();