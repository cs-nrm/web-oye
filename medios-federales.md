# Medios Federales (Equativ / Smart AdServer): apagado

> **Estado: comentado, no borrado.** Si hiciste pull y no ves anuncios de Medios
> Federales, es a propósito. Aquí se explica qué hace ese código, dónde está
> comentado y cómo volver a encenderlo.

## Por qué está apagado

El recuadro de Medios Federales ocupaba en las notas el mismo hueco que
ShowHeroes/Exte. Se decidió regresar ShowHeroes/Exte y apagar Medios Federales
mientras se define dónde colocarlo. No está descartado: el código está completo
y probado, solo desconectado.

## Qué hace cuando está encendido

Pide un video programático a Equativ (red 4308) y lo pinta en un recuadro
flotante abajo a la izquierda, con una X para cerrarlo. El recuadro solo se ve
cuando llega un creativo real. Si no llega, se queda invisible y no captura
clics.

Datos de Oye:

| | |
|---|---|
| red | 4308 |
| siteId | 794554 |
| pageId | 2249309 |
| formato | 111268 ("Inline", plantilla video-read) |
| schain | `1.0,1!mediosfederales.com,794554,1,oyedigital,oyedigital.mx` |

Las líneas de Medios Federales en `public/ads.txt` (bloque `#MEDIOS FEDERALES`)
**siguen puestas** a propósito. Son declaraciones de vendedores, no etiquetas, y
quitarlas desautorizaría demanda.

## Dónde está comentado

| Archivo | Qué se comentó |
|---|---|
| `src/components/BaseHead.astro` | el import y `<SmartMediosFederales />` del head |
| `src/pages/index.astro` | el import y `<SmartInline />` |
| `src/pages/{breakingnews,cine,entrevistas,eventos,gaming,kpop,locutores,promociones}/[slug].astro` | el import y `<SmartInline />` |
| `src/pages/topten/[slug].astro` | el import y `<SmartInline />` |

Los componentes siguen en su lugar y funcionan:

- `src/components/head/SmartMediosFederales.astro`: carga `smart.js`, hace el
  `setup`, pide el anuncio y lo pinta.
- `src/components/SmartInline.astro`: el recuadro flotante y su CSS.

En las plantillas se usó `{/* */}` a propósito, no `<!-- -->`. El comentario de
Astro no llega al HTML publicado y el de HTML sí. Medios Federales revisa el HTML
con grep, y un `<!-- -->` les aparecería como si el código siguiera ahí.

## Cómo volver a encenderlo

1. Descomentar el import y el uso en `BaseHead.astro`.
2. Descomentar el import y el uso de `SmartInline` en las páginas donde deba
   salir. **No tiene que ser en todas**: el código solo pide anuncio donde existe
   el contenedor, así que basta con agregarlo en las páginas que lo vayan a
   mostrar.
3. Resolver el choque con ShowHeroes/Exte. Si se quedan los dos en las notas, hay
   que mover uno de lugar o quitar el otro, como estaba antes.

## Trampas, para no volver a tropezar

Todo esto se descubrió midiendo, no son suposiciones.

- **El contenedor no puede ir `display:none` mientras no hay anuncio.** La
  plantilla video-read mide el ancho del div para dimensionarse. Si está oculto
  mide 0 y el video nunca se despliega. Por eso el recuadro vive transparente y
  con `pointer-events:none` hasta que llega el creativo.
- **No sirve contar los hijos del div para saber si hay anuncio.** Smart siempre
  mete ahí sus `<script>`, haya video o no. Lo que lo distingue es el alto. Por
  eso se usa un `ResizeObserver` con umbral de 20 px.
- **El id va con I mayúscula** y debe ser idéntico en los tres lugares: el
  `tagId` del formato, el `<div id="Inline">` y la llamada de render.
- **`sas.setup` solo se puede llamar una vez por carga.** Si se repite, lanza
  "sas.setup can only be called once". Por eso el onecall vive aparte del setup
  y se repite en cada navegación del ClientRouter.
- **Con `renderMode: 2` hacen falta dos llamadas de render.** `sas.render("Inline")`
  solo marca el tag como pendiente; `sas.render()` sin argumentos es la que
  libera la cola. Sin la segunda, la petición espera a que venza
  `renderModeTimeout`, que es de 5000 ms por omisión. Medido en vivo: 5004 ms de
  espera.
- **`astro:page-load` se dispara con el evento `load`, no con
  `DOMContentLoaded`.** El `load` espera todas las imágenes y las otras redes de
  anuncios. Medido en vivo en una nota de Oye: `DOMContentLoaded` a 0.93 s y
  `load` a 9.87 s. Por eso el pedido se registra en `DOMContentLoaded` para la
  carga directa y en `astro:page-load` para las navegaciones internas, con un
  `WeakSet` que evita pedir dos veces por el mismo contenedor.
- **`ResizeObserver` no funciona en el navegador interno de Claude.** Para
  comprobar que el recuadro aparece, usa Chrome.
- **No todas las peticiones a smartadserver o sascdn son de este código.** Otros
  compradores que entran por GAM, entre ellos la demanda de ShowHeroes/Exte,
  también usan Smart. Las de este código son `ced.sascdn.com/tag/4308/smart.js`
  y `adapi.smartadserver.com/4308/call`.

## Pendiente con Medios Federales

Mientras estuvo encendido, el video de KIA (inserción 13456937) **nunca llegó a
verse en Oye**. El historial de eventos del propio smart.js
(`sas.events.eventHistory`) registraba un solo `setupCalled`, un solo `call` con
los datos correctos y el `render` del tag Inline. Después, el servidor respondía
`noad` para esa inserción. El 16 de noviembre de 2026 pasaba lo mismo en los
cuatro sitios (siteIds 794551 a 794554).

**La pregunta para Medios Federales sigue abierta:** por qué su servidor
descarta la inserción 13456937. Si se vuelve a encender sin resolver eso, el
recuadro va a seguir sin aparecer.
