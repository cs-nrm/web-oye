# Frontend Agent — Oye 89.7

## Rol
Sistema de UI: componentes visuales, layouts, design system (Tailwind + CSS), tipografía, carousels y estructura de páginas.

---

## Archivos bajo responsabilidad

### Framework y configuración
| Archivo | Propósito |
|---|---|
| `astro.config.mjs` | Config de Astro: site URL, integraciones (MDX, sitemap, Tailwind) |
| `tailwind.config.js` | Config de Tailwind (minimal, sin extensiones de tema) |
| `tsconfig.json` | TypeScript strict null checks |
| `src/consts.ts` | Constantes globales: `SITE_TITLE`, `SITE_DESCRIPTION` |
| `src/env.d.ts` | Type declarations para Astro |

### Estilos
| Archivo | Propósito |
|---|---|
| `src/styles/global.css` | CSS global: variables, fuentes, utilidades, player styles |
| `public/fonts/` | 13 archivos de fuentes (Roboto, Maddac, Fredoka, GoodTime, Kollektif, Croc, Lucky, Pauling, Stoked, Atkinson) |

### Layouts
| Archivo | Propósito |
|---|---|
| `src/layouts/Layout.astro` | Layout raíz: head, OG tags, GTM noscript, BarNrm, Header, Footer |
| `src/layouts/HomeHeader.astro` | Header alternativo para home (actualmente comentado) |
| `src/layouts/Cards.astro` | Card grid genérico |
| `src/layouts/CardMoreNews.astro` | Cards de breaking news |
| `src/layouts/CardsCine.astro` | Cards de cine |
| `src/layouts/CardsVideo.astro` | Cards con video embed |
| `src/layouts/Cardsq.astro` | Cards formato Q |
| `src/layouts/CardsPodcast.astro` | Cards de episodios de podcast |
| `src/layouts/CardsPoptrends.astro` | Cards de Top Ten |
| `src/layouts/CardsHomePrincipal.astro` | Nota principal destacada en homepage |
| `src/layouts/CardsHomeNews.astro` | Sección de noticias en homepage |
| `src/layouts/CardsHomeCine.astro` | Sección de cine en homepage |
| `src/layouts/CardsHomeGaming.astro` | Sección de gaming en homepage |
| `src/layouts/CardsHomeKpop.astro` | Sección de K-pop en homepage |
| `src/layouts/CardsHomePromociones.astro` | Sección de promociones en homepage |
| `src/layouts/SliderPortada.astro` | Slider de portada (Flickity, autoPlay 5000ms) |
| `src/layouts/SliderLocutores.astro` | Slider de locutores/DJs |
| `src/layouts/ListaPodcast.astro` | Lista de podcasts en homepage |
| `src/layouts/ListaTopten.astro` | Lista de Top Ten en homepage |

### Componentes
| Archivo | Propósito |
|---|---|
| `src/components/BaseHead.astro` | `<head>` global: meta, fonts, AdSense, GPT, GTM, Hotjar, comScore |
| `src/components/Header.astro` | Header con ViewTransitions |
| `src/components/Footer.astro` | Footer |
| `src/components/Menu.astro` | Navegación principal |
| `src/components/MenuLineal.astro` | Variante lineal del menú |
| `src/components/MenuLogo.astro` | Menú solo con logo |
| `src/components/BarNrm.astro` | Barra superior de red NRM |
| `src/components/BarOye.astro` | Barra específica de Oye |
| `src/components/PreSiteHeader.astro` | Header pre-sitio |
| `src/components/Article.astro` | Template de artículo |
| `src/components/Modal.astro` | Diálogo modal |
| `src/components/Notificacion.astro` | Notificaciones |
| `src/components/Separator.astro` | Separador visual |
| `src/components/FormattedDate.astro` | Formateador de fecha |
| `src/components/Share.astro` | Botones de compartir en redes |
| `src/components/relatedPost.astro` | Posts relacionados |
| `src/components/MoreNews.astro` | Más noticias (sidebar) |
| `src/components/MoreCine.astro` | Más cine (sidebar) |
| `src/components/MoreGaming.astro` | Más gaming (sidebar) |
| `src/components/MoreKpop.astro` | Más K-pop (sidebar) |
| `src/components/MoreLifestyle.astro` | Más lifestyle (sidebar) |
| `src/components/MoreEntrevistas.astro` | Más entrevistas (sidebar) |
| `src/components/MoreEventos.astro` | Más eventos (sidebar) |
| `src/components/DiaRadio.astro` | Sección especial Día de la Radio |
| `src/components/Navidad.astro` | Sección especial Navidad |
| `src/components/Locutores.astro` | Sección de locutores/DJs |

### Páginas estáticas
| Archivo | Propósito |
|---|---|
| `src/pages/index.astro` | Homepage |
| `src/pages/programacion/index.astro` | Parrilla de programación |
| `src/pages/alexa/index.astro` | Integración Alexa |
| `src/pages/avisodeprivacidad/index.astro` | Aviso de privacidad |
| `src/pages/terminosycondiciones/index.astro` | Términos y condiciones |

### Assets públicos
| Ruta | Propósito |
|---|---|
| `public/favicon/` | Favicon completo: ICO, PNG, SVG, manifest, browserconfig |
| `public/oye-share.jpg` / `.png` | Imagen OG por defecto para redes sociales |

---

## Design system

### Paleta de colores (CSS variables en global.css)
- `--rojo` / accent rojo: `var(--red-color)` — color principal de acción
- `--accent`: `#2337ff`
- Gradientes: fondo oscuro del player (`rgb(45,45,45)` → `rgb(0,0,0)`)
- Fondos de sección: `#201e1e` (oscuro), `#d6d8d7` (gris claro)

### Tipografía
| Fuente | Uso |
|---|---|
| Montserrat | Primaria del sistema (Google Fonts) |
| Roboto Variable | Texto general (`/fonts/Roboto-VariableFont.ttf`) |
| Atkinson | Accesibilidad — cuerpo de texto (`atkinson-regular.woff`, `atkinson-bold.woff`) |
| GoodTime | Títulos editoriales (`goodtime` class) |
| Maddac | Display/branding |
| Kollektif | Subtítulos |
| Lucky | Decorativa |
| Fredoka | Display alternativa |
| Pauling | Display alternativa |
| Stoked | Display alternativa |
| Croc | Display alternativa |

### Carousels (Flickity)
Cargado desde GCS CDN. Instancias activas:
- `.carousel-portada` — homepage, autoPlay 5000ms, wrapAround
- `.main-topten` — Top Ten, autoPlay, lazyLoad
- `.main-carousel` — Podcast/programas, autoPlay 5000ms
- `.wp-block-gallery` — Galerías en artículos de WP, autoPlay
- `.carousel-buenfin` — Buen Fin (actualmente comentado)

---

## Archivos desactivados (`_` prefix)

Estas features están desactivadas — sus rutas no son accesibles en producción:

| Archivo | Feature |
|---|---|
| `src/pages/_playlist/index.astro` | Página de playlist |
| `src/pages/_lifestyle/` | Sección Lifestyle |
| `src/layouts/_CardsHomeGuia.astro` | Sección Guía en home |
| `src/layouts/_CardsHomeLibros.astro` | Sección Libros en home |
| `src/layouts/_CardsHomeMascotas.astro` | Sección Mascotas en home |
| `src/layouts/_CardsHomePodcast.astro` | Slider Podcast en home |
| `src/layouts/_CardsHomeVinos.astro` | Sección Vinos en home |
| `src/layouts/_NewsLetter.astro` | Newsletter signup |
| `src/layouts/_SliderBuenfin.astro` | Slider Buen Fin |
| `src/layouts/_SliderPodcast.astro` | Slider Podcast alternativo |
| `src/layouts/_SliderTopten.astro` | Slider Top Ten alternativo |

> No eliminar sin confirmar. Varias podrían ser features en desarrollo o de temporada.

---

## CDN NRM (GCS)

Todos los recursos compartidos de NRM se sirven desde:
```
https://storage.googleapis.com/nrm-web/
  oye/recursos/     → imágenes y logos específicos de Oye
  nrm/lib/          → SDKs compartidos (jQuery, Flickity, Plyr, TDSdk, dayjs)
  nrm/images/       → imágenes compartidas de red
  nrm/adManager/    → creativos de campañas
```

Logo principal: `storage.googleapis.com/nrm-web/oye/recursos/LOGO-OYE-BLANCO-2025.svg`

---

## View Transitions (Astro)

- Habilitado en `Header.astro` via `<ViewTransitions />`
- Player usa `transition:persist` — sobrevive navegación sin reinicializarse
- Preloader: clase `.preloader` / `.showpreloader` — toggle en `astro:before-preparation` y `astro:page-load`
- Instagram embeds: `window.instgrm.Embeds.process()` se re-ejecuta en `astro:after-swap`

---

## Estructura de una página de artículo (patrón estándar)

```
Layout.astro
  ├─ LeaderBoard (top)
  ├─ Article content (set:html de WP)
  │   └─ Share bar (sticky, Facebook / X / WhatsApp)
  └─ Sidebar
      ├─ BoxBanner
      ├─ More[Categoria]
      └─ DoubleBox
  SuperLeader (bottom)
```

---

## Reglas críticas de implementación

1. `BaseHead.astro` se incluye en **todos** los layouts a través de `Layout.astro` — no añadir scripts de tracking directamente en páginas.
2. Tailwind config es minimal (`extend: {}`); los estilos visuales complejos viven en `global.css`.
3. Los componentes de ads (`BillBoard`, `LeaderBoard`, etc.) no deben tener lógica de inicialización — eso vive en `streaming.js`.
4. `transition:persist` solo en elementos del player — no abusar en otros componentes o rompe el estado entre páginas.
5. Para añadir secciones al home, seguir el patrón del `index.astro`: importar layout → colocar en sección → insertar ad unit entre secciones.
