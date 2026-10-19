/* Racconti, cultura e luoghi del cuore */
/* ---------- RACCONTI ---------- */
let storyCat = 'tutti';
views.stories = () => {
  const cats = [['tutti', 'Tutti', 'layers'], ['storia', 'Storia', 'landmark'], ['tradizione', 'Tradizioni', 'sparkles'], ['memoria', 'Memorie', 'heart'], ['cuore', 'Luoghi del cuore', 'pin']];
  const list = STORIES.filter(s => s.dest === S.dest && (storyCat === 'tutti' || s.cat === storyCat));
  const hearts = [...HEART_PLACES.filter(h => h.dest === S.dest), ...S.hearts.filter(h => h.dest === S.dest)];
  const f = list[0], rest = list.slice(1);
  return `
  ${ph('Racconti e identità', 'La cultura e la memoria dei luoghi, non solo le attrazioni più famose.')}
  <div class="chips scroll" role="group" aria-label="Categorie">${cats.map(c => chip(c[1], c[2], storyCat === c[0], 'storyCat', `data-id="${c[0]}"`)).join('')}</div>
  <div style="height:10px"></div>
  ${storyCat !== 'cuore' && f ? `<button class="feat" data-action="story" data-id="${f.id}">${thumb(byId(f.place))}<div class="in"><span class="pill" style="background:rgba(255,248,236,.92);color:#6E2A12">${{ storia: 'Storia', tradizione: 'Tradizione', memoria: 'Memoria' }[f.cat]}</span><h2>${esc(f.title)}</h2><div class="small" style="opacity:.9">${ic('pin', 13)} ${esc(byId(f.place).name)}</div></div></button>
  ${rest.map(s => `<button class="sc" data-action="story" data-id="${s.id}"><div class="th">${thumb(byId(s.place))}</div><div style="flex:1;min-width:0"><span class="eyebrow muted" style="font-size:.62rem">${{ storia: 'Storia', tradizione: 'Tradizione', memoria: 'Memoria' }[s.cat]}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></button>`).join('')}` : ''}
  ${storyCat === 'tutti' || storyCat === 'cuore' ? `<div class="sec-h"><h2>Luoghi del cuore</h2></div><p class="sec-sub">Suggeriti da residenti e guide. I primi sono esempi; i tuoi restano su questo dispositivo.</p>
    ${hearts.map(h => `<div class="hc-q">${ic('quote', 44, 'q')}<p>“${esc(h.note)}”</p><div class="row"><div class="av">${esc(h.by.trim()[0].toUpperCase())}</div><div style="flex:1;min-width:0"><b class="small">${esc(h.by)}</b><div class="small muted">${esc(byId(h.place).name)}</div></div>${h.mine ? '<span class="pill olive">tuo</span>' : ''}<button class="btn sm soft" data-action="poi" data-id="${h.place}">${ic('pin', 14)}</button></div></div>`).join('')}
    <form class="card" id="heartForm"><h3>Condividi il tuo luogo del cuore</h3>
      <div class="fg"><label for="hPlace">Luogo</label><select class="f" id="hPlace">${POIS.filter(p => p.dest === S.dest).map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></div>
      <div class="fg"><label for="hBy">Il tuo nome</label><input type="text" id="hBy" maxlength="40" required placeholder="Es. Lucia, residente"></div>
      <div class="fg"><label for="hNote">Perché è speciale?</label><textarea id="hNote" rows="3" maxlength="240" required></textarea></div>
      <button class="btn block" type="submit" style="margin-top:16px">${ic('heart', 18)} Condividi</button></form>` : ''}`;
};
