/* Perfil de 2.º de Bachillerato y PAU en Euskadi. Sin cuentas ni envíos de datos. */
(()=>{'use strict';
 const KEY='uni-explorer.profile.v1';
 // Conservar estas opciones para versiones dirigidas a otros perfiles de alumnado.
 const PROFILE_OPTIONS={allowLanguageChoice:false,allowBasqueExemption:false};
 const common=['Historia de España','Historia de la Filosofía','Lengua Vasca y Literatura II','Lengua Castellana y Literatura II'];
 const languages=['Inglés','Francés','Alemán','Italiano','Portugués'];
 const tracks={science:{name:'Ciencias y Tecnología',core:['Matemáticas II','Matemáticas Aplicadas a las Ciencias Sociales II'],other:['Biología','Dibujo Técnico II','Física','Geología y Ciencias Ambientales','Química','Tecnología e Ingeniería II']},humanities:{name:'Humanidades y Ciencias Sociales',core:['Latín II','Matemáticas Aplicadas a las Ciencias Sociales II'],other:['Empresa y Diseño de Modelos de Negocio','Geografía','Griego II','Historia del Arte','Latín II','Matemáticas Aplicadas a las Ciencias Sociales II']}};
 const art=['Dibujo Artístico II','Dibujo Técnico Aplicado a las Artes Plásticas y al Diseño II','Diseño','Fundamentos Artísticos','Técnicas de Expresión Gráfico-Plásticas','Análisis Musical II','Artes Escénicas II','Coro y Técnica Vocal II','Historia de la Música y de la Danza','Literatura Dramática','Ciencias Generales','Movimientos Culturales y Artísticos'];
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\([^)]*\)/g,'').replace(/[^a-z0-9]/g,'');
 const subjectKey=s=>{let k=norm(s);if(k.startsWith('tecnicasdeexpresiongrafico'))return 'tecnicasdeexpresiongrafico';if(k==='artesescenicas')return 'artesescenicasii';return k;};
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const rows=[...(window.EHU_DATA?.ponderaciones||[]),...(window.UPNA_DATA?.grados||[]).flatMap(g=>g.ponderaciones||[])];
 const weighted=new Set(rows.filter(p=>p.coeficiente===0.1||p.coeficiente===0.2).map(p=>subjectKey(p.materia)));
 const electives=[...new Set([...Object.values(tracks).flatMap(t=>[...t.core,...t.other]),...art])].filter(s=>weighted.has(subjectKey(s))).sort((a,b)=>a.localeCompare(b,'es'));
 const defaultProfile=()=>({version:1,track:'',core:'',modality:[],elective:'Otra optativa sin ponderación',language:'Inglés',history:'Historia de España',basque:true});
 function applyProfileOptions(p){if(!p||typeof p!=='object')return p;const result={...p};if(!PROFILE_OPTIONS.allowLanguageChoice)result.language='Inglés';if(!PROFILE_OPTIONS.allowBasqueExemption)result.basque=true;if(Array.isArray(result.modality)&&!optionalSubjects(result).includes(result.elective))result.elective='Otra optativa sin ponderación';return result;}
 function optionalSubjects(p){return [...electives.filter(s=>![p.core,...p.modality].includes(s)),...languages.filter(l=>l!==p.language).map(l=>'Segunda Lengua Extranjera II · '+l),'Otra optativa sin ponderación'];}
 function valid(p){const t=tracks[p?.track];return !!(p&&p.version===1&&t&&t.core.includes(p.core)&&Array.isArray(p.modality)&&p.modality.length===2&&new Set(p.modality).size===2&&p.modality.every(s=>t.other.includes(s)&&s!==p.core)&&languages.includes(p.language)&&common.slice(0,2).includes(p.history)&&typeof p.basque==='boolean'&&optionalSubjects(p).includes(p.elective));}
 function read(){try{const p=applyProfileOptions(JSON.parse(localStorage.getItem(KEY)));return valid(p)?p:null;}catch{return null;}}
 let profile=read(),draft=null;
 function subjects(p){if(!p)return[];return [...common.filter(s=>p.basque||s!=='Lengua Vasca y Literatura II'),p.language,p.core,...p.modality,...(p.elective.startsWith('Segunda Lengua')?[p.elective.split(' · ')[1]]:p.elective==='Otra optativa sin ponderación'?[]:[p.elective])];}
 function rowKeys(row,p,uni){if(!p)return[];const k=subjectKey(row.materia),first=subjectKey(p.language),second=p.elective.startsWith('Segunda Lengua')?subjectKey(p.elective.split(' · ')[1]):null;
  let keys=k==='primeralenguaextranjeraii'?[first]:k==='segundalenguaextranjeraii'?(second?[second]:[]):k==='lenguaextranjeraii'?[first,...(second?[second]:[])]:[k];
  const studied=new Set(subjects(p).map(subjectKey));keys=keys.filter(s=>studied.has(s));
  // La misma materia no puede examinarse en ambas fases de la PAU vasca.
  if(uni==='upna'){
   const compulsory=new Set(['Lengua Castellana y Literatura II',...(p.basque?['Lengua Vasca y Literatura II']:[]),p.history,p.language,p.core].map(subjectKey));
   const voluntary=/voluntaria/i.test(row.fase||row.materia),pau=/PAU/i.test(row.fase||row.materia);
   if(voluntary)keys=keys.filter(s=>!compulsory.has(s));else if(pau)keys=keys.filter(s=>compulsory.has(s));
  }
  return keys;
 }
 function matches(row,uni){return rowKeys(row,profile,uni).length>0;}
 function assess(sets,p=profile,uni='ehu'){
  if(!p)return null;
  if(!sets.some(s=>s.items.some(r=>r.coeficiente===0.1||r.coeficiente===0.2)))return {color:'green',max:null,label:'Sin ponderaciones disponibles en los datos'};
  // Se evalúa cada tabla por separado: los dobles grados EHU usan la más favorable.
  const scores=sets.map(s=>{const bySubject=new Map();for(const r of s.items){if(r.coeficiente!==0.1&&r.coeficiente!==0.2)continue;for(const k of rowKeys(r,p,uni))bySubject.set(k,Math.max(bySubject.get(k)||0,r.coeficiente));}return [...bySubject.values()].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);});
  const bonus=Math.max(0,...scores),max=Math.round((10+10*bonus)*10)/10,color=bonus>=0.4-1e-9?'green':bonus>0?'blue':'red';
  return {color,max,label:color==='green'?'Puedes alcanzar 14 puntos':color==='blue'?`Puedes alcanzar ${max} puntos`:'Sin materias compatibles: máximo 10 puntos'};
 }
 window.UniProfile={get:()=>profile,assess,matches,subjectKey,valid,subjects,rowKeys,tracks};
 const button=document.getElementById('profile-button');
 const baseProfileIcon='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';
 function profileIcon(track){if(!track)return baseProfileIcon;const badge=track==='science'?'<g class="profile-science-symbol" transform="translate(24 24)"><ellipse rx="6" ry="2.4"/><ellipse rx="6" ry="2.4" transform="rotate(60)"/><ellipse rx="6" ry="2.4" transform="rotate(120)"/><circle r="1" fill="currentColor" stroke="none"/></g>':'<path class="profile-humanities-symbol" d="M24 20c-2-1.2-4-1.2-6-.5v9c2-.7 4-.7 6 .5 2-1.2 4-1.2 6-.5v-9c-2-.7-4-.7-6 .5Zm0 0v9"/>';return '<svg viewBox="0 0 33 33" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="8" r="3.5"/><path d="M4 24v-4a7 7 0 0 1 14 0v3"/><circle class="profile-icon-badge" cx="24" cy="24" r="8.5" stroke="none"/>'+badge+'</svg>';}
 const dialog=document.createElement('dialog');dialog.id='profile-dialog';dialog.setAttribute('aria-labelledby','profile-title');document.body.append(dialog);
 function updateButton(){button.classList.toggle('has-profile',!!profile);button.innerHTML=profileIcon(profile?.track)+'<span class="profile-saved-dot" aria-hidden="true"></span>';const trackName=profile?tracks[profile.track].name:'';button.setAttribute('aria-label',profile?'Editar mi perfil de Bachillerato · '+trackName:'Crear mi perfil de Bachillerato');button.title=profile?'Mi perfil · '+trackName:'Configurar mi perfil';}
 function options(items,value,placeholder='Seleccionar…'){return `<option value="">${placeholder}</option>`+items.map(s=>`<option value="${escape(s)}"${s==='Otra optativa sin ponderación'?' class="unweighted-optative"':''}${s===value?' selected':''}>${escape(s)}</option>`).join('');}
 function draw(){const t=tracks[draft.track];dialog.innerHTML=`<form id="profile-form"><div class="profile-heading"><div><div class="eyebrow">BACHILLERATO Y PAU EN EUSKADI</div><h2 id="profile-title">Mi perfil de estudios</h2></div><button type="button" class="profile-close" aria-label="Cerrar perfil">×</button></div><p class="profile-intro">Tus materias de 2.º para explorar las ponderaciones de EHU y UPNA. Se guardan solo en este navegador.</p><button type="button" class="inline-help" data-help-topic="profile">? Cómo rellenar el perfil</button>
  <label class="profile-field">Modalidad<select id="profile-track" required><option value="">Selecciona tu modalidad</option>${Object.entries(tracks).map(([k,v])=>`<option value="${k}"${draft.track===k?' selected':''}>${v.name}</option>`).join('')}</select></label>
  ${t?`<fieldset><legend>Materias comunes · incluidas automáticamente</legend><div class="profile-common">${common.filter(s=>draft.basque||s!=='Lengua Vasca y Literatura II').map(s=>`<span>✓ ${s}</span>`).join('')}<span>✓ Primera Lengua Extranjera II · ${escape(draft.language)}</span></div><label class="profile-field">Primera lengua extranjera<select id="profile-language"${PROFILE_OPTIONS.allowLanguageChoice?'':' disabled'}>${options(languages,draft.language)}</select></label><label class="profile-check"><input id="profile-basque" type="checkbox"${PROFILE_OPTIONS.allowBasqueExemption?'':' disabled'}${draft.basque?' checked':''}> Curso Lengua Vasca y Literatura II</label><small>${PROFILE_OPTIONS.allowBasqueExemption?'Desmárcala solo si tienes exención y no la cursas.':'Inglés y Euskera están incluidos como materias obligatorias.'}</small></fieldset>
  <fieldset><legend>3 materias de modalidad</legend><label class="profile-field">1. Materia específica obligatoria<select id="profile-core" required>${options(t.core,draft.core)}</select></label><p>2 y 3. Selecciona otras dos materias (<span id="modality-count">${draft.modality.length}</span>/2).</p><div class="profile-choices">${t.other.filter(s=>s!==draft.core).map(s=>`<label class="profile-check"><input name="profile-modality" type="checkbox" value="${escape(s)}"${draft.modality.includes(s)?' checked':''}${draft.modality.length>=2&&!draft.modality.includes(s)?' disabled':''}>${escape(s)}</label>`).join('')}</div></fieldset>
  <fieldset><legend>1 optativa</legend><label class="profile-field">Optativa cursada<select id="profile-elective" class="${draft.elective==='Otra optativa sin ponderación'?'unweighted-optative':''}" required>${options(optionalSubjects(draft),draft.elective)}</select></label><small>Se incluyen materias que ponderan si tu centro las ofrece como optativa y una segunda lengua extranjera. Si cursas otra, elige «Otra optativa sin ponderación».</small></fieldset>
  <fieldset><legend>Tu PAU en Euskadi</legend><label class="profile-field">Historia en la fase obligatoria<select id="profile-history">${options(common.slice(0,2),draft.history)}</select></label><small>La otra Historia puede ir a la fase voluntaria. UPNA distingue las ponderaciones por fase; no contamos una misma materia dos veces.</small></fieldset>`:''}
  <div class="profile-explanation"><strong>¿Qué significan los colores?</strong><p>🟢 Dos materias distintas de 0,2: hasta 14. 🔵 Alguna ponderación: más de 10 y menos de 14. 🔴 Ninguna compatible: hasta 10. Si no hay ponderaciones en los datos, el indicador será verde y lo señalará.</p><p>Máximo teórico: supone una base de 10 y un 10 en las dos materias más favorables de las que te examines. Cursar una materia no sustituye presentarse al examen. Las notas de corte se consultan por separado.</p></div>
  <p id="profile-message" role="status" aria-live="polite"></p><div class="profile-actions"><button type="button" id="profile-delete" class="profile-delete"${profile?'':' hidden'}>Borrar perfil</button><button type="button" class="profile-cancel">Cancelar</button><button class="primary-button" type="submit"${t?'':' disabled'}>Guardar perfil</button></div><div class="profile-sources"><a href="https://www.euskadi.eus/web01-bopv/es/p43aBOPVWebWar/VerParalelo.do?cd2023002728" target="_blank" rel="noopener noreferrer">Materias de Euskadi</a> · <a href="https://www.ehu.eus/documents/d/unibertsitaterako-sarbidea/guia-acceso-upv-ehu-26-27-cast-pr3-dig" target="_blank" rel="noopener noreferrer">PAU en Euskadi 2026–2027</a></div></form>`;}
 function announce(){updateButton();window.dispatchEvent(new Event('uni-profile-change'));}
 function close(){dialog.close();button.focus();}
 button.addEventListener('click',()=>{draft=profile?{...profile,modality:[...profile.modality]}:defaultProfile();draw();dialog.showModal();});
 dialog.addEventListener('click',e=>{if(e.target.closest('.profile-close,.profile-cancel'))close();if(e.target.id==='profile-delete'){try{localStorage.removeItem(KEY);profile=null;announce();close();}catch{dialog.querySelector('#profile-message').textContent='No se ha podido borrar el perfil. Revisa los permisos de almacenamiento del navegador.';}}});
 dialog.addEventListener('change',e=>{const el=e.target;
  if(el.id==='profile-track'){draft.track=el.value;draft.core=draft.track==='science'?'Matemáticas II':'';draft.modality=[];draft.elective='Otra optativa sin ponderación';}
  else if(el.id==='profile-core'){draft.core=el.value;draft.modality=draft.modality.filter(s=>s!==draft.core);}
  else if(el.name==='profile-modality'){draft.modality=[...dialog.querySelectorAll('[name="profile-modality"]:checked')].map(i=>i.value).slice(0,2);}
  else if(el.id==='profile-elective')draft.elective=el.value;
  else if(el.id==='profile-language'&&PROFILE_OPTIONS.allowLanguageChoice)draft.language=el.value;
  else if(el.id==='profile-history')draft.history=el.value;
  else if(el.id==='profile-basque'&&PROFILE_OPTIONS.allowBasqueExemption)draft.basque=el.checked;
  if(!optionalSubjects(draft).includes(draft.elective))draft.elective='Otra optativa sin ponderación';
  const focusId=el.id,focusValue=el.value;draw();const focus=focusId?dialog.querySelector('#'+focusId):[...dialog.querySelectorAll('[name="profile-modality"]')].find(i=>i.value===focusValue);focus?.focus();
 });
 dialog.addEventListener('submit',e=>{e.preventDefault();draft=applyProfileOptions(draft);if(!valid(draft)){dialog.querySelector('#profile-message').textContent='Completa la materia obligatoria, otras dos de modalidad y una optativa.';return;}try{localStorage.setItem(KEY,JSON.stringify(draft));profile={...draft,modality:[...draft.modality]};announce();close();}catch{dialog.querySelector('#profile-message').textContent='El navegador no permite guardar el perfil. Habilita el almacenamiento local para conservarlo.';}});
 window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){profile=read();announce();}});
 updateButton();
})();
