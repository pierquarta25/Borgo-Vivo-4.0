/* Stato dell'app (salvato in localStorage), utilità e vocabolari condivisi */
const { byId, fmt, pad, dateKey, dayNames } = Eng;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'borgovivo40c';
const MONTHS = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const DOW = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];

/* ───────────── stato ───────────── */
const today = new Date();
const initNow = (() => { const m = today.getHours() * 60 + Math.round(today.getMinutes() / 30) * 30; return m < 480 || m > 1200 ? 600 : m; })();
const DEFAULT_PREFS = { interests: [], hours: 4, start: 9, mode: 'piedi', pace: 1, avoid: true, rain: false };
const S = Object.assign({
  dest: 'matera', date: dateKey(today), now: initNow, onboarded: false,
  acc: [], hc: false, text: 'n', motion: true, theme: 'light',
  prefs: { ...DEFAULT_PREFS }, plan: null, bookings: [], hearts: [], dataSync: {}
}, (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })());
S.prefs = Object.assign({}, DEFAULT_PREFS, S.prefs);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage non disponibile */ } };
const D = () => new Date(S.date + 'T00:00:00');
const accSet = () => new Set(S.acc);
const dest = () => DESTINATIONS[S.dest];
const crowdNow = p => Eng.crowd(p, D(), S.now);
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 2600); };

/* ───────────── vocabolari ───────────── */
const KIND = {
  panorama: { i: 'camera', c: '#7a6aa8', l: 'Panorama' }, cultura: { i: 'landmark', c: '#b4532a', l: 'Cultura e storia' },
  rupestre: { i: 'cave', c: '#8a5a2b', l: 'Civiltà rupestre' }, natura: { i: 'leaf', c: '#5a6b36', l: 'Natura e archeologia' },
  arte: { i: 'image', c: '#a8436a', l: 'Arte e musei' }, novecento: { i: 'building', c: '#3d6f8a', l: 'Architettura del ’900' },
  artigianato: { i: 'pottery', c: '#c8963c', l: 'Artigianato' }
};
const OPTYPE = { artigiano: 'Artigiani e botteghe', produttore: 'Produttori locali', guida: 'Guide', esperienza: 'Esperienze' };
const OPART = { artigiano: 'artigianato', produttore: 'artigianato', guida: 'panorama', esperienza: 'natura' };
const OPICON = { artigiano: 'pottery', produttore: 'utensils', guida: 'compass', esperienza: 'sparkles' };
const INT_ICON = { rupestre: 'cave', archeo: 'layers', natura: 'leaf', arte: 'image', novecento: 'building', panorami: 'camera', cibo: 'utensils', artigianato: 'pottery', storia: 'book' };
const ACCESS_OPTS = [
  { id: 'wheel', label: 'Carrozzina', icon: 'wheel' }, { id: 'low', label: 'Mobilità ridotta', icon: 'walk' },
  { id: 'stroller', label: 'Passeggino', icon: 'stroller' }, { id: 'vision', label: 'Ipovisione', icon: 'eye' }, { id: 'hearing', label: 'Udito', icon: 'ear' }
];
const EYEBROW = { matera: 'Basilicata · Patrimonio UNESCO', gravina: 'Puglia · Alta Murgia', altamura: 'Puglia · Alta Murgia' };
const PRESETS = [
  { id: 'pr1', cover: 'm_pas', dest: 'matera', name: 'Matera classica', sub: 'Una giornata', tag: 'Sassi e monumenti', kind: 'cultura', start: 9 * 60 + 30, stops: ['m_vv', 'm_pal', 'm_spb', 'm_cat', 'm_sed', 'm_cg', 'm_idr', 'm_sl', 'm_pas'] },
  { id: 'pr2', cover: 'm_tim', dest: 'matera', name: 'Matera prima dei Sassi', sub: 'Mezza giornata', tag: 'Archeologia e natura', kind: 'natura', start: 9 * 60, stops: ['m_jaz', 'm_tim', 'm_falc', 'm_belt'] },
  { id: 'pr3', cover: 'm_lam', dest: 'matera', name: 'La Matera del Novecento', sub: '3–4 ore', tag: 'Architettura e storia sociale', kind: 'novecento', start: 9 * 60 + 30, stops: ['m_lan', 'm_sv', 'm_lam'] },
  { id: 'pr4', cover: 'm_lanf', dest: 'matera', name: 'Tra arte e nuove visioni', sub: '3–4 ore', tag: 'Musei, anche con maltempo', kind: 'arte', start: 10 * 60, stops: ['m_lanf', 'm_sr', 'm_musma'] },
  { id: 'pr5', cover: 'm_cripta', dest: 'matera', name: 'La Matera rupestre nascosta', sub: '2–3 ore', tag: 'Serve l’auto · prenotazione', kind: 'rupestre', start: 10 * 60 + 30, stops: ['m_cripta'] },
  { id: 'pr6', cover: 'g_pon', dest: 'gravina', name: 'Città d’acqua e di pietra', sub: 'Una giornata', tag: 'Storia, fede e paesaggio', kind: 'panorama', start: 9 * 60 + 30, stops: ['g_sca', 'g_pur', 'g_cat', 'g_fin', 'g_cola', 'g_piag', 'g_cal', 'g_sant', 'g_pon'] },
  { id: 'pr7', cover: 'a_duomo', dest: 'altamura', name: 'Pietra, racconto e gusto', sub: 'Una giornata', tag: 'Cattedrale, claustri e Pane DOP', kind: 'cultura', start: 9 * 60 + 30, stops: ['a_duomo', 'a_corso', 'a_claustri', 'a_nicola', 'a_porta', 'a_domenico', 'a_forno'] },
  { id: 'pr8', cover: 'a_lamalunga', dest: 'altamura', name: 'Altamura preistorica', sub: 'Mezza giornata', tag: 'Museo, Lamalunga e Pulo · serve l’auto', kind: 'natura', start: 9 * 60 + 30, stops: ['a_mana', 'a_lamalunga', 'a_pulo'] }
];
const CROWD_LBL = { low: 'Tranquillo', mid: 'Movimentato', high: 'Molto affollato' };
const COL = { low: '#4C8A3A', mid: '#C98A14', high: '#BF3A2B' };
