# Cosmetic and Implant Dentistry Westport — Design Blueprint

## Overall direction & vibe
A calm, editorial, premium one-pager for a full-service dental practice in Westport, Kansas City. Warm ivory paper (with a barely-there dot texture) meets deep navy ink, aqua calls-to-action, and thin gold hairlines; every element is sharp-cornered and typography-led, projecting quiet confidence instead of clinical coldness. Oversized headlines that mix ultra-light and extrabold weights speak to adult patients considering anything from routine cleanings to implants and full-mouth restoration.

## Section-by-section breakdown

### Header (absolute, overlays the hero)
- Utility topbar (lg+ only): solid navy bar, 36px tall (h-9), max-w-7xl inner row, 11px semibold uppercase text with 0.18em tracking. Left: tagline "Full-service dentistry in Westport". Right: link to the contact page with an aqua hover.
- Main nav: ivory at 95% opacity with backdrop blur and a 1px bottom border (navy/10); 76px tall on mobile, 88px at lg. Logo image left (h-12, roughly 176–208px wide, object-contain, object-left). Desktop links (Our Approach, Services, Comfort, Patient Reviews) are text-sm font-semibold with a transparent 2px bottom border that turns aqua on hover. Primary CTA is a square aqua button (px-6 py-4, bold navy text) that flips to teal background with white text on hover.
- Mobile: 44px square hamburger button (1px navy/20 border, three navy bars) toggles a stacked dropdown panel — ivory background, navy/10 divider borders between links, full-width aqua CTA at the bottom. JS toggles a hidden class plus aria-expanded, and the menu closes when any link is tapped.

### Hero (full viewport)
- Section is min-height 100vh/100svh, flex items-center, isolate. Full-bleed background photo (absolute, object-cover) sits behind a horizontal ivory wash gradient: about 98% opaque at the left fading to fully transparent by ~82% of the width (mobile swaps to a simpler 96% → 72% wash) so copy always sits on the light side of the image.
- Content: max-w-7xl container with pt-32 (lg:pt-44) to clear the absolute header; copy constrained to max-w-4xl.
- Eyebrow: a 40px-wide, 1px-tall gold dash next to a teal, bold, uppercase label with 0.22em tracking ("Care for every stage").
- H1: font-size clamp(3.25rem, 7.4vw, 6.7rem), font-light, line-height 0.89, letter-spacing -0.055em, split across two lines with the second line ("every smile.") in font-extrabold — this light/extrabold split is the signature type move.
- Paragraph: max-w-xl, 16–18px, leading-7, navy at 80% opacity.
- CTA row (stacks on mobile, row from sm): solid aqua button and a navy-outlined button on ivory/90; both square, px-7 py-4, text-sm font-extrabold. Hovers: aqua → teal with white text; outline → solid navy with white text.
- Category chip strip: inline-flex wrapping bar with white/85 background, backdrop blur, small shadow, and a 2px gold left border; contains uppercase bold 12px tags with 0.12em tracking: General · Cosmetic · Implants · Emergency.

### Reviews band (#reviews — social proof)
Slim navy strip (py-7) with white text: aqua uppercase kicker "Patient perspectives", a one-line lg semibold statement, and an outlined button (1px border at white/40) linking out to current Google reviews in a new tab; hover shifts border and text to aqua. Stacked on mobile, justified row at md.

### Approach / general care (#care)
- Paper-textured ivory section, py-20 → lg:py-28; two-column grid from lg (gap-10 → lg:gap-20, items-center) with image left, text right.
- Image: 390px tall (520px at sm), full-width, object-cover, decorated by a 96px gold corner bracket (border-left + border-top) offset -16px to the top-left behind it.
- Text: teal numbered eyebrow "01 · General care"; H2 at 5xl → 6xl with a light first line and extrabold second line, line-height 0.98, tracking -0.045em; body copy navy/70; then a two-column list of four service keywords, each with a 1px top hairline (navy/20) and pt-3, text-sm bold; finishes with a teal extrabold arrow link "See all services →".

### Transform & restore (second feature)
- White background, mirrored layout: image moves to the right at lg via order utilities, 390px → 540px tall.
- Same eyebrow/headline pattern ("02 · Transform and restore"; "Refine a detail. / Rebuild with care.").
- Two mini-cards in a 2-column grid: each has a 2px left border (aqua for Cosmetic care, gold for Restorative care), an extrabold h3, and small navy/65 body text.
- CTA: solid navy square button with white extrabold text, hover fills teal.

### Services directory (#services)
- Full navy section with white text, py-20 → lg:py-28.
- Header row: lg grid of 1.1fr / 0.9fr, items-end, with a 1px bottom border (white/15) and pb-12. H2 runs 5xl → 7xl, font-light, leading-none, tracking -0.04em, with "the runaround." as an extrabold aqua span; intro paragraph is white/70 and right-justified at lg.
- Below (mt-12): four category columns (2 columns at sm, 4 at lg, gap-10). Each column has an aqua uppercase bold kicker with 0.2em tracking (Maintain, Transform, Restore, Support) and a plain list (space-y-3, text-sm, white/80) of four services — 16 total spanning preventive, cosmetic, restorative, and support care.

### Comfort (#comfort)
Paper-textured ivory again, py-20 → lg:py-24; three-column lg grid. Column one: teal eyebrow "Comfort + clarity" plus a 4xl extrabold two-line heading ("Capable care. Human delivery."). Columns two and three: text cards each opened by a 1px gold top border (pt-5), an xl bold title ("For anxious patients", "Technology, explained"), and small navy/70 body copy.

### Contact CTA (#contact)
Solid aqua band, py-16; lg grid of 1fr / auto, items-center. Left: extrabold uppercase location eyebrow ("Westport · Kansas City, Missouri"), a 4xl → 6xl extrabold headline "Ready when you are.", and a navy/75 supporting line. Right: two square buttons — navy solid with white text, and navy outline — stacked on mobile, side by side from sm.

### Footer
Navy background, py-10, column on mobile and a justified row at md. The logo sits on an ivory plate (inline-flex box with px-4 py-3) so the dark-on-light logo stays legible against navy. The right side holds small white/65 text: a locality line plus inline links (Services · Contact & calling details) separated by middots, aqua on hover, right-aligned at md.

## Typography
- Headings and body both use Manrope (Google Fonts) with weights 300, 400, 500, 600, 700, 800; stack: 'Manrope', sans-serif.
- Cormorant Garamond (italic 500) is preloaded and mapped to the serif slot in the Tailwind config but is never applied in the mockup — treat it as an optional serif accent, not a requirement.
- Display headlines are very large (clamp up to 6.7rem in the hero; 5xl–7xl elsewhere) and built on weight contrast: a font-light base with font-extrabold spans, tight negative tracking (-0.04em to -0.055em), and compressed line-height (0.89 in the hero, 0.98 in features, leading-none in services).
- Eyebrows/kickers: 11–12px, bold or extrabold, uppercase, wide letter-spacing (0.18em–0.22em); teal on light sections, aqua on navy sections.
- Body copy: 16px (up to 18px in the hero), leading-7, usually navy or white at 65–80% opacity for hierarchy.
- Buttons use text-sm font-extrabold; nav links use text-sm font-semibold.

## Color palette
- Navy #1B2A45 — primary brand/ink: headings, body text, dark section backgrounds (reviews band, services, footer), solid buttons.
- Teal #0D8AAA — secondary: eyebrow/kicker text on light sections, text links, hover fill for aqua and navy buttons.
- Aqua #2AACD1 — accent/action: primary CTA fills, highlighted headline span on navy, kickers and hover states on dark sections, contact band background.
- Gold #C6A15B — decorative accent: hairline dashes, 2px left borders, 1px top borders, the image corner bracket, and the hero chip-strip border.
- Ivory #F7F5F1 — page background and light surfaces (nav at /95, hero outline button at /90, footer logo plate).
- White #FFFFFF — alternate section surface (feature two) and dark-section text, used at /85, /80, /70, /65, /40, and /15 opacities.
- Muted ink ≈ #5D6779 — the effective color of navy/70 body text over ivory; use for secondary text.
- Texture: radial micro-dots of rgba(27,42,69,0.055) at 0.65px on an 8px grid over ivory.

## Spacing & layout
- Container: max-w-7xl (1280px), centered, with px-5 on mobile and px-6 from sm.
- Vertical rhythm: major sections py-20 → lg:py-28; comfort py-20 → lg:py-24; contact band py-16; reviews strip py-7; footer py-10.
- Feature sections: two-column grid from lg with gap-10 → lg:gap-20 and items-center; image side alternates via lg order utilities.
- Services: header grid lg:grid-cols-[1.1fr_.9fr]; list grid sm:grid-cols-2 → lg:grid-cols-4 with gap-10. Comfort: lg:grid-cols-3. Contact: lg:grid-cols-[1fr_auto].
- Breakpoints in use: sm (640px), md (768px), lg (1024px), plus a max-width 767px media query that simplifies the hero wash.
- Header: 76px nav (88px at lg) plus the 36px lg-only topbar; because the header is absolutely positioned over the hero, the hero compensates with pt-32 / lg:pt-44.
- Buttons share px-7 py-4 padding (nav CTA px-6 py-4); html uses scroll-smooth for anchor navigation and body prevents horizontal overflow.

## Unique visual treatments
- Zero border-radius anywhere — buttons, cards, chips, inputs, and the hamburger are strictly square; preserving this sharp editorial edge is essential.
- Paper dot texture utility: ivory background with a radial-gradient navy micro-dot (0.65px dot, 8px tile) used on the care and comfort sections.
- Hero wash: a layered horizontal ivory gradient over a full-bleed photo (opaque left, transparent right; simplified two-stop version under 768px) that keeps type legible without a boxed overlay.
- Weight-contrast headlines: light and extrabold combined inside a single heading, usually split across two lines with a manual break.
- Gold hairline system: 1px eyebrow dash (40px wide), 2px left borders on the hero chip strip and restorative card, 1px top borders on keyword lists and comfort cards, and a 96px offset corner bracket framing the first image.
- Subtle glassmorphism: backdrop-blur on the ivory/95 sticky-looking nav and on the white/85 hero category strip.
- Numbered eyebrows (01 ·, 02 ·) that sequence the narrative sections.
- Interaction cues: smooth in-page scrolling; hover transitions that swap fills (aqua → teal, ivory → navy) and reveal aqua bottom borders on nav links; accessible mobile menu toggle driven by aria-expanded.
- Logo-on-plate treatment in the footer: an ivory box behind the logo so it reads correctly on navy.
