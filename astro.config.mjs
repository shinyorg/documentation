import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import mdx from "@astrojs/mdx";
import tailwind from '@astrojs/tailwind';
// import { astroAsides } from './integrations/astro-asides';

// https://astro.build/config
export default defineConfig({
  site: 'https://shinylib.net/',
  markdown: { drafts: true },
  integrations: [
    tailwind(), 
    preact(), 
    react(), 
    // astroAsides(),
    mdx({ drafts: true })
  ]
});