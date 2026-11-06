# Ayuda y manual de Uni Explorer

Revisión: 6 de noviembre de 2026.

La ayuda contextual cubre 23 temas en castellano y euskera: navegación, perfil, filtros, ponderaciones, interés, comparador, fichas, costes, mapas, QEDU, UNED, enseñanzas artísticas y titulaciones extranjeras. Incluye las novedades de plazas, idiomas, prácticas y el filtro por campus de la ficha.

Cada idioma tiene 55 capturas propias y anotadas: 27 de ordenador y 28 de móvil. Las imágenes móviles muestran la distribución real y el botón del libro; no son recortes de la versión de ordenador. La ayuda elige las capturas de móvil hasta 690 px y permite cambiar entre ambas vistas con el selector Capturas.

El contenido se guarda en data/ayuda-contenido.json y data/ayuda-contenido-eu.json, con sus envoltorios JavaScript. Las imágenes están en assets/help y assets/help-eu; las de móvil, en la subcarpeta mobile de cada idioma. Los textos, las marcas numeradas y las imágenes deben revisarse juntos.

Los manuales docs/manual-uni-explorer.pdf y docs/manual-uni-explorer-eu.pdf incluyen ambas vistas, índice enlazado y marcadores. Las pantallas largas se dividen en varias páginas para facilitar su lectura. Los ejemplos no sustituyen las fuentes oficiales ni las fechas de cada dato.

La ayuda no modifica perfil, selección, filtros ni ruta. Conserva el retorno del foco al cerrarse y los eventos de uso y descarga del PDF. La revisión se valida con pruebas de cobertura bilingüe y móvil, comprobación visual de capturas y renderizado de los PDF.
