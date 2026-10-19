# Design

**Identità "pietra e luce"**: i toni del tufo di Matera, la terracotta e il blu notte del canyon.

## Colori (`src/css/tokens.css`)
| Uso | Valore |
|---|---|
| Sfondo | `#F5EFE4` (tufo) |
| Superficie | `#FFFDF8` |
| Testo | `#211B16` |
| Marchio / azioni | `#B4492A` (terracotta) |
| Notte | `#1F2A36` |
| Accento | `#C8993F` (oro) · `#5E6E3B` (oliva) |
| Affluenza | basso `#4C8A3A` · medio `#C98A14` · alto `#BF3A2B` |

Temi: chiaro (default), scuro, alto contrasto, testo grande (dalla schermata Accessibilità).

## Tipografia
- Titoli: **Fraunces** (serif)
- Testo: **Inter**
- Font in `assets/fonts/` (nessuna chiamata a servizi esterni).

## Logo (`assets/images/logo/`)
Un arco (l'ingresso di una casa-grotta dei Sassi) con il sole che sorge su strati di roccia.
`bv-mark.svg` simbolo a colori · `bv-lockup.svg` simbolo + scritta · `bv-mark-white.svg` / `bv-mark-dark.svg` a un colore · `icon-*.png` icone app.
Nella scritta il testo non è convertito in tracciati: per la stampa farlo in un programma di grafica.

## Icone e illustrazioni
- `src/js/ui/icons.js`: set di icone SVG disegnate per il progetto.
- `src/js/ui/art.js`: paesaggi stilizzati generati in codice, usati quando manca una foto.

## Linee guida seguite (turismo)
Decidere in 5 secondi · prima il pratico, poi la storia · meno folla · il viaggio come giornata · prenotare in pochi tocchi · lingua e accessibilità sempre a portata · pulsanti ≥ 44 px · contrasti alti per leggere al sole.
Le schermate-proposta sono nella tela di design "Borgo Vivo 4.0 – interfaccia turistica" (Claude, link privato).
