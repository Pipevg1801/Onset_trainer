/* OnSet trainer: vista Práctica por niveles */
"use strict";

/* =========================================================
   PRÁCTICA por niveles (y textos propios)
   ========================================================= */
function vPractice(m){
  if(session && session.kind==="text") return textSession(m);
  const desc = {A1:"Para calentar: vocabulario básico y presente.",A2:"El nivel más bajo que mide el onSET.",B1:"Tu meta mínima: Perfekt, subordinadas, más vocabulario.",B2:"Textos informativos con vocabulario abstracto."};
  m.innerHTML = `<h1>Práctica por niveles</h1>
  <p class="lede">Haz cada texto sin prisa, revisa tus fallos y repítelo hasta superar el 70 %. Activa el cronómetro cuando quieras entrenar la velocidad.</p>
  <div class="levels">${["A1","A2","B1","B2"].map(L=>`<section><h2>${L} <span class="small muted" style="font-family:var(--sans);font-weight:400">${desc[L]}</span></h2>
   <div class="tlist">${TEXTS.filter(t=>t.level===L).map(t=>{ const b=S.best[t.id]; const g=b!=null?grade(pct(b,20)):null; return `<button class="tcard" data-text="${t.id}"><span class="t">${esc(t.title)}</span><span class="small muted">${b!=null?`Mejor: ${b}/20 <span class="badge ${g.c}">${g.t}</span>`:"Sin hacer"}</span></button>`; }).join("")}</div></section>`).join("")}</div>`;
  m.querySelectorAll("[data-text]").forEach(b=>b.onclick=()=>{ const t=TEXTS.find(x=>x.id===b.dataset.text); openText(t,"text"); });
}
function openText(t, type){
  session = {kind:"text",type,t,parts:buildCTest(t.text),answers:[],checked:false,timed:session&&session.timedPref||false,left:300};
  if(session.timed) startTextTimer();
  if(type==="custom") view="custom";
  render(); window.scrollTo(0,0);
}
function startTextTimer(){ clearTimer(); session.left=300; timer=setInterval(()=>{ if(!session||session.kind!=="text"||session.checked||!session.timed){clearTimer();return;} session.left--; updateTextTimer(); if(session.left<=0){ toast("Tiempo agotado"); checkText(); } },1000); }
function updateTextTimer(){ const el=$("#timer"); if(!el) return; const l=Math.max(0,session.left); el.textContent=Math.floor(l/60)+":"+String(l%60).padStart(2,"0"); el.classList.toggle("low",l<=60); }
function textSession(m){
  const s = session, t = s.t, n = gapCount(s.parts);
  let res = "";
  if(s.checked){
    const r = s.result, p=pct(r.ok,r.total), g=grade(p);
    res = `<div class="score"><span class="big">${r.ok}/${r.total}</span><span class="badge ${g.c}">${g.t}</span><span class="muted">${p} % de aciertos. +${s.gained} puntos.</span></div>
    ${r.missed.length?`<p class="small muted">Las ${r.missed.length} palabras falladas se guardaron en Repaso.</p>`:"<p class='small'>Texto perfecto.</p>"}
    <div class="row"><button class="btn" id="again">Repetir texto</button><button class="btn ghost" id="back">${s.type==="custom"?"Crear otro texto":"Elegir otro texto"}</button></div>`;
  }
  m.innerHTML = `<article class="sheet">
    <div class="meta"><h2>${esc(t.title)} <span class="badge lv">${esc(t.level)}</span></h2>
      ${s.checked?"":`<div class="row"><label class="toggle"><input type="checkbox" id="timedT" ${s.timed?"checked":""}> Cronómetro 5 min</label>${s.timed?`<span class="timer" id="timer">5:00</span>`:""}</div>`}</div>
    <p class="small muted" style="margin-top:-8px">${n} huecos. Completa la segunda mitad de cada palabra cortada.</p>
    <div class="ctext">${renderCTest(s.parts,s.answers,s.checked)}</div>
    ${s.checked?"":umlautBar()+`<div class="row" style="margin-top:16px"><button class="btn" id="check">Comprobar</button><button class="btn ghost" id="back">Salir</button></div>`}
    ${res}
  </article>`;
  if(s.timed && !s.checked) updateTextTimer();
  const tt=$("#timedT"); if(tt) tt.onchange=()=>{ s.answers=readAnswers(); s.timed=tt.checked; s.timedPref=tt.checked; if(s.timed) startTextTimer(); else clearTimer(); render(); };
  const c=$("#check"); if(c) c.onclick=checkText;
  const a=$("#again"); if(a) a.onclick=()=>{ const keep=s.timedPref; session={...s,answers:[],checked:false,left:300}; session.timedPref=keep; session.timed=keep; if(keep) startTextTimer(); render(); };
  const b=$("#back"); if(b) b.onclick=()=>{ clearTimer(); session=null; render(); };
}
function checkText(){
  const s=session; clearTimer();
  s.answers = readAnswers();
  const r = scoreParts(s.parts, s.answers);
  s.result=r; s.checked=true;
  const bonus = r.total && r.ok/r.total>=0.75 ? 5 : 0;
  s.gained = r.ok + bonus;
  S.xp += s.gained;
  addErrors(r.missed, s.t.level);
  if(s.type==="text") S.best[s.t.id] = Math.max(S.best[s.t.id]||0, r.ok);
  if(s.type==="custom" && s.t.ci!=null && S.custom[s.t.ci]) S.custom[s.t.ci].best = Math.max(S.custom[s.t.ci].best||0, r.ok);
  S.history.push({type:s.type,label:s.t.title,level:s.t.level,correct:r.ok,total:r.total,date:new Date().toISOString()});
  markDay(); save(); render();
}

