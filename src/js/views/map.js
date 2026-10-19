/* Mappa interattiva (Leaflet): livelli, affluenza per ora, alternative alla folla */
/* ---------- MAPPA ---------- */
let map = null, layerGroup = null;
const mapState = { layers: { cultura: true, rupestre: true, natura: true, panorami: true, parcheggi: true, trasporti: true, botteghe: true, guide: true, eventi: true }, crowd: true };
const LAYER_DEF = [['cultura', 'Cultura e arte', 'landmark'], ['rupestre', 'Rupestre', 'cave'], ['natura', 'Natura e ’900', 'leaf'], ['panorami', 'Panorami', 'camera'], ['parcheggi', 'Parcheggi', 'parking'], ['trasporti', 'Trasporti', 'bus'], ['botteghe', 'Botteghe', 'pottery'], ['guide', 'Guide', 'compass'], ['eventi', 'Eventi', 'calendar']];
const poiLayer = p => ({ cultura: 'cultura', arte: 'cultura', artigianato: 'botteghe', rupestre: 'rupestre', natura: 'natura', novecento: 'natura', panorama: 'panorami' }[p.kind]);

views.map = () => `
  <div class="mapwrap">
    <div id="map" role="application" aria-label="Mappa interattiva"></div>
    <div class="map-offline notice warn" role="status">${ic('alert', 18)}<div>Sei offline: la mappa mostra solo le zone già visitate. Luoghi e percorsi restano disponibili.</div></div>
    <div class="map-top"><div class="chips scroll" role="group" aria-label="Livelli della mappa">
      <button class="chip" style="background:var(--brand);border-color:var(--brand);color:#fff" data-action="redis">${ic('users', 16)} Alternative alla folla</button>
      ${LAYER_DEF.map(l => chip(l[1], l[2], mapState.layers[l[0]], 'layer', `data-id="${l[0]}"`)).join('')}</div></div>
    <div class="map-bot">
      <div class="row sp" style="margin-bottom:4px"><span class="eyebrow muted">Affluenza alle</span><label class="row small" style="gap:8px;font-weight:600">Colori <span class="toggle" style="width:40px;height:24px"><input type="checkbox" ${mapState.crowd ? 'checked' : ''} data-bind="crowdTog"><i></i></span></label></div>
      ${clockCtl('mapNow')}
      <div class="legend"><span><i style="background:var(--low)"></i>tranquillo</span><span><i style="background:var(--mid)"></i>movimentato</span><span><i style="background:var(--high)"></i>molto affollato</span>${estPill}</div>
    </div>
  </div>`;

function initMap() {
  if (map) { map.remove(); map = null; }
  const el = $('#map'); if (!el || typeof L === 'undefined') { if (el) el.innerHTML = '<p class="empty">Mappa non disponibile.</p>'; return; }
  map = L.map(el, { zoomControl: true, attributionControl: true }).setView(dest().center, dest().zoom);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap', crossOrigin: true }).addTo(map);
  layerGroup = L.layerGroup().addTo(map);
  drawMap();
  setTimeout(() => { if (map) { map.invalidateSize(); map.setView(dest().center, dest().zoom); } }, 150);
}
function pin(ll, icon, color, onClick, label) {
  const m = L.marker(ll, { icon: L.divIcon({ className: '', html: `<div class="pin" style="background:${color}">${ic(icon, 16)}</div>`, iconSize: [34, 34], iconAnchor: [17, 34] }), title: label, alt: label });
  m.on('click', onClick); return m;
}
function drawMap() {
  if (!map) return;
  layerGroup.clearLayers();
  const Ls = mapState.layers, date = D();
  POIS.filter(p => p.dest === S.dest && Ls[poiLayer(p)]).forEach(p => {
    const v = Eng.crowd(p, date, S.now), col = p.closed ? '#8a8178' : mapState.crowd ? COL[Eng.level(v)] : KIND[p.kind].c;
    pin(p.ll, KIND[p.kind].i, col, () => openSheet(poiSheet(p.id)), p.name).addTo(layerGroup);
  });
  if (Ls.parcheggi) PARKINGS.filter(p => p.dest === S.dest && p.ll).forEach(p => pin(p.ll, 'parking', '#3d6f8a', () => openSheet(`<div class="sh-pad pt"><h2 id="sheetTitle">${esc(p.name)}</h2>${parkRow(p)}</div>`), p.name).addTo(layerGroup));
  if (Ls.trasporti) TRANSIT.filter(p => p.dest === S.dest).forEach(p => pin(p.ll, 'bus', '#5b4b8a', () => openSheet(`<div class="sh-pad pt"><h2 id="sheetTitle">${esc(p.name)}</h2><p>${esc(p.note)}</p></div>`), p.name).addTo(layerGroup));
  OPERATORS.filter(o => o.dest === S.dest && o.at).forEach(o => { const layer = o.type === 'guida' ? 'guide' : 'botteghe'; if (Ls[layer]) pin(byId(o.at).ll, OPICON[o.type], '#c8963c', () => openSheet(opSheet(o.id)), o.name).addTo(layerGroup); });
  if (Ls.eventi) EVENTS.filter(e => e.dest === S.dest).forEach(e => { const p = byId(e.place); pin([p.ll[0] + .0004, p.ll[1] + .0004], 'calendar', '#a8436a', () => openSheet(`<div class="sh-pad pt"><h2 id="sheetTitle">${esc(e.name)}</h2><p>${esc(e.note)}</p><button class="btn sm" data-action="poi" data-id="${p.id}">Vai al luogo</button></div>`), e.name).addTo(layerGroup); });
  if (S.plan && S.plan.dest === S.dest) {
    const line = S.plan.items.filter(i => !i.meal && i.status !== 'skipped').map(i => byId(i.id).ll);
    if (line.length > 1) L.polyline(line, { color: '#B4492A', weight: 4, dashArray: '8 8', opacity: .9 }).addTo(layerGroup);
  }
}
function redisSheet() {
  const rd = Eng.redistribute(S.dest, D(), S.now, accSet());
  return `<div class="sh-pad pt"><h2 id="sheetTitle">Alternative alla folla</h2><p class="muted">Alle ${fmt(S.now)}: i luoghi molto affollati e un’alternativa simile, aperta e più tranquilla. ${estPill}</p>
  ${rd.length ? rd.map(r => `<div class="alt"><div class="th">${thumb(r.to)}</div><div class="bd"><div class="small muted">Invece di <b>${esc(r.from.name)}</b> ${crowdPill(r.fromV)}</div><b style="font-family:var(--display);font-size:1.02rem">${esc(r.to.name)}</b><div style="margin-top:4px">${crowdPill(r.toV)}</div></div><div class="acts"><button class="btn sm soft" data-action="flyTo" data-id="${r.to.id}">${ic('map', 15)} Mostra sulla mappa</button></div></div>`).join('') : `<div class="empty">${ic('check', 28)}<br>Nessun luogo è molto affollato a quest’ora.</div>`}</div>`;
}
