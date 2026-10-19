/* Home: punto di partenza NEUTRO sul territorio (nessuna città preselezionata).
   La pagina di ogni città è in views/city.js. */
views.home = () => {
  const ids = Object.keys(DESTINATIONS);
  const slots = [['Mattina', 570], ['Pranzo', 750], ['Pomeriggio', 960], ['Sera', 1110]];
  const near = slots.reduce((a, b) => Math.abs(b[1] - S.now) < Math.abs(a[1] - S.now) ? b : a);
  const quiet = POIS.filter(p => !p.closed && p.less && Eng.isOpen(p, D(), S.now)).sort((a, b) => crowdNow(a) - crowdNow(b)).slice(0, 8);
  const ev = eventsList().slice(0, 4);
  return `
  <section class="hero tri" aria-labelledby="h1">
    <div class="tri-art">${ids.map(i => heroArt(i)).join('')}</div>
    <a class="credit ch" href="#/about">Foto: Wikimedia Commons · crediti</a>
    <div class="hero-in">
      <div class="eyebrow">${ic('route', 14)} Matera · Gravina in Puglia · Altamura</div>
      <h1 id="h1">Dove il tempo ha un altro ritmo</h1>
      <p>Tre città, un solo territorio: scopri quando, come e dove viverlo, senza finire nei soliti posti affollati.</p>
      <div class="hs">${ic('search', 20)}<input type="search" id="q" placeholder="Cerca un luogo, un racconto, un’esperienza" data-bind="search" autocomplete="off" aria-label="Cerca"><div class="results" id="results"></div></div>
    </div>
  </section>

  <div class="sec-h" style="margin-top:22px"><h2>Da dove vuoi cominciare?</h2></div>
  <div class="rail destrail">${ids.map(i => destCard(DESTINATIONS[i])).join('')}</div>

  <div class="sec-h"><h2>Tutto in un’app</h2></div>
  <div class="bento">
    <a class="bt wide brand" href="#/planner"><div class="ico">${ic('sparkles', 24)}</div><div><b>AI Planner</b><small>Costruisce la tua giornata e propone un Piano B se qualcosa cambia.</small></div></a>
    <a class="bt" href="#/map"><div class="ico">${ic('map', 22)}</div><div><b>Mappa</b><small>Luoghi, servizi e stima dell’affluenza</small></div></a>
    <a class="bt" href="#/stories"><div class="ico">${ic('book', 22)}</div><div><b>Racconti</b><small>Storie e luoghi del cuore</small></div></a>
    <a class="bt olive" href="#/market"><div class="ico">${ic('bag', 22)}</div><div><b>Esperienze</b><small>Botteghe, guide, produttori</small></div></a>
    <a class="bt dark" href="#/mobility"><div class="ico">${ic('bus', 22)}</div><div><b>Mobilità e flussi</b><small>Parcheggi, stazioni, dati ufficiali</small></div></a>
    <a class="bt wide" href="#/access"><div class="ico">${ic('access', 24)}</div><div><b>Accessibilità</b><small>Itinerari e luoghi adatti a ogni esigenza</small></div></a>
  </div>

  <div class="sec-h"><h2>Percorsi pronti</h2><a href="#/planner">Crea il tuo</a></div>
  <div class="rail">${PRESETS.map(routeCard).join('')}</div>

  <div class="sec-h"><h2>Luoghi meno noti, aperti ora</h2><a href="#/map">Sulla mappa</a></div>
  <div class="sec-sub">Alle ${fmt(S.now)}, nelle tre città: poca gente secondo la stima del modello. ${estPill}</div>
  <div class="times" role="group" aria-label="Momento della giornata" style="margin:0 0 12px">${slots.map(s => `<button aria-pressed="${s === near}" data-action="setNow" data-v="${s[1]}">${s[0]}</button>`).join('')}</div>
  ${quiet.length ? `<div class="rail">${quiet.map(poiCard).join('')}</div>` : '<p class="empty">Nessun luogo meno noto è aperto a quest’ora: prova un altro momento della giornata.</p>'}

  <div class="sec-h" style="margin-bottom:0"></div>
  ${territoryCard()}

  <div class="sec-h"><h2>Prossimi appuntamenti</h2></div>
  ${ev.map(eventRow).join('') || '<p class="empty">Nessun evento.</p>'}

  <div class="quote">“Il digitale non porta tutti nello stesso posto, ma aiuta ciascun visitatore a trovare il proprio.”</div>
  <p class="small muted" style="text-align:center"><a href="#/about">Scopri il progetto</a></p>`;
};
