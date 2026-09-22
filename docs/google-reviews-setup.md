# Google Reviews Setup

## Cloudflare Pages Configuration

Set these under the CIDWP Pages project's **Settings → Variables And Secrets** in **Production** before deploying the function:

| Type | Name | Value |
| --- | --- | --- |
| Secret | `GOOGLE_PLACES_API_KEY` | The key from the CIDWP Website Google Cloud project |
| Text | `GOOGLE_PLACE_ID` | `ChIJUywCm23vwIcRoV5FtFAqW3A` |

Bryan confirmed both saved on September 22, 2026. The Place ID was checked in Google's finder against the practice name and 638 W 39th St, Kansas City, MO 64111.

The key should be restricted to **Places API (New)**. Requests come from the server, so website referrer restrictions are incompatible. IP restrictions require stable outbound IPs; the current Cloudflare setup does not provide a configured fixed egress IP. The key is never included in a client bundle or API response.

Production and Preview settings are separate. Preview deployments without these variables display the static excerpts. A new deployment is required to use updated bindings. Keep the existing `npm run build` build command and `dist` output directory. Cloudflare's Git integration also compiles the root `functions` directory.

## Review Selection

The endpoint keeps only usable five-star written reviews from Google's selection of up to five relevance-ranked reviews, then sorts by publication date from newest to oldest. Missing or invalid dates go last; equal dates retain Google's order. This can produce fewer than five reviews and cannot guarantee the five newest five-star reviews across the practice's full review history.

The carousel retains Google's attribution and a short selection notice. The full terms and privacy supplement is linked from the site footer rather than repeated beneath the carousel. If no reviews qualify or the request fails, the original four manually checked five-star excerpts remain visible with their excerpt label. They have no exact publication dates and are not described as the newest reviews. The site does not mix excerpts into a nonempty live response to fill empty slots.

## Usage And Availability

Google Cloud billing must be enabled. Requesting the `reviews` field uses the **Place Details Enterprise + Atmosphere** SKU. One successful browser visit to the review section triggers one Place Details request; visits that do not approach the section make no review request. There is no polling or automatic retry.

Before enabling this on a high-traffic site, set a suitable Place Details quota in Google Cloud and a billing budget alert. Budget alerts do not stop spending; API quotas limit requests. The public endpoint rejects cross-site browser requests but this is not authentication or comprehensive abuse prevention. A caller can directly request the configured practice's endpoint, consuming quota. Cloudflare rate limiting can be added as traffic warrants. Reaching Google's quota keeps the manual excerpts visible.

Google Places review content is not stored in the repository, a database, KV, browser storage, or a CDN cache. Both upstream requests and endpoint responses use `no-store`. The existing manual excerpt source file remains separate from API content. Only the public Place ID is retained as configuration.

The upstream request uses `Cache-Control: no-store` and Cloudflare's negative `cacheTtlByStatus` setting to disable caching across compatibility dates. It intentionally omits the `RequestInit.cache` option, which throws in Workers configured before November 11, 2024 without the `cache_option_enabled` flag.

Redirect handling uses `manual` and rejects 3xx responses, so the API key is never forwarded to a redirect destination. This also works on Workers runtimes that reject the `error` redirect mode.

## Verification

```sh
npm test
npx astro check
npm run build
npx wrangler pages functions build --outdir /tmp/cidwp-pages-function-build
```

Astro's local dev server serves the static site but does not execute Pages Functions. The static fallback is expected there. To test the Cloudflare runtime locally, build first, put local credentials in a gitignored `.dev.vars` file, then run `npx wrangler pages dev dist`. Never commit `.dev.vars`, paste a real key into chat, or add a `PUBLIC_` prefix to it.

After deployment, open `/api/google-reviews`: success is JSON with `reviews` and `attributions`. Errors are 503 responses with a generic message plus a diagnostic code: `CONFIGURATION_MISSING`, `GOOGLE_REQUEST_FAILED`, `GOOGLE_TIMEOUT`, or `GOOGLE_UNAVAILABLE`. Failed Google responses also expose their HTTP status and, when available, the uppercase ErrorInfo reason enum (for example, `BILLING_DISABLED`). Error messages and metadata from Google are never returned. Cloudflare Function logs include only the upstream HTTP status or failure category. A Google 403 usually means billing, API enablement, or key restrictions need checking; 429 indicates a quota limit. No credentials or Google error bodies are logged.

On the homepage, scroll to the reviews. The section's `data-review-state` becomes `live` for an API result and stays `fallback` when static excerpts are used. A live result displays Google Maps attribution, review dates, and author/profile links. Confirm that every live review has a rating of five, valid dates are newest first, and the selection notice matches that behavior. Confirm that next/previous, keyboard navigation, and Read More work on desktop and mobile. A successful static build alone does not verify the deployed Google connection.

## Sources

- [Place Details fields and billing](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Google Places display, attribution, and storage policies](https://developers.google.com/maps/documentation/places/web-service/policies)
- [Google API key security](https://developers.google.com/maps/api-security-best-practices)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/get-started/)
- [Cloudflare secrets](https://developers.cloudflare.com/pages/functions/bindings/#secrets)

The unmodified `public/google-maps-attribution.svg` is Google's DarkGray SVG from the [official attribution assets](https://developers.google.com/static/maps/documentation/images/Google_Maps_Attribution_Assets.zip), downloaded September 22, 2026.
