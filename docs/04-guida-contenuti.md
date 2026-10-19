# Guida: come modificare i contenuti

## Aggiungere un luogo
1. Apri `src/js/data/places.js` e copia una voce di `POIS`. Campi: `id` (unico), `dest` (`matera`/`gravina`), `name`, `kind`, `tags`, `ll` (latitudine, longitudine), `dur` (minuti di visita), `pop` (popolarità 0-100), `hours`, `price`, `access`, `desc`.
2. Orari: `hours: { def: [[H(10,0), H(13,0)]] }`; per un giorno diverso la chiave è il giorno (0=domenica, 1=lunedì…). Un array vuoto = chiuso.
3. `less: true` lo segnala come "meno noto" (viene valorizzato dal planner). `closed: true` = temporaneamente chiuso.

## Aggiungere una foto
1. Metti il file JPG in `assets/images/photos/` con nome = id del luogo (es. `m_vv.jpg`).
2. Aggiungi la voce in `assets/images/photos/credits.json` (file, autore, licenza, pagina, titolo).
3. Esegui `python3 tools/generate-photos.py`: aggiorna `src/js/data/photos.js` e `docs/06-crediti-foto.md`.
Se un luogo non ha foto, l'app disegna un'illustrazione al suo posto.

## Aggiungere un'esperienza (marketplace)
`src/js/data/operators.js`: copia una voce di `OPERATORS`. `days` sono i giorni attivi (0=domenica), `slots` gli orari, `max` i posti.

## Aggiungere un racconto o un evento
`src/js/data/stories.js` (STORIES, HEART_PLACES) e `src/js/data/events.js`. `place` è l'id di un luogo.

## Aggiungere una schermata
1. Crea `src/js/views/nome.js` con `views.nome = () => `...html...`;`
2. Aggiungi lo `<script>` in `index.html` (dopo gli altri `views`).
3. Raggiungila con `#/nome`; per metterla nella barra in basso modifica `TABS` in `core/router.js`.
