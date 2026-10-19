/* Introduzione al primo avvio */
/* ───────────── onboarding ───────────── */
let onbStep = 0;
function onboarding() {
  const el = $('#onb'); el.hidden = false; document.body.style.overflow = 'hidden';
  if (onbStep === 0) el.innerHTML = `<div class="ho">${heroArt('matera')}<div class="in"><img src="assets/images/logo/bv-mark.svg" width="56" height="56" alt="" style="display:block;margin-bottom:14px;border-radius:15px;box-shadow:0 6px 20px rgba(0,0,0,.35)"><div class="eyebrow" style="opacity:.9">Benvenuto</div><h1>Borgo Vivo <em style="font-style:normal;color:#F6B98F">4.0</em></h1><p style="margin:6px 0 0;opacity:.95;font-family:var(--display);font-size:1.15rem;font-style:italic">Dove il tempo ha un altro ritmo.</p></div></div>
    <div class="bd"><div class="dots"><i class="on"></i><i></i></div><h2 style="margin-bottom:8px">Il digitale non porta tutti nello stesso posto.</h2><p class="muted">Ti aiuta a trovare il tuo: itinerari su misura, luoghi meno affollati, botteghe e storie del territorio. Per tutti.</p>
    <button class="btn block" data-action="onbNext" style="margin-top:22px;min-height:54px">Iniziamo ${ic('arrow', 18)}</button><button class="btn ghost block" data-action="onbDone" style="margin-top:8px;border-color:transparent">Salta</button></div>`;
  else el.innerHTML = `<div class="bd" style="padding-top:30px"><div class="dots"><i></i><i class="on"></i></div><h2>Dove vuoi cominciare?</h2><div style="margin:14px 0 6px">${Object.values(DESTINATIONS).map(d => `<button class="dcard" aria-pressed="${S.dest === d.id}" data-action="onbDest" data-id="${d.id}"><div class="th">${heroArt(d.id).replace('xMidYMid','xMidYMax')}</div><div><b style="font-family:var(--display);font-size:1.1rem">${esc(d.name)}</b><div class="small muted">${esc(EYEBROW[d.id])}</div></div></button>`).join('')}</div>
    <div class="fg"><div class="lb">${ic('heart', 18)} Cosa ti piace?</div><div class="chips">${INTERESTS.map(i => chip(i.label, INT_ICON[i.id], S.prefs.interests.includes(i.id), 'togInt', `data-id="${i.id}"`)).join('')}</div></div>
    <div class="fg"><div class="lb">${ic('access', 18)} Hai esigenze di accessibilità?</div><div class="chips">${ACCESS_OPTS.map(i => chip(i.label, i.icon, S.acc.includes(i.id), 'togAcc', `data-id="${i.id}"`)).join('')}</div></div>
    <button class="btn block" data-action="onbDone" style="margin-top:26px;min-height:54px">Entra in Borgo Vivo ${ic('arrow', 18)}</button></div>`;
  el.scrollTop = 0;
}
