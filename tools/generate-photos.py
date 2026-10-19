#!/usr/bin/env python3
"""Rigenera src/js/data/photos.js e docs/06-crediti-foto.md a partire da
assets/images/photos/credits.json. Da lanciare dopo aver aggiunto o cambiato una foto.

Uso:  python3 tools/generate-photos.py
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
credits = json.load(open(os.path.join(ROOT, 'assets/images/photos/credits.json')))

fields = ('file', 'author', 'lic', 'page', 'title')
photos = {k: {f: v[f] for f in fields} for k, v in credits.items()}
with open(os.path.join(ROOT, 'src/js/data/photos.js'), 'w') as f:
    f.write('/* GENERATO da tools/generate-photos.py: non modificare a mano.\n'
            '   Foto da Wikimedia Commons con licenza libera: autore e licenza vanno sempre mostrati. */\n')
    f.write('const PHOTOS = ' + json.dumps(photos, ensure_ascii=False, indent=1) + ';\n')

seen, rows = set(), []
for k, v in credits.items():
    if v['file'] in seen: continue
    seen.add(v['file'])
    rows.append(f"| `{k}` | `{v['file']}` | {v['author']} | [{v['lic']}]({v['page']}) |")
with open(os.path.join(ROOT, 'docs/06-crediti-foto.md'), 'w') as f:
    f.write('# Crediti fotografici\n\nTutte le foto vengono da [Wikimedia Commons](https://commons.wikimedia.org) con licenza libera.\n'
            'Le licenze CC BY e CC BY-SA richiedono di citare l\'autore (l\'app lo fa); con CC BY-SA, se si modifica una foto va ripubblicata con la stessa licenza.\n\n'
            'Generato da `tools/generate-photos.py`. Le chiavi (`m_vv`, `g_pon`, `o1`…) sono gli id di luoghi, operatori e copertine in `src/js/data/`.\n\n'
            '| Id | File | Autore | Licenza |\n|---|---|---|---|\n' + '\n'.join(rows) + '\n')
print(f'{len(photos)} foto collegate, {len(rows)} file unici')
