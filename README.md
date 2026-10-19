# Borgo Vivo 4.0

> *Dove il tempo ha un altro ritmo.*
> App web per un turismo intelligente e sostenibile: meno overtourism, più borghi, botteghe e comunità.
> Prototipo su tre città: **Matera**, **Gravina in Puglia** e **Altamura**.

## Avvio rapido

**macOS:** doppio clic su [`tools/start-server.command`](tools/start-server.command) (apre http://localhost:8000).

**Da terminale:**
```bash
cd Borgo-Vivo-4.0
python3 -m http.server 8000
# apri http://localhost:8000
```

**Funziona anche offline**: apri l'app una volta online e poi puoi usarla senza rete (la mappa mostra le zone già viste). Dettagli in [docs/09-offline.md](docs/09-offline.md). Serve `localhost` o `https`: non aprire `index.html` con doppio clic.

## Le 8 funzioni
Home neutra e pagine città · AI Planner con Piano B · Mappa con stima dell'affluenza · Racconti · Esperienze di operatori reali · Accessibilità · Mobilità e flussi con dati ufficiali · Dati e fonti. Dettagli e file: [docs/02-funzionalita.md](docs/02-funzionalita.md).

## Dati: cosa è affidabile
- **Statistiche turistiche ufficiali**: APT Basilicata (Matera) e Regione Puglia (Gravina, Altamura), con fonte e data accanto ai numeri.
- **Orari e prezzi**: da siti ufficiali e schede, da riconfermare; le discrepanze tra fonti sono dichiarate.
- **Parcheggi**: solo quelli la cui esistenza è confermata da almeno due fonti; niente tariffe né posti liberi inventati.
- **Operatori ed esperienze**: reali, con link al sito ufficiale per prenotare.
- **Stime**: affluenza oraria e accessibilità di dettaglio sono stime e vengono etichettate come tali.

Tabella completa: [docs/05-dati-e-affidabilita.md](docs/05-dati-e-affidabilita.md) · fonti: [docs/08-fonti-ufficiali.md](docs/08-fonti-ufficiali.md).

## Struttura
```
index.html            punto d'ingresso
sw.js                 service worker per l'offline (generato)
assets/               font, logo, foto
src/css/              stili (tokens, base, layout, components, views/, responsive)
src/js/data/          contenuti: luoghi, operatori, servizi, racconti, eventi, statistiche ufficiali
src/js/engine/        logica: affluenza (stima), orari, planner, Piano B
src/js/core/          stato, router, azioni, eventi
src/js/ui/            icone, illustrazioni, helper
src/js/views/         una schermata per file
src/js/components/    schede a comparsa, introduzione
vendor/leaflet/       libreria mappa
docs/                 documentazione
tools/                script di servizio
```
Spiegazione completa: [docs/03-architettura.md](docs/03-architettura.md).

## Script (cartella `tools/`)
| Script | A cosa serve |
|---|---|
| `start-server.command` | avvia l'app in locale (macOS) |
| `fetch-official-stats.py` | riscarica le statistiche ufficiali e rigenera `official-stats.js` (serve `pip install pypdf`) |
| `generate-photos.py` | rigenera elenco foto e crediti |
| `generate-sw.py` | rigenera `sw.js` (elenco file offline) — da lanciare dopo ogni modifica ai file |

## Documentazione
1. [Il progetto](docs/01-progetto.md)
2. [Le 8 funzioni](docs/02-funzionalita.md)
3. [Architettura](docs/03-architettura.md)
4. [Guida ai contenuti](docs/04-guida-contenuti.md)
5. [Dati: ufficiali, verificati, stimati](docs/05-dati-e-affidabilita.md)
6. [Crediti fotografici](docs/06-crediti-foto.md)
7. [Design](docs/07-design.md)
8. [Fonti ufficiali e verifiche](docs/08-fonti-ufficiali.md)
9. [Funzionamento offline](docs/09-offline.md)

## Pubblicare online
Il sito è statico: si può pubblicare con GitHub Pages (Impostazioni → Pages → ramo `main`, cartella radice). Su `https` il service worker permette l'uso offline.

## Stato del prototipo
- Contenuti reali e verificabili; nessun backend: i dati dell'utente restano nel browser.
- Le richieste alle esperienze sono solo di prova: per prenotare si usa il sito dell'operatore.
- Prossimi passi: dati di affluenza reali (sensori/biglietterie), API dei parcheggi e dei treni, censimento di botteghe e artigiani di Matera, backend per le prenotazioni.

## Licenze
Codice del progetto: da definire. Foto: Wikimedia Commons (CC BY / CC BY-SA / pubblico dominio), vedi i crediti. Statistiche: dati aperti di APT Basilicata e Regione Puglia. Leaflet: BSD-2. Font Fraunces e Inter: SIL Open Font License.
