/* OnSet trainer: vista Plan de 4 semanas */
"use strict";

/* =========================================================
   PLAN de 4 semanas
   ========================================================= */
function vPlan(m){
  const all = PLAN.flatMap(w=>w.tasks), done = all.filter(t=>S.plan[t[0]]).length;
  m.innerHTML = `<h1>Plan de 4 semanas</h1>
  <p class="lede">Unas 2 o 3 horas al día. Marca cada tarea al terminarla; el plan prioriza lo que da puntos en el onSET: terminaciones, palabras frecuentes y velocidad de lectura.</p>
  <div class="row" style="margin-bottom:22px"><div class="bar" style="flex:1;max-width:420px"><i style="width:${pct(done,all.length)}%"></i></div><span class="small"><b>${done}</b> de ${all.length} tareas</span></div>
  ${PLAN.map(w=>`<section class="panel week"><h2>${w.w}: ${esc(w.title)}</h2><ul class="tasks">${w.tasks.map(([id,txt,v])=>`<li class="${S.plan[id]?"done":""}"><input type="checkbox" id="${id}" data-task="${id}" ${S.plan[id]?"checked":""}><span><label for="${id}">${esc(txt)}</label>${v?` <button class="btn ghost small" style="margin-left:6px;padding:2px 10px" data-view="${v}">Abrir</button>`:""}</span></li>`).join("")}</ul></section>`).join("")}`;
  m.querySelectorAll("[data-task]").forEach(cb=>cb.onchange=()=>{ S.plan[cb.dataset.task]=cb.checked; if(cb.checked){ S.xp+=3; markDay(); toast("+3 puntos"); } save(); render(); });
}

