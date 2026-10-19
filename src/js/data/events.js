/* Eventi annuali, dalle schede su Matera, Gravina e Altamura (e dal comunicato ufficiale della Polizia Locale di Altamura per Federicus).
   approx = date da verificare ogni anno presso Comune/IAT. rule = data calcolata. Nessun evento ricorrente inventato. */
const EVENTS = [
  { id: 'e1', dest: 'matera', name: 'Festa della Madonna della Bruna', month: 7, day: 2, place: 'm_cat', note: 'Processioni, Cavalcata, carro in cartapesta e rito dello strazzo.' },
  { id: 'e2', dest: 'gravina', name: 'San Michele Piccolo e i balloni (rione Fondovico)', month: 5, day: 8, place: 'g_smg', note: 'Tessuti di casa sospesi da un balcone all’altro sopra la strada. Svolgimento e accesso alla chiesa possono cambiare se il monumento è chiuso.' },
  { id: 'e3', dest: 'gravina', name: 'Fiera di San Giorgio e Corteo storico di Montfort', month: 4, day: 20, approx: true, place: 'g_sca', note: 'In aprile (seconda metà): date e programma da verificare presso il Comune.' },
  { id: 'e4', dest: 'gravina', name: 'San Michele Grande (festa patronale)', month: 9, day: 29, approx: true, place: 'g_cat', note: 'A settembre: il programma cambia ogni anno, fare riferimento all’edizione corrente.' },
  { id: 'e5', dest: 'altamura', name: 'Festa di Sant’Irene', month: 5, day: 5, place: 'a_duomo', note: 'Festa liturgica della patrona della città e della diocesi, con celebrazioni e processione.' },
  { id: 'e6', dest: 'altamura', name: 'Cavalcata della Madonna del Buoncammino', rule: 'sundayAfter', month: 8, day: 15, place: 'a_buon', note: 'Tradizionalmente la domenica dopo l’Assunzione, preceduta dall’asta della bandiera.' },
  { id: 'e7', dest: 'altamura', name: 'Federicus, rievocazione medievale', month: 4, day: 26, approx: true, place: 'a_duomo', note: 'Fine aprile (edizione 2024: 26–28 aprile). Date 2026 da verificare presso il Comune.' }
];
