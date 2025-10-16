export async function loadJSON(url){
  try{
    const res = await fetch(url, { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }catch(err){
    console.error('loadJSON:', err);
    throw err;
  }
}