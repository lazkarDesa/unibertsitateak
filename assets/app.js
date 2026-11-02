/* Uni Explorer v2.0: SPA autocontenida, sin backend ni navegación de URL. */
(()=>{'use strict';
 const raw={ehu:window.EHU_DATA,deusto:window.DEUSTO_DATA,navarra:window.NAVARRA_DATA};
 const main=document.getElementById('main'),popup=document.getElementById('hover-popover');
 const RAMAS=['Artes y Humanidades','Ciencias','Ciencias de la Salud','Ciencias Sociales y Jurídicas','Ingeniería y Arquitectura'];
 const CFG={ehu:{name:'EHU · Universidad del País Vasco',short:'EHU',campuses:['Araba','Gipuzkoa','Bizkaia'],type:'Pública',website:'https://www.ehu.eus/es/web/graduak/graduak'},deusto:{name:'Universidad de Deusto',short:'Deusto',campuses:['Bilbao','Donostia-San Sebastián'],type:'Privada',website:'https://www.deusto.es/es/inicio/estudia/estudios/grados'},navarra:{name:'Universidad de Navarra',short:'Universidad de Navarra',campuses:['Pamplona','Donostia-San Sebastián'],type:'Privada',website:'https://www.unav.edu/estudios/grados'}};
 const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').replace(/\s+/g,' ').trim();
 const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sortText=(a,b)=>String(a??'').localeCompare(String(b??''),'es',{sensitivity:'base'});
 const num=(n,d=2)=>typeof n==='number'&&Number.isFinite(n)?new Intl.NumberFormat('es-ES',{maximumFractionDigits:d,minimumFractionDigits:0}).format(n):'—';
 const eur=n=>typeof n==='number'&&Number.isFinite(n)?new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n):'No consta';
 const validUrl=x=>typeof x==='string'&&/^https:\/\//.test(x)?x:null;
 const link=(x,label)=>validUrl(x)?`<a href="${safe(x)}" target="_blank" rel="noopener noreferrer">${safe(label)}</a>`:'';
 const pill=(x,cls='')=>`<span class="pill ${cls}">${safe(x)}</span>`;
 const degreeKey=g=>norm(g.nombre_corto||g.titulacion).replace(/\s*\((?:plan nuevo|nuevo plan \d{4}|euskera|trilingue)\)\s*/g,'');
 const datasets={};
 for(const uni of Object.keys(CFG)){
   const src=raw[uni]||{}, pmap=new Map();
   if(uni==='ehu')for(const p of src.ponderaciones||[]){if(p.coeficiente!==0.1&&p.coeficiente!==0.2)continue;const k=String(p.grado_ponderacion||'');if(!pmap.has(k))pmap.set(k,[]);pmap.get(k).push(p)}
   const records=(src.grados||[]).filter(g=>uni!=='ehu'||g.oferta_2026).filter(g=>CFG[uni].campuses.includes(g.campus)).filter(g=>uni!=='deusto'||g.estado_oferta!=='Inicio 2027-2028');
   const groups=new Map();for(const g of records){const k=degreeKey(g);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(g)}
   const arr=[...groups.entries()].map(([key,offers],i)=>({key,offers,id:`${uni}--${i}`,name:chooseName(offers)})).sort((a,b)=>sortText(a.name,b.name));
   datasets[uni]={src,records,groups:arr,lookup:new Map(arr.map(g=>[g.id,g])),pmap};
 }
 function chooseName(offers){const title=offers.map(o=>o.titulacion).find(x=>!/\((?:plan nuevo|nuevo plan \d{4}|euskera|trilingüe)\)/i.test(x));return title||offers[0].titulacion;}
 const materias=[...new Set((raw.ehu?.ponderaciones||[]).filter(p=>p.coeficiente===0.1||p.coeficiente===0.2).map(p=>p.materia))].sort(sortText);
 const initial=()=>({screen:'portal',uni:null,campus:'',rama:'',materia:'',facultad:'',q:'',sort:'name',searchText:''});
 let state=initial(),historyStack=[];
 function saveHistory(){historyStack.push({state:{...state},scroll:window.scrollY});if(historyStack.length>32)historyStack.shift()}
 function go(screen,patch={}){hidePopup();saveHistory();state={...state,...patch,screen};render();window.scrollTo(0,0)}
 function goBack(){hidePopup();if(historyStack.length){const last=historyStack.pop();state=last.state;render();requestAnimationFrame(()=>window.scrollTo(0,last.scroll||0));}else{state=initial();render();window.scrollTo(0,0)}}
 function chooseUni(uni){go('university',{uni,campus:'',rama:'',materia:'',facultad:'',q:'',sort:'name',searchText:''})}
 const backBtn=()=>`<button class="back-button" type="button" data-action="back">← Volver</button>`;
 function top(label,heading,description){return `<div class="page-top">${backBtn()}<div class="eyebrow">${safe(label)}</div><h1>${safe(heading)}</h1><p>${safe(description)}</p></div>`}
 function renderPortal(){
  const card=(id,ordinal,category,headline,place,summary)=>`<button class="portal-card" data-uni="${id}" type="button"><span class="portal-number">${ordinal} · ${category}</span><h2>${headline}</h2><strong>${place}</strong><p>${summary}</p><span class="portal-cta">Explorar grados <span aria-hidden="true">→</span></span></button>`;
  main.innerHTML=`<section class="hero portal-hero"><div class="eyebrow">Guía universitaria 2026–2027</div><h1>¿Qué universidad quieres explorar?</h1><p>Busca grados, compara campus y centros, consulta los requisitos académicos y examina los costes cuando están publicados.</p></section>
  <div class="portal-label">Universidad pública</div><div class="portal-grid portal-public">${card('ehu','01','Pública','EHU · Universidad del País Vasco','Araba, Gipuzkoa y Bizkaia','Notas de corte de 2025 y 2026; materias de Bachillerato que ponderan 0,1 o 0,2.')}</div>
  <div class="portal-label">Universidades privadas</div><div class="portal-grid portal-private">${card('deusto','02','Privada','Deusto','Campus de Bilbao y Donostia','Grados, facultades, precios oficiales de primero y costes totales orientativos.')}${card('navarra','03','Privada','Universidad de Navarra','Pamplona y Tecnun · Donostia','Grados, programas combinados, precios de primero y costes totales orientativos.')}</div>
  <div class="helper-note"><span class="notice-symbol">ⓘ</span><span>Los precios de las privadas son de <strong>2026–2027</strong>. Los costes totales son extrapolaciones que no contemplan subidas posteriores, becas, alojamiento ni manutención. Los grados de la EHU usan las ponderaciones oficiales de acceso; no se aplican a las privadas.</span></div>`;
 }
 function renderUniversity(){
  const {uni}=state,cfg=CFG[uni],ds=datasets[uni],isE=uni==='ehu',counts=Object.fromEntries(cfg.campuses.map(c=>[c,ds.records.filter(g=>g.campus===c).length]));
  main.innerHTML=`${top('Universidad seleccionada',cfg.name,'Busca una titulación o explora el catálogo por campus y rama de conocimiento.')}
  <div class="home-grid">
  <section class="panel panel-wide"><div class="panel-tag">01 · Buscador</div><h2>Buscar una carrera</h2><p>Escribe al menos 3 caracteres. Si un grado se imparte en varios campus, el buscador lo mostrará una sola vez.</p><div class="search-wrap" id="search-wrap"><div class="search-control"><span class="search-icon">⌕</span><input id="degree-search" type="search" role="combobox" aria-expanded="false" aria-controls="search-suggestions" autocomplete="off" placeholder="Ej. Medicina, Derecho, Ingeniería…" value="${safe(state.searchText)}"></div><div id="search-suggestions" class="suggestions" role="listbox" hidden></div></div><div class="search-hint">Ignora mayúsculas y tildes · Mínimo 3 letras</div></section>
  <section class="panel panel-wide"><div class="panel-tag">02 · Campus</div><h2>Explorar por campus</h2><p>En los listados puedes filtrar por facultad, ordenar resultados${isE?' y seleccionar una materia que pondera':''}.</p><div class="campus-links">${cfg.campuses.map(c=>`<button type="button" data-open-campus="${safe(c)}" class="route-tile"><span class="route-arrow">↗</span><b>${safe(c)}</b><small>${counts[c]} ofertas</small></button>`).join('')}</div></section>
  <section class="panel panel-wide"><div class="panel-tag">03 · Ramas</div><h2>Rama de conocimiento</h2><p>Cinco categorías para filtrar las ofertas. En las privadas, la clasificación es orientativa cuando no se ha verificado la rama oficial de la titulación.</p><div class="theme-links branch-links">${RAMAS.map((r,i)=>`<button class="theme-card" type="button" data-open-rama="${safe(r)}"><span class="theme-illustration">${['Aa','∑','✚','§','⌘'][i]}</span><b>${safe(r)}</b><small>${ds.records.filter(g=>g.rama===r).length} ofertas</small></button>`).join('')}</div></section>
  ${isE?`<section class="panel panel-wide"><div class="panel-tag">04 · Ponderaciones</div><h2>¿Dónde pondera una asignatura?</h2><p>Elige una materia, por ejemplo Biología, para ver exclusivamente los grados en que se aplica un coeficiente de 0,1 o 0,2.</p><div class="subject-lookup"><select id="home-materia" aria-label="Asignatura de Bachillerato"><option value="">Seleccionar asignatura…</option>${materiaOptions('')}</select><button type="button" class="primary-button" data-action="search-subject">Ver carreras</button></div></section>`:`<div class="helper-note private-hint"><span class="notice-symbol">€</span><span>Las universidades privadas no publican una tabla de ponderaciones equivalente a la EHU en este conjunto de datos. En sus fichas se muestran el importe oficial de primero y una estimación de toda la carrera cuando están disponibles.</span></div>`}
  </div><div class="helper-note"><span class="notice-symbol">ⓘ</span><span>${isE?'Las notas 2025 y 2026 pueden proceder de distintas fases de admisión; no siempre son comparables. Cuando una ponderación no puede relacionarse con una carrera, se indica expresamente.':'Los importes de primero proceden de las tablas oficiales 2026–2027. La estimación total conserva los precios por crédito de ese curso; no es un presupuesto ni refleja necesariamente las tasas de cursos superiores.'}</span></div>`;
  updateSuggestions();
 }
 function materiaOptions(selected){return materias.map(m=>`<option value="${safe(m)}"${m===selected?' selected':''}>${safe(m)}</option>`).join('')}
 function updateSuggestions(){
  if(state.screen!=='university')return;
  const input=document.getElementById('degree-search'),sug=document.getElementById('search-suggestions');if(!input||!sug)return;
  state.searchText=input.value;const t=norm(input.value);if(t.length<3){sug.hidden=true;sug.innerHTML='';input.setAttribute('aria-expanded','false');return}
  const matches=datasets[state.uni].groups.filter(g=>norm(g.name).includes(t)||g.offers.some(o=>norm(o.titulacion).includes(t))).slice(0,20);
  sug.innerHTML=matches.length?matches.map((g,i)=>`<button type="button" role="option" data-open-detail="${g.id}" class="suggestion ${i===0?'active':''}" aria-selected="${i===0?'true':'false'}"><span><b>${safe(g.name)}</b><small>${safe([...new Set(g.offers.map(o=>o.campus))].join(' · '))}</small></span><span class="arrow">→</span></button>`).join(''):'<div class="suggestions-empty">No se han encontrado grados con ese texto.</div>';
  sug.hidden=false;input.setAttribute('aria-expanded','true');
 }
 function pondSets(g){if(state.uni!=='ehu')return[];const ids=[...new Set(g.offers.flatMap(x=>String(x.ponderacion_ids||'').split('|').filter(Boolean)))];return ids.map(id=>({id,items:datasets.ehu.pmap.get(id)||[]})).filter(x=>x.items.length)}
 function pondContains(g,mat){return !!pondSets(g).some(s=>s.items.some(x=>norm(x.materia)===norm(mat)))}
 function groupedForRow(g){return datasets[state.uni].groups.find(gr=>gr.offers.includes(g))}
 function selectOptions(items,value){return items.map(x=>`<option value="${safe(x)}" ${x===value?'selected':''}>${safe(x)}</option>`).join('')}
 function renderList(){
  const {uni,screen}=state, ds=datasets[uni], cfg=CFG[uni];const isCampus=screen==='campus';const isRama=screen==='rama';const isSubject=screen==='subject';const base=ds.records.filter(r=>isCampus?r.campus===state.campus:isRama?r.rama===state.rama:true);
  const centers=[...new Set(base.map(r=>r.centro).filter(Boolean))].sort(sortText), campuses=[...new Set(base.map(r=>r.campus))].sort(sortText);
  const header=isCampus?state.campus:isRama?state.rama:`Materias: ${state.materia||'Seleccionar asignatura'}`;
  main.innerHTML=`${top(cfg.short,header,isCampus?'Grados del campus. Filtra por centro, ordena por nota o nombre y consulta las ponderaciones pasando el ratón.':isRama?'Titulaciones de esta rama, con filtros y ordenación.':'Carreras para las que la materia seleccionada pondera en la EHU.')}
  <div class="filter-bar filter-bar-extended">
   ${isCampus?`<div class="field"><label for="faculty-filter">Facultad / Escuela</label><select id="faculty-filter"><option value="">Todos los centros</option>${selectOptions(centers,state.facultad)}</select></div>`:`<div class="field"><label for="campus-filter">Campus</label><select id="campus-filter"><option value="">Todos los campus</option>${selectOptions(campuses,state.campus)}</select></div>`}
   <div class="field"><label for="list-query">Buscar carrera o centro</label><input id="list-query" type="search" placeholder="Buscar…" value="${safe(state.q)}"></div>
   ${uni==='ehu'?`<div class="field"><label for="materia-filter">Asignatura que pondera</label><select id="materia-filter"><option value="">Todas las asignaturas</option>${materiaOptions(state.materia)}</select></div>`:''}
   <div class="field"><label for="sort-by">Ordenar por</label><select id="sort-by"><option value="name" ${state.sort==='name'?'selected':''}>Nombre · A → Z</option><option value="faculty" ${state.sort==='faculty'?'selected':''}>Facultad · A → Z</option>${uni==='ehu'?`<option value="note2026" ${state.sort==='note2026'?'selected':''}>Nota 2026 · Mayor a menor</option><option value="note2025" ${state.sort==='note2025'?'selected':''}>Nota 2025 · Mayor a menor</option>`:`<option value="firstprice" ${state.sort==='firstprice'?'selected':''}>Precio de 1.º · Menor a mayor</option><option value="totalprice" ${state.sort==='totalprice'?'selected':''}>Coste estimado · Menor a mayor</option>`}</select></div>
   <span class="filter-count" id="filter-count"></span></div>
   <div class="data-summary"><span class="small">${uni==='ehu'?'Nota de corte de cupo general, solo donde publicada. Popover de materias al pasar sobre cada carrera.':'Costes a tarifas 2026–2027; las estimaciones son orientativas.'}</span><button type="button" class="btn-text" data-action="reset-filters">Restablecer filtros</button></div>
   <div id="results-list" class="results-list"></div>`;
  updateList();
 }
 function updateList(){
  const {screen,uni}=state,ds=datasets[uni];let entries=ds.records.filter(g=>screen==='campus'?g.campus===state.campus:screen==='rama'?g.rama===state.rama:true);
  if(screen!=='campus'&&state.campus)entries=entries.filter(g=>g.campus===state.campus);
  if(state.facultad)entries=entries.filter(g=>g.centro===state.facultad);
  if(state.materia&&uni==='ehu')entries=entries.filter(g=>{let group=groupedForRow(g);return group?pondContains(group,state.materia):false});
  if(state.q)entries=entries.filter(g=>norm([g.titulacion,g.centro,g.campus].join(' ')).includes(norm(state.q)));
  const sorter={name:(a,b)=>sortText(a.titulacion,b.titulacion)||sortText(a.campus,b.campus),faculty:(a,b)=>sortText(a.centro,b.centro)||sortText(a.titulacion,b.titulacion),};
  // Los datos ausentes deben ir siempre al final independientemente del orden.
  const key=state.sort;
  if(['note2025','note2026'].includes(key)){const fld=key==='note2025'?'nota_2025':'nota_2026';entries.sort((a,b)=>nullableCompare(a,b,fld,true)||sortText(a.titulacion,b.titulacion));}
  else if(['firstprice','totalprice'].includes(key)){const fld=key==='firstprice'?'precio_primero_2026':'coste_total_est_2026';entries.sort((a,b)=>nullableCompare(a,b,fld,false)||sortText(a.titulacion,b.titulacion));}
  else entries.sort(sorter[key]||sorter.name);
  document.getElementById('filter-count').textContent=`${entries.length} ${entries.length===1?'oferta':'ofertas'}`;
  document.getElementById('results-list').innerHTML=entries.length?entries.map(g=>rowHTML(g)).join(''):'<div class="empty-panel"><b>No hay resultados.</b>Modifica o limpia los filtros para ampliar la búsqueda.</div>';
 }
 
 function nullableCompare(a,b,field,desc){const av=a[field],bv=b[field],aOk=typeof av==='number',bOk=typeof bv==='number';if(aOk!==bOk)return aOk?-1:1;if(!aOk)return 0;return desc?bv-av:av-bv}
 function noteMini(g,y){const n=g[`nota_${y}`],st=g[`estado_${y}`];return `<div class="year-note" title="${safe(st||'No publicada')}"><small>${y}</small><b class="${typeof n==='number'?'':'empty'}">${typeof n==='number'?num(n):st==='Plazas vacantes'?'Vacantes':'—'}</b></div>`}
 function rowHTML(g){const group=groupedForRow(g),isE=state.uni==='ehu';return `<article class="degree-row ${isE?'hoverable':''}" ${group?`data-hover-group="${safe(group.id)}"`:''}><div><button class="degree-title" type="button" data-open-detail="${safe(group?.id||'')}">${safe(g.titulacion)}</button><div class="degree-subline">${safe(g.centro||'Centro por confirmar')} <span class="dot">·</span>${safe(g.campus)}</div><div class="minor-tags">${g.ects?pill(`${num(g.ects)} ECTS`):''}${g.anos?pill(`${num(g.anos)} años`):''}</div></div><div class="note-pair">${isE?noteMini(g,2025)+noteMini(g,2026):`<div class="year-note"><small>1.º curso</small><b>${eur(g.precio_primero_2026)}</b></div><div class="year-note"><small>Total aprox.</small><b>${eur(g.coste_total_est_2026)}</b></div>`}</div><div class="row-links">${link(g.url_grado,'Carrera')}${link(g.url_centro,'Facultad')}${!g.url_grado?link(g.fuente_oferta,'Catálogo'):''}</div></article>`}
 function subjectsHTML(group){const sets=pondSets(group);if(!sets.length)return `<div class="mini-alert"><strong>Ponderaciones no verificadas.</strong> No se ha podido asociar este grado con materias del PDF. No implica que ninguna materia pondere.</div>`;
  const doubled=sets.length>1||group.offers.some(g=>norm(g.tipo).includes('doble'));
  const items=entries=>`<div class="subject-head"><span>Asignatura</span><span>Coeficiente</span></div>${entries.slice().sort((a,b)=>b.coeficiente-a.coeficiente||sortText(a.materia,b.materia)).map(p=>`<div class="subject"><span class="subject-name">${safe(p.materia)}</span><span class="coeff ${p.coeficiente===0.2?'high':''}">${num(p.coeficiente,1)}</span></div>`).join('')}`;
  return `${doubled?'<div class="mini-alert"><strong>Doble grado:</strong> consultar los componentes por separado. La EHU usa la opción de ponderación que resulte más favorable; no se suman todas las materias de ambos.</div>':''}${sets.map(s=>`<div class="subject-group">${doubled?`<h3>${safe(s.id)}</h3>`:''}${items(s.items)}</div>`).join('')}<div class="site-notice">Solo coeficientes 0,1 y 0,2. ${link(raw.ehu.meta.fuentes.ponderaciones_2026,'PDF oficial de parámetros EHU')}</div>`}
 function valueBox(label,value,small){return `<div class="note-box"><span class="year">${safe(label)}</span><b class="${small?'na':''}">${safe(value)}</b></div>`}
 function offeringHTML(g){const isE=state.uni==='ehu';return `<div class="campus-offering"><div class="offering-top"><div><h3>${safe(g.campus)}</h3><p>${safe(g.centro)} · ${safe(g.municipio||'')}</p></div><div class="offer-links">${link(g.url_grado,'Web carrera')}${link(g.url_centro,'Web facultad')}${!g.url_grado?link(g.fuente_oferta,'Catálogo de grados'):''}</div></div>
  <div class="offering-data">${isE?valueBox('Nota 2025',typeof g.nota_2025==='number'?num(g.nota_2025):g.estado_2025==='Plazas vacantes'?'Plazas vacantes':'No consta',typeof g.nota_2025!=='number')+valueBox('Nota 2026',typeof g.nota_2026==='number'?num(g.nota_2026):'No consta',typeof g.nota_2026!=='number'):valueBox('Precio oficial primer curso 2026-27',eur(g.precio_primero_2026),g.precio_primero_2026==null)+valueBox('Coste total estimado a precios 2026-27',eur(g.coste_total_est_2026),g.coste_total_est_2026==null)}</div>
  <div class="offering-info">${g.ects?`<strong>Plan:</strong> ${num(g.ects)} ECTS${g.anos?` en ${num(g.anos)} años`:''}.`:''} ${g.idiomas?`<strong>Idiomas:</strong> ${safe(g.idiomas)}.`:''}</div>${!isE&&g.coste_total_est_2026!=null?`<div class="cost-method">${safe(g.metodo_estimacion||'Estimación por ECTS, manteniendo la tarifa 2026–2027.')}</div>`:''}${!isE&&g.precio_primero_2026==null?'<div class="mini-alert">No consta un importe publicado para esta variante concreta en la tabla consultada. No se extrapola el precio de otro programa.</div>':''}${g.observaciones?`<div class="offering-info">${safe(g.observaciones)}</div>`:''}</div>`}
 function renderDetail(){
  const {uni}=state,ds=datasets[uni],group=ds.lookup.get(state.group);if(!group){goBack();return}
  const offers=group.offers.slice().sort((a,b)=>CFG[uni].campuses.indexOf(a.campus)-CFG[uni].campuses.indexOf(b.campus));
  const g=offers[0],isE=uni==='ehu';
  main.innerHTML=`${top(CFG[uni].short,'',isE?'Ficha del grado, ponderaciones y notas de acceso.':'Ficha de grado, campus, facultad y estimación de matrícula.')}
  <div class="detail-title-override"><h1>${safe(group.name)}</h1><div class="detail-tags">${pill(g.rama||'Rama no verificada','teal')}${pill(g.tipo||'Grado')}${g.ects?pill(`${num(g.ects)} ECTS`):''}${g.anos?pill(`${num(g.anos)} años`):''}</div></div>
  <div class="detail-layout"><div class="detail-main">
    ${isE?`<section class="section-card"><h2>Materias de Bachillerato que ponderan</h2><p>Parámetros oficiales EHU para 2026–2027: solo asignaturas con coeficientes 0,1 o 0,2.</p>${subjectsHTML(group)}</section>`:`<section class="section-card"><h2>Coste de los estudios</h2><p>El importe de primer curso procede de la tabla oficial 2026–2027. El coste total se estima manteniendo los precios actuales por crédito: no es una tarifa vinculante.</p><div class="cost-caveat">Los cursos superiores pueden tener tarifas diferentes. No incluye manutención, alojamiento, becas, inflación ni otras tasas. ${uni==='navarra'?'La Universidad de Navarra anuncia además 95 € en derechos de secretaría.':''}</div></section>`}
    <section class="section-card"><h2>Campus, centro ${isE?'y notas de corte':'y precio'}</h2><p>${isE?'Las notas pueden variar entre campus o modalidades; no se asume equivalencia entre fases de admisión.':'Los precios se muestran solo donde se han podido asociar a la titulación exacta.'}</p>${offers.map(offeringHTML).join('')}</section>
    </div><aside class="detail-sidebar"><section class="section-card"><h2>Datos académicos</h2><dl class="fact-grid"><div class="fact wide"><dt>Rama</dt><dd>${safe(g.rama||'No verificada')}</dd></div><div class="fact"><dt>Duración</dt><dd>${g.anos?num(g.anos)+' años':'No verificada'}</dd></div><div class="fact"><dt>Créditos</dt><dd>${g.ects?num(g.ects)+' ECTS':'No verificados'}</dd></div><div class="fact wide"><dt>Modalidad</dt><dd>${safe(g.modalidad||g.modalidad_docente||'Presencial')}</dd></div><div class="fact wide"><dt>Idiomas</dt><dd>${safe(g.idiomas||'Pendientes de verificación')}</dd></div></dl></section>
    <section class="section-card"><h2>Enlaces y fuentes</h2><div class="sources-list">${offers.map(o=>link(o.url_grado,`Carrera · ${o.campus}`)+link(o.url_centro,`Facultad · ${o.campus}`)).join('')}${link(g.fuente_oferta,'Oferta oficial de grados')}${!isE?link(g.fuente_precio,'Precios oficiales del primer curso'):link(raw.ehu.meta.fuentes.ponderaciones_2026,'PDF ponderaciones 2026')}${!isE?link(g.fuente_admision,'Admisión y ayudas'):''}</div></section>
    ${isE?`<section class="section-card"><h2>Notas de corte</h2><p>La última nota publicada no garantiza el acceso del siguiente curso. Las notas de 2025 y 2026 pueden referirse a fases distintas.</p></section>`:`<section class="section-card"><h2>¿Nota de corte?</h2><p>En estas universidades privadas no se ofrece una nota de corte pública comparable con la adjudicación de plazas de la EHU. Consulta sus requisitos y procedimientos de admisión.</p></section>`}
  </aside></div>`;
  const pageTop=main.querySelector('.page-top h1');if(pageTop)pageTop.remove();
 }
 function popupHTML(group){const sets=pondSets(group);if(!sets.length)return `<strong>${safe(group.name)}</strong><p>Ponderaciones no verificadas para esta titulación; no significa que no existan.</p>`;
  const rows=sets.map(s=>`<div class="popover-group">${sets.length>1?`<strong class="popover-heading">${safe(s.id)}</strong>`:''}${s.items.slice().sort((a,b)=>b.coeficiente-a.coeficiente||sortText(a.materia,b.materia)).map(p=>`<div><span>${safe(p.materia)}</span><b class="${p.coeficiente===0.2?'strong-coeff':''}">${num(p.coeficiente,1)}</b></div>`).join('')}</div>`).join('');return `<strong>${safe(group.name)}</strong><p>Materias que ponderan · EHU 2026–2027</p>${rows}`;
 }
 function hidePopup(){popup.hidden=true;popup.innerHTML=''}
 function showPopup(target){if(state.uni!=='ehu'||!target||!target.dataset.hoverGroup)return;const group=datasets.ehu.lookup.get(target.dataset.hoverGroup);if(!group)return;popup.innerHTML=popupHTML(group);popup.hidden=false;const r=target.getBoundingClientRect(),w=Math.min(365,window.innerWidth-24);popup.style.width=w+'px';let x=r.left+Math.min(r.width/2,260),y=r.top+12;x=Math.min(Math.max(12,x),window.innerWidth-w-12);const pH=popup.getBoundingClientRect().height;if(y+pH>window.innerHeight-8)y=Math.max(8,r.top-pH-10);popup.style.left=x+'px';popup.style.top=y+'px';}
 function render(){const label=document.getElementById('active-university-label');label.textContent=state.uni?CFG[state.uni].short:'Tres universidades';hidePopup();if(state.screen==='portal')renderPortal();else if(state.screen==='university')renderUniversity();else if(['campus','rama','subject'].includes(state.screen))renderList();else if(state.screen==='detail')renderDetail();}
 function openDetail(id){if(!datasets[state.uni].lookup.has(id))return;go('detail',{group:id})}
 function openCampus(c){if(!CFG[state.uni].campuses.includes(c))return;go('campus',{campus:c,facultad:'',materia:'',q:'',sort:'name'})}
 function openRama(r){if(!RAMAS.includes(r))return;go('rama',{rama:r,campus:'',facultad:'',materia:'',q:'',sort:'name'})}
 function openSubject(m){if(!materias.includes(m))return;go('subject',{materia:m,campus:'',facultad:'',q:'',sort:'name'})}
 function resetFilters(){state.q='';state.facultad='';state.materia=state.screen==='subject'?state.materia:'';state.sort='name';if(state.screen!=='campus')state.campus='';renderList()}
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-uni],[data-open-campus],[data-open-rama],[data-open-detail],[data-action],#brand-home');if(!b){if(state.screen==='university'&&!e.target.closest('#search-wrap')){const el=document.getElementById('search-suggestions');if(el)el.hidden=true;}return}
  if(b.id==='brand-home'){historyStack=[];state=initial();render();window.scrollTo(0,0)}
  else if(b.dataset.uni)chooseUni(b.dataset.uni);
  else if(b.dataset.openCampus)openCampus(b.dataset.openCampus);
  else if(b.dataset.openRama)openRama(b.dataset.openRama);
  else if(b.dataset.openDetail)openDetail(b.dataset.openDetail);
  else if(b.dataset.action==='back')goBack();
  else if(b.dataset.action==='search-subject'){const m=document.getElementById('home-materia')?.value;if(m)openSubject(m)}
  else if(b.dataset.action==='reset-filters')resetFilters();
 });
 document.addEventListener('input',e=>{if(e.target.id==='degree-search')updateSuggestions();if(e.target.id==='list-query'){state.q=e.target.value;updateList()}});
 document.addEventListener('change',e=>{
  if(e.target.id==='faculty-filter'){state.facultad=e.target.value;updateList()}
  if(e.target.id==='campus-filter'){state.campus=e.target.value;updateList()}
  if(e.target.id==='materia-filter'){state.materia=e.target.value;updateList()}
  if(e.target.id==='sort-by'){state.sort=e.target.value;updateList()}
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){hidePopup();const sug=document.getElementById('search-suggestions');if(sug)sug.hidden=true}
  if(e.target.id!=='degree-search')return;const el=document.getElementById('search-suggestions');if(!el||el.hidden)return;const opts=[...el.querySelectorAll('[data-open-detail]')];if(!opts.length)return;const idx=opts.findIndex(o=>o.classList.contains('active'));
  if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const next=(idx+(e.key==='ArrowDown'?1:-1)+opts.length)%opts.length;opts.forEach((o,i)=>{o.classList.toggle('active',i===next);o.setAttribute('aria-selected',String(i===next))});opts[next].scrollIntoView({block:'nearest'})}
  if(e.key==='Enter'){e.preventDefault();openDetail(opts[idx>=0?idx:0].dataset.openDetail)}
 });
 document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const row=e.target.closest('.degree-row[data-hover-group]');if(row&&!row.contains(e.relatedTarget))showPopup(row)});
 document.addEventListener('pointerout',e=>{const row=e.target.closest('.degree-row[data-hover-group]');if(row&&!row.contains(e.relatedTarget))hidePopup()});
 document.addEventListener('focusin',e=>{const row=e.target.closest('.degree-row[data-hover-group]');if(row)showPopup(row)});
 document.addEventListener('focusout',e=>{const row=e.target.closest('.degree-row[data-hover-group]');if(row&&!row.contains(e.relatedTarget))hidePopup()});
 window.addEventListener('scroll',hidePopup,{passive:true});window.addEventListener('resize',hidePopup);
 if(!raw.ehu?.grados||!raw.deusto?.grados||!raw.navarra?.grados){main.innerHTML='<div class="empty-panel"><b>No se han cargado los datos.</b>Comprueba los archivos de la carpeta data/ y su publicación.</div>';return}
 render();
})();
