# Le 8 funzioni dell'app

Dal documento "App" (specifiche). Per ognuna: cosa fa e **dove sta nel codice**.

| # | Funzione | Cosa fa | Schermata | Codice |
|---|---|---|---|---|
| 1 | Home e portale turistico | Punto di partenza **neutro** sul territorio: tre città, percorsi, luoghi meno noti, statistiche ufficiali, eventi. Ogni città ha la sua pagina | Home, Città | `src/js/views/home.js`, `src/js/views/city.js` |
| 2 | AI Planner | Itinerari su misura (interessi, tempo, accessibilità, affluenza) con Piano B e ricalcolo; percorsi pronti dalle schede | Planner | `src/js/views/planner.js`, `src/js/engine/engine.js` |
| 3 | Mappa interattiva | Luoghi, servizi, esperienze, eventi; stima dell'affluenza per ora; alternative alla folla; funziona offline per le zone già viste | Mappa | `src/js/views/map.js` |
| 4 | Racconti e identità locale | Storie, tradizioni, memorie, "luoghi del cuore" | Racconti | `src/js/views/stories.js`, `src/js/data/stories.js` |
| 5 | Marketplace | Operatori reali di Gravina e Altamura e visite ufficiali di Matera, con link al sito per prenotare; richieste di prova salvate sul dispositivo | Esperienze | `src/js/views/market.js`, `src/js/data/operators.js` |
| 6 | Accessibilità | Esigenze nell'itinerario, filtri, alto contrasto, testo grande | Accessibilità | `src/js/views/access.js` |
| 7 | Mobilità e flussi | Statistiche ufficiali, stagionalità, stima oraria, alternative alla folla, parcheggi e stazioni verificati | Mobilità | `src/js/views/mobility.js` |
| 8 | Dati e aggiornamenti | Da dove arrivano i dati e quanto sono affidabili; script per aggiornarli | Dati | `src/js/views/sources.js`, `src/js/data/data-sources.js` |

Trasversale: **funzionamento offline** ([09-offline.md](09-offline.md)).

## Cosa non è definito nelle specifiche
- Pagamenti online e recensioni: non previsti (la piattaforma rimanda al sito dell'operatore).
- Filtri e dettagli di accessibilità: da definire con i gestori dei luoghi. Oggi sono stime prudenziali, segnalate come tali.
