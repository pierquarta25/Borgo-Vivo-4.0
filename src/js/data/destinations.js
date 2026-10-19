/* Destinazioni e interessi. Luoghi e testi derivano dalle schede su Matera, Gravina in Puglia e Altamura. */
const DESTINATIONS = {
  matera: {
    id: 'matera', name: 'Matera', region: 'Basilicata', center: [40.6655, 16.6095], zoom: 15,
    tagline: 'Dai Sassi alla Murgia: una città scavata nella roccia',
    intro: 'Patrimonio UNESCO dal 1993 e Capitale europea della cultura 2019. Oltre ai Sassi c’è una Matera preistorica, rupestre, novecentesca e d’arte che quasi nessuno racconta.',
    start: { name: 'Piazza Vittorio Veneto', ll: [40.66664, 16.60641] },
    meal: { title: 'Pausa gastronomica lucana', text: 'pane di Matera, crapiata, peperoni cruschi, cialledda, caseari locali' },
    neighbour: 'gravina'
  },
  gravina: {
    id: 'gravina', name: 'Gravina in Puglia', region: 'Puglia', center: [40.8174, 16.4150], zoom: 15,
    tagline: 'Città d’acqua e di pietra sull’orlo della gravina',
    intro: 'A pochi chilometri da Matera: il canyon, il Ponte Acquedotto, le chiese rupestri, il culto di San Michele e la Fiera di San Giorgio.',
    start: { name: 'Piazza Scacchi', ll: [40.81754, 16.41842] },
    meal: { title: 'Pausa gastronomica murgiana', text: 'pane, Pallone di Gravina, sasanello, vino Gravina DOP' },
    neighbour: 'altamura'
  },
  altamura: {
    id: 'altamura', name: 'Altamura', region: 'Puglia', center: [40.8277, 16.5531], zoom: 15,
    tagline: 'La Leonessa di Puglia, tra Cattedrale federiciana e Murgia',
    intro: 'Dalle mura megalitiche alla Cattedrale di Federico II, dai claustri al Pane DOP: una città di pietra chiara sull’Alta Murgia, con l’Uomo di Altamura e il Pulo a pochi chilometri.',
    start: { name: 'Piazza Duomo', ll: [40.82747, 16.55324] },
    meal: { title: 'Pausa gastronomica murgiana', text: 'Pane di Altamura DOP, lenticchia IGP, focacce, friselle e latticini' },
    neighbour: 'matera'
  }
};
/* Tempo di spostamento in auto tra due città: stima = distanza in linea d'aria × 1,3 a 55 km/h + 8 minuti (non un orario di trasporto) */
function transferMin(a, b) {
  if (a === b) return 0;
  const A = DESTINATIONS[a].center, B = DESTINATIONS[b].center, R = 6371, rad = x => x * Math.PI / 180;
  const dLat = rad(B[0] - A[0]), dLon = rad(B[1] - A[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(A[0])) * Math.cos(rad(B[0])) * Math.sin(dLon / 2) ** 2;
  const km = 2 * R * Math.asin(Math.sqrt(h)) * 1.3;
  return Math.round((km / 55 * 60 + 8) / 5) * 5;
}

const INTERESTS = [
  { id: 'rupestre',    label: 'Civiltà rupestre',        icon: '🕳️' },
  { id: 'archeo',      label: 'Archeologia',             icon: '🏺' },
  { id: 'natura',      label: 'Natura e sentieri',       icon: '🌿' },
  { id: 'arte',        label: 'Arte e musei',            icon: '🖼️' },
  { id: 'novecento',   label: 'Architettura del ’900',   icon: '🏘️' },
  { id: 'panorami',    label: 'Panorami e foto',         icon: '📷' },
  { id: 'cibo',        label: 'Gastronomia',             icon: '🍞' },
  { id: 'artigianato', label: 'Artigianato',             icon: '🏺' },
  { id: 'storia',      label: 'Storia e tradizioni',     icon: '📜' }
];
