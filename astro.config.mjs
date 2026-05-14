import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://oyedigital.mx',
  integrations: [mdx(), sitemap({ sitemap: '/sitemap.xml' })],
  devToolbar: {
    enabled: false
  }
});
