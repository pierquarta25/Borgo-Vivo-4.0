#!/usr/bin/env python3
"""Scarica le statistiche turistiche UFFICIALI e rigenera src/js/data/official-stats.js.

Fonti
- Matera: APT Basilicata, Area CED – "Movimento clienti del periodo 2025/2019 – Matera" (PDF)
  https://www.aptbasilicata.it/dati-statistici/03.2.05.pdf
- Gravina in Puglia e Altamura: Regione Puglia, Osservatorio sul turismo (sistema SPOT) – open data
  https://dati.puglia.it/ckan/dataset/puglia-movimento-turistico-anno-2025-dettaglio  (e anni 2022-2024)

Uso:   python3 tools/fetch-official-stats.py
Requisiti: python3 e il pacchetto pypdf (pip install pypdf)
"""
import csv, io, json, os, re, sys, urllib.request, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (BorgoVivo40 stats fetcher)'}
APT_URL = 'https://www.aptbasilicata.it/dati-statistici/03.2.05.pdf'
PUGLIA_URL = 'https://osservatorio.dms.puglia.it/opendata/puglia_movimentazione_turistica/{y}/mov_comune.csv'
PUGLIA_YEARS = (2022, 2023, 2024, 2025)
PUGLIA_COMUNI = {'gravina': 'Gravina in Puglia', 'altamura': 'Altamura'}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()


def num(s):
    return int(s.replace('.', ''))


def matera():
    import pypdf
    reader = pypdf.PdfReader(io.BytesIO(get(APT_URL)))
    text = reader.pages[0].extract_text()
    elaborated = (re.search(r'Data elaborazione:\s*([\d/]+)', text) or [None, ''])[1]
    years = {}
    totals = []   # righe dei totali annuali (18 valori, senza anno/mese)
    for line in text.split('\n'):
        m = re.match(r'^(\d{4}) (\d{1,2}) ([\d. ]+)$', line.strip())
        if m:
            y, mo, vals = int(m[1]), int(m[2]), [num(v) for v in m[3].split()]
            d = years.setdefault(y, {'monthsArr': [0] * 12, 'monthsPres': [0] * 12})
            d['monthsArr'][mo - 1], d['monthsPres'][mo - 1] = vals[-2], vals[-1]   # ultime due colonne = totale complessivo
            continue
        vals = line.strip().split()
        if len(vals) == 18 and all(re.match(r'^[\d.]+$', v) for v in vals):
            totals.append([num(v) for v in vals])
    # i totali annuali compaiono dopo ogni blocco (2025, 2024, ... 2019): stessa ordine degli anni
    for y, t in zip(sorted(years, reverse=True), totals):
        d = years[y]
        d['arr'], d['pres'] = t[16], t[17]
        d['arrEst'], d['presEst'] = t[14], t[15]
        assert d['arr'] == sum(d['monthsArr']) and d['pres'] == sum(d['monthsPres']), f'controllo somme fallito per {y}'
    return {
        'provider': 'APT Basilicata – Area CED', 'dataset': 'Movimento clienti, Matera, 2019-2025', 'url': APT_URL,
        'elaborated': elaborated, 'scope': 'Esercizi alberghieri ed extra-alberghieri del comune di Matera',
        'years': {str(y): years[y] for y in sorted(years)}}


def puglia():
    out = {k: {} for k in PUGLIA_COMUNI}
    for y in PUGLIA_YEARS:
        rows = csv.DictReader(io.StringIO(get(PUGLIA_URL.format(y=y)).decode('utf-8')))
        acc = {k: {'monthsArr': [0] * 12, 'monthsPres': [0] * 12, 'arrEst': 0, 'presEst': 0} for k in PUGLIA_COMUNI}
        for r in rows:
            for k, name in PUGLIA_COMUNI.items():
                if r['comune'] == name:
                    mo, a, p = int(r['mese']) - 1, int(r['arrivi']), int(r['presenze'])
                    acc[k]['monthsArr'][mo] += a
                    acc[k]['monthsPres'][mo] += p
                    if r['tipo_provenienza'].lower().startswith('estera'):
                        acc[k]['arrEst'] += a
                        acc[k]['presEst'] += p
        for k in PUGLIA_COMUNI:
            d = acc[k]
            d['arr'], d['pres'] = sum(d['monthsArr']), sum(d['monthsPres'])
            out[k][str(y)] = d
        print(f'  Puglia {y}: ok', file=sys.stderr)
    meta = {'provider': 'Regione Puglia – Osservatorio sul turismo (SPOT)', 'url': 'https://dati.puglia.it/ckan/dataset/puglia-movimento-turistico-anno-2025-dettaglio',
            'elaborated': datetime.date.today().strftime('%d/%m/%Y') + ' (scaricato)',
            'scope': 'Strutture ricettive che trasmettono i dati al sistema SPOT della Regione Puglia'}
    return {k: dict(meta, dataset=f'Movimento turistico per comune, {PUGLIA_COMUNI[k]}, 2022-2025', years=v) for k, v in out.items()}


if __name__ == '__main__':
    print('Matera (APT Basilicata)…', file=sys.stderr)
    cities = {'matera': matera()}
    print('Gravina e Altamura (Regione Puglia)…', file=sys.stderr)
    cities.update(puglia())
    path = os.path.join(ROOT, 'src/js/data/official-stats.js')
    with open(path, 'w') as f:
        f.write('/* GENERATO da tools/fetch-official-stats.py — non modificare a mano.\n'
                '   Statistiche turistiche UFFICIALI (arrivi = clienti arrivati, presenze = notti trascorse). */\n')
        f.write('const OFFICIAL_STATS = ' + json.dumps(cities, ensure_ascii=False, indent=1) + ';\n')
    for k, c in cities.items():
        ys = sorted(c['years'])
        last = c['years'][ys[-1]]
        print(f"{k}: anni {ys[0]}-{ys[-1]}, {ys[-1]}: arrivi {last['arr']:,}, presenze {last['pres']:,}".replace(',', '.'))
