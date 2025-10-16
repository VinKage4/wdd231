const KEY = 'pokeretro.catalog.prefs';
export const getPrefs = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
export const savePrefs = (obj) => localStorage.setItem(KEY, JSON.stringify(obj));