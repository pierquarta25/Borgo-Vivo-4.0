/* Pezzi di interfaccia riusabili: pillole, schede, gauge, interruttori, statistiche ufficiali… */
const views = {};   // registro delle schermate: ogni file in src/js/views/ aggiunge la sua
const PH_ = typeof PHOTOS !== 'undefined' ? PHOTOS : {};
const PH_NOTE = { m_lan: 'quartiere Spine Bianche' };
const pic = (id, alt, fallback, eager) => PH_[id] ? `<img class="art" src="assets/images/photos/${PH_[id].file}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" ${id === 'g_pur' ? 'style="object-position:50% 18%"' : ''}>` : fallback;
const thumb = p => pic(p.id, p.name, Art.art(p.kind, p.id));
const opPic = o => pic(o.photo, o.name, Art.art(OPART[o.type], o.id));
const heroArt = (d, dusk) => pic('hero_' + d, DESTINATIONS[d].name + ': panorama', Art.hero(d, dusk), true);
const credit = (id, cls = '') => PH_[id] ? `<a class="credit ${cls}" href="${esc(PH_[id].page)}" target="_blank" rel="noopener" title="${esc(PH_[id].title)}">Foto${PH_NOTE[id] ? ' (' + PH_NOTE[id] + ')' : ''}: ${esc(PH_[id].author.slice(0, 40))} · ${esc(PH_[id].lic)}</a>` : '';
const crowdPill = v => `<span class="pill ${Eng.level(v)}" title="Stima del modello: ${v}%"><i class="dot"></i>${CROWD_LBL[Eng.level(v)]}</span>`;
const accPill = p => p.access === 'unknown'
  ? `<span class="pill">${ic('access', 12)} Accessibilità non indicata</span>`
  : `<span class="pill ${p.access === 'full' ? 'low' : p.access === 'partial' ? 'mid' : 'high'}">${ic('access', 12)} ${p.access === 'full' ? 'Accessibile' : p.access === 'partial' ? 'Parziale' : 'Non accessibile'}${p.accVerified ? '' : ' (stima)'}</span>`;
const estPill = '<span class="pill demo" title="Calcolata dal modello: la stagionalità viene dai dati ufficiali, il profilo orario è un’ipotesi">stima del modello</span>';
const fmtN = n => Number(n).toLocaleString('it-IT');
const MONTHS_L = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const priceLabel = p => p.price === null || p.price === undefined ? 'Prezzo da verificare' : p.price === 0 ? 'Ingresso libero / gratuito' : '€' + p.price;
const pctChg = (a, b) => b ? Math.round((a / b - 1) * 1000) / 10 : null;
const signed = v => v === null ? '—' : (v > 0 ? '+' : '') + String(v).replace('.', ',') + '%';
const gauge = v => { const r = 34, c = 2 * Math.PI * r; return `<div class="gauge" role="img" aria-label="Affluenza stimata ${v} per cento"><svg width="78" height="78" viewBox="0 0 78 78"><circle cx="39" cy="39" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="7"/><circle cx="39" cy="39" r="${r}" fill="none" stroke="${COL[Eng.level(v)]}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}"/></svg><b>${v}<small style="font-size:.55em;margin-left:1px">%</small></b></div>`; };
const toggle = (id, on, bind, label, icon, sub = '') => `<div class="sw"><div class="row" style="gap:12px">${icon ? ic(icon, 22) : ''}<div><label for="${id}" style="font-weight:600">${label}</label>${sub ? `<div class="small muted">${sub}</div>` : ''}</div></div><span class="toggle"><input type="checkbox" id="${id}" ${on ? 'checked' : ''} data-bind="${bind}"><i></i></span></div>`;
const chip = (label, icon, pressed, action, attrs = '') => `<button type="button" class="chip" aria-pressed="${pressed}" data-action="${action}" ${attrs}>${icon ? ic(icon, 17) : ''}${label}</button>`;
const ph = (t, sub, extra = '') => `<div class="ph"><div class="row sp"><h1>${t}</h1>${extra}</div><p>${sub}</p></div>`;
const clockCtl = (id, label = true) => `<div class="tm"><b id="${id}Lbl">${fmt(S.now)}</b><input type="range" id="${id}" min="480" max="1200" step="30" value="${S.now}" data-bind="now" aria-label="Ora della giornata simulata"></div>`;
const poiCard = p => { const v = crowdNow(p); return `<button class="pcard" data-action="poi" data-id="${p.id}"><div class="im">${thumb(p)}<span class="pill">${ic(KIND[p.kind].i, 12)} ${KIND[p.kind].l}</span></div><div class="bd"><h3>${esc(p.name)}</h3><div class="small muted" style="margin-top:-2px">${esc(DESTINATIONS[p.dest].name)}</div><div class="meta">${crowdPill(v)}${p.less ? '<span class="pill olive">Meno noto</span>' : ''}</div></div></button>`; };
const routeCard = pr => `<button class="rcard" data-action="preset" data-id="${pr.id}">${pic(pr.cover, pr.name, Art.art(pr.kind, pr.id))}<span class="go">${ic('arrow', 18)}</span><div class="in"><div class="xs" style="opacity:.85;text-transform:uppercase;letter-spacing:.1em;font-weight:600">${esc(DESTINATIONS[pr.dest].name)}</div><h3>${esc(pr.name)}</h3><div class="m"><span>${ic('clock', 13)} ${esc(pr.sub)}</span><span>${ic('pin', 13)} ${pr.stops.length} ${pr.stops.length > 1 ? 'tappe' : 'tappa'}</span></div><div class="m" style="margin-top:2px;opacity:.8">${esc(pr.tag)}</div></div></button>`;
const sheetHero = art => `<div class="sh-hero">${art}</div>`;

/* ----- parcheggi: solo esistenza verificata, nessun dato inventato ----- */
const parkRow = pk => `<div class="pk"><div class="ico">${ic('parking', 22)}</div><div class="g"><b>${esc(pk.name)}</b><div class="small muted">${esc([pk.kind, pk.cap ? pk.cap + ' posti' : null, pk.operator].filter(Boolean).join(' · '))}</div>${pk.note ? `<div class="xs muted">${esc(pk.note)}</div>` : ''}<div class="xs muted">Fonti: ${pk.sources.map(esc).join(', ')}</div></div></div>`;
const parkBlock = id => {
  const l = PARKINGS.filter(p => p.dest === id);
  return (l.length ? `<div class="card" style="padding:4px 16px">${l.map(parkRow).join('')}</div>` : `<div class="notice">${ic('info', 18)}<div>Per ${esc(DESTINATIONS[id].name)} non ho ancora parcheggi verificati con fonti ufficiali. Chiedi al Comune o alla Polizia Locale.</div></div>`)
    + `<p class="small muted">Esistenza verificata con almeno due fonti. Tariffe, orari e posti liberi in tempo reale non sono pubblicati in modo verificabile: chiedi al gestore o al Comune.</p>`;
};

/* ----- statistiche turistiche UFFICIALI (src/js/data/official-stats.js) ----- */
function statsOf(id) {
  const st = OFFICIAL_STATS[id], ys = Object.keys(st.years).sort(), y = ys[ys.length - 1], py = ys[ys.length - 2];
  const d = st.years[y], pd = st.years[py], d19 = st.years['2019'];
  const mx = Math.max(...d.monthsPres);
  return { st, y, py, d, pd, d19, mx, peak: d.monthsPres.indexOf(mx), share: Math.round(d.presEst / d.pres * 100), chgP: pctChg(d.pres, pd.pres), chgA: pctChg(d.arr, pd.arr), chg19: d19 ? pctChg(d.pres, d19.pres) : null };
}
function statsCard(id) {
  if (typeof OFFICIAL_STATS === 'undefined' || !OFFICIAL_STATS[id]) return '';
  const s = statsOf(id), cur = D().getMonth();
  return `<div class="card">
    <div class="row sp"><h3>Turismo in numeri · ${s.y}</h3><span class="pill olive">${ic('shield', 12)} dati ufficiali</span></div>
    <div class="stat-row">
      <div><b>${fmtN(s.d.pres)}</b><span>presenze (notti)</span><em class="${s.chgP >= 0 ? 'up' : 'dn'}">${signed(s.chgP)} sul ${s.py}</em></div>
      <div><b>${fmtN(s.d.arr)}</b><span>arrivi</span><em class="${s.chgA >= 0 ? 'up' : 'dn'}">${signed(s.chgA)} sul ${s.py}</em></div>
      <div><b>${s.share}%</b><span>presenze straniere</span>${s.chg19 !== null ? `<em class="${s.chg19 >= 0 ? 'up' : 'dn'}">${signed(s.chg19)} sul 2019</em>` : ''}</div>
    </div>
    <div class="bars stat" role="img" aria-label="Presenze per mese nel ${s.y}; mese di punta ${MONTHS_L[s.peak]}">${s.d.monthsPres.map((v, i) => `<div class="${i === cur ? 'now' : ''}" style="height:${Math.max(4, v / s.mx * 100)}%" title="${MONTHS_L[i]}: ${fmtN(v)} presenze"></div>`).join('')}</div>
    <div class="axis"><span>gen</span><span>apr</span><span>lug</span><span>ott</span><span>dic</span></div>
    <p class="small" style="margin:10px 0 4px">Mese di punta: <b>${MONTHS_L[s.peak]}</b> (${fmtN(s.mx)} presenze). Il mese in corso è evidenziato.</p>
    <p class="xs muted" style="margin:0">Fonte: <a href="${esc(s.st.url)}" target="_blank" rel="noopener">${esc(s.st.provider)}</a> · ${esc(s.st.dataset)} · elaborazione ${esc(s.st.elaborated)}. ${esc(s.st.scope)}. Arrivi = clienti arrivati; presenze = notti trascorse.</p>
  </div>`;
}
/* Confronto tra le tre città sullo stesso anno: serve a mostrare come i flussi si concentrano */
function territoryCard() {
  if (typeof OFFICIAL_STATS === 'undefined') return '';
  const ids = Object.keys(DESTINATIONS), y = String(Math.min(...ids.map(i => +Object.keys(OFFICIAL_STATS[i].years).sort().pop())));
  const rows = ids.map(i => ({ id: i, pres: OFFICIAL_STATS[i].years[y].pres, prev: OFFICIAL_STATS[i].years[String(y - 1)] ? OFFICIAL_STATS[i].years[String(y - 1)].pres : null })).sort((a, b) => b.pres - a.pres);
  const tot = rows.reduce((s, r) => s + r.pres, 0), mx = rows[0].pres;
  return `<div class="card">
    <div class="row sp"><h3>Il territorio in numeri · ${y}</h3><span class="pill olive">${ic('shield', 12)} dati ufficiali</span></div>
    <p class="small muted" style="margin:4px 0 12px">Presenze (notti trascorse) nelle strutture ricettive delle tre città.</p>
    ${rows.map(r => `<div style="margin-bottom:12px"><div class="row sp small"><b>${esc(DESTINATIONS[r.id].name)}</b><span><b>${fmtN(r.pres)}</b> · ${Math.round(r.pres / tot * 100)}% del totale <em class="${r.prev && r.pres >= r.prev ? 'up' : 'dn'}" style="font-style:normal;font-weight:700">${r.prev ? signed(pctChg(r.pres, r.prev)) : ''}</em></span></div><div class="bar"><i style="width:${Math.max(2, r.pres / mx * 100)}%;background:var(--brand)"></i></div></div>`).join('')}
    <p class="small" style="margin:6px 0 4px">Quasi tutte le presenze si concentrano su ${esc(DESTINATIONS[rows[0].id].name)}: è la ragione per cui Borgo Vivo suggerisce anche le città vicine, dove i visitatori crescono ma sono ancora pochi.</p>
    <p class="xs muted" style="margin:0">Fonti: APT Basilicata (Matera); Regione Puglia, Osservatorio sul turismo (Gravina, Altamura). Perimetri e metodi di rilevazione possono differire tra le due regioni.</p>
  </div>`;
}
const destCard = d => { const s = typeof OFFICIAL_STATS !== 'undefined' && OFFICIAL_STATS[d.id] ? statsOf(d.id) : null;
  return `<button class="dcity" data-action="openCity" data-id="${d.id}">${heroArt(d.id)}<div class="in"><div class="eyebrow">${esc(EYEBROW[d.id])}</div><h3>${esc(d.name)}</h3><p>${esc(d.tagline)}</p>${s ? `<div class="xs" style="opacity:.9">${s.y}: ${fmtN(s.d.pres)} presenze (dati ufficiali)</div>` : ''}<span class="btn light sm" style="margin-top:10px">Scopri ${esc(d.name.split(' ')[0])} ${ic('arrow', 15)}</span></div></button>`; };

/* ----- eventi: date calcolate, "approx" = da verificare ----- */
function eventDate(e, base) {
  let t = new Date(base.getFullYear(), e.month - 1, e.day);
  if (e.rule === 'sundayAfter') { t.setDate(t.getDate() + ((7 - t.getDay()) % 7 || 7)); }
  if (t < base) { t = new Date(base.getFullYear() + 1, e.month - 1, e.day); if (e.rule === 'sundayAfter') t.setDate(t.getDate() + ((7 - t.getDay()) % 7 || 7)); }
  return t;
}
function eventsList(destId) {
  const base = D();
  return EVENTS.filter(e => !destId || e.dest === destId).map(e => {
    const t = eventDate(e, base), days = Math.round((t - base) / 864e5);
    return { e, t, days, sub: e.approx ? 'Date da verificare · ' + MONTHS_L[t.getMonth()] : (days === 0 ? 'Oggi' : `Tra ${days} giorni`) };
  }).sort((a, b) => a.days - b.days);
}
const eventRow = ({ e, t, sub }) => `<button class="ev" data-action="poi" data-id="${e.place}"><div class="dt"><b>${e.approx ? '≈' + t.getDate() : t.getDate()}</b><span>${MONTHS[t.getMonth()]}</span></div><div style="flex:1"><b class="t">${esc(e.name)}</b><span class="small muted">${esc(DESTINATIONS[e.dest].name)} · ${esc(sub)}</span><div class="small">${esc(e.note)}</div></div>${ic('right', 18)}</button>`;
