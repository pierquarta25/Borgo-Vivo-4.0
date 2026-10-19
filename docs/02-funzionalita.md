# Le 8 funzioni dell'app

Dal documento "App" (specifiche). Per ognuna: cosa fa e **dove sta nel codice**.

| # | Funzione | Cosa fa | Schermata | Codice |
|---|---|---|---|---|
| 1 | Home e portale turistico | Punto unico: scoperta, eventi, orari, parcheggi, luoghi meno noti | Home | `src/js/views/home.js` |
| 2 | AI Planner | Itinerari su misura (interessi, tempo, accessibilità, affluenza) con Piano B e ricalcolo | Planner | `src/js/views/planner.js`, `src/js/engine/engine.js` |
| 3 | Mappa interattiva | Luoghi, servizi, botteghe, guide, eventi; affluenza per ora; alternative alla folla | Mappa | `src/js/views/map.js` |
| 4 | Racconti e identità locale | Storie, tradizioni, memorie, "luoghi del cuore" | Racconti | `src/js/views/stories.js`, `src/js/data/stories.js` |
| 5 | Marketplace | Schede di artigiani, produttori, guide; prenotazione diretta (senza pagamento online) | Esperienze | `src/js/views/market.js`, `src/js/data/operators.js` |
| 6 | Accessibilità | Esigenze nell'itinerario, filtri, alto contrasto, testo grande | Accessibilità | `src/js/views/access.js` |
| 7 | Mobilità e flussi | Affluenza nella giornata, parcheggi, trasporti, alternative alla folla | Mobilità | `src/js/views/mobility.js` |
| 8 | Dati e aggiornamenti | Livello per collegare dati e API territoriali | Dati | `src/js/views/sources.js`, `src/js/data/data-sources.js` |

## Cosa non è definito nelle specifiche
- Pagamenti online e recensioni: non previsti (le prenotazioni dicono "si paga all'operatore").
- Filtri e dettagli di accessibilità: da definire con i gestori dei luoghi.
