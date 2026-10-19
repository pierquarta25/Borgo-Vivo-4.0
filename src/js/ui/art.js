/* Illustrazioni generative (SVG) — niente foto con diritti da gestire.
   art(tipo, seme) restituisce un paesaggio stilizzato, diverso per ogni luogo. */
const Art = (() => {
  let uid = 0;
  function rng(seed) {
    let h = 2166136261; for (const c of String(seed)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ h >>> 15, 1 | h); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const W = 400, H = 260;
  const ridge = (r, y, amp, fill, steps = 7, op = 1) => {
    const p = []; for (let i = 0; i <= steps; i++) p.push([i * W / steps, y + (r() - .5) * amp * 2]);
    let d = `M0 ${H} L0 ${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length; i++) { const mx = (p[i - 1][0] + p[i][0]) / 2, my = (p[i - 1][1] + p[i][1]) / 2; d += ` Q${p[i - 1][0].toFixed(1)} ${p[i - 1][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
    d += ` L${W} ${p[p.length - 1][1].toFixed(1)} L${W} ${H}Z`;
    return `<path d="${d}" fill="${fill}" opacity="${op}"/>`;
  };
  const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  const sun = (x, y, r, c, glow) => `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="${glow}" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const arch = (x, y, w, h, c) => `<path d="M${x} ${y + h}V${y + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${y + h}z" fill="${c}"/>`;
  const wrap = (inner, cls = '') => `<svg class="art ${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;

  /* Sassi di Matera: case a gradoni su un pendio, campanile in cima */
  function sassi(r, dusk) {
    const id = 's' + uid++;
    let s = sky(id, dusk ? '#3B3F63' : '#F0A877', dusk ? '#E7A07C' : '#FBE0B4') + sun(300, 70, 20, '#FFF1C9', '#FFD79A');
    s += ridge(r, 150, 14, '#C7926A', 6) + ridge(r, 175, 10, '#B27A55', 5, .9);
    const tones = ['#E8CFA6', '#DDBF92', '#D2AE7F', '#C79E70', '#EBD7B5'];
    for (let row = 0; row < 7; row++) {
      const y = 112 + row * 20, off = -20 + row * 18;
      for (let x = off; x < W + 30; x += 24 + r() * 16) {
        const w = 22 + r() * 18, h = 14 + r() * 14, c = tones[Math.floor(r() * tones.length)];
        s += `<rect x="${x.toFixed(1)}" y="${(y - h + 12).toFixed(1)}" width="${w.toFixed(1)}" height="${(h + 8).toFixed(1)}" rx="1.5" fill="${c}"/>`;
        if (r() > .45) s += arch(x + w / 2 - 3, y - 4, 6, 9, '#6B4630');
        if (r() > .7) s += `<rect x="${(x + 3).toFixed(1)}" y="${(y - h + 14).toFixed(1)}" width="${(w - 6).toFixed(1)}" height="2" fill="#fff" opacity=".25"/>`;
      }
      s += `<rect x="0" y="${y + 12}" width="${W}" height="3" fill="#8A5E3F" opacity=".25"/>`;
    }
    s += `<rect x="62" y="40" width="16" height="72" fill="#E3C79B"/><path d="M60 40h20l-10-14z" fill="#B5482A"/>${arch(66, 52, 8, 14, '#5B3A26')}<rect x="48" y="82" width="44" height="30" fill="#DDBF92"/>`;
    s += `<path d="M0 ${H}V222Q120 208 220 226T${W} 214V${H}z" fill="#5A3A28"/>`;
    return s;
  }
  /* Gravina: canyon e Ponte Acquedotto */
  function gravina(r, dusk) {
    const id = 'g' + uid++;
    let s = sky(id, dusk ? '#2E3B5C' : '#8EB4D6', dusk ? '#F0AE82' : '#F5E3C0') + sun(110, 78, 18, '#FFF1C9', '#FFD7A0');
    s += ridge(r, 128, 12, '#B89573', 6, .9);
    s += `<path d="M0 ${H}V120L70 134 92 ${H}z" fill="#8F6A4A"/><path d="M${W} ${H}V104L330 128 304 ${H}z" fill="#7A5638"/>`;
    s += `<path d="M96 ${H}L74 134 0 120V150L60 ${H}z" fill="#A98259" opacity=".9"/>`;
    // ponte
    s += `<rect x="40" y="112" width="326" height="12" fill="#D9BE94"/><rect x="40" y="108" width="326" height="4" fill="#E9D4B0"/>`;
    for (let i = 0; i < 6; i++) { const x = 60 + i * 52; s += `<path d="M${x} 214V150a22 22 0 0 1 44 0V214z" fill="#C9A87C"/><path d="M${x + 8} 214V152a14 14 0 0 1 28 0V214z" fill="#3A2A44" opacity=".85"/>`; s += `<path d="M${x} 124h44v26a22 22 0 0 0-44 0z" fill="#D9BE94"/>`; }
    s += `<path d="M0 ${H}V226Q100 214 200 228T${W} 222V${H}z" fill="#4C5E4A"/>`;
    for (let i = 0; i < 16; i++) s += `<circle cx="${(r() * W).toFixed(0)}" cy="${(232 + r() * 20).toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="#6F8A5A"/>`;
    return s;
  }
  const P = {
    panorama: ['#F3B279', '#FBE5BE', '#E0A06F', '#B97048', '#7B442E'],
    cultura: ['#E7C79B', '#F8EBD0', '#CDA77C', '#A57B57', '#6A4630'],
    rupestre: ['#C9AE86', '#EDDDBF', '#BA9468', '#8E673F', '#4B3220'],
    natura: ['#B9D0B0', '#F0EDCE', '#9DB27C', '#6F8A4F', '#3F5A33'],
    novecento: ['#9FBFD6', '#EEF2EA', '#CBB9A5', '#B5714F', '#7A4A35'],
    arte: ['#E8A3A0', '#F8DAC4', '#D96F6B', '#7B4F9E', '#2F3A6B'],
    artigianato: ['#E9C27B', '#F8E6BD', '#C5762F', '#8E3F22', '#5B2A18']
  };
  function scene(kind, r) {
    const c = P[kind] || P.cultura, id = 'k' + uid++;
    let s = sky(id, c[0], c[1]);
    if (kind === 'panorama') s += sun(250 + r() * 60, 90, 22, '#FFF4D0', '#FFD08A') + ridge(r, 150, 18, c[2], 7) + ridge(r, 185, 14, c[3], 6) + ridge(r, 222, 10, c[4], 5);
    else if (kind === 'rupestre') {
      s += ridge(r, 110, 14, c[2], 6) + `<path d="M0 ${H}V96H${W}V${H}z" fill="${c[3]}"/>`;
      for (let y = 118; y < 250; y += 24) s += `<path d="M0 ${y}H${W}" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>`;
      const n = 3 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) { const x = 40 + i * (300 / n) + r() * 30, w = 30 + r() * 22, y = 120 + r() * 60; s += arch(x, y, w, w * 1.2, '#2A1B12') + arch(x + 5, y + 6, w - 10, w * 1.2 - 8, '#4A3220'); }
      s += `<path d="M0 ${H}V236Q100 222 200 238T${W} 230V${H}z" fill="${c[4]}"/>`;
    } else if (kind === 'natura') {
      s += sun(80, 70, 16, '#FFF6D6', '#FFE9A5') + ridge(r, 140, 22, c[2], 7) + ridge(r, 180, 16, c[3], 6) + ridge(r, 220, 12, c[4], 5);
      for (let i = 0; i < 22; i++) { const x = r() * W, y = 190 + r() * 60; s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l4 -14l4 14z" fill="${r() > .5 ? '#2D4528' : '#3F5A33'}"/>`; }
    } else if (kind === 'novecento') {
      s += ridge(r, 170, 6, '#D9CDBB', 5);
      for (let b = 0; b < 4; b++) {
        const x = 20 + b * 92, h = 90 + r() * 50, w = 78, y = 224 - h;
        s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${b % 2 ? '#B5714F' : '#C98660'}"/>`;
        for (let yy = y + 10; yy < 214; yy += 20) for (let xx = x + 8; xx < x + w - 10; xx += 20) s += `<rect x="${xx}" y="${yy}" width="12" height="10" fill="#F6E9D3"/><rect x="${xx}" y="${yy + 10}" width="12" height="3" fill="#7A4A35" opacity=".5"/>`;
      }
      s += `<rect x="0" y="224" width="${W}" height="40" fill="#8A7A66"/>`;
    } else if (kind === 'arte') {
      s += `<circle cx="120" cy="120" r="76" fill="${c[2]}" opacity=".9"/><circle cx="240" cy="150" r="96" fill="${c[3]}" opacity=".8"/><rect x="250" y="40" width="110" height="110" rx="14" fill="#F6C65B" opacity=".95"/><path d="M0 220Q100 160 200 210T400 190V${H}H0z" fill="${c[4]}"/><circle cx="310" cy="95" r="26" fill="#FFF"/>`;
    } else if (kind === 'artigianato') {
      s += `<rect y="196" width="${W}" height="64" fill="${c[4]}"/>`;
      for (let i = 0; i < 3; i++) { const x = 90 + i * 110, h = 80 + r() * 30, t = 196 - h; s += `<path d="M${x - 18} 196C${x - 40} 170 ${x - 36} ${t + 10} ${x - 12} ${t}h24C${x + 36} ${t + 10} ${x + 40} 170 ${x + 18} 196z" fill="${i % 2 ? c[2] : c[3]}"/><rect x="${x - 16}" y="${t - 8}" width="32" height="10" rx="4" fill="${c[3]}"/><path d="M${x - 26} ${t + 36}q26 -12 52 0M${x - 28} ${t + 52}q28 -12 56 0" stroke="#FFE7B0" stroke-width="3" fill="none" opacity=".75"/>`; }
    } else { // cultura: facciata romanica
      s += sun(320, 70, 18, '#FFF4D0', '#FFDCA0') + ridge(r, 180, 10, c[2], 6);
      s += `<rect x="110" y="70" width="180" height="150" fill="#E9D3AC"/><path d="M104 70L200 28 296 70z" fill="#D9BC8D"/>${arch(176, 150, 48, 70, '#4A3220')}<circle cx="200" cy="104" r="22" fill="#C6A474"/><circle cx="200" cy="104" r="12" fill="#4A3220"/><rect x="128" y="104" width="12" height="60" fill="#C6A474"/><rect x="260" y="104" width="12" height="60" fill="#C6A474"/><rect x="70" y="50" width="28" height="170" fill="#DEC69A"/><rect x="66" y="44" width="36" height="10" fill="#B5482A"/>`;
      s += `<rect x="0" y="220" width="${W}" height="40" fill="${c[4]}"/>`;
    }
    return s;
  }
  /* api */
  const hero = (dest, dusk = false) => { const r = rng('hero' + dest); return wrap(dest === 'gravina' ? gravina(r, dusk) : sassi(r, dusk), 'hero'); };
  const art = (kind, seed, cls = '') => wrap(scene(kind, rng(seed + kind)), cls);
  return { hero, art };
})();
