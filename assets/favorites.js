/* Favoritos locales. Las claves no dependen del orden del catálogo. */
(()=>{'use strict';
 const KEY='uni-explorer.favorites.v1',universities=['ehu','upna','deusto','navarra'];
 const valid=x=>x&&universities.includes(x.uni)&&typeof x.key==='string'&&x.key.length>0&&x.key.length<=1000;
 function read(){try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version!==1||!Array.isArray(saved.items))return[];const seen=new Set();return saved.items.filter(x=>{if(!valid(x))return false;const id=JSON.stringify([x.uni,x.key]);if(seen.has(id))return false;seen.add(id);return true;}).map(x=>({uni:x.uni,key:x.key}));}catch{return[];}}
 let items=read();
 const has=(uni,key)=>items.some(x=>x.uni===uni&&x.key===key);
 function toggle(uni,key){if(!valid({uni,key}))return {ok:false,error:'No se ha podido identificar esta carrera.'};
  // Recoger también los cambios realizados desde otra pestaña antes de guardar.
  const current=read(),added=!current.some(x=>x.uni===uni&&x.key===key),next=added?[...current,{uni,key}]:current.filter(x=>x.uni!==uni||x.key!==key);
  try{localStorage.setItem(KEY,JSON.stringify({version:1,items:next}));items=next;window.dispatchEvent(new Event('uni-favorites-change'));return {ok:true,added};}catch{return {ok:false,error:'El navegador no permite guardar favoritos. Revisa los permisos de almacenamiento local.'};}
 }
 function csv(rows){const quote=value=>{let s=String(value??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return '\uFEFF'+rows.map(row=>row.map(quote).join(';')).join('\r\n')+'\r\n';}
 window.UniFavorites={get:()=>items.map(x=>({...x})),has,toggle,csv};
 window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){items=read();window.dispatchEvent(new Event('uni-favorites-change'));}});
})();
