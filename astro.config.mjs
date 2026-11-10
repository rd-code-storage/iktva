import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [mdx(), sitemap()],
  site: 'https://rd-code-storage.github.io',
  base: '/iktva',
  trailingSlash: 'always',
});
