/* Destinazioni e interessi. Luoghi e testi derivano dalle schede su Matera e Gravina in Puglia. */
const DESTINATIONS = {
  matera: {
    id: 'matera', name: 'Matera', region: 'Basilicata', center: [40.6655, 16.6095], zoom: 15,
    tagline: 'Dai Sassi alla Murgia: una città scavata nella roccia',
    intro: 'Patrimonio UNESCO dal 1993 e Capitale europea della cultura 2019. Oltre ai Sassi c’è una Matera preistorica, rupestre, novecentesca e d’arte che quasi nessuno racconta.',
    start: { name: 'Piazza Vittorio Veneto', ll: [40.6668, 16.6049] },
    neighbour: 'gravina'
  },
  gravina: {
    id: 'gravina', name: 'Gravina in Puglia', region: 'Puglia', center: [40.8170, 16.4165], zoom: 15,
    tagline: 'Città d’acqua e di pietra sull’orlo della gravina',
    intro: 'A pochi chilometri da Matera: il canyon, il Ponte Acquedotto, le chiese rupestri, il culto di San Michele e la Fiera di San Giorgio.',
    start: { name: 'Piazza Scacchi', ll: [40.8184, 16.4175] },
    neighbour: 'matera'
  }
};
const TRANSFER_MIN = 40;   // spostamento in auto Matera <-> Gravina (circa)

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
