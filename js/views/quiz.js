/* Lückenlos: vista Test de artículos y pronombres */
"use strict";

/* =========================================================
   TEST DE SELECCIÓN MÚLTIPLE: artículos y pronombres
   ========================================================= */
const PNOM = {ich:["ich",0,"yo"],du:["du",1,"tú"],er:["er",2,"él"],sie:["sie",2,"ella"],wir:["wir",3,"nosotros"],ihr:["ihr",4,"ustedes, informal"],sie3:["sie",5,"ellos"],Sie:["Sie",5,"usted, formal"]};
function artQuizItem(){
  const c = rnd(["nom","akk","akk","dat","dat","gen"]);
  const it = npItem(c,false,true); if(!it) return null;
  const fam = it.dt==="def" ? ["der","die","das","den","dem","des"] : ["","e","en","em","er","es"].map(e=>STEM[it.dt]+e);
  const raw = it.detRaw, fix = o => it.start ? cap(o) : o;
  const opts = [raw, ...shuffle(fam.filter(f=>f!==raw)).slice(0,3)].map(fix);
  return {pre:it.before, post:it.post, options:shuffle(opts), ans:fix(raw), cue:null, expl:it.expl, c};
}
function pronQuizItem(){
  const c = rnd(["nom","akk","akk","dat","dat"]);
  let pre, post, p, form, cue, r;
  if(c==="nom"){
    p = rnd(PRON); const [f,idx,cueN] = PNOM[p.k]; const v = rnd(VERBS.filter(x=>!x.p));
    pre = rnd(["Heute","Jetzt","Morgen früh"])+" "+v.f[idx]+" "; post = " "+v.c+"."; form = f; cue = cueN; r = `es el sujeto del verbo «${v.i}»`;
  } else {
    const tp = rnd(PTPL.filter(x=>x.c===c)); p = rnd(PRON.filter(x=>!tp.x.includes(x.k)));
    [pre, post] = tp.t.split("{PR}"); form = p[c]; cue = p.es; r = tp.r;
  }
  const own = shuffle([PNOM[p.k][0], p.akk, p.dat]);
  const others = shuffle(PRON.filter(x=>x.k!==p.k)).map(x=> c==="nom" ? PNOM[x.k][0] : x[c]);
  const set = [form]; for(const o of own.concat(others)) if(!set.includes(o) && set.length<4) set.push(o);
  return {pre, post, options:shuffle(set), ans:form, cue, expl:`${CASE_ES[c]}. ${sent(r)} «${cue}» → ${form}.`, c};
}
const QUIZ = {
  art:{name:"Test de artículos",desc:"Elige entre der, die, das, den, dem, des, ein, einen, meinem, keiner… según el caso y el género.",gen:artQuizItem},
  pron:{name:"Test de pronombres",desc:"Elige entre ich, mich, mir, er, ihn, ihm, sie, ihr, ihnen… según la función en la frase.",gen:pronQuizItem}
};
function quizItems(mode,n){
  const out=[], seen=new Set(); let t=0;
  while(out.length<n && t<500){ t++; const it=QUIZ[mode].gen(); if(!it) continue; const k=it.pre+"|"+it.ans+"|"+it.post; if(seen.has(k)) continue; seen.add(k); out.push(it); }
  return out;
}
function startQuiz(mode){ session={kind:"quiz",mode,items:quizItems(mode,15),i:0,picked:[],done:false}; render(); window.scrollTo(0,0); }
function vQuiz(m){
  if(session && session.kind==="quiz") return session.done ? quizResults(m) : quizQuestion(m);
  m.innerHTML = `<h1>Test de artículos y pronombres</h1>
  <p class="lede">Rondas de 15 preguntas de selección múltiple. Lee la frase, piensa en la función de la palabra que falta y elige la forma correcta. Las frases, los sustantivos, los géneros y el orden de las opciones cambian en cada ronda.</p>
  <div class="grid g2">${Object.entries(QUIZ).map(([k,q])=>{ const p=mastery("q_"+k); return `<section class="panel">
    <h2>${q.name}</h2><p class="small muted">${q.desc}</p>
    <div class="row" style="margin:12px 0 14px"><div class="bar" style="flex:1"><i style="width:${p||0}%"></i></div><span class="small">${p===null?"Sin hacer":"Dominio "+p+" %"}</span></div>
    <button class="btn" data-quiz="${k}">Empezar ronda de 15</button></section>`; }).join("")}</div>
  <p class="small muted" style="margin-top:20px">Atajo de teclado: pulsa 1, 2, 3 o 4 para elegir y Enter para pasar a la siguiente pregunta. Si dudas, repasa las clases de los casos en Gramática.</p>`;
  m.querySelectorAll("[data-quiz]").forEach(b=>b.onclick=()=>startQuiz(b.dataset.quiz));
}
function quizQuestion(m){
  const s=session, it=s.items[s.i], picked=s.picked[s.i];
  const answered = picked!==undefined;
  m.innerHTML = `<div class="dots" aria-label="Progreso">${s.items.map((_,j)=>{ const pk=s.picked[j]; const cls = j===s.i ? "cur" : pk===undefined ? "" : (pk===s.items[j].ans ? "done" : "miss"); return `<span class="${cls}"></span>`; }).join("")}</div>
  <article class="sheet quiz">
    <div class="meta"><h2>${QUIZ[s.mode].name}</h2><span class="small muted">Pregunta ${s.i+1} de ${s.items.length}</span></div>
    <p class="qsent">${esc(it.pre)}<span class="qblank ${answered?(picked===it.ans?"ok":"bad"):""}">${answered?esc(it.ans):"&nbsp;"}</span>${esc(it.post)}${it.cue?`<span class="hint">(${esc(it.cue)})</span>`:""}</p>
    <div class="qopts">${it.options.map((o,j)=>{ const cls = !answered ? "" : o===it.ans ? "ok" : (o===picked ? "bad" : "dim"); return `<button class="qopt ${cls}" data-opt="${j}" ${answered?"disabled":""}><span class="k">${j+1}</span>${esc(o)}</button>`; }).join("")}</div>
    ${answered?`<p class="expl" style="margin-top:16px">${picked===it.ans?"<b>Correcto.</b> ":"<b>Incorrecto.</b> "}${esc(it.expl)}</p>
      <button class="btn" id="qnext">${s.i<s.items.length-1?"Siguiente pregunta":"Ver resultado"}</button>`:""}
  </article>
  <div class="row" style="margin-top:14px"><button class="btn ghost small" id="qexit">Salir del test</button></div>`;
  m.querySelectorAll("[data-opt]").forEach(b=>b.onclick=()=>quizPick(+b.dataset.opt));
  const n=$("#qnext"); if(n){ n.onclick=quizNext; n.focus({preventScroll:true}); }
  $("#qexit").onclick=()=>{ session=null; render(); };
}
function quizPick(j){ const s=session; if(!s||s.kind!=="quiz"||s.done||s.picked[s.i]!==undefined) return; const it=s.items[s.i]; if(!it.options[j]) return; s.picked[s.i]=it.options[j]; render(); }
function quizNext(){
  const s=session; if(!s||s.picked[s.i]===undefined) return;
  if(s.i<s.items.length-1){ s.i++; render(); return; }
  s.done=true;
  const good = s.items.filter((it,j)=>s.picked[j]===it.ans).length;
  const key="q_"+s.mode, arr=S.drills[key]||[];
  s.items.forEach((it,j)=>arr.push(s.picked[j]===it.ans)); S.drills[key]=arr.slice(-30);
  S.xp+=good;
  S.history.push({type:"quiz",label:QUIZ[s.mode].name,level:"Test",correct:good,total:s.items.length,date:new Date().toISOString()});
  markDay(); save(); render(); window.scrollTo(0,0);
}
function quizResults(m){
  const s=session, good=s.items.filter((it,j)=>s.picked[j]===it.ans).length, p=pct(good,s.items.length), g=grade(p);
  const miss = s.items.map((it,j)=>({it,pk:s.picked[j]})).filter(x=>x.pk!==x.it.ans);
  m.innerHTML = `<h1>${QUIZ[s.mode].name}: resultado</h1>
  <section class="panel">
    <div class="score" style="border:0;margin-top:0;padding-top:0"><span class="big">${good}/${s.items.length}</span><span class="badge ${g.c}">${g.t}</span><span class="muted">+${good} puntos</span></div>
    ${miss.length?`<h3 style="margin-top:14px">Tus errores</h3><ul class="ex">${miss.map(({it,pk})=>`<li><div class="de">${esc(it.pre)}<span class="gapw bad"><s>${esc(pk)}</s> <b>${esc(it.ans)}</b></span>${esc(it.post)}${it.cue?`<span class="hint">(${esc(it.cue)})</span>`:""}</div><div class="es">${esc(it.expl)}</div></li>`).join("")}</ul>`:`<p>Ronda perfecta.</p>`}
    <div class="row" style="margin-top:16px"><button class="btn" id="qagain">Nueva ronda aleatoria</button><button class="btn ghost" id="qback">Volver al test</button></div>
  </section>`;
  $("#qagain").onclick=()=>startQuiz(s.mode);
  $("#qback").onclick=()=>{ session=null; render(); };
}

