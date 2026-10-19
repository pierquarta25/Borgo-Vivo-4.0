# Funzionamento offline

L'app usa un **service worker** (`sw.js`): alla prima visita salva sul dispositivo pagine, codice, font, logo e foto (circa 12 MB). Dopo, funziona anche senza rete.

## Cosa funziona offline
- Tutte le schermate: Home, città, Planner (con Piano B e ricalcolo), Racconti, Esperienze (schede e richieste di prova), Accessibilità, Mobilità, statistiche ufficiali, crediti.
- Itinerario e preferenze (salvati sul dispositivo).
- La **mappa**: le zone e i livelli già guardati restano visibili (fino a 600 tasselli salvati man mano). Nelle zone mai viste lo sfondo è vuoto, ma luoghi e percorso si vedono. Un avviso lo spiega.

## Cosa richiede la rete
- Prima visita (per scaricare l'app) e primi tasselli della mappa.
- Link ai siti ufficiali degli operatori e indicazioni stradali.
- Riconfermare orari e prezzi.

## Limiti
- Funziona su `http://localhost` e su `https` (per esempio GitHub Pages), **non** aprendo `index.html` con doppio clic (`file://`): i browser non permettono i service worker.
- Per rispetto della politica d'uso di OpenStreetMap non scarichiamo in blocco le mappe: salviamo solo ciò che l'utente guarda.

## Come provarlo
1. Avvia l'app (`tools/start-server.command`) e aprila una volta online.
2. Nel browser: *Strumenti sviluppatore → Rete → Offline* (oppure disattiva il Wi‑Fi) e ricarica.
3. In *Applicazione → Service Workers* si vede lo stato; *Cache storage* mostra cosa è salvato.

## Dopo aver cambiato file
`python3 tools/generate-sw.py` aggiorna l'elenco dei file offline e la versione. Il codice dell'app viene letto prima dalla rete (così in sviluppo vedi subito le modifiche) e dalla copia salvata solo se sei offline.
