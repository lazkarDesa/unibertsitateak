(() => {
 'use strict';
 const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
 })[c]);
 const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const languageFlags = [
  [/castellano|español|gaztelania/i, 'es', 'Castellano'],
  [/euskera|euskara|vasco/i, 'eu', 'Euskera'],
  [/inglés|english|ingelesa/i, 'gb', 'Inglés']
 ];
 const officialLink = (url,label) => /^https:\/\//.test(url || '') ?
  '<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' ↗</a>' : '';
 function languages(offer) {
  if (!offer.idiomas || /pendient|no consta|sin verificar/i.test(offer.idiomas)) return 'Idiomas de docencia no verificados';
  const flags = languageFlags.filter(([pattern]) => pattern.test(offer.idiomas))
   .map(([,id,name]) => '<img class="teaching-flag" src="assets/flags/'+id+'.svg" alt="'+name+'" title="'+name+'" width="24" height="16">').join('');
  return '<span class="teaching-languages">'+flags+'<span>'+esc(offer.idiomas)+'</span></span>';
 }
 function practices(uni, offer, key) {
  const guide = window.ORIENTATION_DATA?.guides?.[uni]?.[key];
  if (offer.id === 'EHU_BI_6D2341993E') {
   return 'Prácticas clínicas en centros públicos y privados. La ficha indica contacto con la profesión desde primero y un 40 % de formación práctica. ' +
    officialLink(offer.url_grado,'Fuente oficial de prácticas');
  }
  if (offer.id === 'euneiz-11') return '92 ECTS de prácticas clínicas de segundo a cuarto, en ámbitos hospitalarios, comunitarios, sociosanitarios y de salud mental. ' + officialLink(offer.url_grado,'Fuente oficial de prácticas');
  const source = guide?.links?.find(x => /práctica|praktika|placement/i.test(x.name));
  if (source) return officialLink(source.url,'Consultar prácticas en la fuente oficial');
  if (uni === 'uned' && offer.rama === 'Ciencias') {
   return 'Algunas asignaturas de Ciencias incluyen prácticas presenciales. Consulta los requisitos de tu plan y del centro asociado. ' +
    officialLink('https://www.uned.es/universidad/facultades/ciencias/bienvenida/gestion-administracion-ciencias/ayudas-practicas-presenciales.html','Fuente oficial de prácticas');
  }
  return 'Curso, créditos y obligatoriedad pendientes de verificación. ' + officialLink(offer.url_grado,'Consultar el plan oficial');
 }
 const money = amount => Number.isFinite(amount) ?
  new Intl.NumberFormat(window.UniI18n?.locale || 'es-ES',{style:'currency',currency:'EUR',useGrouping:'always'}).format(amount) : 'No consta';
 const interval = (a,b) => a === b ? money(a) : money(a)+' – '+money(b);
 function costs({uni,offer:g}) {
  const p = window.PUBLIC_TUITION_DATA?.offers?.[uni]?.[g.id];
  if (p?.ownFee) return [money(p.ownFee.first),money(p.ownFee.total),esc(p.ownFee.course)];
  if (p?.affiliated) return ['Tarifa propia del centro por confirmar','No consta',esc(p.course)];
  if (p) return [interval(p.firstMin,p.firstMax),interval(p.totalMin,p.totalMax),esc(p.course)];
  return [money(g.precio_primero),money(g.coste_total_est),esc(g.curso_precio || g.precio_curso || 'No consta')];
 }
 const territorial = uni => uni === 'ehu' || uni === 'upna';
 function cutoff({uni,offer:g},year) {
  if (!territorial(uni)) return '—';
  const value=g['nota_'+year], phase=g['fase_nota_'+year];
  return typeof value === 'number' ? new Intl.NumberFormat(window.UniI18n?.locale || 'es-ES',{maximumFractionDigits:3}).format(value) +
   (phase ? ' · '+esc(phase) : '') : esc(g['estado_'+year] || 'No consta');
 }
 function result(a,b) {
  const pair=[a,b], price=pair.map(costs);
  const rows=[
   ['Universidad',...pair.map(x=>esc(x.name))],
   ['Campus o sede',...pair.map(x=>esc(x.offer.campus))],
   ['Carrera',...pair.map(x=>esc(x.title))],
   ['Rama de conocimiento',...pair.map(x=>esc(x.offer.rama || 'No consta'))],
   ['Duración',...pair.map(x=>x.offer.anos ? x.offer.anos+' años' : 'No consta')],
   ['Créditos',...pair.map(x=>x.offer.ects ? x.offer.ects+' ECTS' : 'No consta')],
   ['Modalidad',...pair.map(x=>esc(x.offer.modalidad || 'No consta'))],
   ['Idioma de docencia',...pair.map(x=>languages(x.offer))],
   ['Acceso',...pair.map(x=>territorial(x.uni)?'Admisión con nota de corte':x.uni==='uned'?'Acceso y matrícula UNED':'Puede haber prueba de acceso')],
   ...(pair.some(x=>territorial(x.uni)) ? [2025,2026].map(year=>['Nota de corte '+year,...pair.map(x=>cutoff(x,year))]) : []),
   ['Plazas',...pair.map(x=>{const s=window.ORIENTATION_DATA?.seats?.[x.uni]?.[x.offer.id];return s?esc(s.count)+(s.course?' · '+esc(s.course):''):'No consta';})],
   ['Primer curso',...price.map(x=>x[0])],
   ['Carrera completa · estimación',...price.map(x=>x[1])],
   ['Curso de precios',...price.map(x=>x[2])],
   ['Prácticas',...pair.map(x=>practices(x.uni,x.offer,x.key))],
   ['Enlaces oficiales',...pair.map(x=>officialLink(x.offer.url_grado,'Ficha oficial')+' '+officialLink(x.offer.fuente_admision,'Acceso y admisión'))]
  ];
  return '<p>Comprueba el curso y la fase de las notas. Los costes totales son estimaciones de matrícula.</p>'+
   '<div class="compare-scroll" tabindex="0"><table class="compare-table"><thead><tr><th scope="col">Dato</th><th scope="col">Opción 1</th><th scope="col">Opción 2</th></tr></thead><tbody>'+
   rows.map(([label,x,y])=>'<tr><th scope="row">'+label+'</th><td>'+x+'</td><td>'+y+'</td></tr>').join('')+'</tbody></table></div>';
 }
 function mount(root, offers, saved, onChange) {
  const options=offers.map((x,index)=>({...x,index,label:[x.name,x.offer.campus,x.title].join(' – ')}));
  const box=root.querySelector('#comparison-result'), button=root.querySelector('#compare-run');
  const picks=[0,1].map(i=>{
   const input=root.querySelector('#compare-query-'+i), select=root.querySelector('#compare-pick-'+i);
   const placeholder='Selecciona una oferta';
   function filter(keep) {
    const words=norm(input.value).split(/\s+/).filter(Boolean);
    const matches=options.filter(x=>words.every(w=>norm(x.label+' '+x.offer.titulacion).includes(w)));
    select.replaceChildren(new Option(window.UniI18n?.text(placeholder)||placeholder,''),
     ...matches.map(x=>new Option(x.label,String(x.index))));
    if (matches.some(x=>String(x.index)===keep)) select.value=keep;
    else if(matches.length===1)select.value=String(matches[0].index);
   }
   filter(saved?.picks?.[i]);
   input.addEventListener('input',()=>{filter(select.value);update();});
   select.addEventListener('change',update);
   return select;
  });
  function selected(){return picks.map(x=>x.value);}
  function ready(){const [x,y]=selected();return x!==''&&y!==''&&x!==y;}
  function update(){button.disabled=!ready();box.innerHTML='';onChange({picks:selected(),shown:false});}
  function show(track){
   if(!ready())return;
   box.innerHTML=result(...selected().map(i=>options[Number(i)]));
   onChange({picks:selected(),shown:true});
   if(track)window.UniAnalytics?.emit('comparison_view');
  }
  button.disabled=!ready();
  button.addEventListener('click',()=>show(true));
  if(saved?.shown)show(false);
 }
 window.UniCompare={mount,languages,practices};
})();
