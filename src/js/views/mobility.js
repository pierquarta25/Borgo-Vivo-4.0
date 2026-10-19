/* Mobilità e gestione dei flussi: statistiche ufficiali + stima dell'affluenza + parcheggi e stazioni verificati */
let mobPoi = null;
views.mobility = () => {
  const ps = POIS.filter(p => p.dest === S.dest && !p.closed);
  if (!mobPoi || byId(mobPoi).dest !== S.dest) mobPoi = ps[0].id;
  const p = byId(mobPoi), date = D(), bars = []; for (let m = 480; m <= 1200; m += 30) bars.push([m, Eng.crowd(p, date, m)]);
  const bw = Eng.bestWindow(p, date), rd = Eng.redistribute(S.dest, date, S.now, accSet()), others = Object.values(DESTINATIONS).filter(x => x.id !== S.dest);
  const season = Math.round(Eng.seasonFactor(S.dest, date) * 100);
  return `
  ${ph('Mobilità e flussi', `Dati ufficiali, stima dell’affluenza e come arrivare a ${esc(dest().name.split(' ')[0])}.`)}
  ${statsCard(S.dest)}
  <div class="card"><div class="row sp"><b>${dayNames[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}</b>${estPill}</div>${clockCtl('mobNow')}
    <p class="small muted" style="margin:6px 0 0">In ${MONTHS_L[date.getMonth()]} le presenze sono circa il <b>${season}%</b> di quelle del mese di punta (dati ufficiali, media degli ultimi tre anni). L’andamento nell’arco della giornata è un’ipotesi del modello.</p></div>
  <div class="card"><h3>Affluenza nell’arco della giornata (stima)</h3>
    <select class="f" id="mobSel" data-bind="mobPoi" style="margin-top:10px" aria-label="Luogo">${ps.map(x => `<option value="${x.id}" ${x.id === mobPoi ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select>
    <div class="bars" role="img" aria-label="Affluenza oraria stimata di ${esc(p.name)}">${bars.map(([m, v]) => `<div class="${Eng.level(v)} ${m === S.now ? 'now' : ''}" style="height:${Math.max(4, v)}%" title="${fmt(m)} — ${v}%"></div>`).join('')}</div>
    <div class="axis"><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span></div>
    <div class="facts" style="margin-bottom:0">${bw ? `<div>${ic('leaf', 18)}<span>Fascia più tranquilla (stima): <b>${fmt(bw.m)}</b></span></div>` : ''}<div>${ic('clock', 18)}<span>${esc(Eng.hoursLabel(p, date))}</span></div></div></div>
  <div class="sec-h" style="margin-top:6px"><h2>Alternative alla folla · ${fmt(S.now)}</h2></div>
  ${rd.length ? rd.map(r => `<div class="alt"><div class="th">${thumb(r.to)}</div><div class="bd"><div class="small muted">Invece di <b>${esc(r.from.name)}</b> ${crowdPill(r.fromV)}</div><b style="font-family:var(--display)">${esc(r.to.name)}</b><div style="margin-top:4px">${crowdPill(r.toV)}</div></div></div>`).join('') : `<div class="notice ok">${ic('check', 18)}<div>Nessuna congestione stimata a quest’ora.</div></div>`}
  <div class="sec-h"><h2>Parcheggi verificati</h2></div>
  ${parkBlock(S.dest)}
  <div class="sec-h"><h2>Stazioni</h2></div>
  ${TRANSIT.filter(x => x.dest === S.dest).length ? `<div class="card" style="padding:4px 16px">${TRANSIT.filter(x => x.dest === S.dest).map(t => `<div class="pk"><div class="ico">${ic('bus', 22)}</div><div class="g"><b>${esc(t.name)}</b><div class="small muted">${esc(t.note)}</div></div></div>`).join('')}</div>` : `<div class="notice">${ic('info', 18)}<div>Nessuna stazione censita per questa città.</div></div>`}
  <div class="sec-h"><h2>Altre città vicine</h2></div>
  <div class="rail destrail">${others.map(destCard).join('')}</div>
  <p class="small muted" style="text-align:center">Da ${esc(dest().name.split(' ')[0])}: ${others.map(o => `${esc(o.name.split(' ')[0])} circa ${transferMin(S.dest, o.id)} min in auto`).join(' · ')} (stima su distanza stradale)</p>`;
};
