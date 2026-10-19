/* Schermata Home */
/* ───────────── viste ───────────── */

function parkOcc(pk) {
  const h = S.now / 60, curve = Math.max(Math.exp(-((h - 11.5) ** 2) / 8), 0.8 * Math.exp(-((h - 16) ** 2) / 6));
  const wd = D().getDay(), f = wd === 0 || wd === 6 ? 1.2 : 1;
  return Math.round(Eng.clamp(18 + 72 * curve * f + (Eng.hash(pk.id + S.date) - .5) * 14, 5, 100));
}
const parkRow = pk => { const o = parkOcc(pk), l = o > 85 ? 'high' : o > 60 ? 'mid' : 'low';
  return `<div class="pk"><div class="ico">${ic('parking', 22)}</div><div class="g"><b>${esc(pk.name)}</b><div class="small muted">${pk.cap} posti · ${esc(pk.price)} · ${pk.walk} min a piedi${pk.shuttle ? ' · navetta' : ''}</div><div class="bar ${l}"><i style="width:${o}%"></i></div></div><span class="pill ${l}">${100 - o}% liberi</span></div>`; };

function eventsList() {
  const base = D(), list = [];
  EVENTS.forEach(e => {
    if (e.dest !== S.dest) return;
    let t, days, sub;
    if (e.weekdays) { for (let i = 0; i < 8; i++) { const x = new Date(base); x.setDate(x.getDate() + i); if (e.weekdays.includes(x.getDay())) { t = x; days = i; sub = `${dayNames[x.getDay()]} alle ${e.time}`; break; } } }
    else { t = new Date(base.getFullYear(), e.month - 1, e.day); if (t < base) t = new Date(base.getFullYear() + 1, e.month - 1, e.day); days = Math.round((t - base) / 864e5); sub = days === 0 ? 'Oggi' : `Tra ${days} giorni`; }
    list.push({ e, t, days, sub });
  });
  return list.sort((a, b) => a.days - b.days);
}

views.home = () => {
  const d = dest(), city = Eng.cityCrowd(S.dest, D(), S.now), lvl = Eng.level(city), nb = DESTINATIONS[d.neighbour];
  const open = POIS.filter(p => p.dest === S.dest && !p.closed && Eng.isOpen(p, D(), S.now));
  const quiet = open.filter(p => p.less).sort((a, b) => crowdNow(a) - crowdNow(b)).slice(0, 6);
  const msg = { low: ['è tranquilla', 'Momento ideale per visitare.'], mid: ['è viva', 'I luoghi più noti si riempiono: provane uno meno conosciuto.'], high: ['è molto affollata', 'Meglio le alternative qui sotto, o un altro orario.'] }[lvl];
  const slots = [['Mattina', 570], ['Pranzo', 750], ['Pomeriggio', 960], ['Sera', 1110]];
  const near = slots.reduce((a, b) => Math.abs(b[1] - S.now) < Math.abs(a[1] - S.now) ? b : a);
  const ev = eventsList();
  return `
  <section class="hero" aria-labelledby="h1">
    ${heroArt(S.dest, S.now >= 1050)}${credit('hero_' + S.dest, 'ch')}
    <div class="hero-in">
      <div class="eyebrow">${ic('pin', 14)} ${EYEBROW[S.dest]}</div>
      <h1 id="h1">${esc(d.name)}</h1>
      <p>${esc(d.tagline)}</p>
      <div class="hs">${ic('search', 20)}<input type="search" id="q" placeholder="Cerca un luogo, un racconto, un’esperienza" data-bind="search" autocomplete="off" aria-label="Cerca"><div class="results" id="results"></div></div>
    </div>
  </section>
  <div class="card live">
    ${gauge(city)}
    <div style="flex:1;min-width:0">
      <div class="eyebrow muted" style="margin-bottom:2px">Adesso · ${dayNames[D().getDay()]}</div>
      <h3>${esc(d.name.split(' ')[0])} ${msg[0]}</h3>
      <div class="small muted">${msg[1]}</div>
      <div class="times" role="group" aria-label="Momento della giornata">${slots.map(s => `<button aria-pressed="${s === near}" data-action="setNow" data-v="${s[1]}">${s[0]}</button>`).join('')}</div>
    </div>
  </div>

  <div class="sec-h"><h2>Percorsi per te</h2><a href="#/planner">Tutti</a></div>
  <div class="rail">${PRESETS.filter(x => x.dest === S.dest).map(routeCard).join('')}</div>

  <div class="sec-h"><h2>Più tranquilli adesso</h2><a href="#/map">Sulla mappa</a></div>
  <div class="sec-sub">Luoghi meno conosciuti, aperti alle ${fmt(S.now)}, con poca gente. ${demoPill}</div>
  ${quiet.length ? `<div class="rail">${quiet.map(poiCard).join('')}</div>` : '<p class="empty">Nessun luogo meno noto è aperto a quest’ora: prova un altro momento della giornata.</p>'}

  <div class="sec-h"><h2>Tutto in un’app</h2></div>
  <div class="bento">
    <a class="bt wide brand" href="#/planner"><div class="ico">${ic('sparkles', 24)}</div><div><b>AI Planner</b><small>Costruisce la tua giornata e propone un Piano B se qualcosa cambia.</small></div></a>
    <a class="bt" href="#/map"><div class="ico">${ic('map', 22)}</div><div><b>Mappa</b><small>Luoghi, servizi ed affluenza</small></div></a>
    <a class="bt" href="#/stories"><div class="ico">${ic('book', 22)}</div><div><b>Racconti</b><small>Storie e luoghi del cuore</small></div></a>
    <a class="bt olive" href="#/market"><div class="ico">${ic('bag', 22)}</div><div><b>Esperienze</b><small>Botteghe, guide, produttori</small></div></a>
    <a class="bt dark" href="#/mobility"><div class="ico">${ic('bus', 22)}</div><div><b>Mobilità e flussi</b><small>Parcheggi e trasporti</small></div></a>
    <a class="bt wide" href="#/access"><div class="ico">${ic('access', 24)}</div><div><b>Accessibilità</b><small>Itinerari e luoghi adatti a ogni esigenza</small></div></a>
  </div>

  <div class="sec-h"><h2>Prossimi appuntamenti</h2></div>
  ${ev.map(({ e, t, sub }) => `<button class="ev" data-action="poi" data-id="${e.place}"><div class="dt"><b>${t.getDate()}</b><span>${e.weekdays ? DOW[t.getDay()] : MONTHS[t.getMonth()]}</span></div><div style="flex:1"><b class="t">${esc(e.name)}</b><span class="small muted">${esc(sub)}</span><div class="small">${esc(e.note)}</div></div>${ic('right', 18)}</button>`).join('') || '<p class="empty">Nessun evento.</p>'}

  <div class="sec-h"><h2>Parcheggi</h2><a href="#/mobility">Mobilità</a></div>
  <div class="card" style="padding:4px 16px">${PARKINGS.filter(p => p.dest === S.dest).map(parkRow).join('')}</div>

  <div class="sec-h"><h2>Un borgo vicino</h2></div>
  <div class="banner">${heroArt(nb.id, true)}<div class="in"><div class="eyebrow" style="opacity:.85">${ic('route', 13)} a ${TRANSFER_MIN} minuti</div><h2 style="margin:4px 0 6px">${esc(nb.name)}</h2><p class="small" style="opacity:.92">${esc(nb.tagline)}. Quando i luoghi più noti sono pieni, un’alternativa di pari interesse.</p><button class="btn light sm" data-action="switchDest" data-id="${nb.id}">Esplora ${esc(nb.name.split(' ')[0])} ${ic('arrow', 15)}</button></div></div>
  <div class="quote">“Il digitale non porta tutti nello stesso posto, ma aiuta ciascun visitatore a trovare il proprio.”</div>
  <p class="small muted" style="text-align:center"><a href="#/about">Scopri il progetto</a></p>`;
};

