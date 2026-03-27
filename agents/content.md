# Content Agent — Oye 89.7

## Rol
Integración con WordPress como CMS headless: fetching de contenido, rutas dinámicas, categorías, podcasts, Top Ten y distribución (RSS, sitemap, robots).

---

## Archivos bajo responsabilidad

| Archivo | Propósito |
|---|---|
| `src/lib/api.js` | Cliente de la WordPress REST API |
| `src/consts.ts` | `SITE_TITLE`, `SITE_DESCRIPTION` |
| `src/content/config.ts` | Schema de colecciones locales (Astro Content Collections) |
| `src/content/blog/` | Posts de ejemplo en Markdown (no activos en producción) |
| `src/pages/rss.xml.js` | Feed RSS (actualmente lee colección local, no WP) |
| `src/pages/robots.txt.ts` | Generación de robots.txt |
| `src/js/related.js` | Lógica de posts relacionados |

### Páginas de categorías dinámicas
| Ruta | Categoría WP | ID |
|---|---|---|
| `src/pages/breakingnews/[slug].astro` + `[...page].astro` | Breaking News | 149 |
| `src/pages/gaming/[slug].astro` + `[...page].astro` | Gaming | — |
| `src/pages/cine/[slug].astro` + `[...page].astro` | Cine | — |
| `src/pages/kpop/[slug].astro` + `[...page].astro` | K-pop | — |
| `src/pages/entrevistas/[slug].astro` + `[...page].astro` | Entrevistas | — |
| `src/pages/eventos/[slug].astro` + `[...page].astro` | Eventos | — |
| `src/pages/promociones/[slug].astro` + `[...page].astro` | Promociones | — |
| `src/pages/locutores/[slug].astro` + `[...page].astro` | Locutores | — |
| `src/pages/topten/index.astro` + `[slug].astro` | Top Ten | 280 |
| `src/pages/podcast/[...link].astro` | Podcasts (catálogo hardcoded) | múltiples |
| `src/pages/podcast/[podcast]/[...page].astro` | Episodios por podcast | — |

---

## API WordPress

- **Base URL:** `https://playnrm.com/wp-json/wp/v2` (env: `PUBLIC_API_URL`)
- **Funciones en `src/lib/api.js`:**
  - `fetchAPI(query)` — fetcher genérico
  - `getArticles(cat)` — posts por categoría, `per_page=70`, con `_embed`

### Patrón de fetch en páginas

Las páginas que no usan `api.js` hacen fetch directo al WP API. Campos estándar solicitados:
```
?_embed&per_page=N&categories=ID
&_fields=id,title,yoast_head_json,content,slug,categories,acf
```

### Campos ACF usados

| Campo | Usado en |
|---|---|
| `acf.posicion` | Top Ten — orden de lista |
| `acf.titulo_lista` | Top Ten — título de la edición |
| `acf.programa` | Programación — nombre del programa |
| `acf.hora_inicio` / `acf.hora_fin` | Programación — horario |
| `acf.lunes` / `.martes` / ... `.sabado` | Programación — días de emisión (boolean) |
| `acf.hora_real` | Metadata de canción en streaming |

### Metadatos SEO

`yoast_head_json` se pasa al `Layout.astro` como prop `tags`. El layout extrae:
- `og_image[0].url` → imagen OG
- `og_description` → descripción meta
- `article_published_time` / `article_modified_time` → meta article
- `author` → autor del artículo

---

## Catálogo de Podcasts

Los 14 shows de podcast están hardcodeados en `src/pages/podcast/[...link].astro`. Cada show tiene:
- `nodo` — ID de categoría WP para obtener episodios
- `link` — slug de URL
- `imagen` — imagen del show (GCS)
- `title` / `descripcion`

| Show | nodo | Slug |
|---|---|---|
| El camino de las estrellas | 9046 | el-camino-de-las-estrellas |
| Aquí y Ahora | 9047 | aqui-y-ahora |
| Noticias que parecen broma | 9048 | noticias-que-parecen-broma-pero-no-son |
| Lo más viral | 9049 | lo-mas-viral |
| Tips y recomendaciones | 9050 | tips-y-recomendaciones |
| Receta fit | 9051 | receta-fit |
| Alguien lo tiene que hacer | 9052 | alguien-lo-tiene-que-hacer |
| Top Tech con Geekzilla | 3813 | top-tech |
| Top Gaming con Geekzilla | 3801 | top-gaming |
| Top Ten | 6581 | top-ten |
| Oye la alternativa | 7404 | oye-la-alternativa |
| Al otro lado de la radio | 6806 | al-otro-lado-de-la-radio |
| Oye de Cine | 9138 | oye-de-cine |
| La Regadera | 10689 | la-regadera |

> Para añadir un nuevo podcast, agregar entrada al array `arrpodcast` en `[...link].astro`. No hay CMS para esto — es hardcoded.

---

## Datos externos adicionales

| Endpoint | Usado en | Propósito |
|---|---|---|
| `cdn.nrm.com.mx/cdn/oye/playlist/cancion.json` | `streaming.js` | Canción actual en el stream |
| `playnrm.com/wp-json/wp/v2/posts?categories=3312` | `streaming.js` | Programación del día |
| `ws.audioscrobbler.com/2.0` | `streaming.js` | Portadas de álbumes (Last.fm) |
| `playnrm.com/registrate-aqui-peticiones/` | `peticiones/index.astro` | Formulario de peticiones (iframe) |
| `api.lyrics.ovh/v1/{artist}/{song}` | `streaming.js` | Letras de canciones (Top Ten) |

---

## Imágenes y recursos de contenido

- **GCS base:** `https://storage.googleapis.com/nrm-web/oye/recursos/`
  - `podcast/` — portadas de shows de podcast
  - `img_oye-min.jpg` — placeholder de imagen fallback en artículos
  - `LOGO-OYE-BLANCO-2025.svg` — logo principal
- **Placeholder de nota:** `storage.googleapis.com/nrm-web/oye/recursos/img_oye-min.jpg` — se usa cuando `og_image` de WP no existe

---

## RSS y distribución

- **`src/pages/rss.xml.js`:** actualmente lee `content/blog` (colección local con 5 posts de ejemplo), **no** el contenido real de WordPress. Es un placeholder del template base de Astro.
- **`src/pages/robots.txt.ts`:** generación programática del robots.txt
- **Sitemap:** generado por `@astrojs/sitemap` con todas las rutas pre-renderizadas

> **Deuda técnica:** el RSS no refleja el contenido real de WP. Si se requiere un RSS de noticias, conectarlo a la API de WP.

---

## `getStaticPaths` — pre-render en build time

Todas las páginas `[slug].astro` usan `getStaticPaths()` para pre-renderizar estáticamente. Límite actual: `per_page=100` en breaking news. Si una categoría tiene más de 100 posts, los artículos más antiguos no se generan.

---

## Reglas críticas

1. El WordPress en `playnrm.com` es el CMS de **toda la red NRM**, no solo Oye. Las categorías deben corresponder correctamente para no mezclar contenido de otras propiedades.
2. Los fetches en `getStaticPaths()` ocurren en **build time** — cambios en WP no se reflejan hasta el próximo build/deploy.
3. El catálogo de podcasts es hardcoded — cualquier nuevo show requiere modificar el código.
4. `yoast_head_json` es la fuente de verdad para SEO — no construir meta tags manuales en páginas individuales.
5. `_embed` en los fetches incluye imágenes destacadas (`wp:featuredmedia`) y autores — necesario para las cards.
