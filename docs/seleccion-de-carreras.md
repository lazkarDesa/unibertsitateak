# Selección de carreras

Cuatro decisiones reversibles, independientes por universidad y carrera: sin marcar, en duda, me interesa y no me interesa. El icono abre un diálogo con las cuatro opciones tanto en el buscador y listados como en el detalle. Se conserva la navegación de la fila completa y los popovers de ponderaciones.

Los listados y el buscador se pueden filtrar por los cinco valores (todos y los cuatro estados). «Carreras seleccionadas» contiene únicamente las que interesan y las dudas, agrupadas por universidad. En esa vista el filtro permite todos, dudas o me interesa. El CSV exporta las filas mostradas y su estado; el PDF conserva una etiqueta textual de interés.

Almacenamiento local: `uni-explorer.selections.v2`, con claves estables de universidad y carrera. Las entradas sin marcar se eliminan del conjunto; las descartadas permanecen guardadas para poder encontrarlas con el filtro. Los corazones de `uni-explorer.favorites.v1` se migran a «Me interesa». Un conjunto vacío en el nuevo formato evita que las antiguas marcas reaparezcan. Se sincronizan los cambios entre pestañas. Si no se puede guardar, la elección no se presenta como guardada y el diálogo muestra el error.

El idioma y el perfil académico no cambian con esta actualización.
