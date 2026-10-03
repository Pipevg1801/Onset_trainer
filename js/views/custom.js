/* OnSet trainer: vista Mi texto */
"use strict";

/* =========================================================
   MI TEXTO: convierte cualquier texto en un C-Test
   ========================================================= */
function vCustom(m){
  if(session && session.kind==="text" && session.type==="custom") return textSession(m);
  m.innerHTML = `<h1>Crea tu propio C-Test</h1>
  <p class="lede">Pega un texto en alemán (una noticia, un párrafo de un libro, un artículo de tu carrera). La primera y la última oración quedan completas y se crean 20 huecos con el mismo método del onSET.</p>
  <section class="panel">
    <label for="ctitle" class="small" style="font-weight:700">Título</label>
    <input id="ctitle" class="field" style="width:100%;margin:6px 0 14px" placeholder="Por ejemplo: Nachricht vom Montag">
    <label for="ctext" class="small" style="font-weight:700">Texto en alemán</label>
    <textarea id="ctext" style="margin-top:6px" placeholder="Pega aquí al menos 4 o 5 oraciones (unas 80 palabras)."></textarea>
    <p class="small muted" id="cmsg"></p>
    <button class="btn" id="mk">Crear C-Test</button>
  </section>
  ${S.custom.length?`<section class="panel" style="margin-top:18px"><h2>Tus textos</h2><div class="tlist">${S.custom.map((c,i)=>`<button class="tcard" data-cust="${i}"><span class="t">${esc(c.title)}</span><span class="small muted">${c.best!=null?"Mejor: "+c.best+"/"+c.n:"Sin hacer"}</span></button>`).join("")}</div></section>`:""}`;
  $("#mk").onclick=()=>{
    const txt=$("#ctext").value.trim(), title=$("#ctitle").value.trim()||"Mi texto";
    const parts=buildCTest(txt); const n=gapCount(parts);
    if(splitSentences(txt).length<3 || n<8){ $("#cmsg").textContent="El texto es demasiado corto. Añade más oraciones para poder crear al menos 8 huecos."; return; }
    S.custom.unshift({title,text:txt,n}); S.custom=S.custom.slice(0,12); save();
    openText({id:"c-"+Date.now(),level:"Propio",title,text:txt,ci:0},"custom");
  };
  m.querySelectorAll("[data-cust]").forEach(b=>b.onclick=()=>{ const c=S.custom[+b.dataset.cust]; openText({id:"c",level:"Propio",title:c.title,text:c.text,ci:+b.dataset.cust},"custom"); });
}

