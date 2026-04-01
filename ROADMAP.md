# Roadmap de Refactorización — Oye 89.7

## Objetivo

Separar los archivos que hoy mezclan múltiples dominios, de forma que cada subagente (`agents/`) tenga ownership claro sobre sus archivos sin solapamientos. Sin cambiar ningún comportamiento funcional.

---

## El problema central

Hay dos archivos que hoy son propiedad compartida de varios agentes:

| Archivo | Dominios mezclados | Líneas |
|---|---|---|
| `src/js/streaming.js` | ads + player + votes + música | 1,175 |
| `src/components/BaseHead.astro
` | meta/SEO + favicons + ads + analytics | 87 |

Todos los cambios de este roadmap apuntan a resolver exactamente esto.

---

## Mapa de extracción: `streaming.js`

| Líneas actuales | Contenido | Archivo destino |
|---|---|---|
| 1–16 | SVG constants + global vars del player | `src/js/player.js` |
| 17–119 | Ads: `adFallback()`, `initAdFallbackListener()`, `initGPT()` | `src/js/ads.js` |
| 121–315 | Triton SDK: `initPlayerSDK()`, `getStatus()`, callbacks VAST, `play()`, `pause()`, `stop()` | `src/js/player.js` |
| 316–511 | Votos + música: `detectarNavegador()`, `registerVote()`, `getInfoMusic()` | votos → `src/js/votes.js` / música → `src/js/player.js` |
| 514–559 | Programación: `getInfoProg()` | `src/js/player.js` |
| 561–666 | UI state machine: `radioActive()`, `playstopRadio()`, `transitionPlayer()` | `src/js/player.js` |
| 668–1175 | Navigation + `astro:page-load` mega-handler | `src/js/player.js` |

> **Nota de acoplamiento:** `getInfoMusic()` llama a `registerVote()` para el botón like del player. `votes.js` debe cargarse antes que `player.js`.

---

## Estructura objetivo de `src/js/`

```
src/js/
├── player.js       ← todo lo del player Triton, polling, now playing, controls (renombrado desde streaming.js)
├── ads.js          ← initGPT, adFallback, sizeMapping (hoy: líneas 17–119 de streaming.js)
├── analytics.js    ← ga4Track, trackTritonPlaybackEvent (a crear: no existe aún en Oye)
└── votes.js        ← sistema de votos Top Ten y radio (hoy: líneas 316–400 de streaming.js)
```

> `streaming.js` desaparece y es reemplazado por `player.js` + los archivos extraídos.

---

## Mapa de extracción: `BaseHead.astro`

Crear dos componentes Astro que `BaseHead.astro` importa:

| Bloque actual | Archivo destino |
|---|---|
| Favicons + `<meta charset>` + `<meta viewport>` + robots + font preloads | se queda en `BaseHead.astro` |
| Canonical + OG + Twitter | se queda en `Layout.astro` (ya está ahí) |
| AdSense `<script>` + GPT `<script>` + `window.googletag` init | `src/components/head/AdScripts.astro` |
| GTM snippet + comScore + Hotjar | `src/components/head/AnalyticsScripts.astro` |

```astro
<!-- BaseHead.astro después de la refactorización -->
<AdScripts />
<AnalyticsScripts />
```

---

## Fases

### Fase 0 — Documentación ✅ COMPLETADA
- [x] Crear `agents/ads.md`
- [x] Crear `agents/streaming.md`
- [x] Crear `agents/frontend.md`
- [x] Crear `agents/content.md`
- [x] Crear `agents/analytics.md`
- [x] Crear este `ROADMAP.md`

---

### Fase 1 — Delimitadores en `streaming.js` (riesgo: cero) ✅ COMPLETADA
Agregar comentarios de sección dentro de `streaming.js` sin mover nada.

- [x] Agregar `// ===== [GLOBALS + SVG CONSTANTS] =====` en línea 1
- [x] Agregar `// ===== [ADS] adFallback, initAdFallbackListener, initGPT =====` antes de línea 19
- [x] Agregar `// ===== [PLAYER - TRITON SDK] initPlayerSDK, getStatus, callbacks VAST =====` antes de línea 122
- [x] Agregar `// ===== [PLAYER - SONG POLLING + VOTES] getInfoMusic, registerVote =====` antes de línea 338
- [x] Agregar `// ===== [PLAYER - PROGRAMACION] getInfoProg =====` antes de línea 517
- [x] Agregar `// ===== [PLAYER - CONTROLS] radioActive, playstopRadio, transitionPlayer =====` antes de línea 564
- [x] Agregar `// ===== [NAVIGATION + PAGE LOAD] =====` antes de línea 672

**Criterio de éxito:** Ningún cambio de comportamiento. El sitio funciona igual.

---

### Fase 2 — Extraer `src/js/ads.js` (riesgo: bajo)

- [ ] Crear `src/js/ads.js` con `adFallback()`, `initAdFallbackListener()`, `initGPT()` y el `googletag.cmd.push(initAdFallbackListener)`
- [ ] Actualizar `src/components/Player.astro`: cargar `ads.js` **antes** que `streaming.js`
- [ ] Eliminar esas funciones de `streaming.js`
- [ ] Verificar que los slots renderizan en home, artículos y Top Ten
- [ ] Verificar que el fallback GPT→AdSense funciona
- [ ] Verificar que View Transitions re-inicializan los slots correctamente

**Dependencias:** `ads.js` necesita que `googletag` esté disponible (viene de GPT en `BaseHead.astro` — no cambia).

**Criterio de éxito:** Ads renderizan correctamente, fallback funciona, slots no se duplican al navegar.

---

### Fase 3 — Extraer `src/js/votes.js` (riesgo: bajo)

- [ ] Crear `src/js/votes.js` con `VOTE_COLOR`, `detectarNavegador()`, `detectarDispositivo()`, `registerVote()`
- [ ] Cargar `votes.js` **antes** que `streaming.js` en `Player.astro` (player llama a `registerVote`)
- [ ] Eliminar esas funciones de `streaming.js`
- [ ] Verificar flujo completo: like en el player, voto en Top Ten (`.like-topten`), voto en artículo (`.voto-pop`)

> **Nota:** `.voto-pop` usa un endpoint diferente (`wp-ulike-pro` con Bearer token) y no usa `registerVote()`. Puede quedarse en `player.js` o moverse también a `votes.js` — decidir al llegar aquí.

**Criterio de éxito:** Los tres flujos de voto funcionan igual. `registerVote` es accesible desde `player.js`.

---

### Fase 4 — Crear `src/js/analytics.js` (riesgo: bajo)
Este archivo no existe aún — se crea nuevo.

- [ ] Crear `src/js/analytics.js` con `ga4Track()` y `trackTritonPlaybackEvent()`
- [ ] Cargar `analytics.js` **antes** que `player.js` en `Player.astro`
- [ ] En `player.js`: reemplazar el `analytics: { ... }` interno del TDSdk config por llamadas a `trackTritonPlaybackEvent()` en los callbacks (`getStatus`, `startAd`, `completeAd`, `errorAd`)
- [ ] En `votes.js`: llamar a `ga4Track('vote', { section, artist, song })` en el `.then()` de `registerVote`
- [ ] Verificar en GA4 DebugView que llegan `play`, `stop`, `ad_start`, `ad_complete`, `vote`

**Criterio de éxito:** Eventos visibles en GA4 DebugView. Los eventos de TDSdk analytics integrado pueden coexistir o desactivarse — validar con NRM adops cuál es el canal canónico.

---

### Fase 5 — Renombrar `streaming.js` → `player.js` (riesgo: bajo)
Una vez extraídas las tres secciones, lo que queda es exclusivamente el player.

- [ ] Renombrar `src/js/streaming.js` a `src/js/player.js`
- [ ] Actualizar `src/components/Player.astro`: cambiar el `<script src="...streaming.js">` por `player.js`
- [ ] Verificar que no haya otras referencias al nombre `streaming.js` en el proyecto

**Criterio de éxito:** Build limpio, player funciona, sin errores 404 en Network tab.

---

### Fase 6 — Separar `BaseHead.astro` (riesgo: bajo)

- [ ] Crear `src/components/head/AdScripts.astro`
  - Mover: bloque AdSense `<script async>` + bloque GPT `<script async>` + `window.googletag` init inline
  - Mantener el orden actual (AdSense primero, luego GPT — el `async` sin `defer` es intencional)
- [ ] Crear `src/components/head/AnalyticsScripts.astro`
  - Mover: Hotjar snippet + comScore snippet + GTM snippet
- [ ] En `BaseHead.astro`: reemplazar los bloques movidos con `<AdScripts />` y `<AnalyticsScripts />`
- [ ] Verificar orden de scripts en el HTML generado (debe ser idéntico al actual)

**Criterio de éxito:** HTML generado en build es equivalente en orden de scripts. Ads y analytics funcionan igual.

---

## Estructura final objetivo

```
src/
├── components/
│   ├── head/
│   │   ├── AdScripts.astro          ← GPT + AdSense
│   │   └── AnalyticsScripts.astro   ← GTM + comScore + Hotjar
│   ├── BaseHead.astro               ← solo meta, OG, canonical, favicons
│   ├── Player.astro
│   └── ...
├── js/
│   ├── player.js                    ← Triton SDK, polling, now playing, controls
│   ├── ads.js                       ← initGPT, adFallback, sizeMapping
│   ├── analytics.js                 ← ga4Track, trackTritonPlaybackEvent
│   └── votes.js                     ← sistema de votos
└── ...
```

### Ownership por agente después de la refactorización

| Agente | Archivos exclusivos |
|---|---|
| `agents/ads.md` | `src/js/ads.js`, `src/components/head/AdScripts.astro`, ad unit components, `public/ads.txt` |
| `agents/streaming.md` | `src/js/player.js`, `src/components/Player.astro` |
| `agents/analytics.md` | `src/js/analytics.js`, `src/components/head/AnalyticsScripts.astro` |
| `agents/frontend.md` | `src/components/` (resto), `src/layouts/`, `src/styles/`, `src/components/BaseHead.astro` |
| `agents/content.md` | `src/lib/`, `src/pages/`, `src/content/`, `astro.config.mjs` |
| `agents/votes.md` *(si se crea)* | `src/js/votes.js` |

Ningún archivo pertenece a más de un agente.

---

## Principios de la refactorización

1. **Una fase a la vez** — no combinar extracciones. Cada fase tiene su propio PR y validación.
2. **Cero cambios de comportamiento** — solo mover código, nunca reescribirlo mientras se mueve.
3. **El orden de carga importa** — `analytics.js` → `ads.js` → `votes.js` → `player.js`.
4. **Validar en build, no solo en dev** — Astro SSG puede comportarse diferente en build por el manejo de `is:inline` vs `src`.
5. **Fase 1 es gratis** — los comentarios de sección pueden hacerse hoy sin riesgo.
