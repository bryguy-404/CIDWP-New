/**
 * Brand palette for the Round 2 homepage.
 * #0D8AAA is sampled from CIDWP's official logo.
 * #CCFFFF, #E3FBFF, #F5FFFF and #0E3647 are in the official Smile Club site.
 * Mirrored in src/styles/global.css; see docs/round2-review.md for sources.
 */
export const theme = {
  colors: {
    primary: "#CCFFFF",
    secondary: "#0D8AAA",
    accent: "#E3FBFF",
    background: "#FFFFFF",
    foreground: "#0E3647",
    muted: "#50636C",
    brand: "#0D8AAA",
    blue: "#CCFFFF",
    pale: "#E3FBFF",
    mist: "#F5FFFF",
    ink: "#0E3647",
  },
  fonts: { heading: "'Work Sans', sans-serif", body: "'Work Sans', sans-serif" },
  radius: { sm: "0px", md: "4px", lg: "999px" },
} as const;
export type Theme = typeof theme;
