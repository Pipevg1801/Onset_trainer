/* Lückenlos: generador y corrector de C-Tests con el método onSET */
"use strict";

/* =========================================================
   GENERADOR DE C-TEST (formato onSET)
   Primera y última oración completas; en el resto se borra
   la segunda mitad de cada segunda palabra. 20 huecos.
   ========================================================= */
function splitSentences(t){ return (t.replace(/\s+/g," ").trim().match(/[^.!?]+[.!?]+["»”)]*\s*|[^.!?]+$/g)) || [t]; }
function buildCTest(text, maxGaps=20){
  const sents = splitSentences(text);
  const first = sents[0] || "";
  const hasLast = sents.length>2;
  const last = hasLast ? sents[sents.length-1] : "";
  const middle = sents.slice(1, hasLast ? -1 : undefined).join("");
  const parts = [{t:first}];
  const re = /[A-Za-zÄÖÜäöüßÀ-ÿ]+/g;
  let m, count=0, gaps=0, lastIdx=0;
  while((m = re.exec(middle))){
    const w = m[0];
    if(w.length<2 || gaps>=maxGaps) continue;
    count++;
    if(count%2===0){
      parts.push({t:middle.slice(lastIdx,m.index)});
      const keep = Math.floor(w.length/2);
      const ctx = (sents.find(s=>s.includes(w))||"").trim();
      parts.push({gap:true,prefix:w.slice(0,keep),ans:w.slice(keep),full:w,ctx});
      lastIdx = m.index + w.length; gaps++;
    }
  }
  parts.push({t:middle.slice(lastIdx)});
  if(last) parts.push({t:last});
  return parts;
}
function gapCount(parts){ return parts.filter(p=>p.gap).length; }

function renderCTest(parts, answers, checked){
  let gi=0, html="";
  for(const p of parts){
    if(!p.gap){ html += esc(p.t); continue; }
    const i = gi++;
    if(!checked){
      const w = p.prefix.length + 1;
      html += `<span class="gapw">${esc(p.prefix)}<input data-gap="${i}" aria-label="Hueco ${i+1}: ${esc(p.prefix)}…" maxlength="${w}" style="width:${w+0.6}ch" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(answers[i]||"")}"></span>`;
    } else {
      const v = (answers[i]||"").trim();
      if(v===p.ans) html += `<span class="gapw ok">${esc(p.prefix)}<b>${esc(p.ans)}</b></span>`;
      else html += `<span class="gapw bad">${esc(p.prefix)}${v?`<s>${esc(v)}</s>`:""}<b>${esc(p.ans)}</b></span>`;
    }
  }
  return html;
}
function readAnswers(){ const a=[]; document.querySelectorAll("input[data-gap]").forEach(inp=>a[+inp.dataset.gap]=inp.value); return a; }
function scoreParts(parts, answers){
  let gi=0, ok=0, missed=[];
  for(const p of parts){ if(!p.gap) continue; const v=(answers[gi]||"").trim(); if(v===p.ans) ok++; else missed.push(p); gi++; }
  return {ok, total:gi, missed};
}
function addErrors(missed, level){
  for(const p of missed){
    const ex = S.errors.find(e=>e.full===p.full && e.prefix===p.prefix);
    if(ex){ ex.count++; ex.hits=0; ex.ctx = ex.ctx || p.ctx; }
    else S.errors.push({full:p.full,prefix:p.prefix,ans:p.ans,ctx:p.ctx,level,count:1,hits:0});
  }
}
const umlautBar = () => `<div class="umlauts" aria-label="Teclado alemán">${["ä","ö","ü","ß","Ä","Ö","Ü"].map(c=>`<button type="button" data-ch="${c}" aria-label="Insertar ${c}">${c}</button>`).join("")}</div>`;

