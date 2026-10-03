/* Lückenlos: vista Repaso de errores */
"use strict";

/* =========================================================
   REPASO de errores
   ========================================================= */
function vReview(m){
  if(session && session.kind==="review") return reviewSession(m);
  const errs = S.errors.slice().sort((a,b)=>b.count-a.count);
  m.innerHTML = `<h1>Repaso de errores</h1>
  <p class="lede">Aquí se guardan las palabras que fallaste. Cada una desaparece de la lista cuando la aciertas dos veces seguidas.</p>
  ${errs.length?`<section class="panel"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 style="margin:0">${errs.length} ${errs.length===1?"palabra":"palabras"}</h2><button class="btn" id="startRev">Repasar ${Math.min(15,errs.length)} ahora</button></div>
   <ul class="list">${errs.slice(0,40).map(e=>`<li><span style="font-family:var(--serif)">${esc(e.prefix)}<b>${esc(e.ans)}</b></span><span class="small muted">${e.count} ${e.count===1?"fallo":"fallos"} ${e.hits?`<span class="badge ok">${e.hits}/2</span>`:""}</span></li>`).join("")}</ul>
   ${errs.length>40?`<p class="small muted">Y ${errs.length-40} más.</p>`:""}</section>`
   :`<div class="panel empty">No tienes errores guardados. Cuando falles un hueco en Práctica o en un simulacro, aparecerá aquí.<div style="margin-top:14px"><button class="btn small" data-view="practice">Ir a Práctica</button></div></div>`}`;
  const st=$("#startRev"); if(st) st.onclick=()=>{
    const pickE = errs.slice(0,30); const items = shuffle(pickE).slice(0,15);
    session={kind:"review",items,answers:[],checked:false}; render(); window.scrollTo(0,0);
  };
}
function reviewSession(m){
  const s=session; let ok=0;
  const rows = s.items.map((e,i)=>{
    const ctx = e.ctx || e.full; const k = ctx.indexOf(e.full);
    const before = k>=0?ctx.slice(0,k):"", after = k>=0?ctx.slice(k+e.full.length):"";
    if(!s.checked){ const w=e.prefix.length+1; return `<div class="drill-item">${esc(before)}<span class="gapw">${esc(e.prefix)}<input data-gap="${i}" aria-label="Palabra ${i+1}" maxlength="${w}" style="width:${w+0.6}ch" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(s.answers[i]||"")}"></span>${esc(after)}</div>`; }
    const v=(s.answers[i]||"").trim(), good=v===e.ans; if(good) ok++;
    return `<div class="drill-item">${esc(before)}<span class="gapw ${good?"ok":"bad"}">${esc(e.prefix)}${!good&&v?`<s>${esc(v)}</s>`:""}<b>${esc(e.ans)}</b></span>${esc(after)}</div>`;
  }).join("");
  m.innerHTML = `<article class="sheet"><div class="meta"><h2>Repaso</h2><span class="small muted">${s.items.length} palabras</span></div>
   ${rows}
   ${s.checked?`<div class="score"><span class="big">${ok}/${s.items.length}</span><span class="badge ${grade(pct(ok,s.items.length)).c}">${grade(pct(ok,s.items.length)).t}</span><span class="muted">+${ok} puntos</span></div><div class="row"><button class="btn" id="back">Volver al repaso</button></div>`
   :umlautBar()+`<div class="row" style="margin-top:14px"><button class="btn" id="check">Comprobar</button><button class="btn ghost" id="back">Salir</button></div>`}</article>`;
  const c=$("#check"); if(c) c.onclick=()=>{
    s.answers=readAnswers(); s.checked=true; let good=0;
    s.items.forEach((e,i)=>{ const ref=S.errors.find(x=>x.full===e.full&&x.prefix===e.prefix); if(!ref) return; if((s.answers[i]||"").trim()===e.ans){ good++; ref.hits++; } else { ref.hits=0; ref.count++; } });
    S.errors = S.errors.filter(x=>x.hits<2);
    S.xp+=good;
    S.history.push({type:"review",label:"Repaso de errores",level:"Rep.",correct:good,total:s.items.length,date:new Date().toISOString()});
    markDay(); save(); render();
  };
  const b=$("#back"); if(b) b.onclick=()=>{ session=null; render(); };
}

