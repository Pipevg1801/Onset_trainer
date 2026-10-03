/* Lückenlos: categorías de ejercicios de gramática */
"use strict";

/* =========================================================
   CATEGORÍAS DE EJERCICIOS
   Formato fijo: el texto entre [ ] es lo que hay que escribir.
   ========================================================= */
const DRILLS = {
 nom:{name:"Nominativo",lesson:true,gen:()=>npItem("nom",false)},
 akk:{name:"Acusativo",lesson:true,gen:()=>caseItem("akk")},
 dat:{name:"Dativo",lesson:true,gen:()=>caseItem("dat")},
 gen:{name:"Genitivo",lesson:true,gen:()=>npItem("gen",false)},
 casos:{name:"Casos mezclados",fixedShare:0.2,gen:()=>Math.random()<0.3?mcItem():caseItem(rnd(["nom","akk","dat","gen"])),
 tip:`<p>Mezcla los cuatro casos en la misma ronda, como en un texto real. Algunas preguntas te piden escribir la terminación; otras, identificar el caso de la parte resaltada. Si todavía no has visto las clases, empieza por «¿Qué es un caso?».</p>`,
 items:[
  ["Ich sehe d[en] Mann im Park.","Acusativo masculino: el hombre es lo que veo (objeto directo) → den."],
  ["Wir helfen d[er] Frau mit den Taschen.","«helfen» exige dativo; femenino en dativo → der."],
  ["Das ist das Auto d[es] Lehrers.","Genitivo masculino (de quién es) → des, y el sustantivo lleva -s."],
  ["Sie gibt d[em] Kind einen Apfel.","A quién da algo = dativo; neutro en dativo → dem."],
  ["Ich wohne bei ein[er] Familie.","«bei» siempre rige dativo; femenino → einer."],
  ["Mit d[en] Kindern spielen wir Fußball.","«mit» + dativo plural → den, y el sustantivo termina en -n."],
  ["Der Hund d[er] Nachbarin bellt laut.","Genitivo femenino → der."],
  ["Das Geschenk ist für mein[en] Vater.","«für» siempre rige acusativo; masculino → meinen."],
  ["Ich komme gerade aus d[er] Schule.","«aus» + dativo; die Schule es femenino → der."],
  ["Wir fahren mit d[em] Zug nach Berlin.","«mit» + dativo; der Zug es masculino → dem."]
 ]},
 adjetivos:{name:"Adjetivos",fixedShare:0.3,gen:()=>npItem(rnd(["nom","akk","dat","gen"]),true),
 tip:`<p>La terminación del adjetivo depende de lo que va delante. Regla práctica:</p>
 <p><b>Tras der/die/das</b> (artículo definido): <b>-e</b> en nominativo singular y en acusativo femenino y neutro; <b>-en</b> en todo lo demás.<br>
 <b>Tras ein/kein/mein</b>: si el artículo no muestra el género (ein Mann, ein Haus), el adjetivo lo muestra: <b>-er</b> (masculino), <b>-es</b> (neutro). En dativo, genitivo y plural: <b>-en</b>.<br>
 <b>Sin artículo</b>: el adjetivo toma la terminación que tendría el artículo definido: kalt<b>en</b> Kaffee (den), frisch<b>es</b> Brot (das).</p>`,
 items:[
  ["Ich trinke gern kalt[en] Kaffee.","Sin artículo, acusativo masculino (den) → -en."],
  ["Frisch[es] Brot schmeckt am besten.","Sin artículo, neutro nominativo (das) → -es."],
  ["Das ist die Meinung viel[er] junger Menschen.","Genitivo plural sin artículo → -er."],
  ["Mit gut[en] Freunden ist alles leichter.","Sin artículo, dativo plural → -en."],
  ["Heiß[e] Schokolade ist mein Lieblingsgetränk.","Sin artículo, femenino nominativo (die) → -e."],
  ["Bei schön[em] Wetter gehen wir spazieren.","Sin artículo, dativo neutro (dem) → -em."]
 ]},
 verbos:{name:"Verbos",fixedShare:0.3,gen:verbItem,
 tip:`<p>Terminaciones del presente: ich <b>-e</b>, du <b>-st</b>, er/sie/es <b>-t</b>, wir <b>-en</b>, ihr <b>-t</b>, sie/Sie <b>-en</b>.</p>
 <p>El Perfekt usa <i>haben</i> o <i>sein</i> + participio (ge…t / ge…en). Los verbos de movimiento o cambio de estado usan <i>sein</i>: ich <b>bin</b> gegangen. En los textos del examen verás mucho Präteritum de sein, haben y los modales: war, hatte, konnte, musste.</p>`,
 items:[
  ["Sie ist nach Hause gegang[en].","Participio de gehen: gegangen (verbo fuerte → -en)."],
  ["Ich habe das Buch geles[en].","Participio de lesen: gelesen."],
  ["Das Haus wurde vor zwanzig Jahren gebau[t].","Participio regular: ge…t → gebaut."],
  ["Wenn ich Zeit hätt[e], würde ich reisen.","Konjunktiv II de haben: ich hätte."],
  ["Wir sind gestern ins Kino gegang[en].","Movimiento → sein + gegangen."],
  ["Hast du schon gegess[en]?","Participio de essen: gegessen."],
  ["Er hat mir nicht geantworte[t].","Participio regular de antworten: geantwortet."]
 ]},
 funcion:{name:"Palabras pequeñas",
 tip:`<p>La mitad de los huecos del onSET son palabras cortas y frecuentes: conjunciones, preposiciones, pronombres y verbos auxiliares. Se cortan por la mitad: <b>we</b>___ = weil, <b>d</b>___ = dass/der/die…, <b>a</b>___ = auf/aus.</p>
 <p>Si la palabra tiene letras impares, falta una letra más de las que ves. Aprende de memoria las 100 palabras más frecuentes del alemán: son puntos casi seguros.</p>`,
 items:[
  ["Ich bleibe zu Hause, we[il] ich krank bin.","«weil» (porque) manda el verbo al final."],
  ["Er sagt, da[ss] er morgen kommt.","«dass» (que) introduce una oración subordinada."],
  ["Wir gehen spazieren, obw[ohl] es regnet.","«obwohl» (aunque)."],
  ["Ich warte a[uf] den Bus.","warten auf + acusativo."],
  ["Das ist ni[cht] richtig.","«nicht» niega el adjetivo."],
  ["Sie kommt a[us] Kolumbien.","kommen aus = venir de (origen)."],
  ["Kannst du m[ir] helfen?","helfen + dativo → mir."],
  ["Wir fahren im Sommer na[ch] Italien.","nach + países sin artículo."],
  ["Er ist müde, ab[er] er arbeitet weiter.","«aber» (pero)."],
  ["Ich interessiere mich f[ür] Kunst.","sich interessieren für."],
  ["Es gi[bt] viele Möglichkeiten.","«es gibt» = hay."],
  ["Ich weiß nicht, o[b] er kommt.","«ob» = si (pregunta indirecta)."],
  ["Wir si[nd] seit zwei Jahren hier.","sein con wir → sind."],
  ["Das Buch li[egt] auf dem Tisch.","liegen → er/es liegt."],
  ["Er fährt z[ur] Arbeit.","zu + der = zur."],
  ["Wir warten, b[is] der Bus kommt.","«bis» (hasta que)."],
  ["Sie ist größer a[ls] ich.","Comparativo + «als» (que)."],
  ["Ich trinke Kaffee od[er] Tee.","«oder» (o)."],
  ["We[nn] ich Zeit habe, komme ich.","«wenn» (si, cuando) manda el verbo al final."],
  ["Kommst du au[ch] mit?","«auch» (también)."],
  ["Sie we[iß] es nicht.","wissen → sie weiß."],
  ["Ich ka[nn] heute nicht kommen.","können → ich kann."],
  ["Es ist sc[hon] spät.","«schon» (ya)."],
  ["Ich bin no[ch] müde.","«noch» (todavía)."],
  ["Wir haben keine Zeit, de[nn] wir arbeiten viel.","«denn» (pues, porque) no cambia el orden."],
  ["Er hat sehr vi[el] gelernt.","«viel» (mucho)."]
 ]},
 plural:{name:"Plural y género",fixedShare:0,gen:pluralItem,
 tip:`<p>El plural alemán no es regular como el español. Patrones útiles:</p>
 <p>Femeninos en -e, -ung, -heit, -keit, -tät → <b>-(e)n</b> (die Frauen, die Zeitungen).<br>
 Muchos neutros de una sílaba → <b>-er</b> con Umlaut (Kind → Kinder, Buch → Bücher).<br>
 Masculinos → a menudo <b>-e</b>, a veces con Umlaut (Stuhl → Stühle).<br>
 Masculinos y neutros en -er, -el, -en → no cambian o solo llevan Umlaut (der Lehrer → die Lehrer, der Apfel → die Äpfel).<br>
 Palabras extranjeras → <b>-s</b> (Kino → Kinos, Auto → Autos).</p>
 <p>Aprende cada sustantivo con su artículo y su plural: <i>das Buch, die Bücher</i>.</p>`}
};
function itemKey(it){ return it.type==="mc" ? "mc|"+it.pre+it.np+it.post : it.before+"|"+it.prefix+"|"+it.ans+"|"+it.post; }
function makeItems(k, n){
  const cat = DRILLS[k], out = [], seen = new Set();
  const fixed = cat.items ? shuffle(cat.items).map(([s,e])=>({type:"gap",...parseDrill(s),expl:e})) : [];
  const nFixed = cat.gen ? Math.round(n*(cat.fixedShare||0)) : n;
  for(const it of fixed.slice(0,nFixed)){ out.push(it); seen.add(itemKey(it)); }
  let tries = 0;
  while(out.length<n && cat.gen && tries<600){ tries++; const it = cat.gen(); if(!it) continue; const key = itemKey(it); if(seen.has(key)) continue; seen.add(key); out.push(it); }
  return shuffle(out);
}
function parseDrill(str){ const i=str.indexOf("["), j=str.indexOf("]"); const pre=str.slice(0,i), ans=str.slice(i+1,j), post=str.slice(j+1); const ws=pre.match(/[A-Za-zÄÖÜäöüß]*$/)[0]; return {before:pre.slice(0,pre.length-ws.length),prefix:ws,ans,post}; }

