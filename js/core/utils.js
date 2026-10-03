/* Lückenlos: utilidades, calificaciones y nivel estimado */
"use strict";

/* =========================================================
   UTILIDADES
   ========================================================= */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today = () => { const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
const pct = (a,b) => b ? Math.round(a/b*100) : 0;
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("on"),2200); }
function markDay(){ const d=today(); if(!S.days.includes(d)){ S.days.push(d); if(S.days.length>400) S.days=S.days.slice(-400);} }
function streak(){
  const set = new Set(S.days); let n=0; const d=new Date();
  if(!set.has(today())) d.setDate(d.getDate()-1);
  while(true){ const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); if(set.has(k)){n++; d.setDate(d.getDate()-1);} else break; }
  return n;
}
function grade(p){
  if(p>=90) return {t:"Excelente",c:"ok"};
  if(p>=75) return {t:"Muy bien",c:"ok"};
  if(p>=60) return {t:"Bien",c:""};
  if(p>=45) return {t:"Suficiente",c:""};
  return {t:"Insuficiente",c:"bad"};
}
const LEVELS = ["A1","A2","B1","B2","C1"];
const EDGES = [0,50,80,110,135,160]; // bandas orientativas sobre 160 puntos
function scoreToPos(s){ for(let i=0;i<5;i++){ if(s<EDGES[i+1] || i===4) return Math.min(5, i + Math.max(0,(s-EDGES[i]))/(EDGES[i+1]-EDGES[i])); } return 5; }
function scoreToLevel(s){ const p=scoreToPos(s); return p<1 ? "por debajo de A2" : LEVELS[Math.min(4,Math.floor(p))]; }
function estimate(){
  const sims = S.history.filter(h=>h.type==="sim").slice(-3);
  if(sims.length){ const avg = sims.reduce((a,h)=>a+h.correct,0)/sims.length; return {pos:scoreToPos(avg),src:"sim",score:Math.round(avg),n:sims.length}; }
  let best=null;
  ["A1","A2","B1","B2"].forEach((L,i)=>{
    const hs = S.history.filter(h=>h.type==="text"&&h.level===L).slice(-5);
    if(!hs.length) return;
    const a = hs.reduce((x,h)=>x+h.correct,0)/hs.reduce((x,h)=>x+h.total,0);
    const c = a>=0.4 ? i + Math.min(1,(a-0.4)/0.5) : Math.max(0, i-1 + a/0.4);
    if(best===null || c>best) best=c;
  });
  return best===null ? null : {pos:best,src:"practice"};
}
function posLabel(p){ return LEVELS[Math.min(4,Math.floor(p))]; }

