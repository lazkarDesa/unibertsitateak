# Medición directa en GA4

Flujo web: `G-8C9WYSHSG3`. Uni Explorer envía los eventos directamente con la etiqueta de Google, con vistas automáticas de configuración y publicidad desactivadas. Comprueba los eventos en GA4 → Tiempo real. Si el flujo tiene activadas las vistas de página por cambios de historial en Medición mejorada, desactiva esa opción para evitar duplicados.

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
