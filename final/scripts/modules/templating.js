export const cardHTML = (p) => `
  <article class="card" data-id="${p.id}">
    <img src="${p.img}" alt="${p.name}" loading="lazy" width="320" height="320">
    <h3>${p.name}</h3>
    <p class="meta">${p.type === 'Card' ? `${p.grade} • ${p.series}` : `${p.platform}`}</p>
    <p class="price">$${p.price.toFixed(2)}</p>
    <button class="btn" data-open="${p.id}">Quick View</button>
  </article>`;

export const modalHTML = (p) => `
  <dialog id="dlg-${p.id}" aria-labelledby="h-${p.id}">
    <h2 id="h-${p.id}">${p.name}</h2>
    <img src="${p.img}" alt="${p.name}" width="360" height="360" loading="lazy">
    ${p.type === 'Card'
      ? `<p><strong>Grade:</strong> ${p.grade}</p><p><strong>Series:</strong> ${p.series}</p>`
      : `<p><strong>Platform:</strong> ${p.platform}</p>`}
    <p>${p.desc}</p>
    <p><strong>Price:</strong> $${p.price.toFixed(2)}</p>
    <form method="dialog"><button class="btn">Close</button></form>
  </dialog>`;