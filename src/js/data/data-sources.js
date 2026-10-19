/* Fonti dati territoriali (simulate): qui si collegheranno le API reali */
const DATA_SOURCES = [
  { id: 'ds1', name: 'Orari e aperture dei luoghi', kind: 'Cataloghi dei gestori (MiC, musei, Parco)', mode: 'Dati reali dalle schede', live: false, every: '— (curato)' },
  { id: 'ds2', name: 'Affluenza', kind: 'Sensori / celle telefoniche / biglietterie', mode: 'Stima simulata', live: false, every: 'ogni 15 min' },
  { id: 'ds3', name: 'Parcheggi', kind: 'API comunali dei parcheggi', mode: 'Simulato', live: false, every: 'ogni 5 min' },
  { id: 'ds4', name: 'Trasporti', kind: 'GTFS / orari FAL e bus', mode: 'Simulato', live: false, every: 'ogni 5 min' },
  { id: 'ds5', name: 'Eventi', kind: 'Calendario comunale / Regione', mode: 'Annuali dalle schede + esempi', live: false, every: 'giornaliero' },
  { id: 'ds6', name: 'Prenotazioni operatori', kind: 'Gestionale degli operatori', mode: 'Salvate solo su questo dispositivo', live: false, every: 'in tempo reale' }
];
