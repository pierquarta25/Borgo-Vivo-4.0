/* Azioni dei bottoni (attributo data-action) */
/* ───────────── azioni ───────────── */
const A = {
  closeSheet: () => closeSheet(),
  menu: () => openSheet(menuSheet()),
  poi: a => openSheet(poiSheet(a.dataset.id)),
  story: a => openSheet(storySheet(a.dataset.id)),
  op: a => openSheet(opSheet(a.dataset.id)),
  redis: () => openSheet(redisSheet()),
  setNow: a => { S.now = +a.dataset.v; save(); render(); },
  setDate: a => { S.date = a.dataset.v; save(); $$('[data-action=setDate]').forEach(b => b.setAttribute('aria-pressed', String(b === a))); if (S.plan) render('planOut'); },
  switchDest: a => { S.dest = a.dataset.id; save(); closeSheet(); render(); goTop(); toast('Destinazione: ' + dest().name); },
  togInt: a => { const i = S.prefs.interests, k = a.dataset.id; S.prefs.interests = i.includes(k) ? i.filter(x => x !== k) : [...i, k]; save(); a.setAttribute('aria-pressed', S.prefs.interests.includes(k)); },
  togAcc: a => { const k = a.dataset.id; S.acc = S.acc.includes(k) ? S.acc.filter(x => x !== k) : [...S.acc, k]; save(); a.setAttribute('aria-pressed', S.acc.includes(k)); if (route() === 'access') render(); },
  pref: a => { const k = a.dataset.k; S.prefs[k] = k === 'mode' ? a.dataset.v : Number(a.dataset.v); save(); $$(`[data-action=pref][data-k=${k}]`).forEach(b => b.setAttribute('aria-pressed', String(b === a))); },
  preset: a => {
    const pr = PRESETS.find(x => x.id === a.dataset.id);
    if (S.dest !== pr.dest) { S.dest = pr.dest; }
    const mode = pr.stops.some(s => ['m_cripta', 'm_lam'].includes(s)) ? 'auto' : S.prefs.mode;
    const opts = { dest: pr.dest, start: pr.start, mode, pace: 1 };
    const items = pr.stops.map(id => ({ id, status: 'todo', travel: 0, arrive: 0, depart: 0 }));
    if (pr.stops.length >= 7) items.splice(5, 0, { id: 'meal', meal: true, status: 'todo', travel: 0, arrive: 0, depart: 0 });
    retime(items, opts);
    buildPlan(pr.name, { ...opts, end: items[items.length - 1].depart }, items);
    if (route() !== 'planner') location.hash = '#/planner'; else { render(); }
    setTimeout(revealPlan, 80);
  },
  planB: a => openSheet(planBSheet(+a.dataset.i, 'crowd')),
  planBReason: a => openSheet(planBSheet(+a.dataset.i, a.dataset.r)),
  swap: a => {
    const i = +a.dataset.i, old = S.plan.items[i], np = byId(a.dataset.id);
    S.plan.items[i] = { id: np.id, status: 'todo', travel: 0, arrive: old.arrive, depart: old.depart };
    if (np.dest !== S.plan.dest) { S.plan.dest = np.dest; S.dest = np.dest; chrome(); }
    retime(S.plan.items, planOpts()); save(); closeSheet(); render('planOut'); toast('Tappa sostituita: ' + np.name);
  },
  done: a => { const it = S.plan.items[+a.dataset.i]; it.status = it.status === 'done' ? 'todo' : 'done'; it.fixed = it.status === 'done'; save(); render('planOut'); },
  rmStop: a => { S.plan.items.splice(+a.dataset.i, 1); retime(S.plan.items, planOpts()); save(); render('planOut'); },
  addStop: () => openSheet(addStopSheet()),
  addToPlan: a => {
    if (!S.plan) { toast('Crea prima un itinerario'); return; }
    S.plan.items.push({ id: a.dataset.id, status: 'todo', travel: 0, arrive: 0, depart: 0 });
    retime(S.plan.items, planOpts()); save(); closeSheet(); if (route() === 'planner') render('planOut'); toast('Tappa aggiunta all’itinerario');
  },
  replan: () => {
    const pl = S.plan, done = pl.items.filter(i => i.status === 'done');
    const last = done.filter(i => !i.meal).slice(-1)[0];
    const from = last ? byId(last.id).ll : dest().start.ll;
    const exclude = new Set(pl.items.filter(i => i.status !== 'todo').map(i => i.id));
    const mealDone = done.some(i => i.meal);
    const start = Math.max(S.now, done.length ? done[done.length - 1].depart : 0);
    const items = Eng.plan({ dest: pl.dest, date: D(), start, end: Math.max(pl.end, start + 120), from, interests: S.prefs.interests, acc: accSet(), mode: pl.mode, pace: pl.pace, avoid: true, exclude, lunchDone: mealDone || start > 14 * 60 + 40, rain: S.prefs.rain });
    pl.items = [...done, ...items]; pl.items.forEach(i => { if (i.status === 'done') i.fixed = true; });
    save(); render('planOut'); toast(items.length ? 'Itinerario ricalcolato dalle ' + fmt(start) : 'Nessuna tappa possibile nel tempo rimasto');
  },
  clearPlan: () => { S.plan = null; save(); render('planOut'); },
  layer: a => { const k = a.dataset.id; mapState.layers[k] = !mapState.layers[k]; a.setAttribute('aria-pressed', mapState.layers[k]); drawMap(); },
  flyTo: a => {
    const p = byId(a.dataset.id); closeSheet();
    if (S.dest !== p.dest) { S.dest = p.dest; save(); }
    if (route() !== 'map') { location.hash = '#/map'; setTimeout(() => map && map.setView(p.ll, 17), 450); } else map && map.setView(p.ll, 17);
  },
  storyCat: a => { storyCat = a.dataset.id; render(); },
  opType: a => { opType = a.dataset.id; render(); },
  bookDate: a => { $$('[data-action=bookDate]').forEach(b => b.setAttribute('aria-pressed', String(b === a))); $('#bDate').value = a.dataset.v; const o = OPERATORS.find(x => x.id === $('#bookForm').dataset.op); $('#slotBox').innerHTML = slotsHtml(o, a.dataset.v); },
  step: a => { const h = $('#bN'), n = Eng.clamp(+h.value + +a.dataset.d, 1, +h.dataset.max); h.value = n; $('#nLbl').textContent = n; $('#bBtn').textContent = 'Prenota · €' + n * +h.dataset.price; },
  speak: a => {
    if (!('speechSynthesis' in window)) { toast('Lettura vocale non supportata da questo browser'); return; }
    speechSynthesis.cancel(); const s = STORIES.find(x => x.id === a.dataset.id);
    const u = new SpeechSynthesisUtterance(s.title + '. ' + s.text); u.lang = 'it-IT'; speechSynthesis.speak(u);
  },
  cancelBook: a => { S.bookings.splice(+a.dataset.i, 1); save(); render(); toast('Prenotazione annullata'); },
  sync: () => { DATA_SOURCES.forEach(s => S.dataSync[s.id] = Date.now()); save(); render(); toast('Fonti aggiornate (simulato)'); },
  resetAll: () => { if (confirm('Cancellare itinerario, prenotazioni e preferenze?')) { try { localStorage.removeItem(KEY); } catch (e) {} location.hash = '#/home'; location.reload(); } },
  replayOnb: () => { onbStep = 0; onboarding(); },
  onbNext: () => { onbStep = 1; onboarding(); },
  onbDest: a => { S.dest = a.dataset.id; save(); $$('[data-action=onbDest]').forEach(b => b.setAttribute('aria-pressed', String(b === a))); },
  onbDone: () => { S.onboarded = true; save(); $('#onb').hidden = true; document.body.style.overflow = ''; render(); goTop(); }
};
