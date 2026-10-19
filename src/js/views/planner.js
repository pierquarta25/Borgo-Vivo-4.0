/* AI Planner: percorsi pronti, form su misura, linea del tempo e Piano B */
/* ---------- PLANNER ---------- */
views.planner = () => {
  const p = S.prefs, d = dest();
  const days = []; for (let i = 0; i < 8; i++) { const x = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i); days.push(x); }
  return `
  ${ph('AI Planner', 'Dimmi tempo, interessi ed esigenze: costruisco la giornata e la adatto se qualcosa cambia.')}
  <div class="sec-h" style="margin-top:6px"><h2>Percorsi pronti · ${esc(d.name.split(' ')[0])}</h2></div>
  <div class="rail">${PRESETS.filter(x => x.dest === S.dest).map(routeCard).join('')}</div>

  <div class="split">
  <form class="card" id="planForm" autocomplete="off" style="padding:6px 18px 18px">
    <h2 style="margin-top:14px">Su misura per te</h2>
    <div class="fg"><div class="lb">${ic('calendar', 18)} Quando</div>
      <div class="datechips" role="group" aria-label="Giorno">${days.map(x => { const k = dateKey(x); return `<button type="button" class="dc" aria-pressed="${S.date === k}" data-action="setDate" data-v="${k}"><small>${DOW[x.getDay()]}</small><b>${x.getDate()}</b><small>${MONTHS[x.getMonth()]}</small></button>`; }).join('')}</div></div>
    <div class="fg"><div class="lb">${ic('clock', 18)} Parti alle</div>
      <div class="chips" role="group" aria-label="Orario di partenza">${[8, 9, 10, 11, 14, 15, 16].map(h => chip(pad(h) + ':00', '', p.start === h, 'pref', `data-k="start" data-v="${h}"`)).join('')}</div></div>
    <div class="fg"><div class="lb">${ic('sun', 18)} Quanto tempo hai</div>
      <div class="chips" role="group" aria-label="Durata">${[2, 3, 4, 5, 6, 8].map(h => chip(h + ' ore', '', p.hours === h, 'pref', `data-k="hours" data-v="${h}"`)).join('')}</div></div>
    <div class="fg"><div class="lb">${ic('heart', 18)} Cosa ti piace <span class="muted small" style="font-weight:400">(nessuna scelta = tutto)</span></div>
      <div class="chips" role="group" aria-label="Interessi">${INTERESTS.map(i => chip(i.label, INT_ICON[i.id], p.interests.includes(i.id), 'togInt', `data-id="${i.id}"`)).join('')}</div></div>
    <div class="fg"><div class="lb">${ic('access', 18)} Esigenze di accessibilità</div>
      <div class="chips" role="group" aria-label="Accessibilità">${ACCESS_OPTS.map(i => chip(i.label, i.icon, S.acc.includes(i.id), 'togAcc', `data-id="${i.id}"`)).join('')}</div></div>
    <div class="grid2" style="display:grid;grid-template-columns:1fr;gap:0">
      <div class="fg"><div class="lb">${ic('route', 18)} Come ti muovi</div><div class="seg" role="group" aria-label="Spostamenti"><button type="button" aria-pressed="${p.mode === 'piedi'}" data-action="pref" data-k="mode" data-v="piedi">${ic('walk', 17)} A piedi</button><button type="button" aria-pressed="${p.mode === 'auto'}" data-action="pref" data-k="mode" data-v="auto">${ic('car', 17)} In auto</button></div></div>
      <div class="fg"><div class="lb">${ic('clock', 18)} Ritmo</div><div class="seg" role="group" aria-label="Ritmo"><button type="button" aria-pressed="${p.pace === 1.3}" data-action="pref" data-k="pace" data-v="1.3">Lento</button><button type="button" aria-pressed="${p.pace === 1}" data-action="pref" data-k="pace" data-v="1">Medio</button><button type="button" aria-pressed="${p.pace === 0.8}" data-action="pref" data-k="pace" data-v="0.8">Svelto</button></div></div>
    </div>
    <div style="margin-top:12px">
      ${toggle('pAvoid', p.avoid, 'pref:avoid', 'Evita la folla', 'users', 'Privilegia luoghi meno affollati')}
      ${toggle('pRain', p.rain, 'pref:rain', 'Piove', 'rain', 'Preferisci luoghi al coperto')}
    </div>
    <div class="cta-bar"><button class="btn block" type="submit">${ic('sparkles', 20)} Crea il mio itinerario</button></div>
  </form>
  <div id="planOut">${S.plan ? planHtml() : `<div class="card night" style="text-align:center;padding:30px 20px">${ic('route', 34)}<h3 style="margin:10px 0 6px">Il tuo itinerario apparirà qui</h3><p class="small" style="opacity:.8;margin:0">Scegli un percorso pronto oppure crea il tuo su misura.</p></div>`}</div>
  </div>`;
};

function retime(items, o) {
  const date = D(), acc = accSet();
  let t = o.start, pos = o.from || dest().start.ll, pd = o.dest;
  items.forEach(it => {
    if (it.status === 'done' && it.fixed) { t = it.depart; if (!it.meal) { const q = byId(it.id); pos = q.ll; pd = q.dest; } return; }
    if (it.meal) { it.travel = 0; it.arrive = t; it.depart = t + 60; t = it.depart; return; }
    const p = byId(it.id);
    it.travel = Eng.travelMin(pos, p.ll, o.mode, acc, pd, p.dest);
    let a = t + it.travel;
    if (!Eng.isOpen(p, date, a)) { const nx = (Eng.windows(p, date).filter(w => w[0] >= a).map(w => w[0]).sort((x, y) => x - y))[0]; if (nx !== undefined && nx - a <= 45) a = nx; }
    it.arrive = a; it.depart = a + Math.round(p.dur * (o.pace || 1));
    t = it.depart; pos = p.ll; pd = p.dest;
  });
}
const planOpts = () => ({ dest: S.plan.dest, start: S.plan.start, mode: S.plan.mode, pace: S.plan.pace });

function planHtml() {
  const pl = S.plan, date = D(), acc = accSet(), items = pl.items;
  const real = items.filter(i => !i.meal && i.status !== 'skipped');
  const walk = items.reduce((s, i) => s + (i.status === 'skipped' ? 0 : i.travel), 0);
  let issues = 0, n = 0;
  const rows = items.map((it, idx) => {
    const a = Eng.assess(it, { date, acc });
    const crit = a.flags.filter(f => f.type === 'closed' || f.type === 'crowd');
    if (it.status === 'todo' && crit.length) issues++;
    if (it.meal) return `<li><div class="nd meal">${ic('utensils', 17)}</div><div class="stop"><div class="bd"><h3>Pausa gastronomica lucana</h3><div class="small muted">${fmt(it.arrive)}–${fmt(it.depart)} · pane di Matera, crapiata, peperoni cruschi, cialledda</div><div class="small muted">Indicativa: non è la prenotazione di un ristorante.</div></div><div class="acts"><button class="btn sm ghost" data-action="rmStop" data-i="${idx}">Rimuovi</button><a class="btn sm ghost" href="#/market">Trova un’esperienza</a></div></div></li>`;
    const p = byId(it.id), st = it.status; n++;
    const prev = idx ? byId(items[idx - 1].id) : null;
    const from = prev ? prev.ll : dest().start.ll;
    const tr = it.travel > 4 ? `<div class="tr">${ic(Eng.travelKind(from, p.ll, pl.mode) === 'auto' ? 'car' : 'walk', 14)} ${it.travel} min${prev && prev.dest !== p.dest ? ' · trasferimento tra borghi' : ''}</div>` : '<div class="tr"></div>';
    return `<li>${tr}<div class="nd ${st === 'done' ? 'done' : ''}">${st === 'done' ? ic('check', 18) : n}</div>
      <div class="stop ${st === 'done' ? 'done' : ''} ${crit.length && st === 'todo' ? 'flag' : ''}">
        <div class="th">${thumb(p)}</div>
        <div class="bd"><h3>${esc(p.name)}</h3><div class="small muted">${fmt(it.arrive)}–${fmt(it.depart)} · ${p.price ? '€' + p.price : 'gratuito'}</div><div style="margin-top:6px">${a.crowd != null ? crowdPill(a.crowd) : ''}</div></div>
        ${a.flags.length && st === 'todo' ? `<div class="fl">${a.flags.map(f => `<div class="fl-i ${f.type}">${ic({ closed: 'ban', crowd: 'users', acc: 'access', book: 'ticket' }[f.type], 16)}<span>${esc(f.text)}</span></div>`).join('')}</div>` : ''}
        <div class="acts"><button class="btn sm ${crit.length && st === 'todo' ? '' : 'soft'}" data-action="planB" data-i="${idx}">${ic('swap', 15)} Piano B</button><button class="btn sm ghost" data-action="done" data-i="${idx}">${st === 'done' ? 'Annulla' : ic('check', 15) + ' Fatto'}</button><button class="btn sm ghost" data-action="poi" data-id="${p.id}">Dettagli</button><button class="btn sm ghost" data-action="rmStop" data-i="${idx}" aria-label="Rimuovi tappa">${ic('trash', 15)}</button></div>
      </div></li>`;
  }).join('');
  const crowds = real.map(s => Eng.crowd(byId(s.id), date, s.arrive));
  const avg = crowds.length ? Math.round(crowds.reduce((a, b) => a + b, 0) / crowds.length) : 0;
  const lessN = real.filter(s => byId(s.id).less).length;
  const end = items.length ? items[items.length - 1].depart : pl.start;
  const first = real.length ? byId(real[0].id) : null;
  return `
  <div class="plan-top">${first ? thumb(first) : heroArt(pl.dest)}<div class="in">
    <div class="eyebrow" style="opacity:.85">${esc(DESTINATIONS[pl.dest].name)} · ${DOW[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}</div>
    <h2>${esc(pl.title)}</h2><div class="small" style="opacity:.9">${fmt(pl.start)} → ${fmt(end)}${pl.acc.length ? ' · ' + pl.acc.map(a => ACCESS_OPTS.find(o => o.id === a).label).join(', ') : ''}</div>
    <div class="stats"><div><b>${real.length}</b><span>tappe</span></div><div><b>${walk}′</b><span>spostamenti</span></div><div><b>${lessN}</b><span>meno noti</span></div><div><b>${avg}%</b><span>affluenza media</span></div></div>
  </div></div>
  ${issues ? `<div class="notice warn" role="alert">${ic('alert', 20)}<div><b>${issues} ${issues === 1 ? 'tappa ha' : 'tappe hanno'} una criticità</b><br>Chiusura o troppa folla all’orario previsto. Tocca <b>Piano B</b> sulla tappa per le alternative.</div></div>` : `<div class="notice ok">${ic('shield', 20)}<div><b>Tutto a posto</b><br>Nessuna chiusura o folla prevista agli orari dell’itinerario.</div></div>`}
  <div class="card" style="padding:14px 16px">
    <div class="row sp wrap" style="gap:8px"><b>Adatta la giornata</b><span class="small muted">Ore simulate</span></div>
    ${clockCtl('planNow')}
    <div class="row wrap" style="margin-top:8px"><button class="btn sm" data-action="replan">${ic('refresh', 15)} Ricalcola da ${fmt(S.now)}</button><button class="btn sm soft" data-action="addStop">${ic('plus', 15)} Aggiungi tappa</button><a class="btn sm soft" href="#/map">${ic('map', 15)} Mappa</a><button class="btn sm ghost" data-action="clearPlan">Elimina</button></div>
  </div>
  <ol class="tl">${rows}</ol>
  <p class="small muted" style="margin-top:8px">Orari e accessibilità sono indicativi: verifica sempre le informazioni dei gestori prima della visita.</p>`;
}
function buildPlan(title, opts, items) { S.plan = { title, dest: opts.dest, start: opts.start, end: opts.end, mode: opts.mode, pace: opts.pace || 1, acc: [...S.acc], items }; save(); }
function generate() {
  const p = S.prefs, start = p.start * 60, end = start + p.hours * 60;
  const opts = { dest: S.dest, date: D(), start, end, interests: p.interests, acc: accSet(), mode: p.mode, pace: Number(p.pace), avoid: p.avoid, rain: p.rain };
  const items = Eng.plan(opts);
  if (!items.length) { S.plan = null; $('#planOut').innerHTML = `<div class="notice warn">${ic('alert', 20)}<div>Non ho trovato luoghi aperti con queste condizioni. Prova più interessi, più tempo o un altro giorno.</div></div>`; return; }
  buildPlan('La tua giornata a ' + dest().name.split(' ')[0], opts, items);
  render('planOut'); revealPlan();
}
const revealPlan = () => { const el = $('#planOut'); if (el && innerWidth < 900) el.scrollIntoView({ behavior: S.motion ? 'smooth' : 'auto', block: 'start' }); };
