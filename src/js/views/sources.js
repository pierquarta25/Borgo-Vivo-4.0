/* Dati e aggiornamenti (fonti simulate) */
/* ---------- FONTI DATI ---------- */
views.sources = () => `
  ${ph('Dati e aggiornamenti', 'Il livello tecnico che collega l’app a dati e API territoriali. Nuove fonti si aggiungono senza cambiare l’interfaccia.')}
  ${DATA_SOURCES.map(s => `<div class="card"><div class="row sp"><b>${esc(s.name)}</b><span class="pill ${s.live ? 'low' : 'demo'}">${s.live ? 'in diretta' : esc(s.mode)}</span></div><div class="small muted" style="margin-top:4px">${esc(s.kind)} · aggiornamento ${esc(s.every)}</div><div class="small" style="margin-top:6px">${ic('clock', 13)} Ultima sincronizzazione: ${S.dataSync[s.id] ? new Date(S.dataSync[s.id]).toLocaleTimeString('it-IT') : '—'}</div></div>`).join('')}
  <button class="btn block" data-action="sync">${ic('refresh', 18)} Aggiorna tutte le fonti</button>
  <div class="card night" style="margin-top:16px"><h3 style="margin-bottom:8px">Come collegare le API reali</h3><p class="small" style="opacity:.85;margin:0">Il motore legge affluenza, orari e parcheggi da funzioni uniche: per passare ai dati reali basta sostituirle con chiamate a sensori di presenza, GTFS, parcheggi comunali e calendario eventi. Anche l’AI Planner è sostituibile con un modello di linguaggio mantenendo gli stessi input e output.</p></div>`;
