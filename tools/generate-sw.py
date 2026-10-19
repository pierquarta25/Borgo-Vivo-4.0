#!/usr/bin/env python3
"""Genera sw.js (service worker) con l'elenco aggiornato dei file da tenere offline.
Da rilanciare dopo aver aggiunto, tolto o cambiato file dell'app.

Uso:  python3 tools/generate-sw.py
"""
import hashlib, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCLUDE = ['index.html', 'manifest.webmanifest']
INCLUDE_DIRS = ['assets', 'src', 'vendor']

files = list(INCLUDE)
for d in INCLUDE_DIRS:
    for base, _, names in os.walk(os.path.join(ROOT, d)):
        for n in names:
            if n.startswith('.'):
                continue
            files.append(os.path.relpath(os.path.join(base, n), ROOT))
files.sort()
h = hashlib.sha1()
for f in files:
    h.update(f.encode())
    h.update(open(os.path.join(ROOT, f), 'rb').read())
version = h.hexdigest()[:10]

sw = """/* GENERATO da tools/generate-sw.py — non modificare a mano.
   Offline: l'app (pagine, codice, font, foto) viene salvata alla prima visita.
   - File "pesanti" (assets, vendor): prima la copia salvata, poi la rete.
   - Codice dell'app: prima la rete (così vedi sempre l'ultima versione), con la copia salvata se sei offline.
   - Tasselli della mappa OpenStreetMap: salvati man mano che li guardi (al massimo %(tiles)d), così le zone già viste restano visibili offline. */
const CACHE = 'bv-%(version)s';
const TILES = 'bv-tiles';
const MAX_TILES = %(tiles)d;
const PRECACHE = %(files)s;

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

  const heavy = /\\/(assets|vendor)\\//.test(u.pathname);
  if (heavy) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })));
    return;
  }
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); return res; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(hit => hit || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
""" % {'version': version, 'files': '[' + ', '.join('"' + f.replace('\\', '/') + '"' for f in files) + ']', 'tiles': 600}

open(os.path.join(ROOT, 'sw.js'), 'w').write(sw)
total = sum(os.path.getsize(os.path.join(ROOT, f)) for f in files)
print(f'sw.js generato: {len(files)} file, {total/1e6:.1f} MB, versione {version}')
