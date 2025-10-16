export function applyFilters(list, f){
  const q = (f.q||'').trim().toLowerCase();
  return list
    .filter(x => f.type==='all' ? true : x.type===f.type)
    .filter(x => f.platform==='all' ? true : (x.platform||'')===f.platform)
    .filter(x => f.grade==='all' ? true : (x.grade||'')===f.grade)
    .filter(x => x.price <= (Number(f.max)||Infinity))
    .filter(x => q ? (x.name.toLowerCase().includes(q) || (x.series||'').toLowerCase().includes(q)) : true);
}