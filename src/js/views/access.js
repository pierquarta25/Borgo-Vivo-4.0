/* Accessibilità e opzioni di visualizzazione */
/* ---------- ACCESSIBILITÀ ---------- */
views.access = () => {
  const ps = POIS.filter(p => p.dest === S.dest && !p.closed), ok = ps.filter(p => Eng.accOK(p, accSet()));
  return `
  ${ph('Accessibilità', 'Indica le tue esigenze: itinerari, mappa e proposte ne terranno conto.')}
  <div class="card"><h3>Le mie esigenze</h3><div class="chips" style="margin-top:12px">${ACCESS_OPTS.map(i => chip(i.label, i.icon, S.acc.includes(i.id), 'togAcc', `data-id="${i.id}"`)).join('')}</div>
    <p class="small muted" style="margin:12px 0 0">${S.acc.length ? `${ok.length} luoghi su ${ps.length} compatibili a ${esc(dest().name)}. Carrozzina, mobilità ridotta e passeggino escludono i luoghi non accessibili e segnalano quelli parziali.` : 'Nessun filtro attivo: vedrai tutti i luoghi.'}</p></div>
  <div class="card" style="padding:4px 16px"><h3 style="padding:14px 0 0">Visualizzazione</h3>
    ${toggle('hcT', S.hc, 'hc', 'Alto contrasto', 'eye')}
    ${toggle('motT', S.motion, 'motion', 'Animazioni', 'sparkles')}
    ${toggle('dkT', S.theme === 'dark', 'dark', 'Tema scuro', 'moon')}
    <div class="sw"><div class="row" style="gap:12px">${ic('book', 22)}<label for="txtS" style="font-weight:600">Dimensione del testo</label></div><select id="txtS" class="f" style="width:auto;height:40px" data-bind="text"><option value="n" ${S.text === 'n' ? 'selected' : ''}>Normale</option><option value="lg" ${S.text === 'lg' ? 'selected' : ''}>Grande</option><option value="xl" ${S.text === 'xl' ? 'selected' : ''}>Molto grande</option></select></div>
    <div class="sw"><div class="row" style="gap:12px">${ic('volume', 22)}<div><b>Lettura ad alta voce</b><div class="small muted">Nei racconti, tocca “Ascolta”</div></div></div></div></div>
  <div class="notice">${ic('info', 18)}<div>Le informazioni di accessibilità sono indicative: filtri e dettagli (rampe, ascensori, bagni, percorsi tattili) vanno definiti e verificati con i gestori.</div></div>
  <div class="sec-h" style="margin-top:6px"><h2>Luoghi di ${esc(dest().name.split(' ')[0])}</h2></div>
  ${ps.map(p => `<button class="sc" data-action="poi" data-id="${p.id}"><div class="th">${thumb(p)}</div><div style="flex:1;min-width:0"><h3>${esc(p.name)}</h3><div class="row wrap gap6">${accPill(p)}</div>${p.accNote ? `<p class="small muted" style="margin-top:6px">${esc(p.accNote)}</p>` : ''}</div></button>`).join('')}`;
};
