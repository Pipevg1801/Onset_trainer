/* Lückenlos: vistas Simulacro real y Simulacro fácil */
"use strict";

/* =========================================================
   SIMULACRO: 8 textos x 5 minutos x 20 huecos
   ========================================================= */
function pick(level,n){ return shuffle(TEXTS.filter(t=>t.level===level)).slice(0,n); }
function vSim(m){
  if(session && session.kind==="simEasy") return easySim(m);
  if(!session || session.kind!=="sim"){
    m.innerHTML = `<h1>Simulacro onSET</h1>
    <p class="lede">Como el examen real: 8 textos de dificultad creciente, 20 huecos cada uno y exactamente 5 minutos por texto. Cuando se acaba el tiempo, pasa al siguiente automáticamente. Puntuación máxima: 160.</p>
    <section class="panel">
      <h2>Antes de empezar</h2>
      <p>Necesitas unos 40 minutos sin interrupciones. Usa el teclado alemán de la pantalla para ä, ö, ü y ß. Pulsa <b>Enter</b> o <b>Tab</b> para saltar al siguiente hueco.</p>
      <p class="muted small">Cada hueco tiene tantas letras como las que ves o una más. Los textos van de A2 a B2 y salen al azar de un banco de ${TEXTS.filter(t=>t.level!=="A1").length} textos.</p>
      <button class="btn" id="startSim">Empezar simulacro real</button>
    </section>
    <section class="panel" style="margin-top:18px">
      <h2>Simulacro fácil: elige entre 3 opciones</h2>
      <p>El mismo formato (8 textos, 20 huecos, 5 minutos por texto), pero en cada hueco eliges la palabra correcta entre 3 opciones. En cuanto eliges, la respuesta queda fija y se marca como correcta o errónea.</p>
      <p class="muted small">Ideal para empezar o para calentar antes del simulacro real. No cuenta para tu nivel estimado.</p>
      <button class="btn ghost" id="startEasy">Empezar simulacro fácil</button>
    </section>`;
    $("#startEasy").onclick = startEasySim;
    $("#startSim").onclick = ()=>{
      const list = [...pick("A2",2),...pick("B1",3),...pick("B2",3)];
      session = {kind:"sim",list,parts:list.map(t=>buildCTest(t.text)),answers:list.map(()=>[]),idx:0,left:300,done:false};
      startSimTimer(); render();
    };
    return;
  }
  if(session.done) return simResults(m);
  const t = session.list[session.idx];
  m.innerHTML = `<div class="dots" aria-label="Progreso">${session.list.map((_,i)=>`<span class="${i<session.idx?"done":i===session.idx?"cur":""}"></span>`).join("")}</div>
  <article class="sheet">
    <div class="meta"><h2>Texto ${session.idx+1} de 8: ${esc(t.title)}</h2><span class="timer" id="timer">5:00</span></div>
    <div class="tbar"><i id="tbar" style="width:100%"></i></div>
    <div class="ctext">${renderCTest(session.parts[session.idx], session.answers[session.idx], false)}</div>
    ${umlautBar()}
    <div class="row" style="margin-top:16px"><button class="btn" id="nextText">${session.idx<7?"Siguiente texto":"Terminar simulacro"}</button><span class="small muted">No podrás volver a este texto.</span></div>
  </article>`;
  updateTimer();
  $("#nextText").onclick = ()=>simNext();
}
function startSimTimer(){ clearTimer(); timer = setInterval(()=>{ if(!session||session.kind!=="sim"||session.done){clearTimer();return;} session.left--; updateTimer(); if(session.left<=0){ toast("Tiempo agotado"); simNext(); } },1000); }
function updateTimer(){ const el=$("#timer"); if(!el) return; const l=Math.max(0,session.left); el.textContent=Math.floor(l/60)+":"+String(l%60).padStart(2,"0"); el.classList.toggle("low",l<=60); const b=$("#tbar"); if(b) b.style.width=(l/300*100)+"%"; }
function simNext(){
  session.answers[session.idx] = readAnswers();
  if(session.idx<7){ session.idx++; session.left=300; startSimTimer(); render(); window.scrollTo(0,0); }
  else {
    clearTimer(); session.done=true;
    let tot=0; const per=[];
    session.list.forEach((t,i)=>{ const r=scoreParts(session.parts[i],session.answers[i]); tot+=r.ok; per.push({title:t.title,level:t.level,ok:r.ok,total:r.total}); addErrors(r.missed,t.level); });
    const max = per.reduce((a,p)=>a+p.total,0);
    session.result = {tot,max,per};
    S.history.push({type:"sim",label:"Simulacro",level:scoreToLevel(tot).replace("por debajo de A2","<A2"),correct:tot,total:max,date:new Date().toISOString()});
    S.xp += tot + 20; markDay(); save(); render(); window.scrollTo(0,0);
  }
}
function simResults(m){
  const r = session.result, g = grade(pct(r.tot,r.max)), lvl = scoreToLevel(r.tot);
  m.innerHTML = `<h1>Resultado del simulacro</h1>
  <section class="panel">
    <div class="score"><span class="big">${r.tot}/${r.max}</span><span class="badge ${g.c}">${g.t}</span><span>Nivel estimado: <b>${lvl}</b></span></div>
    <p class="muted small">+${r.tot+20} puntos. Las palabras falladas se guardaron en Repaso.</p>
    <ul class="list">${r.per.map((p,i)=>`<li><span>${i+1}. ${esc(p.title)} <span class="badge lv">${p.level}</span></span><span>${p.ok}/${p.total}</span></li>`).join("")}</ul>
    <div class="row" style="margin-top:16px"><button class="btn" id="seeAns">Ver soluciones</button><button class="btn ghost" data-view="review">Repasar errores</button></div>
  </section><div id="ansBox"></div>`;
  $("#seeAns").onclick = ()=>{
    $("#ansBox").innerHTML = session.list.map((t,i)=>`<article class="sheet" style="margin-top:16px"><div class="meta"><h2>${i+1}. ${esc(t.title)}</h2><span class="badge lv">${t.level}</span></div><div class="ctext">${renderCTest(session.parts[i],session.answers[i],true)}</div></article>`).join("");
    $("#seeAns").disabled = true;
  };
}


/* =========================================================
   SIMULACRO FÁCIL: cada hueco con 3 opciones
   ========================================================= */
let VOCAB = null;
function vocab(){ if(VOCAB) return VOCAB; const set=new Set(); TEXTS.forEach(t=>(t.text.match(/[A-Za-zÄÖÜäöüßÀ-ÿ]+/g)||[]).forEach(w=>{ if(w.length>1) set.add(w); })); VOCAB=[...set]; return VOCAB; }
const ENDS = ["ern","ten","en","er","em","es","st","et","te","e","n","s","t"];
function choicesFor(g){
  const w=g.full, p=g.prefix;
  const real = vocab().filter(v=>v!==w && v.startsWith(p) && v.length>p.length && Math.abs(v.length-w.length)<=3);
  const morph = [], noun = /^[A-ZÄÖÜ]/.test(w);
  const E1 = noun ? ["en","es","er","e","n","s"] : ENDS, E2s = noun ? ["","e","en","n","s","er"] : ["e","en","er","em","es","t","st","et","te","n"];
  for(const E of E1){ if(!w.endsWith(E)) continue; const stem=w.slice(0,-E.length); if(stem.length<p.length) continue; for(const E2 of E2s){ if(E2===E) continue; if(E2==="n" && !/[e]$|el$|er$/.test(stem)) continue; if(E2==="en" && /e$/.test(stem)) continue; morph.push(stem+E2); } break; }
  if(!noun){ morph.push(w+"e", w+"n"); } if(w.length-1>p.length) morph.push(w.slice(0,-1));
  const ok = x => x!==w && x.startsWith(p) && x.length>p.length && x.length>2 && !/e{2}[a-z]?$|nnn|sss|(.)\1\1/.test(x);
  const out=[w], take = arr => { const c=shuffle([...new Set(arr)].filter(x=>ok(x)&&!out.includes(x))); if(c.length){ out.push(c[0]); return true; } return false; };
  if(real.length>=2 && Math.random()<0.7){ take(real); take(real); } else { take(real); }
  while(out.length<3 && take(morph.concat(real))){}
  let k=0; while(out.length<3){ k++; out.push(p+"e".repeat(k)+"n"); }
  return shuffle(out);
}
function choiceSpan(p, a){
  if(a===p.full) return `<span class="gapw ok"><b>${esc(p.full)}</b></span>`;
  return `<span class="gapw bad"><s>${esc(a||"sin respuesta")}</s> <b>${esc(p.full)}</b></span>`;
}
function renderChoiceCTest(parts, opts, answers){
  let gi=0, html="";
  for(const p of parts){
    if(!p.gap){ html+=esc(p.t); continue; }
    const i=gi++, a=answers[i];
    if(a===undefined) html+=`<select class="choice" data-choice="${i}" aria-label="Hueco ${i+1}: ${esc(p.prefix)}…"><option value="" selected disabled>${esc(p.prefix)}…</option>${opts[i].map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join("")}</select>`;
    else html+=choiceSpan(p,a);
  }
  return html;
}
function gapList(parts){ return parts.filter(p=>p.gap); }
function startEasySim(){
  const list=[...pick("A2",2),...pick("B1",3),...pick("B2",3)];
  const parts=list.map(t=>buildCTest(t.text));
  session={kind:"simEasy",list,parts,opts:parts.map(ps=>gapList(ps).map(choicesFor)),answers:list.map(()=>[]),idx:0,left:300,done:false};
  startEasyTimer(); render(); window.scrollTo(0,0);
}
function startEasyTimer(){ clearTimer(); timer=setInterval(()=>{ if(!session||session.kind!=="simEasy"||session.done){clearTimer();return;} session.left--; updateTimer(); if(session.left<=0){ toast("Tiempo agotado"); easyNext(); } },1000); }
function easyLive(){ const s=session, gl=gapList(s.parts[s.idx]), a=s.answers[s.idx]; const done=a.filter(x=>x!==undefined).length, good=gl.filter((g,i)=>a[i]===g.full).length; const el=$("#liveScore"); if(el) el.textContent=`${good} correctas de ${done} respondidas`; }
function easySim(m){
  const s=session;
  if(s.done) return easyResults(m);
  const t=s.list[s.idx];
  m.innerHTML = `<div class="dots" aria-label="Progreso">${s.list.map((_,i)=>`<span class="${i<s.idx?"done":i===s.idx?"cur":""}"></span>`).join("")}</div>
  <article class="sheet">
    <div class="meta"><h2>Texto ${s.idx+1} de 8: ${esc(t.title)} <span class="badge lv">${t.level}</span></h2><span class="timer" id="timer">5:00</span></div>
    <div class="tbar"><i id="tbar" style="width:100%"></i></div>
    <p class="small muted" style="margin-top:-8px">Elige la palabra correcta en cada hueco. La respuesta queda fija en cuanto la eliges. <span id="liveScore"></span></p>
    <div class="ctext easy">${renderChoiceCTest(s.parts[s.idx], s.opts[s.idx], s.answers[s.idx])}</div>
    <div class="row" style="margin-top:16px"><button class="btn" id="nextText">${s.idx<7?"Siguiente texto":"Terminar simulacro"}</button><span class="small muted">Los huecos sin responder cuentan como error.</span></div>
  </article>`;
  updateTimer(); easyLive();
  $("#nextText").onclick=easyNext;
  const f=m.querySelector("select.choice"); if(f) setTimeout(()=>f.focus({preventScroll:true}),30);
}
function easyChoose(sel){
  const s=session; if(!s||s.kind!=="simEasy") return;
  const i=+sel.dataset.choice, p=gapList(s.parts[s.idx])[i];
  s.answers[s.idx][i]=sel.value;
  const tmp=document.createElement("span"); tmp.innerHTML=choiceSpan(p,sel.value);
  const node=tmp.firstChild; sel.replaceWith(node);
  easyLive();
  const next=document.querySelector("select.choice"); if(next) next.focus({preventScroll:true});
}
function easyNext(){
  const s=session;
  if(s.idx<7){ s.idx++; s.left=300; startEasyTimer(); render(); window.scrollTo(0,0); return; }
  clearTimer(); s.done=true;
  let tot=0, max=0; const per=[];
  s.list.forEach((t,i)=>{ const gl=gapList(s.parts[i]); const ok=gl.filter((g,j)=>s.answers[i][j]===g.full).length; tot+=ok; max+=gl.length; per.push({title:t.title,level:t.level,ok,total:gl.length}); addErrors(gl.filter((g,j)=>s.answers[i][j]!==g.full), t.level); });
  s.result={tot,max,per};
  S.history.push({type:"easy",label:"Simulacro fácil",level:"Fácil",correct:tot,total:max,date:new Date().toISOString()});
  S.xp += tot + 10; markDay(); save(); render(); window.scrollTo(0,0);
}
function easyResults(m){
  const s=session, r=s.result, g=grade(pct(r.tot,r.max));
  m.innerHTML = `<h1>Resultado del simulacro fácil</h1>
  <section class="panel">
    <div class="score" style="border:0;margin-top:0;padding-top:0"><span class="big">${r.tot}/${r.max}</span><span class="badge ${g.c}">${g.t}</span><span class="muted">${pct(r.tot,r.max)} % de aciertos. +${r.tot+10} puntos.</span></div>
    <p class="small muted">Este modo es más fácil que el examen real, por eso no cuenta para tu nivel estimado. Cuando superes el 85 %, pasa al simulacro real. Las palabras falladas se guardaron en Repaso.</p>
    <ul class="list">${r.per.map((p,i)=>`<li><span>${i+1}. ${esc(p.title)} <span class="badge lv">${p.level}</span></span><span>${p.ok}/${p.total}</span></li>`).join("")}</ul>
    <div class="row" style="margin-top:16px"><button class="btn" id="seeAns">Ver textos corregidos</button><button class="btn ghost" id="againEasy">Otro simulacro fácil</button></div>
  </section><div id="ansBox"></div>`;
  $("#seeAns").onclick=()=>{ $("#ansBox").innerHTML = s.list.map((t,i)=>`<article class="sheet" style="margin-top:16px"><div class="meta"><h2>${i+1}. ${esc(t.title)}</h2><span class="badge lv">${t.level}</span></div><div class="ctext">${(()=>{ let gi=0; return s.parts[i].map(p=>p.gap?choiceSpan(p,s.answers[i][gi++]):esc(p.t)).join(""); })()}</div></article>`).join(""); $("#seeAns").disabled=true; };
  $("#againEasy").onclick=startEasySim;
}

