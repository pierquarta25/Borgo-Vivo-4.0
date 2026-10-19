/* Eventi annuali (dalle schede) ed esempi ricorrenti */
const EVENTS = [
  { id: 'e1', dest: 'matera', name: 'Festa della Madonna della Bruna', month: 7, day: 2, place: 'm_cat', note: 'Processioni, Cavalcata, carro in cartapesta e rito dello strazzo.' },
  { id: 'e2', dest: 'gravina', name: 'Festa di San Michele (rione Fondovito)', month: 5, day: 8, place: 'g_smg', note: 'Festa di rione e culto di San Michele Arcangelo.' },
  { id: 'e3', dest: 'gravina', name: 'Fiera di San Giorgio', month: 4, day: 20, place: 'g_sca', note: 'Seconda metà di aprile; date e programma da verificare presso il Comune.' },
  { id: 'e4', dest: 'matera', name: 'I Sassi al tramonto (esempio ricorrente)', weekdays: [0, 3, 5, 6], time: '17:30', place: 'm_pas', note: 'Passeggiata guidata – evento dimostrativo.' },
  { id: 'e5', dest: 'gravina', name: 'Visita guidata “città d’acqua e di pietra” (esempio)', weekdays: [0, 6], time: '09:30', place: 'g_sca', note: 'Evento dimostrativo.' }
];
