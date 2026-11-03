# Ayuda y manual de Uni Explorer

Revisión: 3 de noviembre de 2026.

El icono **? Ayuda** de la cabecera está disponible en todas las rutas y abre una ventana contextual grande. El perfil y el selector de interés incorporan además su propio acceso. La ventana permite consultar los 16 temas, ampliar las capturas, descargar el PDF y cerrar con la X, Escape o el fondo exterior; al cerrar devuelve el foco al control que la abrió.

El contenido común del PDF y de las ventanas está en `data/ayuda-contenido.json` y su versión JavaScript. Las 22 capturas anotadas de `assets/help/` muestran un perfil y valoraciones de ejemplo. El manual es `docs/manual-uni-explorer.pdf`, con índice enlazado y marcadores. Abrir ayuda no modifica el perfil, las valoraciones, los filtros ni la ruta.

Las rutas de inicio, universidad, campus, rama, asignatura, ficha pública, ficha privada, orientación y carreras seleccionadas tienen un tema inicial propio. También hay temas de perfil, ponderaciones, compatibilidad, empleo, estados de interés, móvil y datos locales.

No se cargan librerías, analítica o imágenes de terceros para esta función. Las capturas y el PDF se sirven con la aplicación. Cuando cambie una pantalla o una regla, deben revisarse el texto, las marcas numeradas y el PDF juntos.

Validación: pruebas de rutas de ayuda, apertura y cierre con retorno de foco, conservación de ruta, cobertura de capturas, enlace al manual y regresión de las funciones existentes. El PDF se renderiza para comprobar la maquetación y las marcas se contrastan con las capturas originales.
