/* GENERATO da tools/generate-sw.py — non modificare a mano.
   Offline: l'app (pagine, codice, font, foto) viene salvata alla prima visita.
   - File "pesanti" (assets, vendor): prima la copia salvata, poi la rete.
   - Codice dell'app: prima la rete (così vedi sempre l'ultima versione), con la copia salvata se sei offline.
   - Tasselli della mappa OpenStreetMap: salvati man mano che li guardi (al massimo 600), così le zone già viste restano visibili offline. */
const CACHE = 'bv-09443db405';
const TILES = 'bv-tiles';
const MAX_TILES = 600;
const PRECACHE = ["assets/fonts/fonts.css", "assets/fonts/fraunces.woff2", "assets/fonts/inter.woff2", "assets/images/logo/bv-icon-square.svg", "assets/images/logo/bv-lockup.svg", "assets/images/logo/bv-mark-dark.svg", "assets/images/logo/bv-mark-white.svg", "assets/images/logo/bv-mark.svg", "assets/images/logo/icon-1024.png", "assets/images/logo/icon-180.png", "assets/images/logo/icon-192.png", "assets/images/logo/icon-512.png", "assets/images/photos/a_baldassarre.jpg", "assets/images/photos/a_buon.jpg", "assets/images/photos/a_claustri.jpg", "assets/images/photos/a_corso.jpg", "assets/images/photos/a_dino.jpg", "assets/images/photos/a_domenico.jpg", "assets/images/photos/a_duomo.jpg", "assets/images/photos/a_forno.jpg", "assets/images/photos/a_lamalunga.jpg", "assets/images/photos/a_mana.jpg", "assets/images/photos/a_mura.jpg", "assets/images/photos/a_nicola.jpg", "assets/images/photos/a_porta.jpg", "assets/images/photos/a_pulo.jpg", "assets/images/photos/credits.json", "assets/images/photos/g_bot.jpg", "assets/images/photos/g_cal.jpg", "assets/images/photos/g_cas.jpg", "assets/images/photos/g_cat.jpg", "assets/images/photos/g_cola.jpg", "assets/images/photos/g_fin.jpg", "assets/images/photos/g_piag.jpg", "assets/images/photos/g_pon.jpg", "assets/images/photos/g_pur.jpg", "assets/images/photos/g_sant.jpg", "assets/images/photos/g_sca.jpg", "assets/images/photos/g_smg.jpg", "assets/images/photos/hero_altamura.jpg", "assets/images/photos/hero_gravina.jpg", "assets/images/photos/hero_matera.jpg", "assets/images/photos/m_belt.jpg", "assets/images/photos/m_cat.jpg", "assets/images/photos/m_cg.jpg", "assets/images/photos/m_cripta.jpg", "assets/images/photos/m_falc.jpg", "assets/images/photos/m_idr.jpg", "assets/images/photos/m_jaz.jpg", "assets/images/photos/m_lam.jpg", "assets/images/photos/m_lan.jpg", "assets/images/photos/m_lanf.jpg", "assets/images/photos/m_musma.jpg", "assets/images/photos/m_pal.jpg", "assets/images/photos/m_pas.jpg", "assets/images/photos/m_ridola.jpg", "assets/images/photos/m_sed.jpg", "assets/images/photos/m_sl.jpg", "assets/images/photos/m_spb.jpg", "assets/images/photos/m_sr.jpg", "assets/images/photos/m_tim.jpg", "assets/images/photos/m_vv.jpg", "assets/images/photos/o12.jpg", "assets/images/photos/oa_cheese.jpg", "assets/images/photos/oa_pane.jpg", "assets/images/photos/oa_pasta.jpg", "index.html", "manifest.webmanifest", "src/css/base.css", "src/css/components.css", "src/css/layout.css", "src/css/responsive.css", "src/css/tokens.css", "src/css/views/content.css", "src/css/views/home.css", "src/css/views/map.css", "src/css/views/onboarding.css", "src/css/views/planner.css", "src/js/components/onboarding.js", "src/js/components/sheets.js", "src/js/core/actions.js", "src/js/core/events.js", "src/js/core/router.js", "src/js/core/state.js", "src/js/data/data-sources.js", "src/js/data/destinations.js", "src/js/data/events.js", "src/js/data/official-stats.js", "src/js/data/operators.js", "src/js/data/photos.js", "src/js/data/places.js", "src/js/data/services.js", "src/js/data/stories.js", "src/js/engine/engine.js", "src/js/main.js", "src/js/ui/art.js", "src/js/ui/helpers.js", "src/js/ui/icons.js", "src/js/views/about.js", "src/js/views/access.js", "src/js/views/city.js", "src/js/views/home.js", "src/js/views/map.js", "src/js/views/market.js", "src/js/views/mobility.js", "src/js/views/planner.js", "src/js/views/sources.js", "src/js/views/stories.js", "vendor/leaflet/images/layers-2x.png", "vendor/leaflet/images/layers.png", "vendor/leaflet/images/marker-icon-2x.png", "vendor/leaflet/images/marker-icon.png", "vendor/leaflet/images/marker-shadow.png", "vendor/leaflet/leaflet.css", "vendor/leaflet/leaflet.js"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bv-') && k !== CACHE && k !== TILES).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function trimTiles(c) {
  const keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);

  if (u.hostname.endsWith('tile.openstreetmap.org')) {
    e.respondWith(caches.open(TILES).then(async c => {
      const hit = await c.match(r);
      if (hit) return hit;
      try {
        const res = await fetch(r);
        if (res.ok && res.type === 'cors') { c.put(r, res.clone()); trimTiles(c); }
        return res;
      } catch (err) { return Response.error(); }
    }));
    return;
  }
  if (u.origin !== location.origin) return;

  const heavy = /\/(assets|vendor)\//.test(u.pathname);
  if (heavy) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
    return;
  }
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(hit => hit || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
