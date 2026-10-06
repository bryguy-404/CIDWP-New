// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/contact-us/': '/contact/',
    '/services/emergency-dentistry/': '/services/emergency-dentist/',
    '/services/clear-braces/': '/services/braces/',
    '/services/emergency-dentistry-2/': '/services/emergency-dentistry-ppc/',
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx()]
});
