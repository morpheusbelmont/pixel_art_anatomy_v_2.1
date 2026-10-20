# PIXEL ANATOMY LAB V1.4

Aplicación educativa HTML5 para estudiar anatomía muscular aplicada a la ilustración y al Pixel Art.

## Funcionalidades
- Interfaz retro 16-bit responsive.
- Atlas SVG con vistas frontal, posterior y lateral; regiones seleccionables.
- Seis lecciones guiadas con conceptos, consejos y ejercicios.
- Seguimiento local de lecciones completadas.
- Reto anatómico con 15 preguntas aleatorias de selección única y múltiple.
- Retroalimentación por respuesta, puntuación final, revisión de errores e historial local.
- Editor Pixel Art de 32×32 con lápiz, borrador, relleno, paleta, color personalizado, cuadrícula, deshacer/rehacer y limpieza.
- Exportación PNG a 512×512 y guardar/abrir proyecto JSON.

## Ejecutar
Publica la carpeta en GitHub Pages o ejecútala con un servidor local. El atlas usa `fetch()` para cargar SVG y puede no funcionar al abrir `index.html` directamente como archivo `file://`.

## Estructura principal
- `index.html`: interfaz principal.
- `css/`: estilos generales, atlas, Pixel Art, lecciones, evaluación y editor.
- `assets/anatomy/`: vistas esquemáticas SVG.
- `js/data/muscles.js`: datos musculares.
- `js/modules/atlas.js`: lógica del atlas.
- `js/modules/lessons.js`: lecciones y progreso local.
- `js/modules/quiz.js`: banco de preguntas y evaluación.
- `js/modules/pixel-editor.js`: editor de sprites.
- `js/main.js`: navegación entre módulos.

## Estado
- Atlas: funcional.
- Lecciones: funcionales.
- Retos anatómicos: funcionales.
- Editor Pixel Art: funcional, lienzo de 32×32 y exportación PNG/JSON.
- Capas anatómicas: pendiente.
- Panel ampliado de progreso: pendiente; avance e historial se guardan localmente.
- Pruebas finales de integración: recomendadas antes de publicación.

## Créditos
Desarrollado por Lic. Carlos Eduardo Sepúlveda Toro.


## Versión 1.5 — Capas anatómicas interactivas
- Comparación de vistas frontal, posterior y lateral.
- Controles para activar/desactivar grupos musculares, contraste de volumen y contorno.
- Biblioteca de fichas musculares con función general y traducción a Pixel Art.
- Requiere abrir el proyecto mediante GitHub Pages o servidor local para cargar las referencias SVG.


## Versión 1.6 — Mi Progreso
- Tablero con resumen estimado de lecciones, intentos de retos, mejor puntuación y proyectos locales.
- Ruta de aprendizaje sugerida y actualización manual del tablero.
- El tablero lee datos disponibles en localStorage; la exactitud depende de las claves que usen los módulos y no hay sincronización en la nube.


## Revisión de calidad V1.6
- Corregida la lectura del progreso: usa las claves reales `pal-lessons-done` y `pal-quiz-history`.
- El módulo de progreso cuenta exportaciones JSON realizadas desde el editor en este navegador; no cuenta archivos PNG descargados.
- Las zonas musculares del módulo de capas ahora se pueden seleccionar directamente desde el SVG, además de la biblioteca de fichas.
- Validación estática de sintaxis JavaScript con Node.js y comprobación de referencias locales de CSS/JS/SVG.
- La validación automatizada no sustituye una prueba manual en navegador; se recomienda probar mediante servidor local o GitHub Pages.


## Versión 1.7 — Mejoras visuales y navegación por pestañas
- Se rediseñó la figura frontal con proporciones humanoides más naturales para una referencia educativa pixel art.
- Se añadió vista isométrica / tres cuartos al atlas y al módulo de capas.
- Las secciones principales se organizan en pestañas para evitar el desplazamiento vertical entre módulos.
- Las lecciones incluyen una referencia visual del personaje anatómico.
- El arte sigue siendo esquemático para ilustración educativa y no es un atlas clínico.


## V1.8 — Integración de sprites aportados
- Se copiaron los 16 PNG suministrados a `assets/anatomy/`, `assets/muscles/` y `assets/masks/`.
- El atlas permite cambiar entre modelo masculino/femenino y las cuatro vistas.
- La referencia muscular se puede activar en las vistas frontal y posterior.
- Se añadieron rutas de imágenes a las lecciones.
- Importante: las dimensiones de PNG base, imágenes musculares y máscaras no son uniformes. La selección por región no se declara final: requiere normalizar/alinear las máscaras y codificar identificadores musculares distinguibles.


## V1.9 — Maniquí de madera y espacio de estudio reorganizado
- La portada utiliza un maniquí articulado de madera en pixel art como referencia de dibujo.
- El atlas se reorganiza en una zona de trabajo contenida, con controles de vista agrupados y persistentes mientras se trabaja.
- La ficha anatómica queda separada en una columna lateral con desplazamiento interno si el contenido supera el espacio disponible.
- En pantallas pequeñas, el atlas pasa a una distribución vertical adaptable.
- La imagen del maniquí se encuentra en `assets/anatomy/wooden-mannequin-pixel.png`.
- Los PNG anatómicos originales se conservan sin reemplazarlos.
- Nota: los controles de capas siguen siendo referencias visuales; esta versión no afirma selección muscular por regiones pixel a pixel.


## V2.0 — Corrección del atlas
- Los botones Masculino/Femenino actualizan el modelo mediante un render SVG único.
- Se sustituyó la figura raster del atlas por un modelo anatómico vectorial estilizado.
- La capa muscular se dibuja dentro del mismo SVG: al activarla no se apilan PNG ni quedan desalineados.
- Las vistas frontal, posterior, lateral e isométrica cambian el dibujo y actualizan la ficha lateral.
- Se ocultaron las barras de desplazamiento del atlas y se ajustó la distribución al alto disponible; en pantallas pequeñas se usa diseño adaptable.
- Los sprites PNG originales siguen en el proyecto para su uso en lecciones u otros módulos.
- Limitación: el vector es una guía anatómica didáctica simplificada, no un modelo clínico ni una selección por regiones con puntos interactivos.


## V2.1 — Integración con los assets originales
- El atlas usa los PNG originales de `assets/anatomy/` para masculino/femenino y vistas frontal, posterior, lateral e isométrica.
- La referencia muscular usa `assets/muscles/` en vistas frontal y posterior; el control se desactiva en lateral/isométrica.
- Cambiar de vista apaga la capa muscular para evitar imágenes persistentes o duplicadas.
- La portada utiliza la ilustración de cubierta en `assets/anatomy/wooden-mannequin-pixel.png`.
- Se mantienen los archivos de máscaras para una futura implementación de selección anatómica por región.
- Se añadieron diagnósticos legibles si falta un archivo de sprite.
