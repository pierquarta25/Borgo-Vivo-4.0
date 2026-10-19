/* Pezzi di interfaccia riusabili: pillole, schede, gauge, interruttori… */
const views = {};   // registro delle schermate: ogni file in src/js/views/ aggiunge la sua
/* ───────────── pezzi di interfaccia ───────────── */
const PH_ = typeof PHOTOS !== 'undefined' ? PHOTOS : {};
const PH_NOTE = { m_lan: 'quartiere Spine Bianche' };
const pic = (id, alt, fallback, eager) => PH_[id] ? `<img class="art" src="assets/images/photos/${PH_[id].file}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" ${id === 'g_pur' ? 'style="object-position:50% 18%"' : ''}>` : fallback;
const thumb = p => pic(p.id, p.name, Art.art(p.kind, p.id));
const heroArt = (d, dusk) => pic('hero_' + d, DESTINATIONS[d].name + ': panorama', Art.hero(d, dusk), true);
const credit = (id, cls = '') => PH_[id] ? `<a class="credit ${cls}" href="${esc(PH_[id].page)}" target="_blank" rel="noopener" title="${esc(PH_[id].title)}">Foto${PH_NOTE[id] ? ' (' + PH_NOTE[id] + ')' : ''}: ${esc(PH_[id].author.slice(0, 40))} · ${esc(PH_[id].lic)}</a>` : '';
const crowdPill = v => `<span class="pill ${Eng.level(v)}" title="Affluenza stimata ${v}%"><i class="dot"></i>${CROWD_LBL[Eng.level(v)]}</span>`;
const accPill = p => `<span class="pill ${p.access === 'full' ? 'low' : p.access === 'partial' ? 'mid' : 'high'}">${ic('access', 12)} ${p.access === 'full' ? 'Accessibile' : p.access === 'partial' ? 'Parziale' : 'Non accessibile'}</span>`;
const demoPill = '<span class="pill demo" title="Dato dimostrativo, da sostituire con l’API territoriale">dati dimostrativi</span>';
const gauge = v => { const r = 34, c = 2 * Math.PI * r; return `<div class="gauge" role="img" aria-label="Affluenza ${v} per cento"><svg width="78" height="78" viewBox="0 0 78 78"><circle cx="39" cy="39" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="7"/><circle cx="39" cy="39" r="${r}" fill="none" stroke="${COL[Eng.level(v)]}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - v / 100)}"/></svg><b>${v}<small style="font-size:.55em;margin-left:1px">%</small></b></div>`; };
const toggle = (id, on, bind, label, icon, sub = '') => `<div class="sw"><div class="row" style="gap:12px">${icon ? ic(icon, 22) : ''}<div><label for="${id}" style="font-weight:600">${label}</label>${sub ? `<div class="small muted">${sub}</div>` : ''}</div></div><span class="toggle"><input type="checkbox" id="${id}" ${on ? 'checked' : ''} data-bind="${bind}"><i></i></span></div>`;
const chip = (label, icon, pressed, action, attrs = '') => `<button type="button" class="chip" aria-pressed="${pressed}" data-action="${action}" ${attrs}>${icon ? ic(icon, 17) : ''}${label}</button>`;
const ph = (t, sub, extra = '') => `<div class="ph"><div class="row sp"><h1>${t}</h1>${extra}</div><p>${sub}</p></div>`;
const clockCtl = (id, label = true) => `<div class="tm"><b id="${id}Lbl">${fmt(S.now)}</b><input type="range" id="${id}" min="480" max="1200" step="30" value="${S.now}" data-bind="now" aria-label="Ora della giornata simulata"></div>`;
const poiCard = p => { const v = crowdNow(p); return `<button class="pcard" data-action="poi" data-id="${p.id}"><div class="im">${thumb(p)}<span class="pill">${ic(KIND[p.kind].i, 12)} ${KIND[p.kind].l}</span></div><div class="bd"><h3>${esc(p.name)}</h3><div class="meta">${crowdPill(v)}${p.less ? '<span class="pill olive">Meno noto</span>' : ''}</div></div></button>`; };
const routeCard = pr => `<button class="rcard" data-action="preset" data-id="${pr.id}">${pic(pr.cover, pr.name, Art.art(pr.kind, pr.id))}<span class="go">${ic('arrow', 18)}</span><div class="in"><h3>${esc(pr.name)}</h3><div class="m"><span>${ic('clock', 13)} ${esc(pr.sub)}</span><span>${ic('pin', 13)} ${pr.stops.length} ${pr.stops.length > 1 ? 'tappe' : 'tappa'}</span></div><div class="m" style="margin-top:2px;opacity:.8">${esc(pr.tag)}</div></div></button>`;
const sheetHero = art => `<div class="sh-hero">${art}</div>`;
