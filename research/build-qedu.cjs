/* Rebuild only from downloaded official records and reviewed title/centre mappings. */
const fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const raw=read('research/qedu-details.json'),map=read('research/qedu-offer-map.json');
const snapshot=read('research/qedu-fetch-meta.json');if(!snapshot.complete||snapshot.count!==raw.length)throw Error('Incomplete QEDU download');
const checked=snapshot.checked;
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const key=g=>norm(g.nombre_corto||g.titulacion).replace(/\s*\((?:plan nuevo|nuevo plan \d{4}|euskera|trilingue)\)\s*/g,'');
const entities={aacute:'á',eacute:'é',iacute:'í',oacute:'ó',uacute:'ú',ntilde:'ñ',uuml:'ü',nbsp:' ',amp:'&',quot:'"',ordf:'ª',euro:'€'};
const plain=x=>String(x||'').replace(/<[^>]*>/g,' ').replace(/&([a-z]+);/gi,(a,b)=>entities[b]||a).replace(/\s+/g,' ').trim();
const records={};for(const q of raw){const id=[q.card.codUniv,q.card.codCentro,q.card.codTitula].join(':');records[id]={id,codes:{university:q.card.codUniv,center:q.card.codCentro,title:q.card.codTitula},detail:q.detail,employment:typeof q.employment==='object'?q.employment:null,checked};}
const previous=read('data/qedu-datos.json');
const retained=Object.fromEntries(Object.entries(previous.records||{}).filter(([,r])=>!['020','035'].includes(r.codes.university)));
const out={meta:{checked,source:'https://www.ciencia.gob.es/qedu.html',methodology:'https://www.ciencia.gob.es/qedu/AyudaQEDU.html',endpoint:'https://www.ciencia.gob.es/home/qedu/main/zona02/0',employmentYearsAfterGraduation:4,employmentCohort:null,employmentReferenceYear:null,admissionMeanCourse:null},records:{...retained,...records},offers:{...previous.offers,...map},groups:{...previous.groups,ehu:{},upna:{}}};
const audit=[];let languages=0;const orientation=read('data/orientacion-datos.json');
for(const uni of ['ehu','upna']){const d=read('data/'+uni+'-datos.json');for(const g of d.grados.filter(g=>g.oferta_2026!==false)){
 const q=records[map[uni][g.id]],file='research/qedu-universities/'+g.id+'.html';let html=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
 const lang=uni==='ehu'?html.match(/<strong>Idiomas<\/strong><\/p>\s*<p>([\s\S]*?)<\/p>/i):html.match(/<strong>Idioma[^<]*<\/strong>([\s\S]*?)<\/li>\s*(?:<\/ul>\s*<\/li>\s*)?<li[^>]*>\s*<strong>Cr/i);
 if(lang&&plain(lang[1])&&/castellano|eusk|ingl|franc/i.test(plain(lang[1]))){g.idiomas=plain(lang[1]);g.estado_idiomas='Verificado en ficha oficial el '+checked;g.fuente_idiomas=g.url_grado||read('data/orientacion-datos.json').guides[uni][key(g)]?.source.url;for(const [field,re]of [['castellano',/castellano/i],['euskera',/eusk/i],['ingles',/ingl/i],['frances',/franc/i]])g['idioma_'+field]=re.test(g.idiomas);languages++;}
 // Latest EHU page is authoritative for the current course; do not rewrite historical marks from rounded QEDU values.
 const cut=html.match(/<strong>Nota de corte<\/strong><\/p>\s*<p>([\s\S]*?)<\/p>/i),places=html.match(/<strong>Plazas ofertadas<\/strong><\/p>\s*<p>([\s\S]*?)<\/p>/i);
 const cutText=cut?plain(cut[1]):'',cm=cutText.match(/([\d]+,[\d]+) en convocatoria (ordinaria|extraordinaria) \(2026\/27\)/);
 if(uni==='ehu'&&cm){g.nota_2026=Number(cm[1].replace(',','.'));g.fase_nota_2026=cm[2];g.fuente_2026=g.url_grado;}
 const currentPlaces=places?Number(plain(places[1]).match(/^\d+/)?.[0]):null;
 if(uni==='ehu'&&currentPlaces>0){g.plazas_2026=currentPlaces;orientation.seats.ehu[g.id]={count:currentPlaces,course:'2026–2027',source:g.url_grado,campus:g.campus,checked};}
 if(q){g.qedu_id=q.id;const k=key(g);(out.groups[uni][k]??=[]).push({offer:g.id,record:q.id,campus:g.campus,title:g.titulacion});}
 const qcut=q?Number(q.detail.notaCorte.replace(',','.')):NaN;
 audit.push({university:uni,id:g.id,title:g.titulacion,campus:g.campus,qeduId:q?.id||null,status:q?'matched':'unresolved',cutoffLocal2025:g.nota_2025??null,cutoffQedu:q?.detail.notaCorte||null,cutoffCourse:q?.detail.anioActual||null,cutoffCheck:!q?'unresolved':!Number.isFinite(qcut)?'unavailable':Number(g.nota_2025?.toFixed(2))===qcut?'matches-rounded':'review-scope-or-phase',placesLocal:g.plazas_2026??null,placesUniversityPage:currentPlaces,placesQedu:q?.detail.plazas||null,languages:g.idiomas||null,languageSource:g.fuente_idiomas||null,meanAdmission:q?.detail.notaAdmision||null,affiliation:q?.employment?.tasaAfiliacion||null,checked});
 }d.meta.qedu_checked=checked;fs.writeFileSync('data/'+uni+'-datos.json',JSON.stringify(d,null,2)+'\n');fs.writeFileSync('data/'+uni+'-datos.js','window.'+(uni==='ehu'?'EHU':'UPNA')+'_DATA='+JSON.stringify(d)+';\n');}
fs.writeFileSync('data/qedu-datos.json',JSON.stringify(out,null,2)+'\n');fs.writeFileSync('data/qedu-datos.js','window.QEDU_DATA='+JSON.stringify(out)+';\n');
fs.writeFileSync('data/orientacion-datos.json',JSON.stringify(orientation,null,2)+'\n');fs.writeFileSync('data/orientacion-datos.js','window.ORIENTATION_DATA='+JSON.stringify(orientation)+';\n');
fs.writeFileSync('docs/revision-qedu.json',JSON.stringify({checked,languagesVerified:languages,offers:audit},null,2)+'\n');
const esc=x=>String(x??'—').replace(/\|/g,'/');
const report='# Revisión QEDU · EHU y UPNA\n\nConsulta: '+checked+'. Se conservan por separado cursos, fases, campus e idiomas. Las diferencias no implican automáticamente un error: QEDU puede agrupar variantes y redondea notas. No se sustituyen cortes históricos ni plazas actuales por cifras agregadas de QEDU. El curso de nota media, la cohorte laboral y el año de referencia no los expone este servicio; no se deducen de la fecha de consulta.\n\n'+audit.length+' ofertas revisadas; '+audit.filter(a=>a.status==='matched').length+' con correspondencia y '+audit.filter(a=>a.status!=='matched').length+' pendientes de correspondencia. '+languages+' fichas de idiomas verificadas en las páginas universitarias.\n\n| Universidad | Titulación | Campus | Corte propio 2025/26 | Corte QEDU | Plazas propias 2026/27 | Plazas QEDU (curso no explícito) | Comprobación |\n|---|---|---|---:|---:|---:|---:|---|\n'+audit.map(a=>'| '+[a.university,a.title,a.campus,a.cutoffLocal2025,a.cutoffQedu,a.placesLocal,a.placesQedu,a.cutoffCheck].map(esc).join(' | ')+' |').join('\n')+'\n\n## Fuentes\n\n- https://www.ciencia.gob.es/qedu.html\n- https://www.ciencia.gob.es/qedu/AyudaQEDU.html\n- Fichas oficiales individuales: campo languageSource de revision-qedu.json.\n';
fs.writeFileSync('docs/revision-qedu.md',report);console.log(JSON.stringify({offers:audit.length,matched:audit.filter(a=>a.status==='matched').length,languages,unresolved:audit.filter(a=>a.status!=='matched').map(a=>a.title)}));
