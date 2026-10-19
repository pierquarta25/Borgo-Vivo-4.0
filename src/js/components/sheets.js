/* Schede a comparsa (bottom sheet): luogo, racconto, Piano B, menu */
/* ───────────── schede (bottom sheet) ───────────── */
function poiSheet(id) {
  const p = byId(id), date = D(), v = crowdNow(p), bw = Eng.bestWindow(p, date), story = STORIES.find(s => s.place === id);
  const inPlan = S.plan && S.plan.items.some(i => i.id === id);
  const alts = v >= 45 || p.closed ? Eng.alternatives(p, { date, min: S.now, acc: accSet(), mode: S.prefs.mode, exclude: new Set(), reason: p.closed ? 'closed' : 'crowd' }).slice(0, 2) : [];
  return `${sheetHero(thumb(p))}<div class="sh-pad">
  <div class="row wrap gap6" style="margin-bottom:8px">${p.closed ? '<span class="pill high">Temporaneamente chiuso</span>' : crowdPill(v)}${accPill(p)}${p.less ? '<span class="pill olive">Meno noto</span>' : ''}${p.booking ? `<span class="pill brand">${ic('ticket', 12)} Prenotazione</span>` : ''}</div>
  <h2 id="sheetTitle">${esc(p.name)}</h2><p style="color:var(--ink2)">${esc(p.desc)}</p>
  <div class="facts"><div>${ic('clock', 18)}<span>${esc(Eng.hoursLabel(p, date))}</span></div><div>${ic('ticket', 18)}<span>${p.price ? '€' + p.price : 'Ingresso libero / gratuito'}</span></div><div>${ic('walk', 18)}<span>Visita: circa ${p.dur} minuti</span></div>${p.accNote ? `<div>${ic('access', 18)}<span>${esc(p.accNote)}</span></div>` : ''}${bw ? `<div>${ic('leaf', 18)}<span>Orario più tranquillo: ${fmt(bw.m)}</span></div>` : ''}</div>
  <div class="row wrap">
    ${!inPlan && S.plan && S.plan.dest === p.dest && !p.closed ? `<button class="btn" data-action="addToPlan" data-id="${p.id}">${ic('plus', 18)} Aggiungi all’itinerario</button>` : ''}
    ${story ? `<button class="btn soft" data-action="story" data-id="${story.id}">${ic('book', 18)} Racconto</button>` : ''}
    <button class="btn ghost" data-action="flyTo" data-id="${p.id}">${ic('map', 18)} Mappa</button>
    <a class="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${p.ll[0]},${p.ll[1]}">${ic('route', 18)} Indicazioni</a>
  </div>
  ${PH_[p.id] ? `<p class="small muted" style="margin:16px 0 0">${credit(p.id, 'inl')}</p>` : ''}
  ${alts.length ? `<h3 style="margin:22px 0 10px">${p.closed ? 'Alternative' : 'Troppo affollato? Prova invece'}</h3>${alts.map(a => `<button class="alt" data-action="poi" data-id="${a.poi.id}" style="width:100%;text-align:left"><div class="th">${thumb(a.poi)}</div><div class="bd"><b style="font-family:var(--display)">${esc(a.poi.name)}</b><div class="small muted">${a.sameDest ? '' : 'Borgo vicino · '}${a.travel} min</div><div style="margin-top:4px">${crowdPill(a.crowd)}</div></div></button>`).join('')}` : ''}</div>`;
}
function storySheet(id) {
  const s = STORIES.find(x => x.id === id), p = byId(s.place);
  return `${sheetHero(thumb(p))}<div class="sh-pad"><span class="eyebrow" style="color:var(--brand)">${{ storia: 'Storia', tradizione: 'Tradizione', memoria: 'Memoria' }[s.cat]} · ${esc(DESTINATIONS[s.dest].name)}</span>
  <h2 id="sheetTitle" style="margin-top:6px">${esc(s.title)}</h2><p class="story-t drop">${esc(s.text)}</p>
  <div class="row wrap" style="margin-top:16px"><button class="btn" data-action="speak" data-id="${s.id}">${ic('volume', 18)} Ascolta</button><button class="btn soft" data-action="poi" data-id="${p.id}">${ic('pin', 18)} ${esc(p.name.split(' ').slice(0, 3).join(' '))}</button></div>
  <p class="small muted" style="margin-top:14px">Sintesi dalle schede storico-culturali per guide turistiche.</p></div>`;
}
function planBSheet(idx, reason) {
  const it = S.plan.items[idx], p = byId(it.id), date = D(), exclude = new Set(S.plan.items.map(i => i.id));
  const alts = Eng.alternatives(p, { date, min: it.arrive, acc: accSet(), mode: S.plan.mode, exclude, reason });
  const reasons = [['crowd', 'Troppa folla', 'users'], ['closed', 'Chiuso', 'ban'], ['rain', 'Pioggia', 'rain'], ['other', 'Imprevisto', 'alert']];
  return `<div class="sh-pad pt"><span class="eyebrow" style="color:var(--brand)">Piano B</span><h2 id="sheetTitle" style="margin-top:4px">Alternative a ${esc(p.name)}</h2>
  <p class="muted small">Cosa è successo? Scelgo luoghi di pari interesse, aperti alle ${fmt(it.arrive)} e meno richiesti.</p>
  <div class="chips scroll" style="margin-bottom:8px">${reasons.map(r => chip(r[1], r[2], r[0] === reason, 'planBReason', `data-i="${idx}" data-r="${r[0]}"`)).join('')}</div>
  ${alts.length ? alts.map(a => `<div class="alt"><div class="th">${thumb(a.poi)}</div><div class="bd"><b style="font-family:var(--display);font-size:1.02rem">${esc(a.poi.name)}</b><div class="small muted">${a.sameDest ? esc(KIND[a.poi.kind].l) : 'Borgo vicino: ' + esc(DESTINATIONS[a.poi.dest].name) + ' (+' + a.travel + ' min)'}${a.poi.less ? ' · meno noto' : ''}</div><div style="margin-top:6px">${crowdPill(a.crowd)}</div></div><div class="acts"><button class="btn sm block" data-action="swap" data-i="${idx}" data-id="${a.poi.id}">Usa questa tappa</button></div></div>`).join('') : `<div class="empty">Nessuna alternativa adatta: prova a rimuovere la tappa o a cambiare orario.</div>`}</div>`;
}
function addStopSheet() {
  const used = new Set(S.plan.items.map(i => i.id)), date = D();
  const ps = POIS.filter(p => p.dest === S.plan.dest && !p.closed && !used.has(p.id) && Eng.accOK(p, accSet()));
  return `<div class="sh-pad pt"><h2 id="sheetTitle">Aggiungi una tappa</h2><div style="margin-top:12px">${ps.map(p => `<button class="sc" data-action="addToPlan" data-id="${p.id}"><div class="th" style="width:72px;min-height:72px">${thumb(p)}</div><div style="flex:1"><h3>${esc(p.name)}</h3><div class="small muted">${esc(Eng.hoursLabel(p, date))}</div></div></button>`).join('') || '<p class="empty">Hai già inserito tutto.</p>'}</div></div>`;
}
function menuSheet() {
  return `<div class="sh-pad pt"><h2 id="sheetTitle" style="margin-bottom:12px">Menu</h2>${[['#/trips', 'ticket', 'Le mie prenotazioni'], ['#/mobility', 'bus', 'Mobilità e flussi'], ['#/access', 'access', 'Accessibilità e visualizzazione'], ['#/sources', 'plug', 'Dati e aggiornamenti'], ['#/about', 'info', 'Il progetto']].map(m => `<a class="sc" href="${m[0]}" data-action="closeSheet" style="text-decoration:none;color:inherit;align-items:center"><div class="pk" style="padding:0;border:0;flex:1"><div class="ico" style="background:var(--brand-soft);color:var(--brand)">${ic(m[1], 22)}</div><b style="font-family:var(--display);font-size:1.02rem">${m[2]}</b></div>${ic('right', 18)}</a>`).join('')}</div>`;
}
function openSheet(html) { $('#sheetBody').innerHTML = html; $('#sheet').hidden = false; $('.sheet-card').scrollTop = 0; setTimeout(() => $('.sheet-x').focus(), 0); }
function closeSheet() { $('#sheet').hidden = true; if ('speechSynthesis' in window) speechSynthesis.cancel(); }
