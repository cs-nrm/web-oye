# Ads Agent — Oye 89.7

## Rol
Gestión de inventario publicitario programático: Google Ad Manager (GAM), AdSense fallback, sizeMapping responsivo y roadmap hacia Prebid.js / AdX.

---

## Archivos bajo responsabilidad

### Componentes de ad units
| Archivo | Formato | GPT div ID | AdSense slot ID |
|---|---|---|---|
| `src/components/BillBoard.astro` | Billboard | `ad-slot-billboard` | `9108276163` |
| `src/components/BillBoard2.astro` | Billboard variante | `ad-slot-billboard` (mismo slot) | `4971524958` |
| `src/components/LeaderBoard.astro` | Leaderboard | `ad-slot-leader` | `5115879668` |
| `src/components/LeaderBoard2.astro` | Leaderboard variante | `ad-slot-leader2` | `9366065535` |
| `src/components/SuperLeader.astro` | Super Leaderboard | `ad-slot-superleader` | `2069668179` |
| `src/components/BoxBanner.astro` | Medium Rectangle | `ad-slot-box` | `9904563106` |
| `src/components/DoubleBox.astro` | Half Page | `ad-slot-doublebox` | `9774490570` |

### Lógica central de ads
| Archivo | Sección relevante |
|---|---|
| `src/js/streaming.js` | Funciones: `initGPT()`, `adFallback()`, `initAdFallbackListener()`, y definición de todos los slots (líneas 17–119) |
| `src/components/BaseHead.astro` | Carga de GPT (`gpt.js` con `async`) y AdSense (`adsbygoogle.js`) |

### Certificación
| Archivo | Propósito |
|---|---|
| `public/ads.txt` | Sellers autorizados |

---

## Configuración de red

- **GAM Network ID:** `21799830913`
- **Ad Unit base path:** `/21799830913/Oye`
- **AdSense Publisher ID:** `ca-pub-7423640555477330`

---

## Inventario de slots activos

### Slots Oye — con fallback a AdSense
| Variable global | GAM path | Tamaños | sizeMapping | AdSense fallback div |
|---|---|---|---|---|
| `slotBillboard` | `/21799830913/Oye` | 970×250, 320×50 | `mappingBillboard` | `ad-slot-billboard-adsense` |
| `slotLeader` | `/21799830913/Oye` | 728×90, 320×50 | `mappingLeader` | `ad-slot-leader-adsense` |
| `slotLeader2` | `/21799830913/Oye` | 728×90, 320×50 | `mappingLeader` | `ad-slot-leader2-adsense` |
| `slotLeader3` | `/21799830913/Oye` | 728×90, 320×50 | `mappingLeader` | `ad-slot-leader3-adsense` |
| `slotSuperLeader` | `/21799830913/Oye` | 970×90, 320×50 | `mappingSuperLeader` | `ad-slot-superleader-adsense` |
| `slotBox` | `/21799830913/Oye` | 300×250 | `mappingBox` | `ad-slot-box-adsense` |
| `slotDoubleBox` | `/21799830913/Oye` | 300×600 | `mappingDoubleBox` | `ad-slot-doublebox-adsense` |

### Slots especiales — sin fallback a AdSense
| Variable global | GAM path | Tamaños | Nota |
|---|---|---|---|
| `slot14` | `/21799830913/Oye` | 600×800 | Sin sizeMapping, sin fallback |
| `slot141` | `/21799830913/Oye` | 320×480 | Sin sizeMapping, sin fallback |

### Slots cross-property — ⚠️ usan path de Beat
| Variable global | GAM path | Tamaños | Nota |
|---|---|---|---|
| `slot201` | `/21799830913/Beat/Box` | 300×250 | `mappingSlide` |
| `slot202` | `/21799830913/Beat/Box2` | 300×250 | `mappingSlide` |
| `slot203` | `/21799830913/Beat/Box3` | 300×250 | `mappingSlide` |
| `slot204` | `/21799830913/Beat/Box4` | 300×250 | `mappingSlide` |
| `slot205` | `/21799830913/Beat/Box5` | 300×250 | `mappingSlide` |

> **Deuda conocida:** `slot201–slot205` apuntan a ad units de Beat (`/Beat/Box*`) en lugar de Oye. Posiblemente usados en el slider de portada. Coordinar con adops NRM antes de migrar.

---

## Arquitectura de fallback (GPT → AdSense)

```
initGPT()
  └─ googletag.cmd.push()
      └─ destroySlots()           ← limpia slots previos (View Transitions)
      └─ window._adFallbackStates = {}   ← resetea estado de fallback
      └─ define sizeMapping × 6 formatos
      └─ defineSlot() × 14 slots
      └─ googletag.display() × 14 (solo si el div existe en el DOM)
      └─ adFallback() × 7 slots principales

initAdFallbackListener()   ← registrado UNA sola vez (fuera de initGPT)
  └─ googletag.pubads().addEventListener('slotRenderEnded')
      └─ si todos los slots del grupo tienen fill → muestra GPT, oculta AdSense
      └─ si alguno isEmpty → oculta GPT, muestra AdSense

adFallback(slots[], fallbackId)
  └─ registra estado en window._adFallbackStates[fallbackId]
  └─ espera offsetWidth > 0 antes de hacer push a adsbygoogle
```

**Patrón HTML de cada componente:**
```html
<!-- GPT slot -->
<div id="ad-slot-X"></div>

<!-- AdSense fallback (display:none por defecto) -->
<div id="ad-slot-X-adsense" style="display:none">
  <ins class="adsbygoogle" ...></ins>
</div>
```

---

## Box auto-refresh

`slotBox` se refresca automáticamente cada **40 segundos**:
```js
window._boxRefreshInterval = setInterval(function() {
  googletag.pubads().refresh([window.slotBox]);
}, 40000);
```
El intervalo se limpia al inicio de cada `initGPT()` para evitar acumulación en View Transitions.

---

## sizeMapping responsivo

| Breakpoint | Formatos activos |
|---|---|
| `≥ 768px` (desktop) | 970×250 (billboard), 728×90 (leader), 970×90 (superleader), 300×250 (box), 300×600 (doublebox) |
| `0px` (mobile) | 320×50 (billboard, leader, superleader) — box y doublebox **no aparecen** en mobile |
| `mappingSlide` | 300×250 en todos los breakpoints (slots cross-property) |

---

## View Transitions (Astro)

- `initGPT()` se ejecuta en el evento `astro:page-load`
- El `astro:after-swap` handler **no** llama a `initGPT()` (código comentado — no reactivar sin testing)
- `initAdFallbackListener()` se registra una sola vez al cargar el script, no en cada navegación

---

## Sellers autorizados (ads.txt)

```
tritondigital.com, 7833, DIRECT, 19b4454d0b87b58b
latamconnect.com.mx, 0001, DIRECT
google.com, pub-7423640555477330, DIRECT, f08c47fec0942fa0
smartadserver.com, 5366, DIRECT, 060d053dcf45cbf3
smartadserver.com, 5366-OB, RESELLER, 060d053dcf45cbf3
```

> SmartAdServer aparece como DIRECT y como RESELLER (5366-OB). Verificar con NRM si el RESELLER es intencional.

---

## Reglas críticas de implementación

1. `destroySlots()` **siempre** dentro de `googletag.cmd.push()` — nunca fuera.
2. `gpt.js` se carga con `async`, **no con `defer`** — el `defer` rompe el `document.write` interno de GPT.
3. AdSense se carga **una sola vez** en `BaseHead.astro`, no por componente.
4. `initAdFallbackListener()` se registra **una sola vez** fuera de `initGPT()` — tiene guard implícito por ser `googletag.cmd.push` al inicio.
5. No llamar `googletag.pubads().refresh()` global sin destruir y redefinir slots primero.
6. `slot14` y `slot141` no tienen componente `.astro` propio — sus divs se insertan directamente en páginas o layouts específicos.

---

## Troubleshooting frecuente

| Síntoma | Causa probable | Solución |
|---|---|---|
| Slot no renderiza en mobile | `mappingBox` / `mappingDoubleBox` tienen `[]` en `[0,0]` | Correcto — esos formatos no se muestran en mobile por diseño |
| AdSense aparece aunque GPT tiene fill | Estado `_adFallbackStates` no se limpió | Verificar que `destroySlots()` y reset de `_adFallbackStates` ocurren al inicio de `initGPT()` |
| Box no se refresca | `_boxRefreshInterval` acumulado | El `clearInterval` al inicio de `initGPT()` lo maneja; revisar si `initGPT()` se ejecuta en cada página |
| `slot201–205` no llenan | Ad units apuntan a Beat, no Oye | Deuda conocida — ver sección de slots cross-property |
| Slots duplicados tras navegación | `initGPT()` sin `destroySlots()` previo | `destroySlots()` ya está al inicio de `initGPT()` — si persiste, revisar si se llama desde más de un lugar |

---

## Roadmap activo

| Etapa | Estado |
|---|---|
| Google Ad Manager (GAM) | ✅ en producción |
| AdSense fallback | ✅ en producción |
| Box auto-refresh (40s) | ✅ en producción |
| Migrar slot201–205 a path `/Oye` | ⚠️ deuda técnica |
| Prebid.js (header bidding) | 🔜 pendiente |
| Google Ad Exchange (AdX) | 🔜 pendiente (requiere certificación NRM) |

---

## Contexto de negocio

Oye 89.7 es una de 5 propiedades de **NRM** (media company, CDMX). El inventario se gestiona bajo la red GAM compartida de NRM (`21799830913`). Los ad units de Oye viven bajo `/21799830913/Oye`; los slots cross-property (`slot201–205`) actualmente apuntan a `/21799830913/Beat/Box*` — posiblemente heredados de un copy del proyecto Beat. Decisiones de nuevos SSPs o AdX requieren coordinación con adops NRM.
