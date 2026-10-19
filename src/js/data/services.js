/* Servizi di mobilità (DIMOSTRATIVI) */
const PARKINGS = [
  { id: 'pk_m1', dest: 'matera', name: 'Parcheggio Piazza Matteotti', ll: [40.6667, 16.6019], cap: 220, price: '€1,50/h', walk: 8 },
  { id: 'pk_m2', dest: 'matera', name: 'Parcheggio di interscambio Nord', ll: [40.6718, 16.6030], cap: 400, price: '€6/giorno', walk: 18, shuttle: true },
  { id: 'pk_m3', dest: 'matera', name: 'Parcheggio Murgia Timone', ll: [40.6588, 16.6255], cap: 80, price: 'incluso nel biglietto Parco', walk: 5 },
  { id: 'pk_g1', dest: 'gravina', name: 'Parcheggio Ponte Acquedotto', ll: [40.8118, 16.4170], cap: 120, price: 'gratuito', walk: 5 },
  { id: 'pk_g2', dest: 'gravina', name: 'Parcheggio Centro Storico', ll: [40.8203, 16.4190], cap: 150, price: '€1/h', walk: 6 }
];
const TRANSIT = [
  { id: 'tr_m1', dest: 'matera', name: 'Stazione Matera Centrale (FAL)', ll: [40.6679, 16.5962], note: 'Collegamenti con Bari; a piedi o con navetta urbana verso i Sassi.' },
  { id: 'tr_m2', dest: 'matera', name: 'Navetta Sassi (dimostrativa)', ll: [40.6661, 16.6032], note: 'Dalla piazza Matteotti ai belvedere, ogni 20 minuti.' },
  { id: 'tr_g1', dest: 'gravina', name: 'Stazione di Gravina in Puglia (FAL)', ll: [40.8186, 16.4291], note: 'Collegamenti ferroviari regionali; in centro a piedi in circa 12 minuti.' },
  { id: 'tr_x', dest: 'gravina', name: 'Corse Matera ⇄ Gravina (dimostrative)', ll: [40.8196, 16.4265], note: 'Collegamento di bus extraurbano, circa 40 minuti. Orari da integrare via API.' }
];
