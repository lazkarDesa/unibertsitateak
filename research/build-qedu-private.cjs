/* Build private-university enrichment from current official pages and reviewed QEDU identities. */
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const universities=['deusto','navarra','mondragon','euneiz'];
const raw=read('research/qedu-private-details.json'),mapping=read('research/qedu-private-map.json'),snapshot=read('research/qedu-private-fetch-meta.json');
if(!snapshot.complete||snapshot.count!==raw.length)throw Error('Incomplete QEDU snapshot');
const checked=snapshot.checked,jobs=read('research/qedu-private-page-jobs.json'),results=read('research/qedu-private-page-results.json');
const successful=new Set(results.filter(r=>r.status===200&&r.checked===checked).map(r=>r.url));
const entities={aacute:'á',eacute:'é',iacute:'í',oacute:'ó',uacute:'ú',ntilde:'ñ',uuml:'ü',nbsp:' ',amp:'&',quot:'"',apos:"'",euro:'€'};
const plain=x=>String(x||'').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&([a-z]+);/gi,(a,b)=>entities[b.toLowerCase()]||a).replace(/\s+/g,' ').trim();
const norm=x=>plain(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const key=g=>norm(g.nombre_corto||g.titulacion).replace(/\s*\((?:plan nuevo|nuevo plan \d{4}|euskera|trilingue)\)\s*/g,'');
const fields=new Map();
for(const f of read('research/qedu-deusto-web-fields.json'))if(f.checked===checked)fields.set(f.url,f);
const qedu=read('data/qedu-datos.json'),orientation=read('data/orientacion-datos.json'),audit=[];
const languageEvidence=read('research/qedu-euneiz-language-evidence.json');
const baseResults=read('research/qedu-private-base-results.json');
for(const [id,r]of Object.entries(qedu.records))if(['030','031','061','098'].includes(r.codes.university))delete qedu.records[id];
for(const q of raw){const id=[q.card.codUniv,q.card.codCentro,q.card.codTitula].join(':');qedu.records[id]={id,codes:{university:q.card.codUniv,center:q.card.codCentro,title:q.card.codTitula},detail:q.detail,employment:q.employment&&typeof q.employment==='object'?q.employment:null,checked};}
const num=x=>/^\d+$/.test(String(x||'').trim())?Number(x):null;
const headerField=(html,label)=>{const values=[...html.matchAll(/<img[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/gi)].map(m=>plain(m[1]));const patterns={Idioma:/^(?:Castellano|Español|Inglés|Euskera|Bilingüe|English)/i,Plazas:/^\d+\s*plazas/i,Créditos:/^\d+\s*(?:ECTS|Créditos)/i};const found=values.find(v=>patterns[label].test(v));if(found)return found;const icons={Idioma:'language',Plazas:'person',Créditos:'import_contacts'};const icon=new RegExp('>\\s*'+icons[label]+'\\s*</span>\\s*<span[^>]*>([\\s\\S]*?)</span>','i');return plain(html.match(icon)?.[1]);};
function campusSeats(text,g){
 const n=norm(text),c=norm(g.campus);let count=null,scope='degree';
 if(c==='bilbao')count=Number(n.match(/(\d+)\s+(?:en\s+)?(?:\(?campus\s+)?bilbao/)?.[1])||null;
 if(/donostia/.test(c))count=Number(n.match(/(\d+)\s+(?:en\s+)?(?:\(?campus\s+)?(?:san sebastian|donostia)/)?.[1])||null;
 if(count)scope='campus';
 if(!count&&/fisioterapia/.test(norm(g.titulacion)))count=Number(n.match(/(\d+)\s+asignadas al grado/)?.[1])||null;
 if(!count&&/lengua y cultura vasca/.test(norm(g.titulacion)))count=Number(n.match(/^(\d+) plazas para el grado/)?.[1])||null;
 if(!count&&/^lenguas modernas$/.test(norm(g.titulacion)))count=Number(n.match(/\((\d+) llmm/)?.[1])||null;
 if(!count)count=Number(n.match(/^(\d+)/)?.[1])||null;
 if(!count)return null;
 if(/para todos los programas|grado y doble|grado y dobles|total para todos|campus de bilbao y campus de donostia/.test(n))scope='shared';
 if(/450 plazas en total/.test(n))scope='shared';
 const split=/bilbao/.test(n)&&/san sebastian|donostia/.test(n);
 const note=scope==='shared'?(split&&scope!=='degree'&&(/(\d+)\s+(?:en\s+)?bilbao/.test(n)||/campus bilbao/.test(n))?'Plazas compartidas entre programas de este campus; no son plazas exclusivas de esta opción.':'Total conjunto del título, compartido entre campus o programas. No consta un desglose para esta oferta.'):scope==='campus'?'Plazas publicadas para este campus.':plain(text);
 return {count,scope,note};
}
const datasets={};for(const u of universities)datasets[u]=read('data/'+u+'-datos.json');
for(const u of universities){qedu.offers[u]={};qedu.groups[u]={};orientation.seats[u]??={};
 for(const g of datasets[u].grados){const job=jobs.find(j=>j.uni===u&&j.id===g.id),m=mapping[u][g.id],r=m?qedu.records[m.record]:null;
  const html=job&&successful.has(job.url)&&fs.existsSync(job.file)?fs.readFileSync(job.file,'utf8'):'';let f={source:job?.url},language='',seatsText='',seats=null;
  if(u==='deusto'){f=fields.get(job?.url)||f;language=plain(f.language).replace(/Inglés Inglés$/, 'Inglés (opción 100 % en inglés)');seatsText=plain(f.seats);if(!seatsText&&/^ADE \+ Digital/.test(g.titulacion)){const base=fields.get('https://www.deusto.es/es/inicio/estudia/estudios/grado/ade');seatsText=plain(base?.seats);f={...f,seatSource:base?.source};}
   if(seatsText)seats=campusSeats(seatsText,g);
   if(g.titulacion==='Enfermería'&&seatsText.includes('grupo euskera'))language=/Donostia/.test(g.campus)?'Euskera (grupo de Donostia-San Sebastián)':'Castellano (grupo de Bilbao)';
  }else if(u==='navarra'){
   language=headerField(html,'Idioma');seatsText=headerField(html,'Plazas');const n=Number(seatsText.match(/^(\d+)\s*plazas/i)?.[1]);if(n>0)seats={count:n,scope:'degree',note:seatsText};
  }else if(u==='euneiz'){
   const text=plain(html);language=text.match(/Idioma(?:s)?\s*(?:de impartición)?\s*:?\s*((?:Castellano|Español|Euskera|Inglés|Ingl&eacute;s)[\s\S]{0,100}?)(?=\s*(?:Modalidad|Duración|Créditos|Plazas|Centro|Tipo de|Universidad|Presencial|Descargar|Horario))/i)?.[1]||'';
   const n=Number(text.match(/(?:Plazas de nuevo ingreso|Número de plazas|Plazas ofertadas|Plazas)\s*:?\s*(\d+)\s*(?:Precio|plazas)/i)?.[1]);if(n>0)seats={count:n,scope:'degree',note:'Plazas de nuevo ingreso publicadas por EUNEIZ.'};
   const evidence=languageEvidence.find(e=>e.id===g.id&&e.checked===checked);if(evidence&&!evidence.language){g.idiomas=null;g.estado_idiomas='Pendiente de confirmación de la docencia efectiva';g.fuente_idiomas=evidence.source;g.pagina_idiomas=evidence.page;}
   if(evidence&&g.id!=='euneiz-12'&&(!r||r.codes.title===evidence.recordTitle)){language=evidence.language||'';if(language){f={...f,languageSource:evidence.source};g.pagina_idiomas=evidence.page;}}
   if(g.id==='euneiz-12'&&languageEvidence.filter(e=>['euneiz-03','euneiz-05'].includes(e.id)).every(e=>e.language==='Castellano')){language='Castellano (grados componentes; confirmar el itinerario del doble grado)';f={...f,languageSource:languageEvidence.find(e=>e.id==='euneiz-05').source};}
  }else if(u==='mondragon'){
   const text=plain(html);language=text.match(/\bIdiomas?\s+((?:Euskera|Castellano|Español|Inglés)[\s\S]{0,220}?)(?=\s+(?:Campus|Duración|Plazas|Precio|Créditos|Modalidad|¿|Plan de estudios|Itinerarios|Inscripción|Formación|Doble))/i)?.[1]||'';
   const n=Number(text.match(/\bPlazas\s+(\d+)\s*plazas/i)?.[1]);if(n>0)seats={count:n,scope:'degree',note:'Total publicado para el título; no se desglosa por cada sede o itinerario.'};
  }
  // Accept only a concise, explicitly labelled teaching-language field.
  if(language&&language.length<260&&/castellano|español|eusk|ingl/i.test(language)&&!/[<>]|####/.test(language)){
   g.idiomas=plain(language);g.fuente_idiomas=f.languageSource||f.source;g.estado_idiomas='Verificado en ficha oficial el '+checked;
   for(const [name,re]of [['castellano',/castellano|español/i],['euskera',/eusk/i],['ingles',/ingl/i],['frances',/franc/i]])g['idioma_'+name]=re.test(g.idiomas);
  }
  if(seats&&/^\d+\s*(?:plazas)?$/i.test(seats.note||''))seats.note='';
  if(seats){orientation.seats[u][g.id]={...seats,course:f.course||null,checked,source:f.seatSource||f.source,campus:g.campus};}
  if(r){qedu.offers[u][g.id]=m.record;g.qedu_id=m.record;(qedu.groups[u][key(g)]??=[]).push({offer:g.id,record:m.record,campus:g.campus,title:g.titulacion,scope:m.scope});}
  if(!orientation.seats[u][g.id]&&r&&num(r.detail.plazas)>0){orientation.seats[u][g.id]={count:num(r.detail.plazas),scope:'degree',course:null,checked,source:qedu.meta.source,note:'QEDU: total del título, sin desglose por campus o programa y sin curso explícito. Confirmar la oferta vigente con la universidad.'};}
  const pageECTS=u==='navarra'?headerField(html,'Créditos'):null;
  audit.push({university:u,id:g.id,title:g.titulacion,campus:g.campus,qeduId:r?.id||null,qeduScope:m?.scope||null,qeduTitle:r?.detail.titulacion||null,language:g.idiomas||null,languageSource:g.fuente_idiomas||null,languageCheckedThisReview:g.estado_idiomas?.endsWith(checked)||false,seats:orientation.seats[u][g.id]||null,seatsUniversityRaw:seatsText||null,placesQedu:r?.detail.plazas||null,qeduCredits:r?.detail.creditos||null,localCredits:g.ects,universityCredits:pageECTS||null,affiliation:r?.employment?.tasaAfiliacion||null,source:job?.url,sourceDownloaded:!!html||fields.has(job?.url),checked});
 }
}
// A diploma is not a different official degree. Reuse base-degree places only with explicit scope.
for(const a of audit.filter(a=>a.qeduScope==='base-degree')){const g=datasets[a.university].grados.find(g=>g.id===a.id);let base=audit.find(b=>b.university===a.university&&b.qeduId===a.qeduId&&b.qeduScope==='exact'&&b.campus===a.campus&&b.seats);
 const downloadedBase=baseResults.find(b=>b.record===a.qeduId&&b.status===200&&b.checked===checked);
 if(!base&&downloadedBase){const html=fs.readFileSync(downloadedBase.file,'utf8');const count=Number(headerField(html,'Plazas').match(/^\d+/)?.[0]);base={language:headerField(html,'Idioma'),languageSource:downloadedBase.url,seats:count>0?{count,checked,source:downloadedBase.url,course:null,scope:'shared'}:null};}
 if(!orientation.seats[a.university][a.id]&&base?.seats){orientation.seats[a.university][a.id]={...base.seats,scope:'shared',note:'Plazas del grado oficial de base, compartidas con sus programas. No son plazas exclusivas del complemento.',source:base.seats.source};a.seats=orientation.seats[a.university][a.id];}
 if((!g.idiomas||/grado base; consulta/.test(g.idiomas))&&base?.language){g.idiomas=base.language+' (grado base; consulta el idioma del complemento)';g.fuente_idiomas=base.languageSource;g.estado_idiomas='Verificado para el grado base; complemento no verificado';a.language=g.idiomas;a.languageSource=g.fuente_idiomas;}
}
for(const u of universities){datasets[u].meta.qedu_checked=checked;write('data/'+u+'-datos.json',datasets[u]);fs.writeFileSync('data/'+u+'-datos.js','window.'+u.toUpperCase()+'_DATA='+JSON.stringify(datasets[u])+';\n');}
write('data/qedu-datos.json',qedu);fs.writeFileSync('data/qedu-datos.js','window.QEDU_DATA='+JSON.stringify(qedu)+';\n');write('data/orientacion-datos.json',orientation);fs.writeFileSync('data/orientacion-datos.js','window.ORIENTATION_DATA='+JSON.stringify(orientation)+';\n');
write('docs/revision-qedu-privadas.json',{checked,offers:audit,unmappedQeduRecords:raw.filter(q=>!Object.values(mapping).some(m=>Object.values(m).some(x=>x.record===[q.card.codUniv,q.card.codCentro,q.card.codTitula].join(':')))).map(q=>({title:q.detail.titulacion,center:q.detail.nombreCentro,province:q.detail.provincia,id:q.card.codTitula}))});
const totals=universities.map(u=>({university:u,offers:audit.filter(a=>a.university===u).length,qedu:audit.filter(a=>a.university===u&&a.qeduId).length,languages:audit.filter(a=>a.university===u&&a.language).length,seats:audit.filter(a=>a.university===u&&a.seats).length}));
const esc=x=>String(x??'—').replace(/\|/g,'/');
fs.writeFileSync('docs/revision-qedu-privadas.md','# Revisión de universidades privadas · QEDU y fichas oficiales\n\nFecha: '+checked+'.\n\n'+totals.map(t=>'- '+t.university+': '+t.offers+' ofertas; '+t.qedu+' enlazadas con QEDU; '+t.languages+' con idioma; '+t.seats+' con plazas publicadas.').join('\n')+'\n\n## Criterios\n\nSe distinguen grados, dobles grados, programas complementarios, planes nuevos y centros adscritos. Los datos del grado de base no se atribuyen al diploma complementario. QEDU agrupa campus en algunas fichas y no indica siempre el curso de las plazas. Sus cifras se conservan como contraste, sin reemplazar una oferta universitaria actual ni confundir datos no disponibles con cero. Las plazas de una familia de programas no se suman por cada itinerario. El indicador de idioma extranjero de QEDU no es una lista de idiomas de docencia.\n\nHay títulos recientes, canónicos, combinaciones y planes que no tienen correspondencia segura. No se ha usado un título parecido para rellenarlos. No se incorporan al catálogo automáticamente los registros de QEDU de otras provincias ni se da por vigente un plan solo porque aparezca allí.\n\nLos porcentajes laborales son históricos, cuatro años tras egresar. No son una tasa de empleo relacionado ni una puntuación sobre diez. Se preservan las encuestas universitarias con sus metodologías independientes.\n\n## Detalle por oferta\n\n| Universidad | Título | Campus | Idioma | Plazas publicadas | Correspondencia QEDU |\n|---|---|---|---|---|---|\n'+audit.map(a=>'| '+[a.university,a.title,a.campus,a.language,a.seats?a.seats.count+' · '+(a.seats.scope||'oferta'):'No verificadas',a.qeduId?(a.qeduScope==='base-degree'?'Grado de base':'Título identificado'):'Pendiente / no localizado'].map(esc).join(' | ')+' |').join('\n')+'\n\n## Fuentes y datos pendientes\n\nLos enlaces de fuente y los campos sin verificar están en revision-qedu-privadas.json. El endpoint QEDU consultado y sus códigos están conservados en data/qedu-datos.json. La información adicional encontrada incluye modalidad, créditos, tipo de centro e indicadores laborales. Si no se publica un año de referencia, no se deduce de la fecha de consulta.\n');
console.log(JSON.stringify(totals));
