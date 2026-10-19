/* Router a hash (#/home, #/map…), render e tema */
/* ───────────── router & render ───────────── */
const TABS = [['home', 'home', 'Home'], ['map', 'map', 'Mappa'], ['planner', 'sparkles', 'Planner'], ['stories', 'book', 'Racconti'], ['market', 'bag', 'Esperienze']];
const route = () => (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
const TITLES = { home: 'Home', planner: 'AI Planner', map: 'Mappa', stories: 'Racconti', market: 'Esperienze', trips: 'Prenotazioni', mobility: 'Mobilità', access: 'Accessibilità', sources: 'Dati', about: 'Il progetto' };
function chrome() {
  $('#topR').innerHTML = `<label class="destpick">${ic('pin', 18)}<select id="destSel" aria-label="Destinazione">${Object.values(DESTINATIONS).map(d => `<option value="${d.id}" ${d.id === S.dest ? 'selected' : ''}>${d.name.split(' ')[0]}</option>`).join('')}</select>${ic('right', 16)}</label><button class="round" data-action="menu" aria-label="Menu" aria-haspopup="dialog">${ic('menu', 20)}</button>`;
}
function render(only) {
  const r = route();
  if (only === 'planOut') { const o = $('#planOut'); if (o) o.innerHTML = S.plan ? planHtml() : ''; return; }
  $('#tabs').innerHTML = TABS.map(t => `<a href="#/${t[0]}" class="${t[0] === 'planner' ? 'plan' : ''}" ${r === t[0] ? 'aria-current="page"' : ''}>${t[0] === 'planner' ? `<span class="ic-wrap">${ic(t[1], 22)}</span>` : ic(t[1], 22)}<span>${t[2]}</span></a>`).join('');
  chrome();
  if (map && r !== 'map') { map.remove(); map = null; }
  const v = views[r] || views.home, main = $('#view');
  main.className = r === 'map' ? 'bleed' : '';
  main.innerHTML = v();
  if (r === 'map') initMap();
  document.title = 'Borgo Vivo 4.0 — ' + (TITLES[r] || '');
}
function applyDisplay() {
  const c = document.documentElement.classList;
  c.toggle('hc', S.hc); c.toggle('lg', S.text === 'lg'); c.toggle('xl', S.text === 'xl'); c.toggle('nomotion', !S.motion);
  if (S.theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme');
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = S.theme === 'dark' ? '#16120E' : '#B4492A';
}
const goTop = () => window.scrollTo({ top: 0 });
window.addEventListener('hashchange', () => { closeSheet(); render(); goTop(); $('#view').focus({ preventScroll: true }); });
