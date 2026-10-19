/* Fonti dati: cosa è ufficiale, cosa è verificato, cosa è ancora simulato. Qui si collegheranno le API reali. */
const DATA_SOURCES = [
  { id: 'ds1', name: 'Statistiche turistiche (arrivi e presenze)', kind: 'APT Basilicata (Matera) · Regione Puglia, Osservatorio sul turismo (Gravina, Altamura)', mode: 'Dati ufficiali', official: true, every: 'annuale/mensile',
    url: 'https://www.aptbasilicata.it/dati-statistici/03.2.05.pdf' },
  { id: 'ds2', name: 'Orari, prezzi e accessi dei luoghi', kind: 'Siti dei gestori, Ministero della Cultura, Comuni, schede del progetto', mode: 'Da fonti ufficiali, da riconfermare', official: true, every: 'curato a mano' },
  { id: 'ds3', name: 'Parcheggi', kind: 'Esistenza verificata con almeno due fonti (OpenStreetMap, Telepass, Comune/Polizia Locale)', mode: 'Verificato · senza dati in tempo reale', official: false, every: 'curato a mano' },
  { id: 'ds4', name: 'Trasporti', kind: 'Stazioni FAL/RFI (OpenStreetMap, Wikipedia)', mode: 'Solo ubicazione, senza orari', official: false, every: 'curato a mano' },
  { id: 'ds5', name: 'Affluenza giornaliera e oraria', kind: 'Modello: stagionalità dai dati ufficiali, profilo orario ipotizzato', mode: 'Stima del modello', official: false, every: 'ricalcolata sul momento' },
  { id: 'ds6', name: 'Prenotazioni', kind: 'Gestionali degli operatori (da collegare)', mode: 'Simulate, solo su questo dispositivo', official: false, every: 'in tempo reale (futuro)' }
];
