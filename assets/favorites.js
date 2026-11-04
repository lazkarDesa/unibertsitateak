/* Decisiones locales. Las claves no dependen del orden del catálogo. */
(()=>{'use strict';
 const KEY='uni-explorer.selections.v2',LEGACY='uni-explorer.favorites.v1',universities=['ehu','upna','deusto','navarra','mondragon','euneiz','uned'];
 const states={none:{label:'Sin marcar',description:'Todavía no la he valorado.'},doubt:{label:'En duda',description:'Quiero conocerla mejor antes de decidir.'},selected:{label:'Me interesa',description:'Quiero mantenerla entre mis opciones.'},rejected:{label:'No me interesa',description:'La descarto por ahora; puedo cambiarlo después.'}};
 const valid=x=>x&&universities.includes(x.uni)&&typeof x.key==='string'&&x.key.length>0&&x.key.length<=1000;
 function read(){try{const raw=localStorage.getItem(KEY),saved=JSON.parse(raw===null?localStorage.getItem(LEGACY):raw),legacy=raw===null;if(saved?.version!==(legacy?1:2)||!Array.isArray(saved.items))return[];const seen=new Set();return saved.items.filter(x=>{if(!valid(x)||(!legacy&&!['doubt','selected','rejected'].includes(x.status)))return false;const id=JSON.stringify([x.uni,x.key]);if(seen.has(id))return false;seen.add(id);return true;}).map(x=>({uni:x.uni,key:x.key,status:legacy?'selected':x.status}));}catch{return[];}}
 let items=read();
 try{if(localStorage.getItem(KEY)===null&&localStorage.getItem(LEGACY)!==null)localStorage.setItem(KEY,JSON.stringify({version:2,items}));}catch{}
 const status=(uni,key)=>items.find(x=>x.uni===uni&&x.key===key)?.status||'none';
 const has=(uni,key)=>['selected','doubt'].includes(status(uni,key));
 function setStatus(uni,key,value){if(!valid({uni,key})||!Object.hasOwn(states,value))return {ok:false,error:'No se ha podido identificar esta carrera o su estado.'};
  const next=read().filter(x=>x.uni!==uni||x.key!==key);if(value!=='none')next.push({uni,key,status:value});
  try{localStorage.setItem(KEY,JSON.stringify({version:2,items:next}));items=next;window.dispatchEvent(new Event('uni-favorites-change'));return {ok:true,status:value};}catch{return {ok:false,error:'El navegador no permite guardar tu selección. Revisa los permisos de almacenamiento local.'};}
 }
 // Compatibilidad con la interfaz anterior de favoritos.
 function toggle(uni,key){const added=!has(uni,key),r=setStatus(uni,key,added?'selected':'none');return {...r,added};}
 function csv(rows){const quote=value=>{let s=String(value??'');if(window.UniI18n)s=/^https:\/\//.test(s)?window.UniI18n.url(s):window.UniI18n.text(s);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return '\uFEFF'+rows.map(row=>row.map(quote).join(';')).join('\r\n')+'\r\n';}
 function icon(value){const shape={none:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12h7"/>',doubt:'<circle cx="12" cy="12" r="9"/><path d="M9.3 8.6a2.8 2.8 0 0 1 5.4.9c0 2-2.7 2.1-2.7 4.1"/><path d="M12 17h.01"/>',selected:'<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',rejected:'<circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7m0-7-7 7"/>'};return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape[value]||shape.none}</svg>`;}
 window.UniFavorites={get:()=>items.map(x=>({...x})),status,setStatus,states,icon,has,toggle,csv};
 window.addEventListener('storage',e=>{if(e.key===KEY||e.key===LEGACY||e.key===null){items=read();window.dispatchEvent(new Event('uni-favorites-change'));}});
})();
