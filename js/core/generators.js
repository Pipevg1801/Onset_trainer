/* OnSet trainer: generadores aleatorios de ejercicios (artículos, adjetivos, pronombres, verbos, plurales) */
"use strict";

/* =========================================================
   GENERADORES ALEATORIOS DE EJERCICIOS
   Cada ronda se crea al azar: nunca sale la misma lista.
   ========================================================= */
const rnd = a => a[Math.floor(Math.random()*a.length)];
const cap = s => s ? s[0].toUpperCase()+s.slice(1) : s;
const sent = r => cap(r)+(/[?.!]$/.test(r)?"":".");
const cSplit = w => { const k=Math.floor(w.length/2); return {prefix:w.slice(0,k),ans:w.slice(k)}; };
const CASE_ES = {nom:"Nominativo",akk:"Acusativo",dat:"Dativo",gen:"Genitivo"};
const G_ES = {m:"masculino",f:"femenino",n:"neutro",p:"plural"};
const DEF = {nom:{m:"der",f:"die",n:"das",p:"die"},akk:{m:"den",f:"die",n:"das",p:"die"},dat:{m:"dem",f:"der",n:"dem",p:"den"},gen:{m:"des",f:"der",n:"des",p:"der"}};
const EIN_END = {nom:{m:"",f:"e",n:"",p:"e"},akk:{m:"en",f:"e",n:"",p:"e"},dat:{m:"em",f:"er",n:"em",p:"en"},gen:{m:"es",f:"er",n:"es",p:"er"}};
const STEM = {def:"d",ein:"ein",kein:"kein",mein:"mein",dein:"dein",sein:"sein",unser:"unser"};
const detForm = (t,c,g) => t==="def" ? DEF[c][g] : STEM[t]+EIN_END[c][g];
const WEAK = {nom:{m:"e",f:"e",n:"e",p:"en"},akk:{m:"en",f:"e",n:"e",p:"en"},dat:{m:"en",f:"en",n:"en",p:"en"},gen:{m:"en",f:"en",n:"en",p:"en"}};
const STRONG = {nom:{m:"er",f:"e",n:"es",p:"e"},akk:{m:"en",f:"e",n:"es",p:"e"},dat:{m:"em",f:"er",n:"em",p:"en"},gen:{m:"en",f:"er",n:"en",p:"er"}};
function adjEnd(t,c,g){ if(t==="def") return WEAK[c][g]; if(t==="none") return STRONG[c][g]; if(g==="p") return "en"; return EIN_END[c][g]==="" ? STRONG[c][g] : WEAK[c][g]; }


function nounForm(n,c){ const [g,s,gen,datp]=n; if(c==="dat"&&g==="p") return datp||s; if(c==="gen"&&(g==="m"||g==="n")) return gen||s+"s"; return s; }

const agree = (t,g) => t.replace(/\{([^|{}]+)\|([^}]+)\}/g,(_,a,b)=>g==="p"?b:a);

function npItem(c, adj, allowEmpty){
  for(let tries=0; tries<80; tries++){
    const tp = rnd(TPL.filter(x=>x.c===c));
    const n = rnd(NS[tp.set]); const g = n[0];
    let dets = tp.d || (tp.set==="pers" ? ["def","def","ein","mein","dein","sein","unser"] : ["def","def","ein","kein","mein","unser"]);
    if(adj && g==="p" && !tp.d) dets = dets.concat(["none","none"]);
    const dt = rnd(dets);
    if(g==="p" && dt==="ein") continue;
    if(!adj && !allowEmpty && dt!=="def" && EIN_END[c][g]==="") continue;
    const det = dt==="none" ? "" : detForm(dt,c,g);
    const noun = nounForm(n,c);
    const start = tp.t.startsWith("{NP}");
    const [pre, post] = agree(tp.t,g).split("{NP}");
    if(adj){
      const a = rnd(ADJ[tp.set]), e = adjEnd(dt,c,g);
      const d = det && start ? cap(det) : det, ad = !det && start ? cap(a) : a;
      let expl;
      if(dt==="def") expl = `Tras artículo definido («${det}»): ${e==="e"?"forma básica, termina en -e":"el artículo ya muestra el caso, así que termina en -en"}.`;
      else if(dt==="none") expl = `Sin artículo, el adjetivo toma la terminación del artículo definido (${DEF[c][g]}) → -${e}.`;
      else if(e==="er"||e==="es") expl = `«${det}» no muestra el género ${G_ES[g]}, así que lo muestra el adjetivo → -${e}.`;
      else expl = `Tras «${det}» (${CASE_ES[c].toLowerCase()}, ${G_ES[g]}) → -${e}.`;
      return {type:"gap",before:pre+(d?d+" ":""),prefix:ad,ans:e,post:" "+noun+post,expl,c};
    }
    const stem = STEM[dt], shown = start ? cap(stem) : stem;
    return {type:"gap",before:pre,prefix:shown,ans:det.slice(stem.length),post:" "+noun+post,
      expl:`${CASE_ES[c]}. ${sent(tp.r)} ${cap(G_ES[g])} → ${det}.`,c,r:tp.r,
      mcPre:pre,mcNP:(start?cap(det):det)+" "+noun,mcPost:post,detRaw:det,dt,start};
  }
  return null;
}
function pronItem(c){
  const tp = rnd(PTPL.filter(x=>x.c===c)); const p = rnd(PRON.filter(x=>!tp.x.includes(x.k)));
  const form = p[c], [pre,post] = tp.t.split("{PR}"), sp = cSplit(form);
  return {type:"gap",before:pre,prefix:sp.prefix,ans:sp.ans,post,hint:p.es,expl:`${CASE_ES[c]}. ${sent(tp.r)} «${p.es}» → ${form}.`,c,r:tp.r,mcPre:pre,mcNP:form,mcPost:post};
}
function caseItem(c){ return (PTPL.some(x=>x.c===c) && Math.random()<0.3) ? pronItem(c) : npItem(c,false); }
function mcItem(){
  const c = rnd(["nom","akk","dat","gen"]); const it = caseItem(c); if(!it) return null;
  return {type:"mc",pre:it.mcPre,np:it.mcNP,post:it.mcPost,options:shuffle(["nom","akk","dat","gen"]),ans:c,expl:`${CASE_ES[c]}. ${sent(it.r)}`};
}


function verbItem(){
  const v = rnd(VERBS), [s,p] = rnd(SUBJ), form = v.f[p], sp = cSplit(form);
  const inv = v.p || Math.random()<0.4;
  const low = (s==="Maria") ? s : s[0].toLowerCase()+s.slice(1);
  const time = v.p ? rnd(["Gestern","Letzte Woche"]) : rnd(["Heute","Jetzt"]);
  const expl = `«${v.i}» con ${PERS_ES[p]} → ${form}${v.n?". "+cap(v.n):""}.`;
  if(inv) return {type:"gap",before:time+" ",prefix:sp.prefix,ans:sp.ans,post:` ${low} ${v.c}.`,expl};
  return {type:"gap",before:s+" ",prefix:sp.prefix,ans:sp.ans,post:` ${v.c}.`,expl};
}


function pluralItem(){
  const [g,s,pl,t,rule] = rnd(PL), [pre,post] = rnd(PL_FR[t]).split("{PL}"), sp = cSplit(pl);
  return {type:"gap",before:pre,prefix:sp.prefix,ans:sp.ans,post,hint:`${DEF.nom[g]} ${s}`,expl:`${DEF.nom[g]} ${s} → die ${pl}: ${rule}.`};
}

