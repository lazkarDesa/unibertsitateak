# Añadido para la revisión de los lunes · Uni Explorer

Repositorio: lazkardesa/unibertsitateak, rama main. Web: https://lazkardesa.github.io/unibertsitateak/

Revisar todas las ofertas activas de EHU y UPNA frente a QEDU y las fichas oficiales de ambas universidades. Comprobar títulos, centro, campus, itinerario e idioma antes de asociar registros; usar los códigos oficiales de universidad, centro y título y conservar la relación revisada de research/qedu-offer-map.json. No resolver coincidencias dudosas solo por parecido del nombre.

Comprobar notas de corte del mismo curso, cupo y convocatoria; QEDU muestra el corte final y puede agrupar idiomas o itinerarios. Conservar los tres decimales de la fuente universitaria; no sustituirlos por los dos decimales de QEDU. Revisar discrepancias de docs/revision-qedu.json y no asumir que toda diferencia es un error. No reemplazar un curso reciente por uno anterior.

Revisar plazas de nuevo ingreso con curso y alcance (por variante o total del título), idiomas y alcance real de la docencia, ECTS y precios en las páginas universitarias. El campo QEDU «idioma extranjero» significa al menos un 50 % de créditos en lengua extranjera: no sirve para deducir el euskera o el idioma de todas las asignaturas.

Actualizar nota media de admisión desde Bachillerato con su curso cuando se publique. Para «¿Qué es?» actualizar afiliación, autónomos, indefinidos, cotización de nivel universitario y base anual de cotización. Registrar promoción, año de referencia, cuatro años desde egreso y fecha de consulta. Si el servicio no indica un período, dejarlo expresamente sin identificar. No confundir afiliación con empleo relacionado ni base de cotización con salario; no convertir afiliación en puntuación sobre diez ni mezclarla con encuestas Lanbide/UPNA.

Fuentes: https://www.ciencia.gob.es/qedu.html y https://www.ciencia.gob.es/qedu/AyudaQEDU.html. El servicio público actual es https://www.ciencia.gob.es/home/qedu/main/zona02/0 mediante POST urlencoded. action=tarjeta con niveles='GRADO','GRADOD', consulta vacía, ambitos vacío y offset=0 devuelve el catálogo. action=detalle con codTit, codCentro, codUniv devuelve la ficha; action=detalleIn añade nivel y ambito y devuelve indicadores laborales. Verificar que estos parámetros y las definiciones siguen vigentes antes de automatizar cambios. El servicio puede cambiar sin aviso.

Actualizar la copia estática data/qedu-datos.json y su wrapper .js, además de los JSON/JS de cada universidad si corresponde. La ventana QEDU solicita información en directo al abrirse y usa la copia fechada si la consulta falla. Verificar ambas rutas, también cuando no hay datos específicos del título. Comprobar CORS desde la web publicada, respuesta de la universidad/centro correctos, cierre con X/Escape y funcionamiento en móvil y en ES/EU. No añadir un enlace con parámetros que el portal oficial no acepte.

Flujo de reconstrucción disponible: research/fetch-qedu.ps1 descarga las fichas del catálogo guardado; research/fetch-qedu-universities.ps1 descarga las páginas indicadas en research/qedu-university-jobs.json; node research/build-qedu.cjs reconstruye datos e informe a partir de esas descargas. Renovar primero el catálogo, las URLs de trabajo y las correspondencias revisadas: no ejecutar el constructor con descargas antiguas y etiquetarlas como actuales. Revisar el resultado antes de publicar.

Pendientes iniciales de correspondencia EHU: Double Bachelors degree in Business and Economics; Máquinas y Mantenimiento Naval; Ingeniería en Digitalización Industrial y Ciberseguridad. Revisar también idiomas pendientes indicados en docs/revision-qedu.json. No atribuirles datos de un título anterior sin verificar continuidad del plan.

Validar los JSON/JS sincronizados, ejecutar tests/qedu.test.cjs y las pruebas de orientación, traducción y fichas afectadas. Publicar cambios autorizados en main, comprobar GitHub Pages y la URL pública en castellano y euskera. Entregar resumen con cambios, diferencias pendientes, fuentes y cursos. Si no hay novedades, indicar que la revisión se ha realizado sin alterar datos.

La tarea debe poder acceder a Internet y publicar en ese repositorio. En la oficina usar el proxy configurado del equipo; en casa conexión directa. No guardar credenciales ni la dirección de un proxy con contraseña en el repositorio.
