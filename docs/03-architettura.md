# Architettura

App **web statica** in HTML, CSS e JavaScript "vanilla": nessun framework, nessuna build, nessun `npm install`.
Si apre con un semplice server locale (vedi README) e, una volta caricata, **funziona anche offline** (service worker).

## Mappa delle cartelle

```
Borgo-Vivo-4.0/
├── index.html              # unico documento: carica CSS e script nell'ordine giusto
├── manifest.webmanifest    # per "aggiungi alla schermata Home" sul telefono
├── sw.js                   # service worker per l'offline (GENERATO da tools/generate-sw.py)
├── assets/
│   ├── fonts/              #   Fraunces (titoli) e Inter (testo), in locale
│   └── images/
│       ├── logo/           #   logo (SVG, PNG)
│       └── photos/         #   foto dei luoghi + credits.json
├── src/
│   ├── css/                # tokens, base, layout, components, responsive + views/
│   └── js/
│       ├── data/           # CONTENUTI
│       │   ├── destinations.js   città e tempi di spostamento
│       │   ├── places.js         luoghi (POIS) con orari, prezzi, accessibilità
│       │   ├── operators.js      operatori ed esperienze reali
│       │   ├── services.js       parcheggi e stazioni verificati
│       │   ├── stories.js        racconti e luoghi del cuore
│       │   ├── events.js         eventi annuali
│       │   ├── official-stats.js statistiche UFFICIALI (generato)
│       │   ├── data-sources.js   elenco delle fonti
│       │   └── photos.js         foto e crediti (generato)
│       ├── engine/         # LOGICA (affluenza, orari, accessibilità, planner, Piano B)
│       ├── core/           # stato, router, azioni, eventi
│       ├── ui/             # icone, illustrazioni, pezzi riusabili
│       ├── views/          # una schermata per file (home, city, planner, map…)
│       ├── components/     # schede a comparsa, introduzione
│       └── main.js         # avvio + registrazione del service worker
├── vendor/leaflet/         # libreria della mappa (di terzi)
├── docs/                   # documentazione
└── tools/                  # script di servizio (server, foto, statistiche, offline)
```

## Come ragiona il codice (3 livelli)
1. **Dati** (`src/js/data/`): solo costanti, nessuna logica. Cambiare un testo o un orario = modificare qui.
2. **Motore** (`src/js/engine/engine.js`): funzioni che leggono i dati e rispondono a domande
   ("quanta gente c'è (stima)?", "è aperto?", "costruisci un itinerario", "alternative a questo luogo").
3. **Interfaccia** (`views`, `components`, `core`, `ui`): disegna le schermate chiamando il motore.

## Home neutra e pagina città
La **Home** (`#/home`) non dipende dalla città scelta: mostra le tre città e contenuti del territorio. Scegliere una città (carta o selettore in alto)
porta alla **pagina città** (`#/city`). La città scelta (`S.dest`) resta come "contesto" per Planner, Mappa, Racconti, Esperienze e Mobilità, e si cambia dal selettore.

## Come si calcola l'affluenza (stima)
`Eng.crowd(luogo, data, ora)` = popolarità del luogo × profilo orario × giorno della settimana × **stagionalità**.
- La **stagionalità** viene dai dati ufficiali: presenze del mese rispetto al mese di punta, media degli ultimi tre anni (`Eng.seasonFactor`).
- Popolarità, profilo orario e giorno sono ipotesi del modello. L'app le chiama "stima del modello".
Per passare a dati reali (sensori, biglietterie) basta sostituire questa funzione.

## Ordine di caricamento
Gli script sono "classici" (non moduli) e condividono lo stesso spazio globale: l'**ordine in `index.html` conta**.
`data` → `engine` → `core/state` → `ui/helpers` → `views` → `components` → `core/router` → `core/actions` → `core/events` → `main`.
Ogni file in `views/` aggiunge una schermata all'oggetto `views`; il router (`core/router.js`) sceglie quale mostrare dall'indirizzo (`#/planner`).

## Stato e salvataggio
Un solo oggetto `S` (in `core/state.js`): città, ora simulata, itinerario, richieste, preferenze.
Viene salvato nel browser (`localStorage`, chiave `borgovivo40c`). Non esiste un server.

## Dal prototipo al prodotto
| Oggi | Domani |
|---|---|
| Affluenza stimata (stagionalità ufficiale + ipotesi) | API di sensori / celle telefoniche / biglietterie |
| Parcheggi e stazioni: solo esistenza verificata | API comunali dei parcheggi, GTFS dei treni |
| Richieste di prova salvate nel browser | Backend e accordi con gli operatori |
| `Eng.plan()` regole e punteggi | Modello di linguaggio, stessi input e output |
| Orari scritti a mano, con fonte | Cataloghi dei gestori |
| Statistiche scaricate con uno script | Aggiornamento automatico periodico |
