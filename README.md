# Cosmetic & Implant Dentistry Westport

An Astro homepage for the Westport, Kansas City dental practice, styled with Tailwind CSS and custom responsive layouts.

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
```

The static website is generated in `dist/`. Build output and installed dependencies are excluded from Git.

Google reviews load through the Cloudflare Pages Function at `/api/google-reviews`. See [Google Reviews Setup](docs/google-reviews-setup.md) for server variables, deployment, usage controls, and runtime checks. Run `npm test` for the endpoint tests. Astro alone displays the static review fallback locally.

## Editing the website

- `src/pages/index.astro`: homepage section order.
- `src/components/`: homepage sections, navigation, FAQs, and scroll reveals.
- `src/styles/global.css`: styles, responsive layouts, and motion preferences.
- `src/lib/site.ts`: practice details and link destinations.
- `src/assets/`: practice photography and logo.

Booking and service-detail links currently connect to the practice’s existing external pages. The project does not handle appointment submissions itself.
