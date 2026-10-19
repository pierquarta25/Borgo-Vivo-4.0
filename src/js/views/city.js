/* Pagina di una città (quella scelta in S.dest): si raggiunge dalla Home o dal selettore in alto */
views.city = () => {
  const d = dest(), city = Eng.cityCrowd(S.dest, D(), S.now), lvl = Eng.level(city);
  const quiet = POIS.filter(p => p.dest === S.dest && !p.closed && p.less && Eng.isOpen(p, D(), S.now)).sort((a, b) => crowdNow(a) - crowdNow(b)).slice(0, 6);
  const msg = { low: ['è tranquilla', 'Momento ideale per visitare.'], mid: ['è viva', 'I luoghi più noti si riempiono: provane uno meno conosciuto.'], high: ['è molto affollata', 'Meglio le alternative qui sotto, o un altro orario.'] }[lvl];
  const slots = [['Mattina', 570], ['Pranzo', 750], ['Pomeriggio', 960], ['Sera', 1110]];
  const near = slots.reduce((a, b) => Math.abs(b[1] - S.now) < Math.abs(a[1] - S.now) ? b : a);
  const others = Object.values(DESTINATIONS).filter(x => x.id !== S.dest);
  return `
  <section class="hero" aria-labelledby="h1">
    ${heroArt(S.dest, S.now >= 1050)}${credit('hero_' + S.dest, 'ch')}
    <a class="hero-back" href="#/home">${ic('left', 16)} Tutte le città</a>
    <div class="hero-in">
      <div class="eyebrow">${ic('pin', 14)} ${EYEBROW[S.dest]}</div>
      <h1 id="h1">${esc(d.name)}</h1>
      <p>${esc(d.tagline)}</p>
      <p class="small" style="opacity:.9;max-width:34em">${esc(d.intro)}</p>
    </div>
  </section>
  <div class="card live">
    ${gauge(city)}
    <div style="flex:1;min-width:0">
      <div class="eyebrow muted" style="margin-bottom:2px">Adesso · ${dayNames[D().getDay()]} · stima</div>
      <h3>${esc(d.name.split(' ')[0])} ${msg[0]}</h3>
      <div class="small muted">${msg[1]}</div>
      <div class="times" role="group" aria-label="Momento della giornata">${slots.map(s => `<button aria-pressed="${s === near}" data-action="setNow" data-v="${s[1]}">${s[0]}</button>`).join('')}</div>
    </div>
  </div>

  <div class="sec-h"><h2>Percorsi per te</h2><a href="#/planner">Tutti</a></div>
  <div class="rail">${PRESETS.filter(x => x.dest === S.dest).map(routeCard).join('')}</div>

  <div class="sec-h"><h2>Più tranquilli adesso</h2><a href="#/map">Sulla mappa</a></div>
  <div class="sec-sub">Luoghi meno conosciuti, aperti alle ${fmt(S.now)}, con poca gente. ${estPill}</div>
  ${quiet.length ? `<div class="rail">${quiet.map(poiCard).join('')}</div>` : '<p class="empty">Nessun luogo meno noto è aperto a quest’ora: prova un altro momento della giornata.</p>'}

  <div class="sec-h"><h2>${esc(d.name.split(' ')[0])} in numeri</h2></div>
  ${statsCard(S.dest)}

  <div class="sec-h"><h2>Prossimi appuntamenti</h2></div>
  ${eventsList(S.dest).map(eventRow).join('') || '<p class="empty">Nessun evento.</p>'}

  <div class="sec-h"><h2>Parcheggi</h2><a href="#/mobility">Mobilità</a></div>
  ${parkBlock(S.dest)}

  <div class="sec-h"><h2>Altre città vicine</h2></div>
  <div class="rail destrail">${others.map(destCard).join('')}</div>
  <p class="small muted" style="text-align:center">Da ${esc(d.name.split(' ')[0])}: ${others.map(o => `${esc(o.name.split(' ')[0])} circa ${transferMin(S.dest, o.id)} min in auto`).join(' · ')} (stima)</p>`;
};
