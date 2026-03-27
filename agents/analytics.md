# Analytics Agent — Oye 89.7

## Rol
Medición de audiencias y comportamiento: Google Tag Manager, GA4, comScore, Hotjar, Facebook Pixel y eventos de streaming.

---

## Archivos bajo responsabilidad

| Archivo | Sección relevante |
|---|---|
| `src/components/BaseHead.astro` | Bloques de AdSense, GTM, Hotjar, comScore (líneas 41–86) |
| `src/layouts/Layout.astro` | GTM noscript + comScore noscript en `<body>` |
| `src/js/streaming.js` | Configuración de analytics en TDSdk (líneas 134–142) |
| `public/pageview_candidate.txt` | Archivo de verificación de pageviews |

---

## Tags activos

### Google Tag Manager

- **Container ID:** `GTM-N3MTSSX`
- Cargado en `BaseHead.astro` (script en `<head>`)
- Noscript iframe en `Layout.astro` (`<body>`)
- **Responsabilidad:** GTM es el bus de distribución — todos los eventos de GA4 que no sean de TDSdk deberían pasar por GTM

### Google Analytics 4 (vía TDSdk)

- **Tracking ID:** `G-M9RYDQ6Z9L`
- Integrado directamente en TDSdk — **no pasa por GTM**
- Configuración en `streaming.js`:
  ```js
  analytics: {
    active: true,
    debug: false,
    appInstallerId: 'oyePag',
    trackingId: 'G-M9RYDQ6Z9L',
    trackingEvents: ['play', 'stop', 'pause', 'resume', 'all'],
    sampleRate: 100,
    category: 'Reproduccion Radio Pag'
  }
  ```
- Eventos rastreados: `play`, `stop`, `pause`, `resume` + `all` (catch-all)
- Categoría de evento: `'Reproduccion Radio Pag'`

### comScore

- **C2 ID:** `6906652`
- Cargado en `BaseHead.astro` + noscript pixel en `Layout.astro`
- **Configuración relevante:**
  ```js
  enableFirstPartyCookie: true,
  bypassUserConsentRequirementFor1PCookie: true
  ```
- Script: `sb.scorecardresearch.com/cs/6906652/beacon.js`
- Noscript pixel: `sb.scorecardresearch.com/p?c1=2&c2=6906652&cv=4.4.0&cj=1`

### Hotjar

- **Site ID:** `5141779`
- Versión del snippet: `hjsv: 6`
- Cargado en `BaseHead.astro`
- Script: `static.hotjar.com/c/hotjar-5141779.js?sv=6`

### Facebook

- **App ID:** `746588188144228`
- Declarado como `<meta property="fb:app_id">` en `BaseHead.astro`
- No hay Pixel de conversión configurado actualmente — solo identificación de app para Open Graph

---

## Metadatos de distribución (OG / Twitter)

Gestionados en `src/layouts/Layout.astro`. Fuente de verdad: `yoast_head_json` de WordPress.

| Meta tag | Fuente |
|---|---|
| `og:title` | `tags.title` ?? `title` ?? `SITE_TITLE` |
| `og:description` | `tags.og_description` ?? `tags.description` ?? `SITE_DESCRIPTION` |
| `og:image` | `tags.og_image[0].url` ?? `img` ?? `/default-og.jpg` |
| `og:locale` | `tags.og_locale` ?? `es_MX` |
| `og:type` | `tags.og_type` ?? `article` |
| `article:published_time` | `tags.article_published_time` |
| `article:modified_time` | `tags.article_modified_time` |
| `twitter:card` | `summary_large_image` (fijo) |
| `twitter:creator` | `@Oye897` (fijo) |
| Canonical URL | `Astro.site` + `Astro.url.pathname` |

---

## Consentimiento y privacidad

**Estado actual:** No hay CMP (Consent Management Platform) ni banner de cookies.

| Vendor | Configuración de consentimiento |
|---|---|
| comScore | `bypassUserConsentRequirementFor1PCookie: true` — activo sin consentimiento |
| Hotjar | Sin configuración de consentimiento |
| GTM | Sin consent mode configurado |
| TDSdk / GA4 | Sin consent mode configurado |
| Facebook | Solo `fb:app_id` — sin Pixel activo |

> **Riesgo regulatorio:** Si el sitio aplica a LFPDPPP (México) o usuarios de la UE, la ausencia de CMP y el `bypassUserConsentRequirementFor1PCookie: true` de comScore necesitan revisión legal.

---

## Eventos GA4 de streaming (TDSdk)

Los siguientes eventos se envían automáticamente a `G-M9RYDQ6Z9L` cuando el usuario interactúa con el player:

| Evento | Trigger |
|---|---|
| `play` | Usuario inicia reproducción |
| `stop` | Usuario detiene reproducción |
| `pause` | Stream en pausa |
| `resume` | Stream reanudado |
| `all` | Cualquier evento de stream |

- Categoría del evento en GA4: `Reproduccion Radio Pag`
- Sample rate: 100% (todas las sesiones)

---

## Sistema de votos (señal de comportamiento)

`registerVote()` en `streaming.js` registra votos del Top Ten en un endpoint PHP externo (`playnrm.com/6456heu2/8s4v3f1l3s.php`). Incluye metadatos de dispositivo y navegador. **No hay evento GA4 disparado actualmente en los votos** — el `.then()` tiene un comentario `// Hook opcional: aquí podrías disparar un toast/analytics`.

---

## Roadmap de analytics

| Etapa | Estado |
|---|---|
| GTM básico | ✅ activo |
| GA4 via TDSdk (streaming events) | ✅ activo |
| comScore | ✅ activo |
| Hotjar | ✅ activo |
| Facebook Pixel (conversiones) | ⚠️ solo App ID, sin Pixel |
| GA4 eventos de navegación / contenido | ⚠️ no configurados explícitamente (depende de GTM) |
| Eventos de voto en Top Ten | 🔜 pendiente |
| Consent Mode (Google) | 🔜 pendiente |
| CMP / banner de cookies | 🔜 pendiente |
| Audience segments para GAM (AdX) | 🔜 pendiente (prerequisito para AdX) |

---

## Troubleshooting frecuente

| Síntoma | Causa probable | Solución |
|---|---|---|
| Eventos de streaming no aparecen en GA4 | TDSdk envía directo, no via GTM | Buscar en GA4 con `category: 'Reproduccion Radio Pag'` |
| comScore no registra pageviews en SPA | View Transitions no dispara el beacon en navegaciones | Verificar si comScore necesita re-trigger en `astro:page-load` |
| Hotjar no graba sesiones | Sampling o filtro de URL activo en Hotjar | Revisar configuración en hotjar.com para hjid 5141779 |
| OG image no aparece en Facebook | `og_image` null en WP o placeholder `/default-og.jpg` | Verificar que el post en WP tiene imagen destacada |
| GTM no carga | CSP bloqueando `googletagmanager.com` | Revisar headers de seguridad en el servidor |
