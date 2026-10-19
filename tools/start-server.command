#!/bin/bash
# Doppio clic su macOS: avvia l'app su http://localhost:8000 e la apre nel browser.
cd "$(dirname "$0")/.." || exit 1
echo "Borgo Vivo 4.0 → http://localhost:8000   (Ctrl+C per fermare)"
(sleep 1 && open "http://localhost:8000") &
python3 -m http.server 8000
