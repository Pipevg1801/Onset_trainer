/* OnSet trainer: vista Panel */
"use strict";

/* =========================================================
   PANEL
   ========================================================= */
function vDash(m){
  const est = estimate();
  const pos = est ? est.pos : 0;
  const lvl = est ? (pos<1 && est.src==="sim" ? "A1" : posLabel(pos)) : "—";
  const sub = !est ? "Haz un texto de práctica o un simulacro para calcular tu nivel."
    : est.src==="sim" ? `Media de tus últimos ${est.n} simulacros: ${est.score} de 160 puntos.`
    : "Estimación a partir de tus textos de práctica. Un simulacro la hace más precisa.";
  const recent = S.history.slice(-10);
  const acc = recent.length ? pct(recent.reduce((a,h)=>a+h.correct,0), recent.reduce((a,h)=>a+h.total,0)) : null;
  const sims = S.history.filter(h=>h.type==="sim");
  const bestSim = sims.length ? Math.max(...sims.map(h=>h.correct)) : null;
  const todayGaps = S.history.filter(h=>h.date.slice(0,10)===today()).reduce((a,h)=>a+h.total,0);

  m.innerHTML = `
  <h1>Tu camino al onSET</h1>
  <p class="lede">Entrena solo lo que mide el examen: completar palabras en textos cortos, con la terminación y la ortografía exactas, en 5 minutos por texto.</p>

  <section class="panel ruler-wrap" aria-label="Nivel estimado">
    <div class="ruler-head">
      <div class="ruler-level">${lvl}<small>${esc(sub)}</small></div>
      <div class="muted small">Meta: B1 como mínimo, B2 ideal.</div>
    </div>
    <div class="ruler">
      <div class="bands">${LEVELS.map(()=>"<div></div>").join("")}</div>
      <div class="fill" style="width:${est?pos/5*100:0}%"></div>
      ${est?`<div class="you" style="left:${Math.max(3,Math.min(97,pos/5*100))}%">Tú</div>`:""}
      <div class="goal" style="left:40%" title="Meta B1"></div>
      <div class="goal" style="left:60%" title="Meta B2"></div>
      <div class="labels">${LEVELS.map((L,i)=>`<span class="${est && Math.floor(pos)>=i?"on":""}">${L}</span>`).join("")}</div>
    </div>
    <div class="stats">
      <div class="stat"><span class="v">${S.xp}</span><span class="k">Puntos acumulados</span></div>
      <div class="stat"><span class="v">${streak()} ${streak()===1?"día":"días"}</span><span class="k">Racha de estudio</span></div>
      <div class="stat"><span class="v">${acc===null?"—":acc+" %"}</span><span class="k">Precisión (últimas 10)</span></div>
      <div class="stat"><span class="v">${bestSim===null?"—":bestSim+"/160"}</span><span class="k">Mejor simulacro</span></div>
    </div>
  </section>

  ${nextStep()}

  <div class="grid g2">
    <section class="panel">
      <h2>Resultados recientes</h2>
      ${chart()}
    </section>
    <section class="panel">
      <h2>Hoy</h2>
      <p class="small muted" style="margin-top:-6px">Meta diaria: 60 huecos (unos 3 textos).</p>
      <div class="bar" style="margin:8px 0 6px"><i style="width:${Math.min(100,pct(todayGaps,60))}%"></i></div>
      <p class="small"><b>${todayGaps}</b> de 60 huecos</p>
      <h3 style="margin-top:18px">Dominio de gramática</h3>
      <div class="mastery">${[...Object.entries(DRILLS),...Object.entries(QUIZ).map(([k,q])=>["q_"+k,q])].map(([k,d])=>{ const r=S.drills[k]||[]; const p=r.length?pct(r.filter(Boolean).length,r.length):0; return `<div class="m"><span>${d.name}</span><div class="bar"><i style="width:${p}%"></i></div><span class="small">${r.length?p+" %":"—"}</span></div>`; }).join("")}</div>
    </section>
  </div>

  <section class="panel" style="margin-top:18px">
    <h2>Actividad</h2>
    ${S.history.length ? `<ul class="list">${S.history.slice(-8).reverse().map(h=>{ const p=pct(h.correct,h.total), g=grade(p); return `<li><span>${esc(h.label)} <span class="badge lv">${esc(h.level)}</span></span><span>${h.correct}/${h.total} <span class="badge ${g.c}">${g.t}</span></span></li>`; }).join("")}</ul>` : `<div class="empty">Aún no hay actividad. <button class="btn small" data-view="practice">Empieza con un texto A1</button></div>`}
  </section>
  <p class="small muted" style="margin-top:22px">Las bandas de nivel son orientativas para practicar (sobre 160 puntos: A2 desde 50, B1 desde 80, B2 desde 110, C1 desde 135). El resultado oficial lo da el onSET real; puedes probar el test de muestra en <a href="https://www.onset.de" target="_blank" rel="noopener">onset.de</a>.</p>`;
}
function nextStep(){
  let t, v, b;
  const texts = S.history.filter(h=>h.type==="text");
  const weakDrill = Object.entries(DRILLS).map(([k,d])=>{const r=S.drills[k]||[]; return {k,d,n:r.length,p:r.length?r.filter(Boolean).length/r.length:0};}).sort((a,b)=>a.p-b.p)[0];
  const lastSim = S.history.filter(h=>h.type==="sim").slice(-1)[0];
  if(!S.history.length){ t="Empieza por un texto A1 para calentar y conocer el formato de los huecos."; v="practice"; b="Ir a Práctica"; }
  else if(S.errors.length>=15){ t=`Tienes ${S.errors.length} palabras falladas guardadas. Repasarlas es la forma más rápida de subir puntos.`; v="review"; b="Repasar errores"; }
  else if(weakDrill && weakDrill.p<0.7){ t=`Tu punto débil en gramática es «${weakDrill.d.name}». Una ronda de 10 frases te llevará 3 minutos.`; v="drills"; b="Practicar gramática"; }
  else if(texts.length>=4 && (!lastSim || Date.now()-new Date(lastSim.date).getTime()>3*864e5)){ t="Hace tiempo que no haces un simulacro completo. Mide tu progreso con 8 textos cronometrados."; v="sim"; b="Hacer simulacro"; }
  else { t="Sigue con textos del siguiente nivel. Cuando superes el 70 % en un nivel, pasa al siguiente."; v="practice"; b="Ir a Práctica"; }
  return `<div class="next"><p style="margin:0 0 10px"><b>Siguiente paso.</b> ${esc(t)}</p><button class="btn small" data-view="${v}">${b}</button></div>`;
}
function chart(){
  const h = S.history.filter(x=>x.type==="text"||x.type==="sim"||x.type==="custom").slice(-12);
  if(h.length<2) return `<div class="empty">Completa al menos 2 textos para ver tu evolución.</div>`;
  const W=460,H=190,P=30, step=(W-P*2)/(h.length-1);
  const pts = h.map((x,i)=>[P+i*step, H-P-(pct(x.correct,x.total)/100)*(H-P*2)]);
  const grid = [0,50,100].map(v=>{const y=H-P-(v/100)*(H-P*2); return `<line x1="${P}" x2="${W-P}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${P-6}" y="${y+4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`;}).join("");
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Porcentaje de aciertos en los últimos textos">${grid}
   <polyline fill="none" stroke="var(--ink)" stroke-width="2.5" points="${pts.map(p=>p.join(",")).join(" ")}"/>
   ${pts.map((p,i)=>h[i].type==="sim"?`<rect x="${p[0]-6}" y="${p[1]-6}" width="12" height="12" fill="var(--mark)" stroke="var(--ink)" stroke-width="1.5"><title>Simulacro: ${pct(h[i].correct,h[i].total)} %</title></rect>`:`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"><title>${esc(h[i].label)}: ${pct(h[i].correct,h[i].total)} %</title></circle>`).join("")}
  </svg><p class="small muted" style="margin:6px 0 0">% de aciertos. Los cuadrados amarillos son simulacros.</p></div>`;
}

