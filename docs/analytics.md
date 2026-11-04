# Medición de Uni Explorer en GA4

Contenedor: `GTM-PNKDC9FM`. En HTTP y HTTPS se carga el contenedor desde la primera pantalla, con almacenamiento de analítica activado y publicidad desactivada. Los eventos no incluyen las materias del perfil ni el texto introducido en el buscador.

## Configurar el contenedor

1. En Google Tag Manager, crea o revisa la etiqueta de Google con el ID de medición `G-…` del flujo web de GA4. Configura `send_page_view=false`. Si está activada la medición mejorada de cambios de página por historial, desactívala en el flujo para evitar duplicados.
2. Crea un activador de evento personalizado exacto `uni_page_view`. Vincúlalo a una etiqueta de evento GA4 llamada `page_view` y mapea las variables de capa de datos `page_location`, `page_title`, `page_referrer`, `screen_name`, `site_language`, `university` y `degree`.
3. Crea un segundo activador de evento personalizado con la expresión regular `^(university_view|university_search|degree_view|orientation_view|favorites_view|interest_open|interest_change|favorites_export)$`. En su etiqueta GA4 usa `{{Event}}` como nombre del evento. Mapea `site_language`, `university`, `degree`, `screen_name`, `previous_interest`, `interest_status` y `export_format` desde variables de capa de datos homónimas.
4. Usa Vista previa y comprueba los eventos en Tag Assistant y GA4 DebugView. Publica el contenedor cuando las etiquetas lleguen al flujo correcto.

## Leer los resultados

En GA4 registra dimensiones personalizadas de ámbito **evento** para `university`, `degree`, `site_language`, `interest_status` y las demás que quieras desglosar. En Explorar usa **Número de eventos** como métrica. Para contar accesos a cada universidad, filtra **Nombre del evento = university_view** y pon **university** en Filas. Cuenta entradas a la pantalla de universidad, incluidas las visitas repetidas.

| Evento | Significado |
|---|---|
| university_view | Entrada a la pantalla de una universidad |
| university_search | Búsqueda de al menos tres caracteres tras una pausa de 650 ms. Solo registra la universidad |
| degree_view | Vista de la pestaña de ficha de una carrera |
| orientation_view | Vista de la pestaña ¿Qué es? |
| favorites_view | Entrada a Carreras seleccionadas |
| interest_open | Apertura del selector de interés |
| interest_change | Cambio guardado. Incluye estado anterior y nuevo, también al quitar la marca |
| favorites_export | Acción de exportar CSV o abrir el diálogo de impresión para PDF |

Las rutas de medición son virtuales, por ejemplo `#/detail/ehu/fisica/orientation`. El historial normal de la web no cambia.
