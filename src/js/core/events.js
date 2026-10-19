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
document.addEventListener('change', e => { if (e.target.id === 'destSel') { S.dest = e.target.value; save(); render(); toast('Destinazione: ' + dest().name); } });

document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'planForm') generate();
  if (f.id === 'heartForm') {
    S.hearts.push({ id: 'u' + Date.now(), dest: S.dest, by: $('#hBy').value.trim(), place: $('#hPlace').value, note: $('#hNote').value.trim(), mine: true }); save(); render(); toast('Grazie! Il tuo luogo del cuore è stato salvato.');
  }
  if (f.id === 'bookForm') {
    const o = OPERATORS.find(x => x.id === f.dataset.op), date = $('#bDate').value, slot = (f.querySelector('input[name=slot]:checked') || {}).value, n = +$('#bN').value;
    if (!slot) { toast('Scegli un orario disponibile'); return; }
    if (n > seatsLeft(o, date, slot)) { toast('Posti insufficienti: ne restano ' + seatsLeft(o, date, slot)); return; }
    const dt = new Date(date + 'T00:00:00');
    const b = { op: o.id, date, slot, n, name: $('#bName').value.trim(), mail: $('#bMail').value.trim(), note: $('#bNote').value.trim(), code: 'BV-' + Math.random().toString(36).slice(2, 7).toUpperCase(), label: `${dayNames[dt.getDay()]} ${dt.getDate()} ${MONTHS[dt.getMonth()]}` };
    S.bookings.push(b); save();
    openSheet(`<div class="sh-pad pt" style="text-align:center"><div class="pill low" style="padding:14px;border-radius:50%;margin:10px auto">${ic('check', 40)}</div><h2 id="sheetTitle">Prenotazione confermata</h2><p>${esc(o.name)}<br><b>${esc(b.label)} alle ${slot}</b> · ${n} ${n > 1 ? 'persone' : 'persona'}</p><div class="card" style="display:inline-block;padding:10px 24px"><span class="small muted">Codice</span><br><b style="font-family:var(--display);font-size:1.5rem;letter-spacing:.08em">${b.code}</b></div><p class="small muted">Da pagare all’operatore: €${o.price * n}. Nel prototipo non viene inviata alcuna email: la prenotazione è salvata su questo dispositivo.</p><a class="btn block" href="#/trips" data-action="closeSheet">Vedi le mie prenotazioni</a></div>`);
  }
});

function searchRender(q) {
  const box = $('#results'); q = q.trim().toLowerCase();
  if (q.length < 2) { box.innerHTML = ''; return; }
  const hit = s => s.toLowerCase().includes(q);
  const row = (act, id, art, t, sub) => `<button class="res" data-action="${act}" data-id="${id}"><div class="th">${art}</div><div><b>${esc(t)}</b><span class="small muted">${esc(sub)}</span></div></button>`;
  const p = POIS.filter(x => hit(x.name + ' ' + x.desc)).slice(0, 5).map(x => row('poi', x.id, thumb(x), x.name, DESTINATIONS[x.dest].name));
  const s = STORIES.filter(x => hit(x.title + ' ' + x.text)).slice(0, 3).map(x => row('story', x.id, thumb(byId(x.place)), x.title, 'Racconto'));
  const o = OPERATORS.filter(x => hit(x.name + ' ' + x.op + ' ' + x.desc)).slice(0, 3).map(x => row('op', x.id, pic(x.id, x.name, Art.art(OPART[x.type], x.id)), x.name, 'Esperienza · ' + x.op));
  box.innerHTML = [...p, ...s, ...o].join('') || '<p class="empty" style="padding:14px">Nessun risultato.</p>';
}
