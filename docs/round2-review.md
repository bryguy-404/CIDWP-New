# CIDWP homepage — Round 2 review

Prepared September 20, 2026 from KO’s September 18 brief and Denea’s email.

## Preview

- Homepage: http://127.0.0.1:4321/
- KO review view, including labelled asset positions and a consolidated checklist: http://127.0.0.1:4321/review/
- Reference: https://jacksonfamilydentalonline.com/

Bryan approved the local Round 2 preview and requested a commit and push to `main` on September 20, 2026. The review route has `noindex, nofollow`; that prevents intended indexing but does not provide access control when the route is deployed.

## Capitalization Update

Bryan requested Title Case for headings, navigation, service titles, and short UI labels on September 20, 2026. This replaces the original lowercase direction. Body paragraphs, the approved hero subhead, and patient quotations retain their original casing. The preference is recorded in `AGENTS.md` for future project work.

## What changed

The homepage now follows the reference’s section sequence, full-width hero, large photography, alternating service rows, larger headings, and generous spacing. Light blue is the main surface/button color, with teal used for accents and dark teal for readable text. Work Sans is hosted locally. Pill buttons follow KO’s written brief.

The exact Round 1 hero subhead is preserved:

> Everyday care. Caring Experience. A team that takes the time to get to know you.

There are no numbered section labels. Photography uses the existing practice assets and additional images published by CIDWP. Jackson’s photos, wording, awards, and review count have not been reused.

## Section-by-section review

| Brief item | Implementation | Remaining client material |
| --- | --- | --- |
| 1. Header | Logo left; About, Services, Problems We Treat dropdowns; phone and schedule button; white header on scroll | None |
| 2. Hero | Full-width team photo, large headline, exact Round 1 subhead, paired call/schedule buttons | Optional future video; static photo is the agreed substitute |
| 3. Meet the doctors | Two adjacent photo positions, introduction, meet-us link | Confirm roster and professional headshots; currently Dr. Hunter’s published personal photo plus a labelled team photo. No unsupported “top-rated” claim |
| 4. Details | Large treatment-room photo and five differentiators | Additional office photo can replace the current one |
| 5. Smile Club | Full-width light-blue membership band linking to the existing plan | None |
| 6. Implants | Photo feature plus second-opinion strip and paired CTAs | Treatment-specific photography/video if available |
| 7. Technology | Three photo cards for technology named on the official Smile Club page | Confirm Westport equipment and send actual equipment photos; current photos show general practice scenes |
| 8. Service tiles | Three large alternating photo/copy rows: routine, restorative, cosmetic | More distinct practice/patient photos will reduce reuse |
| 9. Expertise | Nine existing services in a 3×3 desktop grid | None |
| 10. Comfort | Gallery opens photos in a keyboard-accessible dialog; four team portraits underneath | About ten distinct office/amenity photos. Four existing practice scenes are shown; six additional positions appear in the review view |
| 11. Reviews | Manual carousel with quote icon, first name/last initial, arrows, keyboard controls, Google link | Five selected Google reviews and verified count/rating. Three short Smile Club excerpts are provisional; two additional positions appear in review mode |
| 12. Schedule strip | Large heading and paired call/schedule buttons | None |
| 13. FAQ | Six native accordion questions with relevant links | None |
| 14. Office | Address, phone, hours, embedded Google Map, directions link | Resolve Friday-hours discrepancy |
| 15. Trust badges | Component and labelled positions in review view | Actual memberships/awards and approved logo files |
| 16. Instagram | Component with four labelled review positions | Official account plus four posts/images or feed integration details |
| 17. Final CTA | Full-width light-blue closing band with paired buttons | None |
| 18. Footer | Four columns, logo, copyright, current privacy/accessibility links; social/HIPAA fields ready | Official social URLs and HIPAA notice URL |
| 19. Mobile bar | Fixed call/contact buttons on small screens, with safe-area spacing | Confirm whether the phone supports texting |

Missing testimonials, badges, posts, and additional gallery slots are shown only as clearly labelled review positions on `/review/`. They are not presented as real content on `/`.

## One email for KO to send

**Subject: CIDWP homepage — remaining photos and details for Round 2**

Hi Denea,

The homepage layout has been rebuilt around the Jackson reference, including the light-blue palette, large photo sections, service rows, and expanded homepage sequence. To finish it with current CIDWP content, could you send the following together?

1. **Doctors:** Please confirm the doctors to feature and send current professional headshots. The current website identifies Dr. Hunter McAreavy; please confirm whether another doctor should be included.
2. **Technology:** Please confirm digital X-rays, intraoral cameras, and cone beam CT at Westport and send one photo of each. These are listed on the Smile Club page.
3. **Photography:** Around ten distinct office, reception, exterior, treatment-room, amenity, and candid photos. We have four practice scenes, but more variety will bring the gallery and service sections closer to the reference.
4. **Reviews:** Five selected Google review links, plus the current Google rating and review count. We have three short published Smile Club testimonials available to use while the selections are confirmed.
5. **Badges:** The association memberships and awards CIDWP should display, with approved logo files.
6. **Social:** The official Instagram and Facebook URLs, plus four Instagram post links/images or details of an existing feed integration.
7. **Office details:** Confirm Friday hours, whether (816) 388-0985 accepts texts, and the HIPAA notice link. The site’s footer/Smile Club show Monday–Thursday, while the contact page also lists Friday.

The video can follow later; the full-width photo is already in place. Once these details arrive, we can complete the remaining positions and send the revised preview back for review.

Thank you!

## Copy overview

Headings now read as connected phrases: “Feel At Home In Our Care,” “Get To Know Your Dental Team,” “We Make Time For The Details,” “Let’s Talk About Dental Implants,” “A Closer Look At Your Dental Health,” “Let’s Care For Your Smile,” “Find The Care You’re Looking For,” “Make Yourself Comfortable,” “Hear From Our Patients,” “Let’s Plan Your First Visit,” “What To Know Before You Visit,” “Come See Us In Westport,” and “We’re Ready When You Are.”

Supporting copy is concise and practice-specific. The CTAs use the existing phone and CareStack booking destination. There are no invented affiliations, treatment guarantees, review counts, or social posts.

## Implementation notes

- Page assembly: `src/components/Homepage.astro`
- Photo, service, review, badge, social and content-request data: `src/lib/homepage.ts`
- Contact information and optional video/social/texting/review-count fields: `src/lib/site.ts`
- Shared design styles: `src/styles/global.css`
- Source details: [round2-asset-sources.md](round2-asset-sources.md)
- Local QA captures and browser report: `.loop/round2/` (ignored by Git)

All photo slots support replacement with final client assets. The map and linked appointment system remain external services; testing does not submit an appointment.

## Validation and comparison

- `astro check`: 0 errors, 0 warnings, 0 hints.
- Production build passes for both `/` and `/review/`.
- Browser checks cover dropdown opening/dismissal and keyboard focus, gallery opening/photo load/Escape, carousel next/previous/wrap/arrow keys, six FAQ items, internal anchor targets, existing phone/booking URLs, mobile menu dismissal, and review-only content positions.
- Responsive checks at 320, 390, 768, 1100, and 1440 pixels found no horizontal overflow or broken images after the narrow-phone expertise grid adjustment.
- Runtime checks found no page errors.
- The Google Maps iframe URL is configured and redirects to Google's embed endpoint, but its rendered map content could not be confirmed reliably in the test browser. The office card therefore also has a visible address fallback and a direct “open in Google Maps” link. Live third-party map rendering should be rechecked on the eventual hosted preview.
- Reference, before, desktop, mobile, and section captures are saved in `.loop/round2/`. `comparison.html` presents the reference and revised review view side by side, with the previous homepage available as an alternate comparison.

The comparison confirms the requested section order and the shift to larger photography, alternating service rows, full-width color bands, larger type and a lighter palette. Final doctor portraits, more distinct office photographs, equipment photos, and confirmed review/social/badge content remain the main differences to resolve with client assets.
