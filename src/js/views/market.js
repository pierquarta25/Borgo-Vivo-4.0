/* Esperienze e botteghe: operatori REALI, richiesta di prova, le mie richieste */
let opType = 'tutti', opShowAll = false;
const opPrice = o => o.price === null || o.price === undefined ? 'Su richiesta' : (o.priceNote && /€\d+.*(€|e )/.test(o.priceNote) ? 'da ' : '') + '€' + o.price;
const DAYPARTS = ['Mattina', 'Pomeriggio', 'Sera'];
views.market = () => {
  const types = [['tutti', 'Tutto', 'layers'], ...Object.entries(OPTYPE).map(([k, v]) => [k, v, OPICON[k]])];
  const ops = OPERATORS.filter(o => (opShowAll || o.dest === S.dest) && (opType === 'tutti' || o.type === opType));
  return `
  ${ph('Esperienze e botteghe', `Operatori reali di ${esc(dest().name.split(' ')[0])}: scopri e prenota dal loro sito ufficiale.`, `<a class="btn sm soft" href="#/trips">${ic('ticket', 15)} ${S.bookings.length}</a>`)}
  <div class="notice">${ic('info', 18)}<div>Operatori e programmi sono quelli pubblicati online (documento di progetto e siti ufficiali). I prezzi sono quelli visualizzati nella data di consultazione: <b>riconfermali con l’operatore</b>. La piattaforma non gestisce pagamenti.</div></div>
  <div class="chips scroll" role="group" aria-label="Tipologia">${types.map(t => chip(t[1], t[2], opType === t[0], 'opType', `data-id="${t[0]}"`)).join('')}</div>
  ${toggle('opAll', opShowAll, 'opAll', 'Mostra anche le altre città', 'route')}
  <div class="grid" style="margin-top:14px">${ops.map(o => `<button class="oc" data-action="op" data-id="${o.id}"><div class="im">${opPic(o)}<span class="price">${opPrice(o)}</span></div><div class="bd"><h3>${esc(o.name)}</h3><div class="small muted">${esc(o.op)} · ${esc(DESTINATIONS[o.dest].name)}</div><div class="row wrap gap6" style="margin-top:10px"><span class="pill brand">${ic(OPICON[o.type], 12)} ${esc(OPTYPE[o.type])}</span>${o.dur ? `<span class="pill">${ic('clock', 12)} ${Math.round(o.dur / 6) / 10} h</span>` : ''}${accPill(o)}</div></div></button>`).join('') || '<p class="empty">Nessuna proposta ancora censita per questa città.</p>'}</div>
  ${S.dest === 'matera' ? `<div class="notice" style="margin-top:6px">${ic('info', 18)}<div>A Matera sono censite per ora le visite con biglietto o prenotazione ufficiale. Botteghe e laboratori da inserire insieme al Comune e agli operatori.</div></div>` : ''}`;
};

function opSheet(id) {
  const o = OPERATORS.find(x => x.id === id);
  const dates = []; for (let i = 0; i < 14; i++) { const t = new Date(D()); t.setDate(t.getDate() + i); dates.push(t); }
  const ph_ = PH_[o.photo];
  return `${sheetHero(opPic(o))}<div class="sh-pad">
  <div class="row wrap gap6" style="margin-bottom:8px"><span class="pill brand">${ic(OPICON[o.type], 12)} ${esc(OPTYPE[o.type])}</span>${accPill(o)}<span class="pill olive">${ic('shield', 12)} operatore reale</span></div>
  <h2 id="sheetTitle">${esc(o.name)}</h2><p class="small muted">${esc(o.op)} · ${esc(DESTINATIONS[o.dest].name)}</p><p>${esc(o.desc)}</p>${ph_ ? `<p class="small muted" style="margin:0 0 6px">${credit(o.photo, 'inl')}</p>` : ''}
  <div class="facts">
    <div>${ic('ticket', 18)}<span>${o.price === null || o.price === undefined ? 'Prezzo non pubblicato' : '€' + o.price + (o.priceNote ? '' : ' a persona')}${o.priceNote ? `<br><span class="small muted">${esc(o.priceNote)}</span>` : ''}</span></div>
    ${o.dur ? `<div>${ic('clock', 18)}<span>Durata circa ${Math.round(o.dur / 6) / 10} ore</span></div>` : ''}
    ${o.max ? `<div>${ic('users', 18)}<span>Gruppi fino a ${o.max} persone</span></div>` : ''}
    ${o.langs ? `<div>${ic('book', 18)}<span>Lingue: ${esc(o.langs)}</span></div>` : ''}
    <div>${ic('calendar', 18)}<span>${esc(o.how)}</span></div>
  </div>
  ${o.access === 'none' && S.acc.some(a => a === 'wheel' || a === 'low') ? `<div class="notice warn">${ic('alert', 18)}<div>Potrebbe non essere adatta alle esigenze di accessibilità indicate.</div></div>` : ''}
  <a class="btn block" href="${esc(o.url)}" target="_blank" rel="noopener" style="min-height:54px">${ic('arrow', 18)} Vai al sito ufficiale per prenotare</a>
  <details class="trial"><summary>Salva una richiesta di prova nel tuo viaggio</summary>
    <form id="bookForm" data-op="${o.id}">
      <p class="small muted">Prototipo: la richiesta resta su questo dispositivo e <b>non viene inviata</b> all’operatore.</p>
      <div class="fg"><div class="lb">${ic('calendar', 18)} Giorno desiderato</div><input type="hidden" id="bDate" value="${dateKey(dates[0])}">
        <div class="datechips" role="group" aria-label="Giorno">${dates.map((t, i) => `<button type="button" class="dc" aria-pressed="${i === 0}" data-action="bookDate" data-v="${dateKey(t)}"><small>${DOW[t.getDay()]}</small><b>${t.getDate()}</b><small>${MONTHS[t.getMonth()]}</small></button>`).join('')}</div></div>
      <div class="fg"><div class="lb">${ic('clock', 18)} Fascia</div><div class="seg" role="radiogroup" aria-label="Fascia oraria">${DAYPARTS.map((x, i) => `<button type="button" aria-pressed="${i === 0}" data-action="bookPart" data-v="${x}">${x}</button>`).join('')}</div><input type="hidden" id="bPart" value="${DAYPARTS[0]}"></div>
      <div class="fg"><div class="lb">${ic('users', 18)} Persone</div><div class="stepper"><button type="button" data-action="step" data-d="-1" aria-label="Meno">${ic('minus', 18)}</button><b id="nLbl">2</b><button type="button" data-action="step" data-d="1" aria-label="Più">${ic('plus', 18)}</button><input type="hidden" id="bN" value="2" data-max="${o.max || 12}"></div></div>
      <div class="fg"><label for="bNote">Esigenze particolari (facoltativo)</label><input type="text" id="bNote" maxlength="120" value="${esc(S.acc.map(a => ACCESS_OPTS.find(x => x.id === a).label).join(', '))}"></div>
      <button class="btn soft block" type="submit" style="margin-top:16px">Salva richiesta di prova</button>
    </form>
  </details></div>`;
}

views.trips = () => `
  ${ph('Le mie richieste', 'Richieste di prova salvate su questo dispositivo: non sono prenotazioni.')}
  ${S.bookings.length ? S.bookings.map((b, i) => { const o = OPERATORS.find(x => x.id === b.op); return `<div class="card"><div class="row sp"><span class="pill">${ic('clock', 12)} Richiesta di prova</span><span class="small muted">non inviata</span></div><h3 style="margin:10px 0 2px">${esc(o.name)}</h3><div class="small muted">${esc(o.op)}</div><div class="facts"><div>${ic('calendar', 18)}<span>${esc(b.label)} · ${esc(b.part)}</span></div><div>${ic('users', 18)}<span>${b.n} ${b.n > 1 ? 'persone' : 'persona'}</span></div>${o.price ? `<div>${ic('ticket', 18)}<span>Prezzo pubblicato €${o.price} a persona (da riconfermare)</span></div>` : ''}</div><div class="row wrap"><a class="btn sm" href="${esc(o.url)}" target="_blank" rel="noopener">Prenota sul sito ufficiale</a><button class="btn sm ghost" data-action="cancelBook" data-i="${i}">Elimina</button></div></div>`; }).join('') : `<div class="empty">${ic('ticket', 34)}<p>Non hai ancora salvato richieste.</p><a class="btn" href="#/market">Scopri le esperienze</a></div>`}`;
