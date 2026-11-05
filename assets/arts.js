(() => {
 'use strict';
 const groups = [
  [
    "musikene",
    "Musikene",
    "Donostia / San Sebastián",
    "music",
    "interpretation composition conducting pedagogy",
    "https://musikene.eus/grado/",
    "https://musikene.eus/grado/?lang=eu",
    "https://apply.musikene.eus/es/acceso/grado",
    "La prueba depende de la especialidad y, en Interpretación, del instrumento. Consulta el repertorio y los ejercicios de la convocatoria.",
    "Proba espezialitatearen araberakoa da, eta Interpretazioan, instrumentuaren araberakoa. Begiratu deialdiko errepertorioa eta ariketak."
  ],
  [
    "dantzerti-drama",
    "Dantzerti",
    "Bilbao",
    "drama",
    "acting",
    "https://www.dantzerti.eus/es/estudios/grado-en-arte-dramatico",
    null,
    "https://www.dantzerti.eus/en/entrance-method/entrance-process",
    "La prueba específica incluye ejercicios de interpretación. Consulta los textos, ejercicios y criterios de la convocatoria.",
    "Proba espezifikoak interpretazio-ariketak ditu. Begiratu deialdiko testuak, ariketak eta irizpideak."
  ],
  [
    "dantzerti-dance",
    "Dantzerti",
    "Bilbao",
    "dance",
    "choreography",
    "https://www.dantzerti.eus/es/acceso/que_es_dantzerti",
    "https://www.dantzerti.eus/eu/sarrera-probak/zer_da_dantzerti",
    "https://www.dantzerti.eus/en/entrance-method/entrance-process",
    "La prueba evalúa técnica e interpretación. Si acreditas el título profesional de Danza, Dantzerti indica que la prueba cuenta un 80 % y el expediente profesional un 20 %.",
    "Probak teknika eta interpretazioa ebaluatzen ditu. Dantzako lanbide-titulua egiaztatuz gero, Dantzertik dio proba % 80 eta lanbide-espedientea % 20 direla."
  ],
  [
    "idarte",
    "IDarte",
    "Vitoria-Gasteiz",
    "design",
    "graphic interiors",
    "https://www.idarte.eus/es/que-quieres-estudiar/",
    null,
    "https://www.idarte.eus/es/faq-es/",
    "La vía habitual desde Bachillerato es la prueba específica de Diseño. Consulta si tu titulación previa da acceso directo.",
    "Batxilergotik sartzeko ohiko bidea Diseinuko proba espezifikoa da. Egiaztatu aurretiko titulazioak zuzeneko sarbidea ematen dizun."
  ],
  [
    "ied",
    "IED Kunsthal",
    "Bilbao",
    "design",
    "graphic interiors fashion product",
    "https://www.ied.es/bilbao/grado",
    null,
    "https://www.ied.es/estudiar-en-espana/titulo-de-grado-en-ensenanzas-artisticas-de-diseno",
    "Consulta con el centro la prueba específica, la entrevista y las vías de acceso directo aplicables a tu titulación.",
    "Galdetu ikastegian proba espezifikoaz, elkarrizketaz eta zure titulazioari dagozkion zuzeneko sarbideez."
  ],
  [
    "navarra-music",
    [
      "Conservatorio Superior de Música de Navarra",
      "Nafarroako Goi Mailako Musika Kontserbatorioa"
    ],
    "Iruña / Pamplona",
    "music",
    "interpretation composition musicology pedagogy",
    "https://www.educacion.navarra.es/web/dpto/musica-y-danza-estudios-superiores-de-musica",
    null,
    "https://www.educacion.navarra.es/web/dpto/estudios-superiores-de-musica/acceso",
    "La prueba específica depende de la especialidad. Navarra tiene en cuenta el título profesional de Música en la calificación final cuando se acredita.",
    "Proba espezifikoa espezialitatearen araberakoa da. Nafarroan Musikako lanbide-titulua azken kalifikazioan kontuan hartzen da egiaztatuz gero."
  ],
  [
    "navarra-design",
    [
      "Escuela de Arte y Superior de Diseño de Pamplona",
      "Iruñeko Arte eta Diseinuko Goi Mailako Eskola"
    ],
    "Iruña / Pamplona",
    "design",
    "interiors",
    "https://escueladeartesuperior.educacion.navarra.es/web/estudios/estudios-superiores-de-diseno-de-interiores/",
    null,
    null,
    "Desde Bachillerato, la vía habitual es superar la prueba específica. Revisa las condiciones de acceso directo para titulaciones previas.",
    "Batxilergotik sartzeko ohiko bidea proba espezifikoa gainditzea da. Begiratu aurretiko titulazioen zuzeneko sarbidearen baldintzak."
  ]
];
 const specialties = {
  "interpretation": [
    "Interpretación musical",
    "Musika-interpretazioa",
    "Perfeccionas tu instrumento o voz y aprendes a preparar repertorio y tocar en conjunto.",
    "Instrumentua edo ahotsa lantzen duzu, errepertorioa prestatzen eta taldean jotzen ikasiz.",
    "Conciertos, agrupaciones musicales, grabaciones y proyectos escénicos.",
    "Kontzertuak, musika-taldeak, grabazioak eta proiektu eszenikoak."
  ],
  "composition": [
    "Composición",
    "Konposizioa",
    "Aprendes a escribir música y a trabajar con armonía, instrumentación y formas musicales.",
    "Musika idazten eta harmonia, instrumentazioa eta musika-formak lantzen ikasten duzu.",
    "Composición para conciertos, artes escénicas y proyectos audiovisuales.",
    "Kontzertuetarako, arte eszenikoetarako eta ikus-entzunezko proiektuetarako konposizioa."
  ],
  "conducting": [
    "Dirección",
    "Zuzendaritza",
    "Aprendes a leer partituras, dirigir ensayos y coordinar a un conjunto musical.",
    "Partiturak irakurtzen, entseguak zuzentzen eta musika-taldeak koordinatzen ikasten duzu.",
    "Dirección de agrupaciones y coordinación de proyectos musicales.",
    "Musika-taldeen zuzendaritza eta musika-proiektuen koordinazioa."
  ],
  "pedagogy": [
    "Pedagogía musical",
    "Musika-pedagogia",
    "Estudias cómo enseñar música y adaptar el aprendizaje a distintos niveles y edades.",
    "Musika irakasten eta ikaskuntza maila eta adin desberdinetara egokitzen ikasten duzu.",
    "Escuelas de música y proyectos de formación o mediación musical, según los requisitos del puesto.",
    "Musika-eskolak eta prestakuntza- edo bitartekaritza-proiektuak, lanpostuaren baldintzen arabera."
  ],
  "musicology": [
    "Musicología",
    "Musikologia",
    "Investigas cómo se crea, interpreta y transmite la música en diferentes épocas y culturas.",
    "Musika garai eta kultura desberdinetan nola sortu, interpretatu eta transmititzen den ikertzen duzu.",
    "Investigación, archivos musicales, documentación y divulgación cultural.",
    "Ikerketa, musika-artxiboak, dokumentazioa eta kultura-dibulgazioa."
  ],
  "acting": [
    "Interpretación escénica",
    "Interpretazio eszenikoa",
    "Entrenas la voz, el cuerpo y la interpretación para construir personajes y escenas.",
    "Ahotsa, gorputza eta interpretazioa lantzen dituzu pertsonaiak eta eszenak sortzeko.",
    "Interpretación teatral y audiovisual, creación escénica y proyectos culturales.",
    "Antzerki- eta ikus-entzunezko interpretazioa, sorkuntza eszenikoa eta kultura-proiektuak."
  ],
  "choreography": [
    "Coreografía e interpretación",
    "Koreografia eta interpretazioa",
    "Entrenas técnicas de danza y aprendes a crear y representar piezas coreográficas.",
    "Dantza-teknikak lantzen eta pieza koreografikoak sortzen eta antzezten ikasten duzu.",
    "Compañías de danza, creación coreográfica y espectáculos en directo.",
    "Dantza-konpainiak, sorkuntza koreografikoa eta zuzeneko ikuskizunak."
  ],
  "graphic": [
    "Diseño Gráfico",
    "Diseinu Grafikoa",
    "Combinas imagen, tipografía y composición para comunicar ideas en soportes impresos y digitales.",
    "Irudia, tipografia eta konposizioa uztartzen dituzu euskarri inprimatu eta digitaletan ideiak komunikatzeko.",
    "Identidad visual, diseño editorial y comunicación digital.",
    "Ikus-identitatea, diseinu editoriala eta komunikazio digitala."
  ],
  "interiors": [
    "Diseño de Interiores",
    "Barne Diseinua",
    "Diseñas espacios considerando cómo se usan, la luz, los materiales y el mobiliario.",
    "Espazioak diseinatzen dituzu, erabilera, argia, materialak eta altzariak kontuan hartuta.",
    "Interiorismo residencial, comercial y expositivo.",
    "Etxebizitzen, merkataritza-guneen eta erakusketa-espazioen barne-diseinua."
  ],
  "fashion": [
    "Diseño de Moda",
    "Moda Diseinua",
    "Creas prendas y colecciones a partir de investigación, dibujo, materiales y prototipos.",
    "Jantziak eta bildumak sortzen dituzu, ikerketa, marrazketa, materialak eta prototipoak erabiliz.",
    "Diseño de prendas, desarrollo de colecciones y proyectos textiles.",
    "Jantzien diseinua, bildumen garapena eta ehungintzako proiektuak."
  ],
  "product": [
    "Diseño de Producto",
    "Produktu Diseinua",
    "Diseñas objetos útiles y pruebas cómo se fabrican, funcionan y usan mediante prototipos.",
    "Objektu erabilgarriak diseinatzen dituzu eta prototipoekin fabrikazioa, funtzionamendua eta erabilera probatzen dituzu.",
    "Diseño de objetos y mobiliario, prototipado y desarrollo de productos.",
    "Objektuen eta altzarien diseinua, prototipoak eta produktuen garapena."
  ]
};
 const titles = {
  music: ['Música','Musika'], drama: ['Arte Dramático','Arte Dramatikoa'],
  dance: ['Danza','Dantza'], design: ['Diseño','Diseinua']
 };
 const eu = () => window.UniI18n?.locale?.startsWith('eu') ? 1 : 0;
 const tr = (es, euskara) => eu() ? euskara : es;
 const label = () => tr('Enseñanzas Artísticas Superiores','Goi Mailako Arte Irakaskuntzak');
 const center = group => Array.isArray(group[1]) ? group[1][eu()] : group[1];
 const offerings = groups.flatMap(group => group[4].split(' ').map(key => ({
  id: group[0]+'-'+key, group, specialty: specialties[key]
 })));
 function portal() {
  return '<section data-no-translate aria-labelledby="arts-portal-title"><h2 id="arts-portal-title" class="portal-label">'+label()+'</h2>'+
   '<div class="portal-grid"><button class="portal-card" data-action="arts" type="button"><h2>'+
   tr('Explorar Música, Danza, Arte Dramático y Diseño','Arakatu Musika, Dantza, Arte Dramatikoa eta Diseinua')+
   '</h2><strong>'+tr('Euskadi y Navarra','Euskadi eta Nafarroa')+'</strong><p>'+
   tr('Grados oficiales y pruebas específicas de acceso.','Gradu ofizialak eta sarbide-proba espezifikoak.')+'</p></button></div></section>';
 }
 function catalog(back) {
  return '<div class="arts-catalog" data-no-translate><div class="page-top">'+back()+'<h1>'+label()+'</h1><p>'+
   tr('Elige una especialidad para consultar qué se estudia y cómo se accede.','Aukeratu espezialitate bat zer ikasten den eta nola sartzen den jakiteko.')+
   '</p></div>'+Object.entries(titles).map(([kind,title])=>'<section class="section-card"><h2>'+title[eu()]+'</h2>'+
   groups.filter(group=>group[3]===kind).map(group=>'<section class="arts-center"><h3>'+center(group)+
    ' <small>'+group[2]+'</small></h3><div class="portal-grid">'+
    offerings.filter(x=>x.group===group).map(x=>'<button class="portal-card" data-action="art-detail" data-art="'+x.id+
     '" type="button"><strong>'+x.specialty[eu()]+'</strong></button>').join('')+'</div></section>').join('')+
   '</section>').join('')+'</div>';
 }
 const practicalInfo = {
  "musikene": [
    1588.2,
    6352.8,
    80,
    "Última tarifa publicada por el centro",
    "Ikastegiak argitaratutako azken tarifa",
    "https://musikene.eus/grado/",
    "https://musikene.eus/grado/acceso-y-admision/",
    "Título de Bachiller o vía equivalente de la convocatoria y prueba específica. En Interpretación las plazas se publican por instrumento; en Dirección, por itinerario.",
    "Batxiler-titulua edo deialdiko bide baliokidea eta proba espezifikoa. Interpretazioan plazak instrumentuka argitaratzen dira; Zuzendaritzan, ibilbideka."
  ],
  "dantzerti-drama": [
    1380,
    5520,
    28.02,
    "2026–2027",
    null,
    "https://www.euskadi.eus/contenidos/informacion/dantzerti_danza/es_def/adjuntos/Resolucion-matricula-dantzerti-superiores-26-27_cas.pdf",
    "https://www.dantzerti.eus/es/actualidad/noticias/curso-2026-2027-pruebas-de-acceso",
    "Bachillerato o vía alternativa admitida y prueba de interpretación. El centro indica 15 plazas en la convocatoria de junio.",
    "Batxilergoa edo onartutako beste sarbide bat eta interpretazio-proba. Ikastegiak 15 plaza adierazten ditu ekaineko deialdian."
  ],
  "dantzerti-dance": [
    1200,
    4800,
    28.02,
    "2026–2027",
    null,
    "https://www.euskadi.eus/contenidos/informacion/dantzerti_danza/es_def/adjuntos/Resolucion-matricula-dantzerti-superiores-26-27_cas.pdf",
    "https://www.dantzerti.eus/es/actualidad/noticias/curso-2026-2027-pruebas-de-acceso",
    "Bachillerato o vía alternativa admitida y prueba de danza. El centro indica 15 plazas en la convocatoria de junio.",
    "Batxilergoa edo onartutako beste sarbide bat eta dantza-proba. Ikastegiak 15 plaza adierazten ditu ekaineko deialdian."
  ],
  "idarte": [
    656.4,
    2625.6,
    28.02,
    "2026–2027",
    null,
    "https://www.euskadi.eus/contenidos/informacion/artisticas_superiores_diseinua/es_def/adjuntos/Resolucion-matricula-idarte-26-27-superiores_cas.pdf",
    "https://www.idarte.eus/es/faq-es/",
    "Desde Bachillerato se realiza la prueba específica de Diseño. Consulta el acceso directo si tienes un título de Técnico Superior de Artes Plásticas y Diseño.",
    "Batxilergotik Diseinuko proba espezifikoa egiten da. Arte Plastikoetako eta Diseinuko goi-mailako teknikariaren titulua baduzu, kontsultatu zuzeneko sarbidea."
  ],
  "ied": [
    [
      11100,
      15100
    ],
    [
      44400,
      60400
    ],
    null,
    "2026–2027",
    null,
    "https://www.ied.es/other-pdf/Spain/Bilbao/Tarifas/Tarifas_Grado_IED_Bilbao.pdf",
    "https://www.ied.es/estudiar-en-espana/titulo-de-grado-en-ensenanzas-artisticas-de-diseno",
    "El precio incluye matrícula y enseñanza y depende de la tarifa aplicable. Consulta al centro la prueba de Diseño, los requisitos académicos y las vías de acceso directo.",
    "Prezioak matrikula eta irakaskuntza barne hartzen ditu eta dagokion tarifaren araberakoa da. Galdetu ikastegian Diseinuko probaz, baldintza akademikoez eta zuzeneko sarbideaz."
  ],
  "navarra-music": [
    null,
    null,
    61.79,
    "2026–2027",
    null,
    null,
    "https://www.navarra.es/documents/48192/24507905/ANEXO.pdf/dd344423-a1ed-88a0-002f-cba426f0a2d1",
    "Bachiller, Técnico Superior, otro título superior o una vía alternativa admitida, más prueba específica. En 2026, inscripción del 11 al 22 de mayo y pruebas desde el 8 de junio. Mínimo de 5 en la prueba.",
    "Batxiler-titulua, goi-mailako teknikariaren titulua, beste goi-mailako titulazio bat edo onartutako ordezko bidea, eta proba espezifikoa. 2026an, izen-ematea maiatzaren 11tik 22ra eta probak ekainaren 8tik aurrera. Proban gutxienez 5 puntu."
  ],
  "navarra-design": [
    538.2,
    2152.8,
    null,
    "2025–2026 · referencia",
    "2025–2026 · erreferentzia",
    "https://escueladeartesuperior.educacion.navarra.es/web/wp-content/uploads/2025/06/EASD-Matricula-4EESS-nuevo2025-26.pdf",
    "https://escueladeartesuperior.educacion.navarra.es/web/matriculas/",
    "Precio de referencia de 2025–2026. Desde Bachillerato, la vía habitual es la prueba específica de Diseño. Consulta las titulaciones que permiten acceso directo.",
    "2025–2026ko erreferentziazko prezioa. Batxilergotik sartzeko ohiko bidea Diseinuko proba espezifikoa da. Kontsultatu zuzeneko sarbidea ematen duten titulazioak."
  ]
};
 const fact = ([label,value]) => '<div class="fact"><dt>'+label+'</dt><dd>'+value+'</dd></div>';
 const card = (title,body) => '<section class="section-card"><h2>'+title+'</h2>'+body+'</section>';
 function detail(id,back,tab='ficha') {
  const item=offerings.find(x=>x.id===id);
  if(!item)return catalog(back);
  const {group,specialty}=item;
  const [first,total,exam,period,periodEu,fees,admission,requirements,requirementsEu]=practicalInfo[group[0]];
  const official=eu()&&group[6]?group[6]:group[5];
  const access=eu()&&group[0].startsWith('dantzerti')?'https://www.dantzerti.eus/eu/sarrera-probak/sarbidea':group[7];
  const link=(href,text)=>href?'<a href="'+href+'" target="_blank" rel="noopener noreferrer">'+text+' ↗</a>':'';
  const format=new Intl.NumberFormat(window.UniI18n?.locale||'es-ES',{style:'currency',currency:'EUR',useGrouping:'always'});
  const money=value=>value==null?tr('Sin importe verificado','Zenbatekoa egiaztatu gabe'):
   Array.isArray(value)?value.map(n=>format.format(n)).join(' – '):format.format(value);
  const discipline=titles[group[3]][eu()], duration=tr('4 años','4 urte'), credits='240 ECTS';
  const title=tr('Grado en Enseñanzas Artísticas Superiores','Goi Mailako Arte Irakaskuntzetako Gradua');
  const tabButton=(key,text)=>'<button type="button" id="arts-tab-'+key+'" role="tab" aria-controls="arts-panel-'+key+
   '" aria-selected="'+(tab===key)+'" data-action="art-tab" data-tab="'+key+'">'+text+'</button>';
  const panel=(key,body,classes='')=>'<div id="arts-panel-'+key+'" role="tabpanel" aria-labelledby="arts-tab-'+key+
   '" class="'+classes+'"'+(tab===key?'':' hidden')+'>'+body+'</div>';
  const prices=card(tr('Coste de los estudios','Ikasketen kostua'),'<p><strong>'+tr('Precios y requisitos','Prezioak eta baldintzak')+
   ' · '+(eu()&&periodEu?periodEu:period)+'</strong></p><dl class="fact-grid">'+[
    [tr('Primer curso (60 ECTS)','Lehen maila (60 ECTS)'),money(first)],
    [tr('Grado completo · estimación','Gradu osoa · zenbatespena'),money(total)]
   ].map(fact).join('')+'</dl><div class="cost-caveat">'+
   tr('Estimación de cuatro cursos a la tarifa indicada. Según el centro, puede haber gastos de expediente, seguro u otros cargos.',
    'Lau ikasturteko zenbatespena adierazitako tarifarekin. Ikastegiaren arabera, espediente-, aseguru- edo bestelako gastuak egon daitezke.')+'</div>');
  const admissionCard=card(tr('Acceso y admisión','Sarbidea eta onarpena'),'<p>'+tr(requirements,requirementsEu)+'</p><p>'+group[8+eu()]+
   '</p><p>'+tr('Las ponderaciones de la EBAU no se aplican.','EAESeko haztapenak ez dira aplikatzen.')+'</p>'+
   (exam==null?'':'<dl class="fact-grid">'+fact([tr('Tasa de la prueba','Probaren tasa'),money(exam)])+'</dl>'));
  const academic=card(tr('Datos académicos','Datu akademikoak'),'<dl class="fact-grid">'+[
   [tr('Centro','Ikastegia'),center(group)],[tr('Localidad','Herria'),group[2]],
   [tr('Disciplina','Diziplina'),discipline],[tr('Duración','Iraupena'),duration],[tr('Créditos','Kredituak'),credits]
  ].map(fact).join('')+'</dl>');
  const sources=card(tr('Enlaces y fuentes','Estekak eta iturriak'),'<div class="sources-list">'+
   link(official,tr('Oferta oficial del centro','Ikastegiaren eskaintza ofiziala'))+
   link(admission,tr('Convocatoria y plazos','Deialdia eta epeak'))+
   (access!==admission?link(access,tr('Información de acceso','Sarbideari buruzko informazioa')):'')+
   link(fees,tr('Fuente de precios','Prezioen iturria'))+'</div>');
  const orientation=card(tr('¿Qué es?','Zer da?'),'<p>'+specialty[2+eu()]+
   '</p><h3>'+tr('Salidas profesionales','Lanbide-aukerak')+'</h3><p>'+specialty[4+eu()]+'</p>');
  const tags=[discipline,title,duration,credits].map(value=>'<span class="pill">'+value+'</span>').join('');
  return '<article data-no-translate><div class="page-top">'+back()+'<div class="eyebrow">'+center(group)+'</div></div>'+
   '<div class="detail-title-override"><div class="detail-heading"><h1>'+specialty[eu()]+'</h1></div><div class="detail-tags">'+tags+'</div></div>'+
   '<div class="detail-tabs" role="tablist" aria-label="'+tr('Información de la carrera','Graduari buruzko informazioa')+'">'+
   tabButton('ficha',tr('Ficha y acceso','Fitxa eta sarbidea'))+tabButton('orientation',tr('¿Qué es?','Zer da?'))+'</div>'+
   panel('ficha','<div class="detail-main">'+prices+admissionCard+'</div><aside class="detail-sidebar">'+academic+sources+'</aside>','detail-layout')+
   panel('orientation',orientation)+'</article>';
 }
 const foreign = [
  ['Arte Digital y Animación','Arte Digitala eta Animazioa','Digital Art and Animation','Creación de personajes, entornos y animación digital.','Pertsonaiak, inguruneak eta animazio digitala sortzea.'],
  ['Simulación Interactiva en Tiempo Real','Denbora Errealeko Simulazio Interaktiboa','Computer Science in Real-Time Interactive Simulation','Programación de motores, gráficos y simulaciones interactivas.','Motorrak, grafikoak eta simulazio interaktiboak programatzea.'],
  ['Informática y Diseño de Videojuegos','Informatika eta Bideojokoen Diseinua','Computer Science and Game Design','Programación y diseño de reglas, niveles y experiencias de juego.','Jokoen arauak, mailak eta esperientziak diseinatu eta programatzea.'],
  ['Informática en Inteligencia Artificial','Adimen Artifizialeko Informatika','Computer Science in Artificial Intelligence','Programación y aplicación de técnicas de inteligencia artificial.','Adimen artifizialeko teknikak programatu eta aplikatzea.']
 ];
 const foreignLabel=()=>tr('Titulaciones extranjeras impartidas aquí','Hemen ematen diren atzerriko titulazioak');
 function foreignPortal(){
  return '<section data-no-translate><h2 class="portal-label">'+foreignLabel()+'</h2><div class="portal-grid"><button class="portal-card" data-action="foreign" type="button"><h2>DigiPen Europe-Bilbao</h2><p>'+tr('Cuatro titulaciones estadounidenses autorizadas en Bilbao.','Bilbon baimendutako Estatu Batuetako lau titulazio.')+'</p></button></div></section>';
 }
 function foreignView(index,back){
  const degree=foreign[index];
  const intro=tr('Los títulos los expide DigiPen en Estados Unidos. La autorización para impartirlos en Bilbao no implica su homologación automática en España.','Titulazioak DigiPenek ematen ditu Estatu Batuetan. Bilbon emateko baimenak ez dakar Espainian automatikoki homologatzea.');
  const title=degree?degree[eu()]:foreignLabel();
  const details=degree?'<section class="section-card"><h2>'+tr('¿Qué es?','Zer da?')+'</h2><p>'+degree[3+eu()]+'</p><h2>'+tr('Acceso','Sarbidea')+'</h2><p><a href="https://www.digipen.es/es/admisiones/como-matricularse" target="_blank" rel="noopener noreferrer">'+tr('Requisitos y solicitud en DigiPen','Baldintzak eta eskaera DigiPenen')+' ↗</a></p><p><a href="https://www.euskadi.eus/bopv2/datos/2026/02/2600867a.pdf" target="_blank" rel="noopener noreferrer">'+tr('Autorización del Gobierno Vasco','Eusko Jaurlaritzaren baimena')+' ↗</a></p></section>':
   '<div class="portal-grid">'+foreign.map((x,i)=>'<button class="portal-card" type="button" data-action="foreign-detail" data-art="'+i+'"><strong>'+x[eu()]+'</strong><p>DigiPen Europe-Bilbao</p></button>').join('')+'</div>';
  return '<div class="arts-catalog" data-no-translate><div class="page-top">'+back()+'<h1>'+title+'</h1><p>'+intro+'</p>'+(degree?'<p>'+degree[2]+' · Bilbao</p>':'')+'</div>'+details+'</div>';
 }
 window.UniArts = {portal,catalog,detail,foreignPortal,foreignView};
})();
