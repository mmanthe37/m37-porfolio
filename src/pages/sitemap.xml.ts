import { nav, path, projects } from '../lib/site';
import type { APIRoute } from 'astro';
export const GET: APIRoute = ({site}) => {
  const routes = [...nav.map(([,route])=>route), ...projects.map(p=>'projects/'+p.slug+'/')];
  const urls = routes.map(r=>'<url><loc>'+new URL(path(r),site).href+'</loc></url>');
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.join('')+'</urlset>',{headers:{'Content-Type':'application/xml'}});
};
