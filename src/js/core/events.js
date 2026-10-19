/* Listener globali: click, input, change, submit, ricerca */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]'); if (!a) return;
  const fn = A[a.dataset.action]; if (!fn) return;
  if (a.tagName === 'A' && a.dataset.action === 'closeSheet') { closeSheet(); return; }
  e.preventDefault(); fn(a, e);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

document.addEventListener('input', e => {
  const t = e.target, b = t.dataset.bind; if (!b) return;
  if (b === 'now') { S.now = +t.value; save(); $$('[data-bind=now]').forEach(x => x.value = S.now); $$('[id$=NowLbl],[id$=Lbl]').forEach(x => x.textContent = fmt(S.now)); if (route() === 'map') drawMap(); }
  if (b === 'search') searchRender(t.value);
});
document.addEventListener('change', e => {
  const t = e.target, b = t.dataset.bind; if (!b) return;
  const [k, sub] = b.split(':');
  if (k === 'pref') { S.prefs[sub] = t.type === 'checkbox' ? t.checked : Number(t.value); save(); }
  else if (k === 'hc') { S.hc = t.checked; save(); applyDisplay(); }
  else if (k === 'dark') { S.theme = t.checked ? 'dark' : 'light'; save(); applyDisplay(); }
  else if (k === 'text') { S.text = t.value; save(); applyDisplay(); }
  else if (k === 'motion') { S.motion = t.checked; save(); applyDisplay(); }
  else if (k === 'crowdTog') { mapState.crowd = t.checked; drawMap(); }
  else if (k === 'mobPoi') { mobPoi = t.value; render(); }
  else if (k === 'opAll') { opShowAll = t.checked; render(); }
  else if (k === 'now') {
    const r = route(), id = t.id;
    if (r === 'home' || r === 'mobility') render(); else if (r === 'planner' && S.plan) render('planOut');
    const again = document.getElementById(id); if (again) again.focus();
  }
});
document.addEventListener('change', e => {
  if (e.target.id !== 'destSel' || e.target.value === 'all') return;
  S.dest = e.target.value; save();
  if (route() === 'home') { location.hash = '#/city'; goTop(); } else render();
  toast('Città: ' + dest().name);
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'planForm') generate();
  if (f.id === 'heartForm') {
    S.hearts.push({ id: 'u' + Date.now(), dest: S.dest, by: $('#hBy').value.trim(), place: $('#hPlace').value, note: $('#hNote').value.trim(), mine: true }); save(); render(); toast('Grazie! Il tuo luogo del cuore è stato salvato.');
  }
  if (f.id === 'bookForm') {
    const o = OPERATORS.find(x => x.id === f.dataset.op), date = $('#bDate').value, part = $('#bPart').value, n = +$('#bN').value;
    const dt = new Date(date + 'T00:00:00');
    S.bookings.push({ op: o.id, date, part, n, note: $('#bNote').value.trim(), label: `${dayNames[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]}` }); save();
    openSheet(`<div class="sh-pad pt" style="text-align:center"><div class="pill" style="padding:14px;border-radius:50%;margin:10px auto">${ic('check', 40)}</div><h2 id="sheetTitle">Richiesta salvata</h2><p>${esc(o.name)}<br><b>${dayNames[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]} · ${esc(part)}</b> · ${n} ${n > 1 ? 'persone' : 'persona'}</p><p class="small muted">È solo una richiesta di prova, salvata su questo dispositivo: non è stata inviata all’operatore. Per prenotare davvero usa il suo sito ufficiale.</p><a class="btn block" href="${esc(o.url)}" target="_blank" rel="noopener">Vai al sito ufficiale</a><a class="btn ghost block" href="#/trips" data-action="closeSheet" style="margin-top:8px">Vedi le mie richieste</a></div>`);
  }
});

function searchRender(q) {
  const box = $('#results'); q = q.trim().toLowerCase();
  if (q.length < 2) { box.innerHTML = ''; return; }
  const hit = s => s.toLowerCase().includes(q);
  const row = (act, id, art, t, sub) => `<button class="res" data-action="${act}" data-id="${id}"><div class="th">${art}</div><div><b>${esc(t)}</b><span class="small muted">${esc(sub)}</span></div></button>`;
  const p = POIS.filter(x => hit(x.name + ' ' + x.desc)).slice(0, 5).map(x => row('poi', x.id, thumb(x), x.name, DESTINATIONS[x.dest].name));
  const s = STORIES.filter(x => hit(x.title + ' ' + x.text)).slice(0, 3).map(x => row('story', x.id, thumb(byId(x.place)), x.title, 'Racconto'));
  const o = OPERATORS.filter(x => hit(x.name + ' ' + x.op + ' ' + x.desc)).slice(0, 3).map(x => row('op', x.id, opPic(x), x.name, 'Esperienza · ' + x.op));
  box.innerHTML = [...p, ...s, ...o].join('') || '<p class="empty" style="padding:14px">Nessun risultato.</p>';
}
