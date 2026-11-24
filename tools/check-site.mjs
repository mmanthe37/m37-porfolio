import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const output = process.argv[2] || 'dist';
const root = new URL(process.env.PAGES_URL || 'http://localhost:4321/');
const prefix = root.pathname.replace(/\/?$/, '/');
const projects = JSON.parse(readFileSync('content/projects.json', 'utf8'));
const routes = ['', 'projects/', 'research/', 'experience/', 'contact/',
  ...projects.map(project => 'projects/' + project.slug + '/'), '404.html'];

function fileFor(url) {
  assert.ok(url.pathname.startsWith(prefix), 'Escaped base path: ' + url.href);
  const local = decodeURIComponent(url.pathname.slice(prefix.length));
  return join(output, local.endsWith('/') || !local ? local + 'index.html' : local);
}
for (const route of routes) {
  const page = new URL(prefix + route, root);
  const html = readFileSync(fileFor(page), 'utf8');
  assert.ok(html.includes('href="' + page.href + '"'), 'Missing canonical for ' + route);
  assert.ok(html.includes('<h1'), 'Missing heading in ' + route);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = new URL(match[1], page);
    // Public projects may share github.io with the portfolio.
    if (!match[1].startsWith('/') && target.origin === root.origin && !target.pathname.startsWith(prefix)) continue;
    if (target.origin !== root.origin) continue;
    const file = fileFor(target);
    assert.ok(existsSync(file) && statSync(file).isFile(), 'Missing asset or page: ' + target.href);
  }
}
const sitemap = readFileSync(join(output, 'sitemap.xml'), 'utf8');
for (const route of routes.filter(route => route !== '404.html')) {
  assert.ok(sitemap.includes('<loc>' + new URL(prefix + route, root).href + '</loc>'));
}
console.log('Verified ' + routes.length + ' HTML pages, local links, assets and sitemap at ' + root.href);
