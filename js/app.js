/* OnSet trainer: navegación, eventos globales e inicio. Se carga al final. */
"use strict";

/* =========================================================
   NAVEGACIÓN
   ========================================================= */
const VIEWS = [["dash","Panel"],["sim","Simulacro"],["practice","Práctica"],["drills","Gramática"],["quiz","Test"],["review","Repaso"],["custom","Mi texto"],["plan","Plan"]];
let view = "dash", session = null, timer = null;
function clearTimer(){ if(timer){ clearInterval(timer); timer=null; } }
function go(v){ clearTimer(); session=null; view=v; render(); window.scrollTo(0,0); }
function renderNav(){
  const h = VIEWS.map(([k,l])=>`<button class="navbtn" data-view="${k}" ${view===k?'aria-current="page"':""}>${l}</button>`).join("");
  $("#navSide").innerHTML = h; $("#navBottom").innerHTML = h;
}
function render(){
  renderNav();
  const m = $("#main");
  ({dash:vDash,sim:vSim,practice:vPractice,drills:vDrills,quiz:vQuiz,review:vReview,custom:vCustom,plan:vPlan})[view](m);
  const first = m.querySelector("input[data-gap]");
  if(first && session && !session.checked) setTimeout(()=>first.focus({preventScroll:true}),30);
}

/* =========================================================
   EVENTOS GLOBALES
   ========================================================= */
let lastInput = null;
document.addEventListener("focusin", e=>{ if(e.target.matches("input[data-gap]")) lastInput=e.target; });
document.addEventListener("mousedown", e=>{ if(e.target.closest(".umlauts button")) e.preventDefault(); });
document.addEventListener("click", e=>{
  const u = e.target.closest(".umlauts button");
  if(u){ const inp = lastInput && document.body.contains(lastInput) ? lastInput : document.querySelector("input[data-gap]"); if(!inp) return;
    const ch=u.dataset.ch, s=inp.selectionStart??inp.value.length, en=inp.selectionEnd??s;
    if(inp.value.length - (en-s) >= inp.maxLength) return;
    inp.value = inp.value.slice(0,s)+ch+inp.value.slice(en); inp.focus(); inp.setSelectionRange(s+1,s+1); return; }
  const v = e.target.closest("[data-view]");
  if(v){ go(v.dataset.view); return; }
});
document.addEventListener("change", e=>{ if(e.target.matches("select.choice")) easyChoose(e.target); });
document.addEventListener("keydown", e=>{
  if(view==="quiz" && session && session.kind==="quiz" && !session.done && !e.target.matches("input,textarea,select")){
    if(/^[1-4]$/.test(e.key)){ quizPick(+e.key-1); return; }
    if(e.key==="Enter" && session.picked[session.i]!==undefined){ e.preventDefault(); quizNext(); return; }
  }
  if(e.key==="Enter" && e.target.matches("input[data-gap]")){
    e.preventDefault();
    const all=[...document.querySelectorAll("input[data-gap]")]; const i=all.indexOf(e.target);
    if(all[i+1]) all[i+1].focus(); else { const c=$("#check")||$("#nextText"); if(c) c.focus(); }
  }
});
$("#resetBtn").onclick=()=>{ if(confirm("¿Borrar todo tu progreso? Esto no se puede deshacer.")){ S=blank(); save(); go("dash"); toast("Progreso borrado"); } };

$("#exportBtn").onclick=exportProgress;
$("#importBtn").onclick=()=>$("#importFile").click();
$("#importFile").onchange=e=>{ const f=e.target.files[0]; if(f) importProgress(f); e.target.value=""; };

loadLocal();
render();
