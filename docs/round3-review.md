# Round 3 Homepage Review

Prepared September 22, 2026 from KO’s September 21 brief. This records the current implementation; the Round 2 documents remain historical references.

## Implemented

- Changed the Problems We Treat label to Emergency Dentistry, preserving its emergency-dentist destination.
- Retained the approved layout, light blue palette, static hero with future video support, and existing header.
- Removed the Instagram section, its internal placeholders, and its content request. No replacement photo strip is needed alongside the comfort gallery.
- Replaced all Smile Club testimonial slides and their misleading testimonial links with four real Google review excerpts.
- Passed review data into the carousel as a typed component property. The component supports names, individual ratings, text, ISO publication dates, review source links, and excerpt labels. An empty list retains the Google reviews call to action; a single review has no carousel controls.
- Pointed Read Our Google Reviews at the practice’s verified Google Maps reviews listing. Individual excerpts link to their own full reviews.
- Added a viewport height limit and scrolling for longer desktop dropdowns. Mobile uses the existing menu scroll container.
- Updated the internal preview at `/review/` to Round 3 and retained unresolved content requests. Title Case remains the UI convention.
- No e-financial copy currently appears in the homepage source; preserve that exact term when payment-plan copy is added.

## Manually Verified Google Review Sources

Verified directly in Google Maps for Cosmetic & Implant Dentistry Westport, 638 W 39th St, Kansas City, on September 22, 2026. All four selected reviews show five stars. Text is a short verbatim excerpt from each reviewer’s separate review, preserving their original wording and display name.

| Reviewer | Source | Age Shown At Verification |
| --- | --- | --- |
| Erik Nestor | https://maps.app.goo.gl/dCsaPgMpgzZzMMCU6 | 3 months ago |
| Ni chol lay | https://maps.app.goo.gl/fDUjK4BrQPRBiVhv6 | 2 months ago |
| Agathe Web | https://maps.app.goo.gl/Px9G7hLqB65ztQLg7 | 4 months ago |
| Jessica Bird | https://maps.app.goo.gl/E1kuJpkx7Ys7wuhQ6 | a month ago |

Google’s visible listing provided relative ages, not exact publication dates. Manual records therefore use `date: null`, and the public carousel omits dates instead of making up precise dates or freezing relative ages. Actual dates supplied by the eventual API will render as semantic time elements. No aggregate review count or live-feed claim is displayed.

## Deferred Until Materials Or Confirmation Arrive

- **Pam’s photo batch:** Keep existing imagery for now. Replace repeats across the homepage before reusing images, expand the comfort gallery to roughly ten distinct photos, and collect any remaining photo needs into one follow-up list after the batch is applied.
- **3D printer:** Replace one technology card once its photo, placement notes, and description of the practice’s use arrive. Do not guess equipment capabilities.
- **Google API:** Select the API and arrange access last. Adapt its response into the `PatientReview` fields in `src/lib/reviews.ts`, then pass the resulting array to `ReviewsBand`. Keep credentials server-side and implement the selected service’s attribution requirements at integration time. This change does not implement API fetching, scheduling, or credential setup.
- **Secondary pages:** Dental Implants, Veneers, and Emergency Dentistry remain on hold until KO confirms priorities against traffic data. Build and preview each separately once authorized.

## Preview And Validation

Run `npm run dev -- --background` and open `/` or `/review/` on Astro’s reported local URL. This round is a local implementation; publishing is a separate step.

Verified September 22, 2026:

- `astro check`: 31 files, zero errors, warnings, or hints.
- `npm run build`: both static routes built successfully.
- Browser checks at 1280px and 390px: homepage and internal preview render, no horizontal overflow or console errors, Instagram is absent, and the existing static hero remains.
- Emergency Dentistry appears in desktop and mobile navigation with the original emergency-dentist URL.
- Review next/previous buttons, wraparound, and Home/End keyboard navigation work. All four slides reserve the same height at both widths; only the active review is visible and the other three are inert.
- The public homepage contains no internal review notes; the internal preview retains six gallery photo placeholders and six follow-ups.
