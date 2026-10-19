# Architettura

App **web statica** in HTML, CSS e JavaScript "vanilla": nessun framework, nessuna build, nessun `npm install`.
Si apre con un semplice server locale (vedi README).

## Mappa delle cartelle

```
Borgo-Vivo-4.0/
├── index.html              # unico documento: carica CSS e script nell'ordine giusto
├── manifest.webmanifest    # per "aggiungi alla schermata Home" sul telefono
├── assets/                 # file statici
│   ├── fonts/              #   Fraunces (titoli) e Inter (testo), in locale
│   └── images/
│       ├── logo/           #   logo (SVG, PNG)
│       └── photos/         #   foto dei luoghi + credits.json
├── src/
│   ├── css/                # stili
│   │   ├── tokens.css      #   colori, font, ombre, temi (chiaro/scuro/alto contrasto)
│   │   ├── base.css        #   reset e tipografia
│   │   ├── layout.css      #   header, barra di navigazione, contenitore
│   │   ├── components.css  #   bottoni, chip, card, form, schede a comparsa
│   │   ├── responsive.css  #   layout desktop
│   │   └── views/          #   stili specifici di ogni schermata
│   └── js/
│       ├── data/           # CONTENUTI (luoghi, operatori, racconti, eventi, servizi, foto)
│       ├── engine/         # LOGICA (affluenza, orari, accessibilità, planner, Piano B)
│       ├── core/           # stato, router, azioni, eventi
│       ├── ui/             # icone, illustrazioni, piccoli pezzi riusabili
│       ├── views/          # una schermata per file
│       ├── components/     # schede a comparsa, introduzione
│       └── main.js         # avvio
├── vendor/leaflet/         # libreria della mappa (di terzi)
├── docs/                   # documentazione
└── tools/                  # script di servizio
```

## Come ragiona il codice (3 livelli)
1. **Dati** (`src/js/data/`): solo costanti, nessuna logica. Cambiare un testo o un orario = modificare qui.
2. **Motore** (`src/js/engine/engine.js`): funzioni pure che leggono i dati e rispondono a domande
   ("quanta gente c'è?", "è aperto?", "costruisci un itinerario", "alternative a questo luogo").
3. **Interfaccia** (`views`, `components`, `core`, `ui`): disegna le schermate chiamando il motore.

## Ordine di caricamento
Gli script sono "classici" (non moduli) e condividono lo stesso spazio globale: l'**ordine in `index.html` conta**.
`data` → `engine` → `core/state` → `ui/helpers` → `views` → `components` → `core/router` → `core/actions` → `core/events` → `main`.
Ogni file in `views/` aggiunge una schermata all'oggetto `views`; il router (`core/router.js`) sceglie quale mostrare dall'indirizzo (`#/planner`).

## Stato e salvataggio
Un solo oggetto `S` (in `core/state.js`): destinazione, ora simulata, itinerario, prenotazioni, preferenze.
Viene salvato nel browser (`localStorage`, chiave `borgovivo40b`). Non esiste un server.

## Dal prototipo al prodotto
| Oggi (simulato) | Domani |
|---|---|
| `Eng.crowd()` stima l'affluenza con una formula | API di sensori / celle telefoniche / biglietterie |
| Parcheggi e trasporti in `data/services.js` | API comunali, GTFS |
| Prenotazioni salvate nel browser | Backend + gestionale degli operatori |
| `Eng.plan()` regole e punteggi | Modello di linguaggio, stessi input e output |
| Orari scritti a mano in `data/places.js` | Cataloghi dei gestori |
