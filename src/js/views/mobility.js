/* Mobilità e gestione dei flussi */
/* ---------- MOBILITÀ ---------- */
let mobPoi = null;
views.mobility = () => {
  const ps = POIS.filter(p => p.dest === S.dest && !p.closed);
  if (!mobPoi || byId(mobPoi).dest !== S.dest) mobPoi = ps[0].id;
  const p = byId(mobPoi), date = D(), bars = []; for (let m = 480; m <= 1200; m += 30) bars.push([m, Eng.crowd(p, date, m)]);
  const bw = Eng.bestWindow(p, date), rd = Eng.redistribute(S.dest, date, S.now, accSet()), nb = DESTINATIONS[dest().neighbour];
  return `
  ${ph('Mobilità e flussi', 'Per distribuire meglio i visitatori e valorizzare le aree meno frequentate.')}
  <div class="card"><div class="row sp"><b>${dayNames[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}</b>${demoPill}</div>${clockCtl('mobNow')}</div>
  <div class="card"><h3>Affluenza nell’arco della giornata</h3>
    <select class="f" id="mobSel" data-bind="mobPoi" style="margin-top:10px" aria-label="Luogo">${ps.map(x => `<option value="${x.id}" ${x.id === mobPoi ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
    <div class="bars" role="img" aria-label="Affluenza oraria stimata di ${esc(p.name)}">${bars.map(([m, v]) => `<div class="${Eng.level(v)} ${m === S.now ? 'now' : ''}" style="height:${Math.max(4, v)}%" title="${fmt(m)} — ${v}%"></div>`).join('')}</div>
    <div class="axis"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span></div>
    <div class="facts" style="margin-bottom:0">${bw ? `<div>${ic('leaf', 18)}<span>Fascia più tranquilla: <b>${fmt(bw.m)}</b> (${bw.v}% di affluenza)</span></div>` : ''}<div>${ic('clock', 18)}<span>${esc(Eng.hoursLabel(p, date))}</span></div></div></div>
  <div class="sec-h" style="margin-top:6px"><h2>Alternative alla folla · ${fmt(S.now)}</h2></div>
  ${rd.length ? rd.map(r => `<div class="alt"><div class="th">${thumb(r.to)}</div><div class="bd"><div class="small muted">Invece di <b>${esc(r.from.name)}</b> ${crowdPill(r.fromV)}</div><b style="font-family:var(--display)">${esc(r.to.name)}</b><div style="margin-top:4px">${crowdPill(r.toV)}</div></div></div>`).join('') : `<div class="notice ok">${ic('check', 18)}<div>Nessuna congestione a quest’ora.</div></div>`}
  <div class="sec-h"><h2>Parcheggi</h2>${demoPill}</div>
  <div class="card" style="padding:4px 16px">${PARKINGS.filter(x => x.dest === S.dest).map(parkRow).join('')}</div>
  <div class="sec-h"><h2>Trasporti</h2>${demoPill}</div>
  <div class="card" style="padding:4px 16px">${TRANSIT.filter(x => x.dest === S.dest).map(t => `<div class="pk"><div class="ico">${ic('bus', 22)}</div><div class="g"><b>${esc(t.name)}</b><div class="small muted">${esc(t.note)}</div></div></div>`).join('')}</div>
  <div class="banner" style="margin-top:20px">${heroArt(nb.id, true)}<div class="in"><h2 style="margin-bottom:6px">${esc(nb.name)}</h2><p class="small" style="opacity:.92">Circa ${TRANSFER_MIN} minuti. Quando ${esc(dest().name.split(' ')[0])} è piena, un’alternativa di pari interesse.</p><button class="btn light sm" data-action="switchDest" data-id="${nb.id}">Passa a ${esc(nb.name.split(' ')[0])}</button></div></div>`;
};
