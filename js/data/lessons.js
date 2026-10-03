/* OnSet trainer: clases de los casos gramaticales */
"use strict";

/* =========================================================
   CLASES DE LOS CASOS
   Marcado en ejemplos: {nom:...} {akk:...} {dat:...} {gen:...}
   ========================================================= */
const TBL_DEF = `<div class="tablewrap"><table><tr><th></th><th>Masculino</th><th>Femenino</th><th>Neutro</th><th>Plural</th></tr>
<tr><th>Nominativo</th><td>der</td><td>die</td><td>das</td><td>die</td></tr>
<tr><th>Acusativo</th><td><b>den</b></td><td>die</td><td>das</td><td>die</td></tr>
<tr><th>Dativo</th><td><b>dem</b></td><td><b>der</b></td><td><b>dem</b></td><td><b>den</b> (+n)</td></tr>
<tr><th>Genitivo</th><td><b>des</b> (+s)</td><td><b>der</b></td><td><b>des</b> (+s)</td><td><b>der</b></td></tr></table></div>`;
const TBL_EIN = `<div class="tablewrap"><table><tr><th></th><th>Masculino</th><th>Femenino</th><th>Neutro</th><th>Plural (kein, mein…)</th></tr>
<tr><th>Nominativo</th><td>ein</td><td>eine</td><td>ein</td><td>keine</td></tr>
<tr><th>Acusativo</th><td><b>einen</b></td><td>eine</td><td>ein</td><td>keine</td></tr>
<tr><th>Dativo</th><td><b>einem</b></td><td><b>einer</b></td><td><b>einem</b></td><td><b>keinen</b> (+n)</td></tr>
<tr><th>Genitivo</th><td><b>eines</b> (+s)</td><td><b>einer</b></td><td><b>eines</b> (+s)</td><td><b>keiner</b></td></tr></table></div>`;
const TBL_PRON = `<div class="tablewrap"><table><tr><th>Nominativo</th><th>Acusativo</th><th>Dativo</th><th>Español</th></tr>
<tr><td>ich</td><td>mich</td><td>mir</td><td>yo / me / a mí</td></tr>
<tr><td>du</td><td>dich</td><td>dir</td><td>tú / te / a ti</td></tr>
<tr><td>er</td><td>ihn</td><td>ihm</td><td>él / lo / le</td></tr>
<tr><td>sie</td><td>sie</td><td>ihr</td><td>ella / la / le</td></tr>
<tr><td>es</td><td>es</td><td>ihm</td><td>ello (neutro)</td></tr>
<tr><td>wir</td><td>uns</td><td>uns</td><td>nosotros / nos</td></tr>
<tr><td>ihr</td><td>euch</td><td>euch</td><td>ustedes (informal)</td></tr>
<tr><td>sie</td><td>sie</td><td>ihnen</td><td>ellos / los / les</td></tr>
<tr><td>Sie</td><td>Sie</td><td>Ihnen</td><td>usted / ustedes (formal)</td></tr></table></div>`;

const LESSONS = [
{id:"intro",drill:"casos",title:"¿Qué es un caso?",short:"La idea clave antes de empezar: por qué el alemán cambia los artículos.",
body:`<h3>El problema para un hispanohablante</h3>
<p>En español sabemos quién hace qué gracias al orden de las palabras y a pequeñas preposiciones: «Juan ve a María» no significa lo mismo que «María ve a Juan». En alemán, esa información va sobre todo en las <b>terminaciones</b> del artículo, del pronombre y del adjetivo. A cada función dentro de la frase le corresponde un <b>caso</b>.</p>
<p>Por eso el alemán puede mover las palabras sin cambiar el significado. Estas dos frases dicen lo mismo, «el hombre ve al perro», porque <i>der</i> marca al sujeto y <i>den</i> al objeto:</p>
<p class="demo">{nom:Der Mann} sieht {akk:den Hund}.<br>{akk:Den Hund} sieht {nom:der Mann}.</p>
<h3>Los cuatro casos</h3>
<div class="tablewrap"><table><tr><th>Caso</th><th>Función</th><th>Pregunta en alemán</th><th>En español</th></tr>
<tr><td><span class="c-nom">Nominativo</span></td><td>sujeto</td><td>Wer? Was?</td><td>¿quién hace la acción?</td></tr>
<tr><td><span class="c-akk">Acusativo</span></td><td>objeto directo</td><td>Wen? Was?</td><td>¿qué? ¿a quién? (lo / la)</td></tr>
<tr><td><span class="c-dat">Dativo</span></td><td>objeto indirecto</td><td>Wem?</td><td>¿a quién? ¿para quién? (le / les)</td></tr>
<tr><td><span class="c-gen">Genitivo</span></td><td>posesión</td><td>Wessen?</td><td>¿de quién?</td></tr></table></div>
<h3>¿Qué palabras cambian?</h3>
<p>Cambian sobre todo los artículos (der, den, dem, des), los pronombres (ich, mich, mir) y las terminaciones de los adjetivos. El sustantivo casi no cambia: solo añade <b>-n</b> en dativo plural (den Kinder<b>n</b>), <b>-s</b> o <b>-es</b> en genitivo masculino y neutro (des Mann<b>es</b>), y un grupo pequeño de masculinos añade <b>-n</b> en todos los casos menos el nominativo (der Student, den Student<b>en</b>).</p>
<h3>Las tablas que tienes que saber de memoria</h3>
<p>Artículo definido:</p>${TBL_DEF}
<p>Artículo indefinido. <i>kein</i> (ningún) y los posesivos <i>mein, dein, sein, ihr, unser, euer</i> llevan exactamente las mismas terminaciones:</p>${TBL_EIN}
<h3>Método en tres pasos</h3>
<ol><li><b>Encuentra el verbo conjugado.</b> En una oración principal casi siempre está en la segunda posición.</li>
<li><b>Busca el sujeto:</b> ¿quién hace la acción? Va en nominativo, y el verbo concuerda con él.</li>
<li><b>Para cada otra parte, mira si hay preposición.</b> Si la hay, la preposición decide el caso. Si no la hay, pregunta <i>Wen? Was?</i> (acusativo) o <i>Wem?</i> (dativo). Si significa «de alguien», es genitivo.</li></ol>
<h3>Por qué importa en el onSET</h3>
<p>En cada texto del onSET hay varios huecos del tipo <i>d___</i>, <i>ein___</i> o <i>mein___</i>. La raíz ya la ves; lo que el examen mide es si sabes la terminación. Si dominas los casos, esos huecos se convierten en puntos casi seguros.</p>`,
examples:[
 ["{nom:Die Frau} gibt {dat:dem Kind} {akk:einen Apfel}.","La mujer le da una manzana al niño."],
 ["{nom:Ich} helfe {dat:meiner Mutter}.","Ayudo a mi mamá."],
 ["Das ist das Auto {gen:des Lehrers}.","Ese es el carro del profesor."],
 ["{akk:Den Film} kenne {nom:ich} schon.","La película ya la conozco."],
 ["{nom:Mein Bruder} wohnt bei {dat:einer Familie}.","Mi hermano vive con una familia."],
 ["{nom:Wir} kaufen {akk:ein Geschenk} für {akk:den Vater}.","Compramos un regalo para el papá."]
]},
{id:"nom",drill:"nom",title:"Nominativo",short:"El sujeto: quien hace la acción. La forma del diccionario.",
body:`<h3>Para qué sirve</h3>
<p>El nominativo es el caso del <b>sujeto</b>: la persona o cosa que realiza la acción del verbo, o de la que se dice algo. Es la forma «de diccionario»: cuando aprendes <i>der Tisch</i> o <i>die Lampe</i>, estás aprendiendo el nominativo.</p>
<p>La pregunta es <b>Wer?</b> (¿quién?) para personas y <b>Was?</b> (¿qué?) para cosas. <i>Wer arbeitet in der Bank? Mein Vater.</i> El sujeto es «mein Vater», en nominativo.</p>
<h3>Formas</h3>
<div class="tablewrap"><table><tr><th></th><th>Masculino</th><th>Femenino</th><th>Neutro</th><th>Plural</th></tr>
<tr><th>Definido</th><td>der</td><td>die</td><td>das</td><td>die</td></tr>
<tr><th>Indefinido</th><td>ein</td><td>eine</td><td>ein</td><td>(sin artículo)</td></tr>
<tr><th>Negativo</th><td>kein</td><td>keine</td><td>kein</td><td>keine</td></tr>
<tr><th>Posesivo</th><td>mein</td><td>meine</td><td>mein</td><td>meine</td></tr></table></div>
<p>Fíjate en que <i>ein</i>, <i>kein</i> y <i>mein</i> no llevan terminación en masculino y neutro. Esto es muy importante para los adjetivos: cuando el artículo no muestra el género, el adjetivo lo muestra (<i>ein gut<b>er</b> Mann, ein gut<b>es</b> Buch</i>).</p>
<p>Pronombres en nominativo: <i>ich, du, er, sie, es, wir, ihr, sie, Sie</i>. Recuerda que <i>ihr</i> es «ustedes» entre amigos o familia, y <i>Sie</i> (con mayúscula) es «usted» o «ustedes» formal.</p>
<h3>Segundo uso: después de sein, werden, bleiben y heißen</h3>
<p>Estos verbos no tienen objeto. Lo que viene después describe al sujeto y por eso también va en nominativo: <i>Das ist <b>ein</b> Hund</i> (no «einen»), <i>Er wird <b>ein</b> guter Arzt</i>, <i>Sie bleibt <b>meine</b> beste Freundin</i>.</p>
<h3>Cuidado: el sujeto no siempre va primero</h3>
<p>En alemán el verbo conjugado ocupa la segunda posición. Si la frase empieza con otra cosa (un tiempo, un lugar, un objeto), el sujeto pasa detrás del verbo: <i>Heute kauft <b>mein Bruder</b> ein Auto.</i> No te fíes de la posición: busca quién hace la acción. El verbo te ayuda, porque concuerda con el sujeto: <i>der Mann kommt</i> frente a <i>die Männer kommen</i>.</p>
<h3>Errores típicos</h3>
<p>El primero es poner acusativo después de <i>sein</i> («Das ist einen Tisch»). El segundo es creer que <i>der</i> siempre es nominativo: <i>der</i> también puede ser dativo o genitivo femenino. Decide por la función en la frase, no por la forma.</p>
<h3>En el onSET</h3>
<p>Si ves <i>Ei___ Frau arbeitet…</i> o <i>D___ Kinder spielen…</i>, pregúntate si esa palabra hace la acción del verbo. Si la respuesta es sí, es nominativo: <i>eine</i>, <i>die</i>.</p>`,
examples:[
 ["{nom:Der Zug} kommt um acht Uhr.","El tren llega a las ocho."],
 ["{nom:Meine Schwester} studiert Medizin.","Mi hermana estudia medicina."],
 ["Morgen besucht uns {nom:mein Opa}.","Mañana nos visita mi abuelo."],
 ["Das ist {nom:ein gutes Buch}.","Es un buen libro."],
 ["{nom:Die Kinder} spielen im Garten.","Los niños juegan en el jardín."],
 ["Er wird {nom:ein guter Lehrer}.","Él va a ser un buen profesor."]
]},
{id:"akk",drill:"akk",title:"Acusativo",short:"El objeto directo, las preposiciones für, ohne, durch… y el movimiento.",
body:`<h3>Para qué sirve</h3>
<p>El acusativo marca el <b>objeto directo</b>: lo que recibe directamente la acción del verbo. Un truco: si en español puedes cambiarlo por «lo» o «la» (compro el libro → lo compro), casi siempre es acusativo.</p>
<p>La pregunta es <b>Wen?</b> (¿a quién?) o <b>Was?</b> (¿qué?). <i>Wen besuchst du? Meinen Opa.</i></p>
<h3>La buena noticia: solo cambia el masculino</h3>
<div class="tablewrap"><table><tr><th></th><th>Masculino</th><th>Femenino</th><th>Neutro</th><th>Plural</th></tr>
<tr><th>Nominativo</th><td>der / ein / mein</td><td>die / eine</td><td>das / ein</td><td>die / meine</td></tr>
<tr><th>Acusativo</th><td><b>den / einen / meinen</b></td><td>die / eine</td><td>das / ein</td><td>die / meine</td></tr></table></div>
<p>Femenino, neutro y plural son iguales al nominativo. Así que la pregunta clave en un hueco es: ¿el sustantivo es masculino? Si lo es y es objeto directo, la terminación es <b>-en</b>.</p>
<p>Pronombres: <i>mich, dich, ihn, sie, es, uns, euch, sie, Sie</i>. El único masculino que cambia de forma es <i>er → ihn</i>.</p>
<h3>La «a» personal del español no es dativo</h3>
<p>En español decimos «veo <b>a</b> mi papá», con «a». Esa «a» engaña: en alemán es un objeto directo normal, en acusativo: <i>Ich sehe <b>meinen</b> Vater.</i> Lo mismo con <i>besuchen, kennen, lieben, fragen, anrufen</i>.</p>
<h3>Verbos frecuentes con acusativo</h3>
<p><i>haben, brauchen, kaufen, suchen, finden, sehen, kennen, besuchen, lieben, fragen, essen, trinken, nehmen, bekommen, lesen, schreiben, anrufen</i>. Y la expresión <b>es gibt</b> (hay): <i>Hier gibt es <b>einen</b> Park.</i></p>
<h3>Preposiciones que siempre rigen acusativo</h3>
<p><b>durch</b> (por, a través de), <b>für</b> (para), <b>gegen</b> (contra), <b>ohne</b> (sin), <b>um</b> (alrededor de, a las). También <i>bis</i> y <i>entlang</i>. <i>Das Geschenk ist für <b>den</b> Lehrer. Ohne <b>meinen</b> Schlüssel komme ich nicht rein.</i></p>
<h3>Preposiciones de doble caso con movimiento (Wohin?)</h3>
<p><i>in, an, auf, über, unter, vor, hinter, neben, zwischen</i> rigen acusativo cuando hay un cambio de lugar, una dirección: <i>Ich gehe in <b>die</b> Stadt. Ich lege das Buch auf <b>den</b> Tisch.</i> Si no hay movimiento (¿dónde está?), van con dativo; lo verás en la clase siguiente.</p>
<h3>Tiempo sin preposición</h3>
<p>Las expresiones de tiempo sin preposición van en acusativo: <i>jed<b>en</b> Tag, nächst<b>en</b> Monat, letzt<b>e</b> Woche, d<b>en</b> ganzen Abend.</i></p>
<h3>Masculinos débiles</h3>
<p>Algunos masculinos, sobre todo personas terminadas en <i>-e</i> o de origen extranjero, añaden <b>-n</b> también al sustantivo: <i>den Student<b>en</b>, den Kolleg<b>en</b>, den Mensch<b>en</b>, den Nachbar<b>n</b>, den Herr<b>n</b></i>.</p>
<h3>En el onSET</h3>
<p>Los huecos más frecuentes son <i>d<b>en</b></i> y <i>ein<b>en</b></i>. Si el sustantivo es masculino, no es el sujeto y no va con una preposición de dativo, piensa en <b>-en</b>.</p>`,
examples:[
 ["Ich brauche {akk:einen neuen Computer}.","Necesito un computador nuevo."],
 ["Kennst du {akk:meinen Bruder}?","¿Conoces a mi hermano?"],
 ["Wir gehen durch {akk:den Park}.","Caminamos por el parque."],
 ["Es gibt {akk:keinen Zucker} mehr.","Ya no hay azúcar."],
 ["Ich lege die Tasche auf {akk:den Stuhl}.","Pongo el bolso sobre la silla."],
 ["{akk:Jeden Morgen} trinke ich Kaffee.","Todas las mañanas tomo café."],
 ["Ich rufe {akk:dich} später an.","Te llamo más tarde."]
]},
{id:"dat",drill:"dat",title:"Dativo",short:"El objeto indirecto, helfen y gefallen, y aus-bei-mit-nach-seit-von-zu.",
body:`<h3>Para qué sirve</h3>
<p>El dativo marca el <b>objeto indirecto</b>: casi siempre una persona que recibe algo, a la que se le hace algo o que se beneficia. En español corresponde a «le» o «les»: <i>Le doy el libro a mi mamá → Ich gebe <b>meiner</b> Mutter das Buch.</i></p>
<p>La pregunta es <b>Wem?</b> (¿a quién?).</p>
<h3>Formas</h3>
<div class="tablewrap"><table><tr><th></th><th>Masculino</th><th>Femenino</th><th>Neutro</th><th>Plural</th></tr>
<tr><th>Definido</th><td>dem</td><td>der</td><td>dem</td><td>den (+n)</td></tr>
<tr><th>Indefinido</th><td>einem</td><td>einer</td><td>einem</td><td>(sin artículo)</td></tr>
<tr><th>Negativo</th><td>keinem</td><td>keiner</td><td>keinem</td><td>keinen</td></tr>
<tr><th>Posesivo</th><td>meinem</td><td>meiner</td><td>meinem</td><td>meinen</td></tr></table></div>
<p>Truco: en dativo, masculino y neutro terminan en <b>-m</b>, el femenino en <b>-r</b> y el plural en <b>-n</b>.</p>
${TBL_PRON}
<h3>El plural añade -n al sustantivo</h3>
<p><i>mit den Kinder<b>n</b>, mit meinen Freunde<b>n</b></i>. La excepción son los plurales que ya terminan en <i>-n</i> o en <i>-s</i>: <i>mit den Frauen, mit den Autos</i>.</p>
<h3>Verbos con dos objetos</h3>
<p><i>geben, schenken, zeigen, erklären, schicken, bringen, empfehlen</i>: la persona va en dativo y la cosa en acusativo. <i>Ich schenke <b>dem Kind</b> einen Ball.</i> Si los dos son sustantivos, primero va el dativo; si la cosa es un pronombre, el pronombre va primero: <i>Ich schenke ihn dem Kind.</i></p>
<h3>Verbos que siempre rigen dativo: la gran trampa</h3>
<p><i>helfen, danken, gefallen, gehören, antworten, gratulieren, schmecken, passen, folgen, glauben</i> (creerle a alguien), <i>fehlen, zuhören</i>. En español varios son directos («ayudo a Juan» → «lo ayudo»), pero en alemán van con dativo: <i>Ich helfe <b>ihm</b>. Das Kleid gefällt <b>mir</b>.</i></p>
<h3>Preposiciones que siempre rigen dativo</h3>
<p><b>aus, bei, mit, nach, seit, von, zu</b> (y <i>gegenüber</i>). Memorízalas como una sola palabra: «aus-bei-mit-nach-seit-von-zu». Contracciones que verás en todos los textos: zu dem → <b>zum</b>, zu der → <b>zur</b>, bei dem → <b>beim</b>, von dem → <b>vom</b>, in dem → <b>im</b>, an dem → <b>am</b>.</p>
<h3>Preposiciones de doble caso sin movimiento (Wo?)</h3>
<p>Las mismas nueve preposiciones del acusativo (<i>in, an, auf, über, unter, vor, hinter, neben, zwischen</i>) rigen dativo cuando indican dónde está algo:</p>
<div class="tablewrap"><table><tr><th>Wo? (dónde) → dativo</th><th>Wohin? (a dónde) → acusativo</th></tr>
<tr><td>Ich bin in <b>der</b> Stadt.</td><td>Ich fahre in <b>die</b> Stadt.</td></tr>
<tr><td>Das Buch liegt auf <b>dem</b> Tisch.</td><td>Ich lege das Buch auf <b>den</b> Tisch.</td></tr>
<tr><td>Das Bild hängt an <b>der</b> Wand.</td><td>Ich hänge das Bild an <b>die</b> Wand.</td></tr></table></div>
<h3>Expresiones fijas</h3>
<p><i>Wie geht es <b>dir</b>? <b>Mir</b> ist kalt. Es tut <b>mir</b> leid. Das ist <b>mir</b> egal.</i></p>
<h3>En el onSET</h3>
<p>Cuando veas una preposición de la lista aus-bei-mit-nach-seit-von-zu, el hueco siguiente casi seguro termina en <b>-em</b>, <b>-er</b> o <b>-en</b>. En los textos B1 y B2 aparecen muchísimo <i>mit d<b>em</b>, bei d<b>er</b>, von d<b>en</b></i>.</p>`,
examples:[
 ["Ich helfe {dat:meiner Nachbarin}.","Ayudo a mi vecina."],
 ["Er schenkt {dat:seiner Freundin} Blumen.","Le regala flores a su novia."],
 ["Wir fahren mit {dat:dem Bus} zur Uni.","Vamos en bus a la universidad."],
 ["Seit {dat:einem Jahr} lerne ich Deutsch.","Hace un año que estudio alemán."],
 ["Das Handy liegt auf {dat:dem Tisch}.","El celular está sobre la mesa."],
 ["Die Suppe schmeckt {dat:den Kindern}.","A los niños les gusta la sopa."],
 ["Wie geht es {dat:Ihnen}?","¿Cómo está usted?"]
]},
{id:"gen",drill:"gen",title:"Genitivo",short:"La posesión, wegen, trotz, während… y la trampa del «der».",
body:`<h3>Para qué sirve</h3>
<p>El genitivo expresa <b>posesión o pertenencia</b>, como «de» en español: <i>el carro del profesor → das Auto <b>des Lehrers</b></i>. La pregunta es <b>Wessen?</b> (¿de quién?).</p>
<h3>Formas</h3>
<div class="tablewrap"><table><tr><th></th><th>Masculino</th><th>Femenino</th><th>Neutro</th><th>Plural</th></tr>
<tr><th>Definido</th><td>des (+s)</td><td>der</td><td>des (+s)</td><td>der</td></tr>
<tr><th>Indefinido</th><td>eines (+s)</td><td>einer</td><td>eines (+s)</td><td>(sin artículo)</td></tr>
<tr><th>Negativo</th><td>keines (+s)</td><td>keiner</td><td>keines (+s)</td><td>keiner</td></tr>
<tr><th>Posesivo</th><td>meines (+s)</td><td>meiner</td><td>meines (+s)</td><td>meiner</td></tr></table></div>
<h3>El sustantivo masculino y neutro añade -s o -es</h3>
<p>Las palabras de una sílaba suelen llevar <b>-es</b>: <i>des Mann<b>es</b>, des Tag<b>es</b>, des Buch<b>es</b></i>. Las más largas llevan <b>-s</b>: <i>des Lehrer<b>s</b>, des Computer<b>s</b>, des Mädchen<b>s</b></i>. El femenino y el plural no cambian: <i>der Frau, der Kinder</i>.</p>
<h3>Con nombres propios</h3>
<p>Con nombres de personas, el genitivo va delante y lleva <b>-s</b> sin apóstrofo: <i>Annas Buch, Peters Wohnung</i>. Con artículo va detrás, igual que en español: <i>das Buch der Lehrerin</i>.</p>
<h3>Preposiciones con genitivo</h3>
<p><b>wegen</b> (por, a causa de), <b>trotz</b> (a pesar de), <b>während</b> (durante), <b>statt / anstatt</b> (en lugar de), <b>innerhalb</b> (dentro de), <b>außerhalb</b> (fuera de). <i>Wegen <b>des</b> Regens bleiben wir zu Hause. Während <b>der</b> Prüfung ist es still.</i></p>
<h3>¿Se usa de verdad?</h3>
<p>En la conversación, muchos alemanes lo cambian por <i>von</i> + dativo: <i>das Auto von meinem Bruder</i>. Pero en los textos escritos, que son justo lo que trae el onSET, el genitivo es muy frecuente, sobre todo en B1 y B2: <i>die Hälfte der Weltbevölkerung, während des Studiums, die Entwicklung dieser Technologie</i>.</p>
<h3>La trampa del «der»</h3>
<p><i>der</i> puede ser nominativo masculino, dativo femenino o genitivo femenino y plural. Si <i>der</i> aparece justo después de otro sustantivo y se traduce como «de la» o «de los», es genitivo: <i>die Meinung <b>der</b> Studenten</i> (la opinión de los estudiantes).</p>
<h3>En el onSET</h3>
<p>Cuando veas un sustantivo, luego <i>d___</i> y después otro sustantivo terminado en <i>-s</i> o <i>-es</i>, el hueco casi seguro es <b>des</b>: <i>das Ende d<b>es</b> Film<b>s</b></i>.</p>`,
examples:[
 ["Das ist das Fahrrad {gen:meines Bruders}.","Esa es la bicicleta de mi hermano."],
 ["Die Farbe {gen:des Autos} gefällt mir.","Me gusta el color del carro."],
 ["Wegen {gen:des Streiks} fährt heute kein Zug.","Por la huelga hoy no hay trenes."],
 ["Trotz {gen:der Kälte} gehen wir spazieren.","A pesar del frío salimos a caminar."],
 ["Während {gen:des Unterrichts} ist das Handy aus.","Durante la clase el celular está apagado."],
 ["Die Meinung {gen:der Studenten} ist wichtig.","La opinión de los estudiantes es importante."],
 ["{gen:Marias} Wohnung ist sehr hell.","El apartamento de María es muy iluminado."]
]}
];
const caseMark = s => esc(s).replace(/\{(nom|akk|dat|gen):([^}]+)\}/g,'<span class="c-$1">$2</span>');
const caseMarkHtml = s => s.replace(/\{(nom|akk|dat|gen):([^}]+)\}/g,'<span class="c-$1">$2</span>');

