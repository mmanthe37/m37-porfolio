import { defineConfig } from 'astro/config';

const address = new URL(process.env.PAGES_URL || 'http://localhost:4321/');
export default defineConfig({
  site: address.origin,
  base: address.pathname.replace(/\/$/, '') || '/',
  output: 'static',
  trailingSlash: 'always',
});
