# Cosmetic & Implant Dentistry Westport

An Astro website for the Westport, Kansas City dental practice, using the approved homepage design across 43 interior pages.

## Local development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev -- --background
```

Use the local URL reported by Astro. Manage the background server with:

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## Validation and production build

```sh
npx astro check
npm run build
npm run content:verify
```

The static website is generated in `dist/`. Build output and installed dependencies are excluded from Git.

Google reviews load through the Cloudflare Pages Function at `/api/google-reviews`. See [Google Reviews Setup](docs/google-reviews-setup.md) for server variables, deployment, usage controls, and runtime checks. Run `npm test` for the endpoint tests. Astro alone displays the static review fallback locally.

## Editing the website

- `src/pages/index.astro`: homepage section order.
- `src/components/`: shared navigation, homepage sections, and the interior-page layout.
- `src/data/pages.json`: imported interior content, generated from the dated source captures.
- `src/styles/interior.css`: interior layouts using the approved homepage design.
- `src/styles/global.css`: styles, responsive layouts, and motion preferences.
- `src/lib/site.ts`: practice details and link destinations.
- `src/assets/`: practice photography and logo.

Interior links now use local routes. External appointment booking, membership, financing, and other source destinations remain available. The project does not handle appointment submissions itself; Jotform is pending Bryan's final embed.

See [Migration Notes](docs/migration/README.md) for scope, source comparisons, remaining integrations, and validation. Visit `/migration-review/` locally for links to all rebuilt pages alongside their originals. The homepage's internal review route is now `/design-review/`; `/review/` contains the practice's original patient-review page.
