# Diario de trabajos

Aplicación web para el móvil (PWA) para apuntar, al final de cada día, el trabajo
hecho: cliente, trabajo, desplazamientos, horas de oficial, horas de ayudante
(sueltas o los dos juntos) y materiales. A fin de mes genera en PDF el listado para facturar.

Pensada para no olvidarse de facturar nada: si no se apunta, se pierde.

## Cómo funciona

- Se instala desde el navegador: *Añadir a pantalla de inicio*. Icono propio y
  pantalla completa, como una app normal.
- **Funciona sin cobertura.** Toda la aplicación queda guardada en el móvil.
- **Los datos no salen del teléfono.** No hay servidor, ni cuenta, ni
  sincronización, ni se envía nada a ninguna parte.
- Los PDF se generan en el propio móvil, también sin conexión.

## Qué hace

- Alta en tres pasos: cliente → trabajo → el apunte del día.
- Las tarifas (hora de oficial, hora de ayudante, hora de los dos juntos y
  desplazamiento) se configuran
  una vez, y **cada apunte guarda la tarifa que había al crearlo**: subir precios
  no recalcula el trabajo antiguo.
- Catálogo de materiales que recuerda el último precio de cada uno.
- Avisa en rojo de los materiales sin precio, para no facturarlos a cero.
- Tres informes en PDF: del mes, de un trabajo concreto (para los que duran
  varios meses), y de todo lo pendiente de facturar.
- Copia de seguridad por el menú de compartir del móvil, y restauración.

## Instalación y uso

Ver [`LEEME.txt`](LEEME.txt).

## Cómo está hecho

Un único fichero HTML sin compilar: ni framework, ni build, ni dependencias de
red. Sólo [jsPDF](https://github.com/parallax/jsPDF) y jspdf-autotable, incluidos
en `vendor/` para que funcionen sin conexión.

Los datos se guardan en IndexedDB como un único documento JSON, con copia espejo
en localStorage.

Para desplegarla basta con servir estos ficheros por HTTPS.
