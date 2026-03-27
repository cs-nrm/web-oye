# Streaming Agent — Oye 89.7

## Rol
Player de radio digital, integración con Triton Digital (TDSdk), metadata de música en vivo, sistema de votos y programación.

---

## Archivos bajo responsabilidad

| Archivo | Propósito |
|---|---|
| `src/components/Player.astro` | HTML del player flotante + carga de SDKs externos |
| `src/js/streaming.js` | Lógica del player (líneas 121–666), votos, metadata, programación, navegación |
| `src/pages/en-vivo/index.astro` | Página de transmisión en vivo con expansión del player |
| `src/pages/peticiones/index.astro` | Página de peticiones (iframe a playnrm.com) |
| `src/pages/programacion/index.astro` | Parrilla de programación |
| `src/pages/alexa/index.astro` | Integración con Alexa |

> **Nota de frontera:** `streaming.js` también contiene `initGPT()` y eventos de ads (ver `ads.md`). La lógica de player está en las líneas ~121–666; la de GPT en ~17–119; la de navegación/page-load en ~668–fin.

---

## Configuración del player

- **SDK:** TDSdk 2.9 (`sdk.listenlive.co/web/2.9/td-sdk.min.js`)
- **Station ID:** `XEOYEFM`
- **App installer ID:** `oyePag`
- **Tracking parameter:** `Dist: 'WebOye'`
- **Módulo core:** `MediaPlayer` con plugin `vastAd`
- **Container div:** `#td_container` (invisible, 1×1px; se expande a 600×360 durante VAST)

---

## Estados del stream

| Código | Comportamiento del UI |
|---|---|
| `GETTING_STATION_INFORMATION` | Spinner, oculta play/pause |
| `LIVE_CONNECTING` | Spinner, oculta play/pause |
| `LIVE_BUFFERING` | Spinner, oculta play/pause |
| `LIVE_PLAYING` | Muestra pause, inicia metadata poll cada 30s |
| `LIVE_STOP` | Muestra play, limpia info de canción |
| `LIVE_PAUSE` | Muestra play, limpia info de canción |

---

## VAST (pre-roll de audio)

- **URL:** `/21799830913/Oye/VASTPrueba` — 600×360, env=vp, output=vast
- **Flujo:**
  ```
  playstopRadio() → start() → streaming.playAd('vastAd', { url: vastUrl })
    └─ ad-playback-start  → muestra #full-cover, spinner
    └─ ad-playback-complete → streaming.play(XEOYEFM), oculta #full-cover
    └─ ad-playback-error    → streaming.play(XEOYEFM) directamente (graceful fallback)
  ```
- **Ad unit pendiente:** `VASTPrueba` sugiere que el ad unit aún no está en producción real; confirmar con NRM adops antes de cambiar.

---

## Metadata de música en vivo

- **Endpoint:** `https://cdn.nrm.com.mx/cdn/oye/playlist/cancion.json`
- **Polling:** cada 30 segundos (solo cuando `LIVE_PLAYING`)
- **Detección de cambio:** compara con `lastArtist` / `lastSong` — solo actualiza UI si hay diferencia

**Categorías del campo `data.categoria`:**

| Categoría | Tipo |
|---|---|
| `OYE-MUS`, `OYE-INGLES`, `OYE-PARTY-NIGHTS` | Música → muestra artista + canción |
| `OYE-ESPECIALES`, `OYE-DEBRAYE`, `OYE-TURNOS`, `OYE-CAP`, `OYE-PRO` | Pausa comercial |
| `COMERCIALES` y default | Pausa comercial |

- **Album cover:** Last.fm API (`ws.audioscrobbler.com/2.0`) — API key: `0aa2713d85e04243944924876ba71f05`
- **Fallback cover:** `storage.googleapis.com/nrm-web/oye/recursos/LOGO-OYE-BLANCO-2025.svg`

---

## Sistema de votos (Top Ten)

- **Endpoint:** `https://playnrm.com/6456heu2/8s4v3f1l3s.php` (POST, `$.post`)
- **Payload:** `{ artista, cancion, seccion, dispositivo, navegador, sistema_operativo }`
- **Protección doble-click:** verifica fill del SVG = `#ef4444` antes de votar
- **Detección de dispositivo:** `/Mobi|Android|iPhone|iPad/i`
- **Secciones que lo usan:** `'Radio'` (player), páginas Top Ten

---

## Programación en vivo (`getInfoProg`)

- **Endpoint:** `https://playnrm.com/wp-json/wp/v2/posts?categories=3312&per_page=30`
- **Campos ACF:** `programa`, `hora_inicio`, `hora_fin`, día de la semana (boolean por día)
- **Lógica:** filtra por día actual + hora actual; calcula "siguiente programa"
- **Polling en `/en-vivo`:** se ejecuta al cargar + cada 60 segundos
- **Estado:** `getInfoProg()` tiene el `setInterval` comentado en código principal — solo se activa en `/en-vivo`

---

## SDKs externos (cargados en Player.astro)

| SDK | URL | Propósito |
|---|---|---|
| jQuery | `storage.googleapis.com/nrm-web/nrm/lib/jquery.js` | DOM, events, AJAX |
| TDSdk | `sdk.listenlive.co/web/2.9/td-sdk.min.js` | Radio streaming |
| player-0.1.0.min.js | `storage.googleapis.com/nrm-web/nrm/lib/player-0.1.0.min.js` | Wrapper NRM |
| dayjs | `storage.googleapis.com/nrm-web/nrm/lib/dayjs.min.js` | Fechas en programación |
| flickity.pkgd.min.js | `storage.googleapis.com/nrm-web/nrm/lib/flickity.pkgd.min.js` | Carousels |
| plyr.js | `storage.googleapis.com/nrm-web/nrm/lib/plyr.js` | Video player (artículos) |

---

## Player UI — elementos y estados

| Elemento | Rol |
|---|---|
| `#radiobutton` | Contenedor flotante del player (bottom-right) |
| `#big-play` | Botón principal play/pause en el widget flotante |
| `#play-pause` | Botón play/pause en la barra inferior |
| `#td_container` | Iframe invisible de TDSdk; se expande a 600×360 en VAST |
| `#full-cover` | Overlay semitransparente durante reproducción de VAST |
| `#infoMusic` | Texto con artista + canción actuales |
| `.text-player` | Label de estado ("Ahora suena..." / "ESCUCHA EN VIVO") |
| `.playerplaying` | Clase que expande `#radiobutton` a 350px cuando hay LIVE_PLAYING |
| `.en-vivo` | Clase aplicada en `/en-vivo` que cambia layout del player a horizontal |
| `.preloader` | Spinner de navegación entre páginas (View Transitions) |

---

## Comportamiento en `/en-vivo`

1. `#radiobutton` recibe clase `.en-vivo` → se expande a full-width
2. `#big-play` pierde `border-4` (diseño flat)
3. Si el stream no estaba activo: autoplay inmediato con `playstopRadio()`
4. `getInfoProg()` se activa con intervalo de 60s
5. `getInfoMusic()` se llama una vez al entrar y continúa desde el intervalo del player

---

## View Transitions y estado del player

- El player usa `transition:persist` en sus elementos — **sobrevive la navegación**
- `local_status` persiste en memoria durante toda la sesión
- En `astro:before-preparation`: muestra `.preloader`
- En `astro:page-load`: quita `.preloader`, reinicia GPT, detecta sección activa

---

## Troubleshooting frecuente

| Síntoma | Causa probable | Solución |
|---|---|---|
| VAST no reproduce | `VASTPrueba` ad unit no tiene demand activo | Confirmar con NRM que el ad unit GAM tiene líneas de campaña |
| Metadata no actualiza | `musicInterval` acumulado | El `clearInterval` al entrar en LIVE_PLAYING lo maneja; revisar si el evento se dispara varias veces |
| Album cover no carga | Last.fm no encuentra el track | Fallback al logo SVG de Oye — comportamiento correcto |
| Player no autoplay en iOS | Política de autoplay en Safari | Requiere interacción del usuario; el botón `#big-play` es el trigger correcto |
| Votos no se registran | Endpoint PHP retorna error | Revisar `https://playnrm.com/6456heu2/8s4v3f1l3s.php` directamente |
| `getInfoProg` no actualiza | `setInterval` comentado en scope global | Solo se activa en `/en-vivo` — es intencional |
