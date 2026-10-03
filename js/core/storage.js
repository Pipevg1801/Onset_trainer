/* Lückenlos: guardado del progreso */
"use strict";

/* =========================================================
   ESTADO Y GUARDADO (localStorage del navegador)
   ========================================================= */
const LS_KEY = "luckenlos-v1";
const blank = () => ({v:1,xp:0,history:[],errors:[],drills:{},plan:{},days:[],custom:[],best:{},updatedAt:0});
let S = blank();

function loadLocal(){ try{ const r = localStorage.getItem(LS_KEY); if(r){ S = Object.assign(blank(), JSON.parse(r)); } }catch(e){} }
function save(){
  S.updatedAt = Date.now();
  if(S.history.length>300) S.history = S.history.slice(-300);
  if(S.errors.length>300) S.errors = S.errors.slice(-300);
  try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }catch(e){}
}

/* Exportar e importar el progreso como archivo, para pasarlo a otro dispositivo */
function exportProgress(){
  const blob = new Blob([JSON.stringify(S,null,1)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "luckenlos-progreso-"+today()+".json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  toast("Progreso exportado");
}
function importProgress(file){
  const r = new FileReader();
  r.onload = () => {
    try{
      const d = JSON.parse(r.result);
      if(!d || typeof d!=="object" || !Array.isArray(d.history)) throw new Error("formato");
      if(!confirm("¿Reemplazar tu progreso actual por el del archivo?")) return;
      S = Object.assign(blank(), d); save(); go("dash"); toast("Progreso importado");
    }catch(e){ toast("El archivo no es un progreso válido"); }
  };
  r.readAsText(file);
}
