# Dati: cosa è ufficiale, verificato, stimato

L'app distingue con etichette chiare l'affidabilità di ogni informazione.

| Tipo | Che cosa | Come lo trattiamo |
|---|---|---|
| **Ufficiale** | Statistiche turistiche (arrivi e presenze) | Scaricate da APT Basilicata (Matera) e Regione Puglia (Gravina, Altamura) con `tools/fetch-official-stats.py`; fonte, dataset e data di elaborazione sono mostrati accanto ai numeri |
| **Ufficiale, da riconfermare** | Orari, prezzi, accessi dei luoghi | Da siti dei gestori, Ministero della Cultura, Comuni e schede di progetto; dove le fonti discordano lo diciamo (es. Fondazione Santomasi, Lamalunga) |
| **Verificato** | Esistenza e posizione di parcheggi e stazioni | Almeno due fonti indipendenti (OpenStreetMap, Wikipedia, Telepass, Polizia Locale…); nessuna tariffa, orario o disponibilità se non pubblicati |
| **Verificato** | Coordinate dei luoghi | OpenStreetMap / Wikipedia; 5 luoghi sono "approssimati" e segnalati |
| **Stima del modello** | Affluenza giornaliera e oraria | Stagionalità dai dati ufficiali; profilo orario e settimanale ipotizzati |
| **Stima** | Accessibilità di dettaglio | Valutazione prudenziale, da verificare con il gestore (solo la Cattedrale di Altamura è confermata ufficialmente) |
| **Stima** | Tempo di spostamento tra città | Distanza stradale stimata, non orari di trasporto |
| **Reali, da riconfermare** | Operatori ed esperienze | Pubblicati online (documento di progetto e siti ufficiali); i prezzi sono quelli visualizzati nella data di consultazione |
| **Esempi** | "Luoghi del cuore" iniziali | Testi dimostrativi, segnalati come tali |
| **Simulate** | Richieste di prenotazione | Salvate solo sul dispositivo, mai inviate all'operatore |

## Cosa NON c'è (volutamente)
- Posti liberi dei parcheggi in tempo reale, tariffe dei parcheggi, orari di navette e treni: non esistono fonti aperte e verificabili; sono stati rimossi invece di inventarli.
- Numeri di visitatori per singolo luogo o per ora: non esistono dati ufficiali a quel livello.
- Botteghe e artigiani di Matera: il documento di progetto non li censisce; vanno raccolti con il Comune e gli operatori.
