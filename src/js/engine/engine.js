/* BORGO VIVO 4.0 — motore: affluenza, orari, accessibilità, AI Planner, Piano B.
   Il planner è un motore a regole/punteggi che gira nel browser; è il punto in cui
   collegare un modello AI e le API reali (vedi DataHub). */

const Eng = (() => {
  const byId = id => POIS.find(p => p.id === id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = n => String(n).padStart(2, '0');
  const fmt = m => { m = Math.round(m); return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60); };
  const dateKey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const dayNames = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; }
  function hav(a, b) {
    const R = 6371, rad = x => x * Math.PI / 180;
    const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  /* ---------- orari ---------- */
  function windows(p, date) { const w = p.hours[date.getDay()]; return w !== undefined ? w : p.hours.def; }
  function isOpen(p, date, min) { return !p.closed && windows(p, date).some(w => min >= w[0] && min < w[1]); }
  function nextOpening(p, date, min) { // prima apertura >= min (stesso giorno)
    let best = null;
    for (const w of windows(p, date)) { if (min < w[1] - 15) { const s = Math.max(min, w[0]); if (best === null || s < best) best = s; } }
    return best;
  }
  function hoursLabel(p, date) {
    if (p.closed) return 'Temporaneamente chiuso';
    const w = windows(p, date);
    if (!w.length) return 'Chiuso oggi';
    if (w.length === 1 && w[0][0] === 0 && w[0][1] === 1440) return 'Sempre accessibile (spazio pubblico)';
    return w.map(x => fmt(x[0]) + '–' + fmt(x[1])).join(' · ');
  }

  /* ---------- affluenza (simulata, deterministica) ---------- */
  const g = (h, c, s) => Math.exp(-((h - c) ** 2) / (2 * s * s));
  function crowd(p, date, min) {
    if (p.closed) return 0;
    const h = min / 60;
    const open = windows(p, date).some(w => min >= w[0] - 30 && min < w[1] + 30);
    if (!open) return Math.round(p.pop * 0.05);
    const curve = 0.22 + 0.78 * Math.max(g(h, 11.2, 1.7), 0.9 * g(h, 16.8, 1.9));
    const wd = date.getDay();
    const dayF = wd === 0 || wd === 6 ? 1.22 : wd === 5 ? 1.1 : 1;
    const noise = (hash(p.id + dateKey(date) + Math.floor(h)) - 0.5) * 14;
    return Math.round(clamp(p.pop * curve * dayF * 0.86 + noise, 0, 100));
  }
  const level = v => v < 35 ? 'low' : v < 62 ? 'mid' : 'high';
  const levelLabel = { low: 'Poco affollato', mid: 'Affluenza media', high: 'Molto affollato' };
  function cityCrowd(dest, date, min) {
    const ps = POIS.filter(p => p.dest === dest && !p.closed);
    const tot = ps.reduce((s, p) => s + p.pop, 0);
    return Math.round(ps.reduce((s, p) => s + crowd(p, date, min) * p.pop, 0) / tot);
  }
  function bestWindow(p, date) { // fascia di 2h meno affollata durante l'apertura
    let best = null;
    for (let m = 8 * 60; m <= 18 * 60; m += 30) {
      if (!isOpen(p, date, m)) continue;
      const v = crowd(p, date, m);
      if (best === null || v < best.v) best = { m, v };
    }
    return best;
  }

  /* ---------- accessibilità ---------- */
  function accOK(p, acc) {
    if (!acc || !acc.size) return true;
    if (acc.has('wheel') && p.access === 'none') return false;
    if (acc.has('low') && p.access === 'none') return false;
    if (acc.has('stroller') && p.access === 'none') return false;
    return true;
  }
  function accWarn(p, acc) {
    if (!acc || !acc.size) return null;
    if ((acc.has('wheel') || acc.has('stroller')) && p.access === 'partial') return 'Accessibilità parziale: ' + (p.accNote || 'da verificare') ;
    return null;
  }
  const accLabel = { full: 'Accessibile', partial: 'Parzialmente accessibile', none: 'Non accessibile' };

  /* ---------- spostamenti ---------- */
  function travelMin(a, b, mode, acc, aDest, bDest) {
    if (aDest && bDest && aDest !== bDest) return TRANSFER_MIN + 10;
    const km = hav(a, b) * 1.3;
    const speed = acc && acc.has('wheel') ? 3.3 : acc && acc.has('low') ? 3.4 : 4.5;
    const walk = km / speed * 60;
    if (mode === 'auto' && km > 1.2) return Math.round(km / 28 * 60 + 7);
    return Math.max(2, Math.round(walk));
  }
  const travelKind = (a, b, mode) => (mode === 'auto' && hav(a, b) * 1.3 > 1.2) ? 'auto' : 'piedi';

  /* ---------- planner ---------- */
  function matchScore(p, interests) {
    if (!interests.length) return 1;
    return p.tags.filter(t => interests.includes(t)).length + (interests.includes(p.kind) ? 1 : 0);
  }

  function plan(o) {
    // o: dest, date, start, end, from, interests[], acc:Set, mode, pace, avoid, exclude:Set, lunchDone, rain
    const interests = o.interests || [], exclude = o.exclude || new Set();
    const startPos = o.from || DESTINATIONS[o.dest].start.ll;
    let pos = startPos, posDest = o.dest, t = o.start, lunchDone = !!o.lunchDone;
    const items = [];
    const pool = POIS.filter(p => p.dest === o.dest && !p.closed && !exclude.has(p.id) && accOK(p, o.acc));
    let cand = pool.filter(p => matchScore(p, interests) > 0);
    if (cand.length < 3) cand = pool;
    const used = new Set();
    const lunchPossible = !lunchDone && (o.end - o.start) >= 270;
    while (true) {
      if (lunchPossible && !lunchDone && t >= 12 * 60 + 20 && t <= 14 * 60 + 40) {
        items.push({ id: 'meal', meal: true, arrive: t, depart: t + 60, travel: 0, status: 'todo' });
        t += 60; lunchDone = true; continue;
      }
      let best = null;
      for (const c of cand) {
        if (used.has(c.id)) continue;
        const tr = travelMin(pos, c.ll, o.mode, o.acc, posDest, c.dest);
        let arrive = t + tr;
        const dur = Math.round(c.dur * (o.pace || 1));
        if (!isOpen(c, o.date, arrive)) {
          const nx = nextOpening(c, o.date, arrive);
          if (nx === null || nx - arrive > 40) continue;
          arrive = nx;
        }
        const wEnd = windows(c, o.date).find(w => arrive >= w[0] && arrive < w[1]);
        if (!wEnd || arrive > wEnd[1] - 20) continue;
        if (arrive + dur > o.end) continue;
        if (o.mode === 'piedi' && tr > 55) continue;
        const cr = crowd(c, o.date, arrive);
        let u = matchScore(c, interests) * 10 + (c.less ? 5 : 0) - cr * (o.avoid ? 0.14 : 0.05);
        if (o.rain && ['natura', 'panorama'].includes(c.kind)) u -= 12;
        u = u / (1 + tr / 25) - (arrive - t - tr) * 0.05;
        if (!best || u > best.u) best = { c, u, tr, arrive, dur };
      }
      if (!best) break;
      items.push({ id: best.c.id, arrive: best.arrive, depart: best.arrive + best.dur, travel: best.tr, status: 'todo' });
      used.add(best.c.id); pos = best.c.ll; posDest = best.c.dest; t = best.arrive + best.dur;
      if (items.length >= 9) break;
    }
    return items;
  }

  /* ---------- verifiche per ogni tappa ---------- */
  function assess(item, ctx) { // ctx: date, acc
    if (item.meal) return { flags: [], crowd: null };
    const p = byId(item.id), flags = [];
    const v = crowd(p, ctx.date, item.arrive);
    if (p.closed) flags.push({ type: 'closed', text: 'Temporaneamente chiuso' });
    else if (!windows(p, ctx.date).length) flags.push({ type: 'closed', text: 'Chiuso oggi (' + dayNames[ctx.date.getDay()] + ')' });
    else if (!isOpen(p, ctx.date, item.arrive) || !windows(p, ctx.date).some(w => item.arrive + 15 <= w[1] && item.arrive >= w[0]))
      flags.push({ type: 'closed', text: 'Fuori orario alle ' + fmt(item.arrive) });
    if (v >= 62 && !p.closed) flags.push({ type: 'crowd', text: 'Molto affollato alle ' + fmt(item.arrive) });
    const aw = accWarn(p, ctx.acc);
    if (aw) flags.push({ type: 'acc', text: aw });
    if (ctx.acc && ctx.acc.size && !accOK(p, ctx.acc)) flags.push({ type: 'acc', text: 'Non adatto alle esigenze indicate' });
    if (p.booking) flags.push({ type: 'book', text: 'Serve prenotazione' });
    return { flags, crowd: v };
  }

  /* ---------- Piano B ---------- */
  const indoor = p => ['arte', 'cultura', 'rupestre'].includes(p.kind);
  function alternatives(poi, ctx) { // ctx: date, min, acc, mode, exclude:Set, reason
    const here = poi.closed ? 70 : crowd(poi, ctx.date, ctx.min);
    const out = [];
    for (const c of POIS) {
      if (c.id === poi.id || c.closed || ctx.exclude.has(c.id)) continue;
      if (!accOK(c, ctx.acc)) continue;
      const overlap = c.tags.filter(t => poi.tags.includes(t)).length + (c.kind === poi.kind ? 1 : 0);
      if (!overlap) continue;
      const arr = ctx.min + 10;
      if (!isOpen(c, ctx.date, arr)) continue;
      const w = windows(c, ctx.date).find(x => arr >= x[0] && arr < x[1]);
      if (!w || arr > w[1] - 25) continue;
      const cv = crowd(c, ctx.date, arr);
      if (ctx.reason === 'crowd' && cv > here - 12) continue;
      if (cv >= 62) continue;
      const sameDest = c.dest === poi.dest;
      const km = hav(poi.ll, c.ll);
      let s = overlap * 10 + (c.less ? 6 : 0) + (here - cv) / 4 - km * (sameDest ? 2 : 0.15) - (sameDest ? 0 : 14);
      if (ctx.reason === 'rain') s += indoor(c) ? 10 : -15;
      out.push({ poi: c, score: s, crowd: cv, sameDest, km, travel: sameDest ? travelMin(poi.ll, c.ll, ctx.mode, ctx.acc) : TRANSFER_MIN });
    }
    out.sort((a, b) => b.score - a.score);
    const same = out.filter(x => x.sameDest).slice(0, 2), far = out.filter(x => !x.sameDest).slice(0, 1);
    return [...same, ...far].sort((a, b) => b.score - a.score);
  }

  /* Ridistribuzione: per i luoghi molto affollati l'alternativa meno congestionata */
  function redistribute(dest, date, min, acc) {
    const res = [];
    for (const p of POIS) {
      if (p.dest !== dest || p.closed) continue;
      const v = crowd(p, date, min);
      if (v < 62) continue;
      const alt = alternatives(p, { date, min, acc, mode: 'piedi', exclude: new Set(), reason: 'crowd' }).filter(a => a.sameDest || true)[0];
      if (alt) res.push({ from: p, to: alt.poi, fromV: v, toV: alt.crowd });
    }
    return res;
  }

  return { byId, fmt, pad, dateKey, dayNames, hav, windows, isOpen, hoursLabel, crowd, level, levelLabel, cityCrowd, bestWindow,
           accOK, accWarn, accLabel, travelMin, travelKind, plan, assess, alternatives, redistribute, indoor, clamp, hash };
})();
