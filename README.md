# Uni Explorer v2.1 — SPA estática 2026–2027

Explorador de grados de **EHU**, **UPNA**, **Universidad de Deusto** y **Universidad de Navarra**.

## Publicación

1. Descomprime el ZIP y publica **todo el contenido** del directorio raíz, sin alterar su estructura.
2. Abre `index.html` en un alojamiento estático (GitHub Pages, Netlify, Apache, Nginx, etc.). No hay backend, llamadas a bases de datos ni dependencias externas de JavaScript.
3. También se puede abrir `index.html` directamente desde disco, porque se entregan ficheros `.js` con los datos precargados. Los `.json` son la fuente interoperable para futuras aplicaciones.
4. Los enlaces externos (fuentes oficiales) sí requieren Internet.

La interfaz es una SPA: todas las pantallas se sustituyen dentro del documento y **no se altera la URL del navegador**.

## Navegación

- Inicio: universidades públicas **EHU** y **UPNA** y, bajo el encabezado **Universidades privadas**, Deusto y Universidad de Navarra.
- Dentro de cada universidad: buscador desde 3 caracteres, exploración por campus y por cinco ramas de conocimiento.
- Las titulaciones del buscador se agrupan cuando comparten nombre y se imparten en varios campus.
- En listados: filtro por campus o facultad, búsqueda libre y ordenación por nombre/facultad/notas (EHU) o precio/total estimado (privadas).
- En EHU y UPNA: filtro de asignatura ponderable (por ejemplo, Biología) y popover que muestra las asignaturas con coeficiente 0,1 o 0,2 al colocar el ratón sobre la titulación.
- El botón **Volver** restaura pantalla, campus, filtros, orden y posición vertical de la lista desde la que se abrió el detalle.

## Cobertura y archivos

- `data/ehu-datos.json` + `data/ehu-datos.js`: EHU (Araba, Gipuzkoa, Bizkaia); 108 ofertas activas y tabla normalizada de 537 ponderaciones, heredados del catálogo EHU previo.
- `data/upna-datos.json` + `.js`: UPNA, campus Pamplona y Tudela; 41 ofertas, notas de 2025 y 2026 (última y primera lista) y 564 relaciones de ponderación derivadas de PDF oficial.
- `data/deusto-datos.json` + `.js`: Deusto en **Bilbao y Donostia**; 42 ofertas visibles de 2026–2027 (excluye modalidad online y oferta futura 2027–2028).
- `data/navarra-datos.json` + `.js`: Universidad de Navarra en **Pamplona y Donostia/Tecnun**; 88 registros de grados, dobles grados y opciones con diploma/programa de la recopilación.
- `excel/EHU_grados_notas_y_ponderaciones_2026.xlsx`: libro previo EHU, por campus, notas y ponderaciones.
- `excel/UPNA_grados_ponderaciones_notas_2026-2027.xlsx`: UPNA, seis pestañas con notas 2025/2026, campus, asignaturas y diccionario.
- `docs/upna-parametros-ponderacion-2026-2027.pdf`: anexo UPNA oficial del curso 2026–2027.
- `excel/Universidad_Deusto_grados_2026_2027.xlsx` y `excel/Universidad_Navarra_grados_2026_2027.xlsx`: archivos **independientes** con las ofertas de cada universidad privada y diccionario de campos.

El número de *ofertas* no equivale necesariamente al de títulos oficiales distintos: algunas universidades enumeran programas combinados y diplomas como opciones propias. Los campos `id`, `universidad`, `campus` y `titulacion` permiten desambiguar los registros.

## Precios: dato oficial frente a estimación

- `precio_primero_2026` (EUR) es el **precio de matrícula de primer curso publicado** en 2026–2027, solo si se pudo identificar la combinación concreta en la tabla de la universidad. `null` significa que no se verificó; **no** significa gratis.
- `creditos_primero_2026` y `precio_credito_2026` expresan los ECTS de primero y su coste unitario en la tabla publicada o derivado de ella en Deusto.
- `coste_total_est_2026` es la **estimación a euros de 2026**, calculada como: `precio_credito_2026 × ects` (créditos del plan). El Excel realiza esa estimación con una fórmula en su columna correspondiente.
- La estimación **no** es el coste real ni un presupuesto de la universidad: las tarifas de cursos superiores pueden ser diferentes, especialmente en dobles grados y programas con diplomas. No se incluyen becas, futuras subidas, alojamiento ni manutención.
- Universidad de Navarra indica **95 € adicionales en derechos de secretaría** sobre matrícula, separados del importe de primer curso publicado. Deusto advierte de posibles tasas adicionales (p. ej. seguro escolar, si corresponde).
- Sin precio oficial verificable, la aplicación muestra «No consta» y no inventa el coste total.

## Notas de corte y ponderaciones

- La UPNA incorpora notas del último listado de admitidos de 2025 (8 oct) y 2026 (7 oct, salvo excepciones), además de las notas iniciales. Las notas se han contrastado con la recopilación https://angelcuesta.com/notas-de-corte-navarra.html que referencia las listas de la UPNA; se recomienda verificación directa antes de decisiones administrativas. Las ponderaciones sí se extraen de https://www2.unavarra.es/gesadj/Estudios/acceso_matricula/Anexoponderacion_2026_2027_cas.pdf. Los programas internacionales mantienen los parámetros del grado base según el anexo.
- Para la UPNA no se ha podido verificar el idioma de docencia ni las titulaciones individuales de todas las páginas oficiales; se indican explícitamente los campos pendientes. Los ECTS de grados ordinarios son referencias generales pendientes de cotejo individual; los dobles grados se dejan sin cifra no acreditada.
- Las notas de la EHU de 2025 y 2026 pueden corresponder a fases diferentes. Su comparabilidad es limitada; consultar ficha oficial.
- En las dos universidades privadas **no** se han extrapolado ni las notas de corte públicas ni los coeficientes de ponderación de la EHU. Sus procedimientos de admisión son propios y pueden exigir pruebas, entrevistas o requisitos específicos que se deben verificar.
- Las ramas de conocimiento de privadas están normalizadas a cinco categorías para permitir filtros; la correspondencia es **orientativa** donde no se comprobó el registro oficial de cada plan.

## Fuentes oficiales principales

- EHU: https://www.ehu.eus/es/web/graduak/graduak
- EHU ponderaciones 2026: https://www.ehu.eus/documents/d/unibertsitaterako-sarbidea/parametros2026_cast
- UPNA ponderaciones: https://www2.unavarra.es/gesadj/Estudios/acceso_matricula/Anexoponderacion_2026_2027_cas.pdf
- UPNA cortes 2025/2026 (recopilación con enlaces a boletines): https://angelcuesta.com/notas-de-corte-navarra.html
- Deusto: https://www.deusto.es/es/inicio/estudia/estudios/grados
- Deusto precios 2026–2027: https://www.deusto.es/es/inicio/estudia/condiciones-economicas/grado/proximo-curso/tasas-primer-curso
- Navarra: https://www.unav.edu/estudios/grados
- Navarra precios 2026–2027: https://www.unav.edu/admision-y-ayudas/grado/cuanto-cuesta-estudiar-en-la-universidad/precios-de-primer-curso

Actualizado **02/11/2026**. Esta herramienta no es oficial. Los enlaces de cada ficha se muestran solo cuando estaban identificados y comprobados; en caso contrario se enlaza el catálogo general.

## Evolución / consumo de datos

Se recomienda utilizar como **fuente de verdad** los JSON en `/data` y generar los `.js` del mismo contenido mediante un script de compilación al publicar. Se separan datos e interfaz y no se necesita incorporar una base de datos en el navegador. Si se necesitan búsquedas offline o almacenamiento incremental, puede incorporarse IndexedDB después sin modificar las claves del modelo.
