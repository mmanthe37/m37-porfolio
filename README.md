# M37 Development

Michael Manthe Jr.’s professional and academic portfolio. The static Astro site features four software case studies, academic work, an experience timeline, verified contact profiles and a downloadable résumé.

## Development

Use Node.js 24 and Python 3.9 or later. Run `npm ci`, then `npm run dev` and open the address printed by Astro. Run `npm test` to check the content and build and validate both the GitHub project URL and the custom-domain URL.

Update the public records in `content/` and the PDF in `public/downloads/`. Keep each project's status and evidence date current. The glass artwork and editorial project illustrations are portfolio visuals.

## GitHub Pages

Set the repository's Settings → Pages → Build and deployment → Source to GitHub Actions. Merging into main runs **Deploy portfolio**. Once on main, the same workflow can also be started manually from Actions → Deploy portfolio → Run workflow.

The build reads GitHub Pages’ reported base URL to configure Astro, local links, downloads, canonical URLs and the sitemap. After a future custom-domain change, rerun the workflow to rebuild at the new base. The source does not configure registrar records or claim a custom domain.
