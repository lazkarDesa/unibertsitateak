# Orientación de grados y plazas

Revisión: 2 de noviembre de 2026. La pestaña «¿Qué es?» cubre las 246 agrupaciones de títulos activas del catálogo: 84 EHU, 41 UPNA, 33 Deusto y 88 Universidad de Navarra. Las ofertas por campus pueden compartir explicación.

`data/orientacion-datos.json` contiene textos propios por área, la asociación explícita con cada título, sus fuentes oficiales, vídeos encontrados y datos de empleo y plazas. Su versión JavaScript permite seguir usando la aplicación sin peticiones a un servidor de datos. Las explicaciones son orientación editorial, no una reproducción literal de las páginas universitarias. Los programas con diplomas y los títulos eclesiásticos llevan precisiones específicas.

## Empleo

Fuente principal: [Lanbide, situación laboral a diciembre de 2025, promoción universitaria 2022](https://www.lanbide.euskadi.eus/estadistica/situacion-laboral-a-diciembre-de-2025-promocion-universitaria-2022/weblan00-estudiosyestadisticas/es/). Cada registro conserva el nombre del PDF individual, universidad, título y páginas físicas del documento.

El índice es una elaboración propia: tasa de empleo sobre el total de respuestas × porcentaje de personas ocupadas con trabajo bastante o muy relacionado / 1000. Se redondea a una décima en una escala de 1 a 10, con mínimo 1. Se publica solo con ambos datos disponibles y al menos 30 respuestas. Los porcentajes fuente ya están redondeados. No es una probabilidad futura individual. No se sustituyen estos indicadores por la tasa de ocupación ni por «empleo encajado», que mide nivel de cualificación y no especialidad. No se asignan medias de universidad ni notas de componentes a dobles grados. Los datos históricos no permiten aislar campus, idioma o planes nuevos.

UPNA publica [un Excel de inserción laboral](https://www2.unavarra.es/gesadj/VPortalTransparencia/Datos_y_cifras_UAP/Insercion_Laboral/Insercion_Laboral.xlsx). Se muestran los datos de la cohorte 2020–2021, encuesta diciembre de 2024, de la hoja `Encuestas_Grado`, conservando su fila. «Puesto acorde» se mantiene con el nombre oficial: el resumen no precisa aquí su definición ni el número de respuestas, así que no se convierte en el índice anterior. No se traslada la cifra del grado general a un programa internacional sin desglose.

Para Universidad de Navarra se enlaza el estudio institucional de 2026, pero sus resultados agregados no se convierten en una puntuación por carrera.

## Plazas

En EHU se revisan las fichas individuales: 100 ofertas tienen nota con convocatoria y curso 2026–2027 explícitos, y sus plazas se vinculan a esa ficha vigente. Se conserva 2025–2026 donde no hay un dato posterior identificado. Si solo se encuentra el número en una ficha sin curso explícito, se indica su fecha de consulta y «curso no indicado». La nota ordinaria de 2026 no se presenta como comparable con la tabla de 2025.

UPNA: [plazas de nuevo acceso 2026–2027, anexo II, página 1](https://www2.unavarra.es/gesadj/Estudios/acceso_matricula/PlazasGrado_2026_2027_cas.pdf). Se separa cada grado y doble programación. Las plazas de programas internacionales están incluidas en las del grado o doble correspondiente; no son adicionales. El total incluye los cupos de reserva, no equivale al cupo general de Bachillerato.

Las plazas de las privadas se muestran solo cuando se ha encontrado un número en la ficha oficial concreta. La ausencia de dato no significa ausencia de límite.

## Costes de EHU y UPNA

`data/publicas-precios.json` y su versión JavaScript contienen 149 ofertas públicas con su fuente, tarifa por crédito, ECTS y supuestos. Tarifas 2026–2027: [Orden EHU, anexo I, página 10](https://www.euskadi.eus/bopv2/datos/2026/06/2602642a.pdf) y [Orden Foral 63E/2026, anexo I, UPNA](https://bon.navarra.es/es/anuncio/-/texto/2026/124/21). Se aplican las tarifas STEM de EHU según el anexo aunque la ficha del título muestre una tarifa general diferente. La diferencia se señala en pantalla.

Primero se presenta como referencia de 60 ECTS, no como carga verificada de cada plan. La estimación de toda la carrera usa los ECTS publicados en la ficha y supone primera matrícula y precios constantes. En dobles con tarifas mixtas se ofrece un intervalo, sin atribuir una distribución de créditos no comprobada. Apertura, gestión y seguro escolar se muestran aparte. No se incluyen becas, repetición, alojamiento, manutención ni másteres posteriores.

Los centros adscritos no se valoran como si la tarifa pública cubriera sus cuotas propias. [Cámarabilbao](https://cubs.camarabilbao.com/condiciones-economicas/) publica 8.670 € por curso en 2025–2026; la referencia de cuatro cursos mantiene esa tarifa y se etiqueta con ese curso. Su explicación y sus enlaces corresponden al centro adscrito, no a ADE de otro campus.

## Marcas

Los anagramas se obtienen de las cabeceras o pies oficiales de las cuatro universidades. Sus marcas pertenecen a sus respectivos titulares. Uni Explorer sigue siendo una herramienta informativa no oficial.
