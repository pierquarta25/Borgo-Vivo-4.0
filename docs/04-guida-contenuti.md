# Guida: come modificare i contenuti

## Aggiungere un luogo
1. Apri `src/js/data/places.js` e copia una voce di `POIS`. Campi principali: `id` (unico), `dest`, `name`, `kind`, `tags`, `ll` (latitudine, longitudine), `dur` (minuti di visita), `pop` (popolarità 0-100), `hours`, `price`, `access`, `desc`.
2. **Coordinate**: prendile da una fonte verificabile (OpenStreetMap/Wikipedia). Se sono approssimate aggiungi `approx: true`.
3. **Orari**: `hours: { def: [[H(10,0), H(13,0)]] }`; un giorno diverso ha come chiave il numero del giorno (0=domenica); un array vuoto = chiuso. Se gli orari non sono verificati: `hoursUnknown: true` (l'app lo segnala).
4. **Prezzo**: numero (0 = gratuito) oppure `null` se non pubblicato; `priceNote` per le precisazioni.
5. **Accessibilità**: `access` = `full` / `partial` / `none`. Se è una stima (default) l'app lo dice; se è confermata da una fonte ufficiale aggiungi `accVerified: true`.
6. `less: true` = "meno noto" (lo valorizza il planner). `closed: true` = temporaneamente chiuso.

## Aggiungere una città
1. `destinations.js`: nuova voce in `DESTINATIONS` (`center`, `start`, `neighbour`…). I tempi tra città sono calcolati da `transferMin`.
2. `state.js`: `EYEBROW` e almeno un percorso in `PRESETS`.
3. Foto di copertina `hero_<id>` (vedi sotto) e statistiche: aggiungi il comune in `tools/fetch-official-stats.py`.

## Aggiungere una foto
1. Metti il file JPG in `assets/images/photos/` con nome = id del luogo (es. `m_vv.jpg`).
2. Aggiungi la voce in `assets/images/photos/credits.json` (file, autore, licenza, pagina, titolo).
3. `python3 tools/generate-photos.py` aggiorna `src/js/data/photos.js` e `docs/06-crediti-foto.md`.
4. `python3 tools/generate-sw.py` per includerla nell'offline.
Senza foto l'app disegna un'illustrazione.

## Aggiungere un'esperienza (marketplace)
`src/js/data/operators.js`: copia una voce. Inserisci **solo operatori reali** con sito ufficiale (`url`), `how` (come si prenota davvero) e il prezzo **solo se pubblicato** (altrimenti `null`). `photo` = id di una foto; `at` = id del luogo per metterla sulla mappa.

## Aggiungere un parcheggio
`src/js/data/services.js`: solo se l'esistenza è confermata da **almeno due fonti indipendenti** (elencale in `sources`). Non inserire tariffe, orari o posti liberi se non sono pubblicati da una fonte ufficiale.

## Aggiornare le statistiche ufficiali
`python3 tools/fetch-official-stats.py` (serve `pip install pypdf`): riscarica APT Basilicata e Regione Puglia e rigenera `src/js/data/official-stats.js`.

## Racconti ed eventi
`src/js/data/stories.js` e `src/js/data/events.js`. `place` è l'id di un luogo. Negli eventi `approx: true` = date da verificare ogni anno.

## Aggiungere una schermata
1. Crea `src/js/views/nome.js` con `views.nome = () => ...html...;`
2. Aggiungi lo `<script>` in `index.html` (dopo gli altri `views`).
3. Raggiungila con `#/nome`; per metterla nella barra in basso modifica `TABS` in `core/router.js`.

## Dopo ogni modifica
Se hai aggiunto o cambiato file: `python3 tools/generate-sw.py` (aggiorna l'elenco offline).
