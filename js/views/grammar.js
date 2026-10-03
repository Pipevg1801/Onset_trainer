/* Lückenlos: vista Gramática: clases y ejercicios */
"use strict";

/* =========================================================
   GRAMÁTICA: clases de los casos + ejercicios aleatorios
   ========================================================= */
function mastery(k){ const r=S.drills[k]||[]; return r.length ? pct(r.filter(Boolean).length,r.length) : null; }
function startDrill(k, from){ session={kind:"drill",k,from:from||null,items:makeItems(k,10),answers:[],checked:false}; render(); window.scrollTo(0,0); }
function vDrills(m){
  if(session && session.kind==="drill") return drillSession(m);
  if(session && session.kind==="lesson") return lessonView(m);
  m.innerHTML = `<h1>Gramática para los huecos</h1>
  <p class="lede">En el onSET no basta con reconocer la palabra: la terminación tiene que ser exacta. Empieza por las clases de los casos y luego refuerza con la práctica. Cada ronda se genera al azar, así que nunca vas a ver la misma lista dos veces.</p>
  <h2>Clases de los casos</h2>
  <div class="lessons">${LESSONS.map((L,i)=>{ const p=mastery(L.drill); return `<section class="panel lcard">
    <span class="lnum" aria-hidden="true">${i+1}</span>
    <div class="lbody"><h3>${esc(L.title)}</h3><p class="small muted">${esc(L.short)}</p>
    <div class="row" style="margin:10px 0 12px"><div class="bar" style="flex:1;max-width:220px"><i style="width:${p||0}%"></i></div><span class="small">${p===null?"Sin ejercicios aún":"Dominio "+p+" %"}</span></div>
    <div class="row"><button class="btn small" data-lesson="${L.id}">Abrir clase</button><button class="btn ghost small" data-drill="${L.drill}" data-from="${L.id}">Solo ejercicios</button></div></div>
  </section>`; }).join("")}</div>
  <h2 style="margin-top:36px">Más práctica</h2>
  <div class="grid g2">${Object.entries(DRILLS).filter(([,d])=>!d.lesson).map(([k,d])=>{ const p=mastery(k); return `<section class="panel"><h3 style="font-family:var(--serif);font-size:1.2rem">${d.name}</h3>
   <div class="row" style="margin:6px 0 12px"><div class="bar" style="flex:1"><i style="width:${p||0}%"></i></div><span class="small">${p===null?"Sin practicar":"Dominio "+p+" %"}</span></div>
   <details><summary class="small" style="cursor:pointer;font-weight:700">Ver guía rápida</summary><div class="tip">${d.tip}</div></details>
   <div class="row" style="margin-top:14px"><button class="btn small" data-drill="${k}">Hacer ronda de 10</button></div></section>`; }).join("")}</div>`;
  m.querySelectorAll("[data-lesson]").forEach(b=>b.onclick=()=>{ session={kind:"lesson",id:b.dataset.lesson}; render(); window.scrollTo(0,0); });
  m.querySelectorAll("[data-drill]").forEach(b=>b.onclick=()=>startDrill(b.dataset.drill, b.dataset.from));
}
function lessonView(m){
  const idx = LESSONS.findIndex(x=>x.id===session.id), L = LESSONS[idx], prev = LESSONS[idx-1], next = LESSONS[idx+1];
  const p = mastery(L.drill);
  m.innerHTML = `<button class="btn ghost small" id="toGram">Volver a Gramática</button>
  <p class="small muted" style="margin:22px 0 4px">Clase ${idx+1} de ${LESSONS.length}</p>
  <h1>${esc(L.title)}</h1>
  <p class="lede">${esc(L.short)}</p>
  <div class="legend small"><span class="c-nom">Nominativo</span><span class="c-akk">Acusativo</span><span class="c-dat">Dativo</span><span class="c-gen">Genitivo</span></div>
  <article class="panel lesson">${caseMarkHtml(L.body)}</article>
  <section class="panel lesson" style="margin-top:18px">
    <h2>Ejemplos</h2>
    <ul class="ex">${L.examples.map(([de,es_])=>`<li><div class="de">${caseMark(de)}</div><div class="es">${esc(es_)}</div></li>`).join("")}</ul>
  </section>
  <section class="panel practice-cta" style="margin-top:18px">
    <h2>Ahora practica</h2>
    <p>10 ejercicios generados al azar sobre ${L.id==="intro"?"los cuatro casos mezclados":"el "+L.title.toLowerCase()}. Cada vez que empiezas, las frases, las palabras y el orden cambian.</p>
    <div class="row"><button class="btn" id="goDrill">Hacer ejercicios</button><span class="small muted">${p===null?"":"Tu dominio actual: "+p+" %"}</span></div>
  </section>
  <div class="row" style="justify-content:space-between;margin-top:22px">
    ${prev?`<button class="btn ghost small" data-lnav="${prev.id}">Clase anterior: ${esc(prev.title)}</button>`:"<span></span>"}
    ${next?`<button class="btn ghost small" data-lnav="${next.id}">Siguiente clase: ${esc(next.title)}</button>`:""}
  </div>`;
  $("#toGram").onclick=()=>{ session=null; render(); window.scrollTo(0,0); };
  $("#goDrill").onclick=()=>startDrill(L.drill, L.id);
  m.querySelectorAll("[data-lnav]").forEach(b=>b.onclick=()=>{ session={kind:"lesson",id:b.dataset.lnav}; render(); window.scrollTo(0,0); });
}
function readDrillAnswers(s){
  return s.items.map((it,i)=>{
    if(it.type==="mc"){ const r=document.querySelector(`input[name="mc${i}"]:checked`); return r?r.value:""; }
    const inp=document.querySelector(`input[data-gap="${i}"]`); return inp?inp.value:"";
  });
}
function drillSession(m){
  const s=session, d=DRILLS[s.k];
  const hasMc = s.items.some(it=>it.type==="mc");
  let ok=0;
  const rows = s.items.map((it,i)=>{
    if(it.type==="mc"){
      const v=s.answers[i]||"", good=v===it.ans; if(s.checked&&good) ok++;
      const opts = it.options.map(o=>{
        const cls = !s.checked ? "" : o===it.ans ? "ok" : (o===v ? "bad" : "");
        return `<label class="opt ${cls}"><input type="radio" name="mc${i}" value="${o}" ${v===o?"checked":""} ${s.checked?"disabled":""}> ${CASE_ES[o]}</label>`;
      }).join("");
      return `<div class="drill-item mcq"><div>${i+1}. ${esc(it.pre)}<span class="hl">${esc(it.np)}</span>${esc(it.post)}</div>
        <div class="opts" role="radiogroup" aria-label="Caso de la frase ${i+1}">${opts}</div></div>${s.checked&&!good?`<p class="expl">${esc(it.expl)}</p>`:""}`;
    }
    const hint = it.hint ? `<span class="hint">(${esc(it.hint)})</span>` : "";
    if(!s.checked){ const w=Math.max(it.ans.length,it.prefix.length)+2; return `<div class="drill-item">${i+1}. ${esc(it.before)}<span class="gapw">${esc(it.prefix)}<input data-gap="${i}" aria-label="Frase ${i+1}" style="width:${w+0.6}ch" maxlength="${w+2}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(s.answers[i]||"")}"></span>${esc(it.post)}${hint}</div>`; }
    const v=(s.answers[i]||"").trim(), good=v===it.ans; if(good) ok++;
    return `<div class="drill-item">${i+1}. ${esc(it.before)}<span class="gapw ${good?"ok":"bad"}">${esc(it.prefix)}${!good&&v?`<s>${esc(v)}</s>`:""}<b>${esc(it.ans)}</b></span>${esc(it.post)}${hint}</div>${good?"":`<p class="expl">${esc(it.expl)}</p>`}`;
  }).join("");
  const backLabel = s.from ? "Volver a la clase" : "Volver a Gramática";
  const res = s.checked ? (()=>{ const p=pct(ok,s.items.length), g=grade(p); return `<div class="score"><span class="big">${ok}/${s.items.length}</span><span class="badge ${g.c}">${g.t}</span><span class="muted">+${ok*2} puntos</span></div><div class="row"><button class="btn" id="again">Nueva ronda aleatoria</button><button class="btn ghost" id="back">${backLabel}</button></div>`; })() : "";
  m.innerHTML = `<article class="sheet"><div class="meta"><h2>${d.name}</h2><span class="small muted">Ronda aleatoria</span></div>
   <p class="small muted" style="margin-top:-8px">Escribe lo que falta${hasMc?". En las frases con opciones, elige el caso de la parte resaltada":""}.</p>
   ${rows}${s.checked?"":umlautBar()+`<div class="row" style="margin-top:14px"><button class="btn" id="check">Comprobar</button><button class="btn ghost" id="back">Salir</button></div>`}${res}</article>`;
  const c=$("#check"); if(c) c.onclick=()=>{
    s.answers=readDrillAnswers(s); s.checked=true;
    const arr=S.drills[s.k]||[]; let good=0;
    s.items.forEach((it,i)=>{ const v=(s.answers[i]||"").trim(); const g=v===it.ans; if(g) good++; arr.push(g); });
    S.drills[s.k]=arr.slice(-30);
    S.xp+=good*2;
    S.history.push({type:"drill",label:"Gramática: "+d.name,level:"Gram.",correct:good,total:s.items.length,date:new Date().toISOString()});
    markDay(); save(); render(); window.scrollTo(0,0);
  };
  const a=$("#again"); if(a) a.onclick=()=>startDrill(s.k, s.from);
  const b=$("#back"); if(b) b.onclick=()=>{ session = s.from ? {kind:"lesson",id:s.from} : null; render(); window.scrollTo(0,0); };
}

