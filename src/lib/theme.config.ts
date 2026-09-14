/**
 * Canonical theme source for Cosmetic & Implant Dentistry Westport.
 *
 * The values here are mirrored into the Tailwind v4 `@theme` block in
 * `src/styles/global.css` (Tailwind v4 is CSS-first, so it cannot import this
 * file directly). If you change a value here, change it there too.
 */
export const theme = {
  colors: {
    // Semantic roles
    primary: "#1B2A45",
    secondary: "#0D8AAA",
    accent: "#2AACD1",
    background: "#F7F5F1",
    foreground: "#1B2A45",
    muted: "#5D6779",

    // Brand aliases — the names used throughout the approved mockup.
    // These are the names components reference.
    navy: "#1B2A45",
    teal: "#0D8AAA",
    aqua: "#2AACD1",
    gold: "#C6A15B",
    ivory: "#F7F5F1",
  },
  fonts: {
    heading: "'Manrope', sans-serif",
    body: "'Manrope', sans-serif",
    /** Preloaded and mapped, but intentionally unused in the approved design. */
    serif: "'Cormorant Garamond', serif",
  },
  radius: {
    sm: "0px",
    md: "0px",
    lg: "0px",
  },
} as const;

export type Theme = typeof theme;
