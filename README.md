# Entrenador para el onSET-Deutsch

Aplicación web gratuita para preparar el examen **onSET-Deutsch**, pensada para hispanohablantes que van de A1 a B1–B2. Funciona en el navegador, sin instalar nada ni crear cuenta.

El onSET es un C-Test: 8 textos cortos, 20 huecos por texto y 5 minutos por texto. En cada hueco falta la segunda mitad de una palabra. La aplicación entrena justo eso: terminaciones, palabras frecuentes y velocidad de lectura.

## Secciones

- **Panel:** tu nivel estimado (A1 a C1), puntos, racha de días, precisión, gráfico de resultados, dominio de cada tema de gramática y una sugerencia de qué hacer después.
- **Simulacro:** dos versiones con el formato del examen (8 textos de A2 a B2, 20 huecos y 5 minutos por texto, máximo 160 puntos).
  - **Real:** escribes las letras que faltan.
  - **Fácil:** eliges entre 3 opciones. La respuesta queda fija al elegirla y se marca en verde o en rojo. No cuenta para tu nivel estimado.
- **Práctica:** 37 textos de A1 a B2 en formato C-Test, con cronómetro opcional de 5 minutos.
- **Gramática:** 5 clases sobre los casos (introducción, nominativo, acusativo, dativo y genitivo), con explicaciones, tablas y ejemplos traducidos. Además hay ejercicios de casos mezclados, adjetivos, verbos, palabras pequeñas y plurales. Los ejercicios se generan al azar en cada ronda, así que no se pueden memorizar.
- **Test:** rondas de 15 preguntas de selección múltiple para elegir el artículo correcto (der, den, dem, des, einen, meinem…) o el pronombre correcto (ich, mich, mir…). Se responde con las teclas 1 a 4 y Enter.
- **Repaso:** guarda automáticamente las palabras que fallas. Cada una sale de la lista cuando la aciertas dos veces seguidas.
- **Mi texto:** pega cualquier texto en alemán y lo convierte en un C-Test.
- **Plan:** lista de tareas para 4 semanas, con acceso directo a cada sección.

## Sistema de calificación

- **Puntos:** 1 por hueco correcto, 2 por ejercicio de gramática acertado, y bonos por textos con 75 % o más, simulacros completos y tareas del plan.
- **Notas:** Excelente (90 % o más), Muy bien (75 %), Bien (60 %), Suficiente (45 %) e Insuficiente (menos de 45 %).
- **Nivel estimado:** se calcula sobre los 160 puntos del simulacro real. Por debajo de 50 es inferior a A2; desde 50, A2; desde 80, B1; desde 110, B2; y desde 135, C1.

Estos rangos son orientativos y no son los cortes oficiales del onSET. Puedes hacer el test de muestra oficial en [onset.de](https://www.onset.de).

## Cómo añadir contenido

- **Un texto nuevo:** en `js/data/texts.js`, copia una línea y cambia `id` (único), `level` (A1, A2, B1 o B2), `title` y `text`. El texto necesita unas 80 palabras para que salgan 20 huecos. Los textos A2–B2 entran automáticamente en los simulacros.
- **Una frase para los ejercicios de casos:** en `js/data/vocabulary.js`, añade una línea a `TPL`. `{NP}` es el hueco del artículo y el sustantivo, y `{singular|plural}` adapta el verbo.
- **Un sustantivo:** añádelo a la lista que corresponda dentro de `NS`.


## Otros proyectos

Si estas interesado en otras maneras de mejorar tu progreso en alemán, prueba descargando la siguiente extension para firefox la cual convierte cualquier pagina de wikipedia en un examen OnSet. [click aqui](https://addons.mozilla.org/en-US/firefox/addon/onset_exam-in-wikipedia/)
