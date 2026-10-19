# Borgo Vivo 4.0

> *Dove il tempo ha un altro ritmo.*
> App web per un turismo intelligente e sostenibile: meno overtourism, più borghi, botteghe e comunità.
> Prototipo con contenuti su **Matera** e **Gravina in Puglia**.

## Avvio rapido

**macOS:** doppio clic su [`tools/start-server.command`](tools/start-server.command) (apre http://localhost:8000).

**Da terminale:**
```bash
cd Borgo-Vivo-4.0
python3 -m http.server 8000
# apri http://localhost:8000
```
Serve connessione solo per le tile della mappa (OpenStreetMap). Il resto funziona offline.

> Aprire `index.html` con doppio clic funziona quasi tutto, ma meglio usare il server.

## Le 8 funzioni
Home · AI Planner con Piano B · Mappa con affluenza · Racconti · Esperienze prenotabili · Accessibilità · Mobilità e flussi · Dati e API. Dettagli e file: [docs/02-funzionalita.md](docs/02-funzionalita.md).

## Struttura
```
index.html            punto d'ingresso
assets/               font, logo, foto
src/css/              stili (tokens, base, layout, components, views/, responsive)
src/js/data/          contenuti: luoghi, operatori, racconti, eventi, servizi
src/js/engine/        logica: affluenza, orari, planner, Piano B
src/js/core/          stato, router, azioni, eventi
src/js/ui/            icone, illustrazioni, helper
src/js/views/         una schermata per file
src/js/components/    schede a comparsa, introduzione
vendor/leaflet/       libreria mappa
docs/                 documentazione
tools/                script di servizio
```
Spiegazione completa: [docs/03-architettura.md](docs/03-architettura.md).

## Documentazione
1. [Il progetto](docs/01-progetto.md)
2. [Le 8 funzioni](docs/02-funzionalita.md)
3. [Architettura](docs/03-architettura.md)
4. [Guida ai contenuti](docs/04-guida-contenuti.md) (aggiungere luoghi, foto, esperienze)
5. [Dati reali e dimostrativi](docs/05-dati-dimostrativi.md)
6. [Crediti fotografici](docs/06-crediti-foto.md)
7. [Design](docs/07-design.md)

## Stato del prototipo
- Contenuti reali dalle schede; **affluenza, parcheggi, trasporti, operatori e prenotazioni sono dimostrativi**.
- Nessun backend: i dati dell'utente restano nel browser.
- Prossimi passi: collegare API reali (affluenza, mobilità), backend per le prenotazioni, test con operatori e comuni pilota.

## Licenze
Codice del progetto: da definire. Foto: Wikimedia Commons (CC BY / CC BY-SA / pubblico dominio), vedi i crediti. Leaflet: licenza BSD-2. Font Fraunces e Inter: SIL Open Font License.
