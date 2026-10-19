/* Racconti (da schede) e luoghi del cuore (ESEMPI) */
const STORIES = [
  { id: 's1', dest: 'matera', cat: 'storia', title: 'I Sassi: una città che segue la roccia', place: 'm_pas',
    text: 'Il Sasso Barisano e il Sasso Caveoso sono due grandi rioni separati e uniti da percorsi che seguono il pendio; tra loro si alza la Civita, il nucleo più antico, dove sorge la Cattedrale. Case ricavate in grotte, ampliate scavando e completate con facciate in muratura: nei Sassi una strada può essere il tetto della casa sottostante. La città non nasce da un disegno geometrico, ma dalla gravità della roccia, dai percorsi e dalle risorse idriche.' },
  { id: 's2', dest: 'matera', cat: 'storia', title: 'Palombaro Lungo: la città che raccoglieva l’acqua', place: 'm_pal',
    text: 'In un territorio carsico l’acqua si doveva intercettare, filtrare e custodire. Cisterne, canalizzazioni e pozzi facevano parte dell’infrastruttura urbana, e il Palombaro Lungo, sotto la piazza principale, ne rende visibile l’ingegno: la città storica era anche una macchina per conservare l’acqua piovana.' },
  { id: 's3', dest: 'matera', cat: 'memoria', title: 'Dallo sfollamento ai nuovi quartieri', place: 'm_lan',
    text: 'Con la legge del 1952 si avviò il risanamento dei Sassi e il trasferimento degli abitanti. Non fu solo edilizia: significò separare molte famiglie dai luoghi in cui avevano costruito reti di solidarietà. Quartieri come Spine Bianche, Serra Venerdì e Lanera, e il borgo La Martella, sono il tentativo di ricostruire il senso di vicinato. Per le testimonianze degli abitanti vale la pena cercare gli archivi del Museo Virtuale della Memoria Collettiva.' },
  { id: 's4', dest: 'matera', cat: 'tradizione', title: 'La Festa della Madonna della Bruna', place: 'm_cat',
    text: 'Il 2 luglio Matera celebra la sua patrona con processioni, la Cavalcata e il grande carro in cartapesta. Il momento più sentito è il rito collettivo dello “strazzo”: il carro viene fatto a pezzi e i frammenti si contendono come segno di devozione e appartenenza.' },
  { id: 's5', dest: 'matera', cat: 'tradizione', title: 'Pane di Matera IGP e crapiata', place: 'm_sed',
    text: 'Grani locali, lievito madre e forme riconoscibili: il Pane di Matera è un sapere alimentare che racconta una cultura contadina. Accanto al pane, la crapiata (zuppa di legumi e cereali), i peperoni cruschi, la cialledda e i prodotti caseari compongono una pausa lucana autentica.' },
  { id: 's6', dest: 'matera', cat: 'storia', title: 'Chiese rupestri: non solo “grotte con affreschi”', place: 'm_idr',
    text: 'Le chiese rupestri hanno navate, absidi, pilastri, sedili e altari modellati nella roccia. Il Parco della Murgia Materana ne censisce circa 150, dall’alto Medioevo all’Ottocento: non tutte uguali né esclusivamente “bizantine”, ma frutto di comunità e pratiche religiose diverse.' },
  { id: 's7', dest: 'matera', cat: 'storia', title: 'Murgia Timone: Matera prima dei Sassi', place: 'm_tim',
    text: 'Il territorio materano è frequentato fin dalla preistoria. Al villaggio neolitico di Murgia Timone si leggono ancora sistemi difensivi e una cisterna: la dimostrazione che le grotte non furono semplici rifugi, ma parte di sistemi abitativi, produttivi e rituali sempre più complessi.' },
  { id: 's8', dest: 'matera', cat: 'memoria', title: 'La Cripta del Peccato Originale', place: 'm_cripta',
    text: 'Un piccolo gioiello dell’arte rupestre, immerso nella campagna: un ciclo dell’VIII–IX secolo con episodi della Creazione e del Peccato Originale, e figure di santi e arcangeli. Un luogo che invita a rallentare, lontano dai flussi principali.' },
  { id: 's9', dest: 'gravina', cat: 'storia', title: 'Una città tra due sponde', place: 'g_pon',
    text: 'Gravina è legata al canyon che attraversa il paesaggio: sulla sponda orientale la città moderna, sull’altra gli insediamenti rupestri. Il Ponte Acquedotto unisce le due sponde e sintetizza il rapporto tra ingegno umano, acqua e pietra. Il soprannome “città di acqua e di pietra” nasce qui.' },
  { id: 's10', dest: 'gravina', cat: 'storia', title: 'Botromagno, Sidion e Silvium', place: 'g_bot',
    text: 'Sulla collina a ovest dell’abitato sorse un centro peuceta con difese, abitazioni e necropoli, in contatto con il mondo greco della costa. Dopo la romanizzazione è associato a Silvium. I nomi antichi sono discussi dagli storici: conviene raccontarli con prudenza.' },
  { id: 's11', dest: 'gravina', cat: 'tradizione', title: 'Fiera di San Giorgio', place: 'g_sca',
    text: 'Nella seconda metà di aprile si svolge una delle tradizioni civiche più durature, che le ricostruzioni locali fanno risalire a un privilegio angioino del 1294. È legata a scambi di bestiame e prodotti e conserva oggi carattere espositivo, commerciale e celebrativo.' },
  { id: 's12', dest: 'gravina', cat: 'tradizione', title: 'San Michele e il racconto del 999', place: 'g_smg',
    text: 'Il culto di San Michele Arcangelo e la festa dell’8 maggio nel rione Fondovito intrecciano fede e vicinato. La memoria locale ricorda un saccheggio nel 999 legato alla chiesa rupestre di San Michele delle Grotte: un quadro storico generale, mentre alcuni dettagli narrativi non sono verificabili.' },
  { id: 's13', dest: 'gravina', cat: 'tradizione', title: 'Fischietti, Pallone e Gravina DOC', place: 'g_cola',
    text: 'I fischietti in terracotta, il formaggio Pallone di Gravina, il pane e il vino Gravina DOC compongono il patrimonio alimentare e artigiano di una terra di grano e pascoli.' }
];

/* Luoghi del cuore: suggeriti da residenti e guide (ESEMPI) */
const HEART_PLACES = [
  { id: 'h1', dest: 'matera', by: 'Anna, residente', place: 'm_pas', note: 'All’alba, prima dell’arrivo dei gruppi, il Caveoso diventa rosa. Portate un caffè e state in silenzio.' },
  { id: 'h2', dest: 'matera', by: 'Guida del Parco', place: 'm_belt', note: 'Il posto da cui i materani guardano la loro città. Alle 17 la luce sui Sassi è la migliore.' },
  { id: 'h3', dest: 'matera', by: 'Giovanni, nonno di Lanera', place: 'm_lan', note: 'Qui giocavamo tra le piazzette. È cambiato, ma i portici sono ancora gli stessi.' },
  { id: 'h4', dest: 'gravina', by: 'Marta, guida locale', place: 'g_cal', note: 'Camminate lungo la gravina verso sera: le cavità si accendono di rosso.' },
  { id: 'h5', dest: 'gravina', by: 'Un residente di Fondovito', place: 'g_smg', note: 'L’8 maggio il rione si ferma per San Michele. Se capitate in quei giorni, fermatevi anche voi.' }
];
