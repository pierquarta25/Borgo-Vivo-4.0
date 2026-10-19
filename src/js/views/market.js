/* Esperienze e botteghe: schede operatori, prenotazione, le mie prenotazioni */
/* ---------- ESPERIENZE ---------- */
let opType = 'tutti', opShowAll = false;
views.market = () => {
  const types = [['tutti', 'Tutto', 'layers'], ...Object.entries(OPTYPE).map(([k, v]) => [k, v, OPICON[k]])];
  const ops = OPERATORS.filter(o => (opShowAll || o.dest === S.dest) && (opType === 'tutti' || o.type === opType));
  return `
  ${ph('Esperienze e botteghe', 'Artigiani, produttori e guide: scopri e prenota direttamente con chi vive il territorio.', `<a class="btn sm soft" href="#/trips">${ic('ticket', 15)} ${S.bookings.length}</a>`)}
  <div class="notice">${ic('info', 18)}<div>Si paga direttamente all’operatore: la piattaforma non gestisce pagamenti online. Operatori e disponibilità sono dimostrativi.</div></div>
  <div class="chips scroll" role="group" aria-label="Tipologia">${types.map(t => chip(t[1], t[2], opType === t[0], 'opType', `data-id="${t[0]}"`)).join('')}</div>
  ${toggle('opAll', opShowAll, 'opAll', 'Mostra anche altri borghi', 'route')}
  <div class="grid" style="margin-top:14px">${ops.map(o => `<button class="oc" data-action="op" data-id="${o.id}"><div class="im">${pic(o.id, o.name, Art.art(OPART[o.type], o.id))}<span class="price">${o.price ? '€' + o.price : 'Gratis'}</span></div><div class="bd"><h3>${esc(o.name)}</h3><div class="small muted">${esc(o.op)} · ${esc(DESTINATIONS[o.dest].name)}</div><div class="row wrap gap6" style="margin-top:10px"><span class="pill brand">${ic(OPICON[o.type], 12)} ${esc(OPTYPE[o.type])}</span><span class="pill">${ic('clock', 12)} ${Math.round(o.dur / 6) / 10} h</span>${accPill(o)}</div></div></button>`).join('') || '<p class="empty">Nessuna proposta.</p>'}</div>`;
};
function seatsLeft(o, dateStr, slot) {
  const taken = Math.floor(Eng.hash(o.id + dateStr + slot) * (o.max * .7));
  const mine = S.bookings.filter(b => b.op === o.id && b.date === dateStr && b.slot === slot).reduce((s, b) => s + b.n, 0);
  return Math.max(0, o.max - taken - mine);
}
function slotsHtml(o, dstr) {
  return o.slots.map((s, i) => { const left = seatsLeft(o, dstr, s); return `<label class="slot"><input type="radio" name="slot" value="${s}" ${i === 0 && left ? 'checked' : ''} ${left ? '' : 'disabled'}><span>${s}<small>${left ? left + ' posti' : 'esaurito'}</small></span></label>`; }).join('');
}
function opSheet(id) {
  const o = OPERATORS.find(x => x.id === id);
  const dates = []; for (let i = 0; i < 14; i++) { const t = new Date(D()); t.setDate(t.getDate() + i); if (o.days.includes(t.getDay())) dates.push(t); }
  const first = dates[0];
  return `${sheetHero(pic(o.id, o.name, Art.art(OPART[o.type], o.id)))}<div class="sh-pad">
  <div class="row wrap gap6" style="margin-bottom:8px"><span class="pill brand">${ic(OPICON[o.type], 12)} ${esc(OPTYPE[o.type])}</span>${accPill(o)}${demoPill}</div>
  <h2 id="sheetTitle">${esc(o.name)}</h2><p class="small muted">${esc(o.op)} · ${esc(DESTINATIONS[o.dest].name)}</p><p>${esc(o.desc)}</p>${PH_[o.id] ? `<p class="small muted" style="margin:0 0 6px">${credit(o.id, 'inl')}</p>` : ''}
  <div class="facts"><div>${ic('clock', 18)}<span>Durata circa ${Math.round(o.dur / 6) / 10} ore</span></div><div>${ic('users', 18)}<span>Gruppi fino a ${o.max} persone</span></div><div>${ic('ticket', 18)}<span>${o.price ? '€' + o.price + ' a persona, da pagare all’operatore' : 'Gratuito'}</span></div></div>
  ${o.access === 'none' && S.acc.some(a => a === 'wheel' || a === 'low') ? `<div class="notice warn">${ic('alert', 18)}<div>Potrebbe non essere adatta alle esigenze di accessibilità indicate.</div></div>` : ''}
  ${first ? `<form id="bookForm" data-op="${o.id}">
    <div class="fg"><div class="lb">${ic('calendar', 18)} Scegli il giorno</div><input type="hidden" id="bDate" value="${dateKey(first)}">
      <div class="datechips" role="group" aria-label="Giorno">${dates.map((t, i) => `<button type="button" class="dc" aria-pressed="${i === 0}" data-action="bookDate" data-v="${dateKey(t)}"><small>${DOW[t.getDay()]}</small><b>${t.getDate()}</b><small>${MONTHS[t.getMonth()]}</small></button>`).join('')}</div></div>
    <div class="fg"><div class="lb">${ic('clock', 18)} Orario</div><div class="slots" id="slotBox" role="radiogroup">${slotsHtml(o, dateKey(first))}</div></div>
    <div class="fg"><div class="lb">${ic('users', 18)} Persone</div><div class="stepper"><button type="button" data-action="step" data-d="-1" aria-label="Meno">${ic('minus', 18)}</button><b id="nLbl">2</b><button type="button" data-action="step" data-d="1" aria-label="Più">${ic('plus', 18)}</button><input type="hidden" id="bN" value="2" data-max="${o.max}" data-price="${o.price}"></div></div>
    <div class="fg"><label for="bName">Nome</label><input type="text" id="bName" required maxlength="60" autocomplete="name"></div>
    <div class="fg"><label for="bMail">Email per la conferma</label><input type="email" id="bMail" required autocomplete="email"></div>
    <div class="fg"><label for="bNote">Esigenze particolari (facoltativo)</label><input type="text" id="bNote" maxlength="120" value="${esc(S.acc.map(a => ACCESS_OPTS.find(x => x.id === a).label).join(', '))}"></div>
    <button class="btn block" type="submit" style="margin-top:20px;min-height:54px" id="bBtn">Prenota · €${o.price * 2}</button>
    <p class="small muted" style="text-align:center;margin-top:8px">Nessun pagamento online.</p></form>`
  : '<p class="empty">Nessuna data disponibile nei prossimi 14 giorni.</p>'}</div>`;
}

views.trips = () => `
  ${ph('Le mie prenotazioni', 'Salvate su questo dispositivo.')}
  ${S.bookings.length ? S.bookings.map((b, i) => { const o = OPERATORS.find(x => x.id === b.op); return `<div class="card"><div class="row sp"><span class="pill low">${ic('check', 12)} Confermata</span><span class="small muted">Codice <b>${esc(b.code)}</b></span></div><h3 style="margin:10px 0 2px">${esc(o.name)}</h3><div class="small muted">${esc(o.op)}</div><div class="facts"><div>${ic('calendar', 18)}<span>${esc(b.label)} alle ${b.slot}</span></div><div>${ic('users', 18)}<span>${b.n} ${b.n > 1 ? 'persone' : 'persona'}</span></div><div>${ic('ticket', 18)}<span>Da pagare in loco: €${o.price * b.n}</span></div></div><button class="btn sm ghost" data-action="cancelBook" data-i="${i}">Annulla prenotazione</button></div>`; }).join('') : `<div class="empty">${ic('ticket', 34)}<p>Non hai ancora prenotato nulla.</p><a class="btn" href="#/market">Scopri le esperienze</a></div>`}`;
