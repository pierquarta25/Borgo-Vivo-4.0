/* Mobilità: SOLO elementi la cui esistenza è verificata (almeno due fonti indipendenti).
   Nessun dato su disponibilità in tempo reale, tariffe o orari delle navette: non sono pubblici/verificati,
   quindi l'app non li mostra e rimanda al gestore.
   Campi: sources = fonti dell'esistenza · cap = posti (solo se le fonti concordano) · approx = posizione indicativa. */
const PARKINGS = [
  { id: 'pk_m1', dest: 'matera', name: 'Parcheggio di Via Pasquale Vena', ll: [40.66284, 16.60806], cap: 'circa 350', operator: 'Comune di Matera', kind: 'Multipiano',
    note: 'Fonti con numeri leggermente diversi (340–354 posti).',
    sources: ['OpenStreetMap', 'Telepass', 'Sicurauto'] },
  { id: 'pk_m2', dest: 'matera', name: 'Parcheggio sotterraneo di Piazza Cesare Firrao', ll: [40.66913, 16.60538], cap: '146', operator: 'S.I.S.A.S. Service', kind: 'Sotterraneo',
    sources: ['OpenStreetMap', 'Telepass', 'Sicurauto'] },
  { id: 'pk_m3', dest: 'matera', name: 'Parcheggio Sant’Isidoro (Via Lanera)', ll: [40.66239, 16.60467], kind: 'Multipiano',
    sources: ['OpenStreetMap', 'Fleet Magazine'] },
  { id: 'pk_m4', dest: 'matera', name: 'Parcheggio di Via Saragat (auto e camper)', ll: [40.66652, 16.59675], kind: 'Multipiano',
    sources: ['OpenStreetMap', 'Fleet Magazine'] },
  { id: 'pk_a1', dest: 'altamura', name: 'Parcheggio coperto di Via V. Russo', ll: null, kind: 'Coperto',
    note: 'Esistenza confermata da fonti ufficiali; la nota non riporta le coordinate, quindi non è sulla mappa.',
    sources: ['Polizia Locale di Altamura (comunicato 22/04/2024)', 'ParkingMyCar'] }
];
/* Stazioni ferroviarie (esistenza verificata su OpenStreetMap e Wikipedia). Gli orari dei treni non sono inclusi. */
const TRANSIT = [
  { id: 'tr_m1', dest: 'matera', name: 'Stazione Matera Centrale (FAL)', ll: [40.6665, 16.6013], note: 'Ferrovie Appulo Lucane. Orari e collegamenti: sito FAL.' },
  { id: 'tr_g1', dest: 'gravina', name: 'Stazione di Gravina in Puglia (FAL)', ll: [40.82594, 16.41804], note: 'Ferrovie Appulo Lucane, linea Bari–Matera. Orari: sito FAL.' },
  { id: 'tr_a1', dest: 'altamura', name: 'Stazione di Altamura (FAL e RFI)', ll: [40.8382, 16.5518], note: 'Linea FAL Bari–Matera e linea RFI. Orari: siti dei gestori.' }
];
