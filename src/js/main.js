/* Avvio dell'app */
applyDisplay(); render();
if (!S.onboarded) onboarding();

/* Offline: service worker (sw.js) + segnalazione dello stato di rete */
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
function netState() {
  const off = !navigator.onLine;
  document.body.classList.toggle('offline', off);
  const p = $('.offline-pill'); if (p) p.hidden = !off;
}
window.addEventListener('offline', () => { netState(); toast('Sei offline: l’app continua a funzionare con i dati salvati'); });
window.addEventListener('online', () => { netState(); toast('Di nuovo online'); });
netState();
