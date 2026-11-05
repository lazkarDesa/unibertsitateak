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
  return '<div data-no-translate><div class="page-top">'+back()+'<h1>'+label()+'</h1><p>'+
   tr('Elige una especialidad para consultar qué se estudia y cómo se accede.','Aukeratu espezialitate bat zer ikasten den eta nola sartzen den jakiteko.')+
   '</p></div>'+Object.entries(titles).map(([kind,title])=>'<section class="section-card"><h2>'+title[eu()]+'</h2><div class="portal-grid">'+
   offerings.filter(x=>x.group[3]===kind).map(x=>'<button class="portal-card" data-action="art-detail" data-art="'+x.id+'" type="button"><strong>'+
    x.specialty[eu()]+'</strong><p>'+center(x.group)+' · '+x.group[2]+'</p></button>').join('')+'</div></section>').join('')+'</div>';
 }
 function detail(id,back) {
  const item=offerings.find(x=>x.id===id);
  if(!item)return catalog(back);
  const {group,specialty}=item;
  const official=eu()&&group[6]?group[6]:group[5];
  const access=eu()&&group[0].startsWith('dantzerti')?'https://www.dantzerti.eus/eu/sarrera-probak/sarbidea':group[7];
  const link=(href,text)=>'<a href="'+href+'" target="_blank" rel="noopener noreferrer">'+text+' ↗</a>';
  return '<article data-no-translate><div class="page-top">'+back()+'<div class="eyebrow">'+center(group)+'</div><h1>'+specialty[eu()]+
   '</h1><p>'+group[2]+' · '+tr('Grado en Enseñanzas Artísticas Superiores','Goi Mailako Arte Irakaskuntzetako Gradua')+' · '+titles[group[3]][eu()]+
   ' · '+tr('4 años','4 urte')+' · 240 ECTS</p></div><section class="section-card"><h2>'+tr('¿Qué es?','Zer da?')+'</h2><p>'+
   specialty[2+eu()]+'</p><h3>'+tr('Salidas profesionales','Lanbide-aukerak')+'</h3><p>'+specialty[4+eu()]+
   '</p></section><section class="section-card"><h2>'+tr('Acceso','Sarbidea')+'</h2><p>'+group[8+eu()]+
   '</p><p>'+tr('Las ponderaciones de la EBAU no se aplican. Consulta las plazas, el calendario y las tasas en la convocatoria oficial.',
   'EAESeko haztapenak ez dira aplikatzen. Begiratu plazak, egutegia eta tasak deialdi ofizialean.')+'</p><ul><li>'+
   link(official,tr('Oferta oficial del centro','Ikastegiaren eskaintza ofiziala'))+'</li>'+
   (access?'<li>'+link(access,tr('Información de acceso','Sarbideari buruzko informazioa'))+'</li>':'')+'</ul></section></article>';
 }
 window.UniArts = {portal,catalog,detail};
})();
