export interface PatientReview {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO publication date from the source, or null when only relative age is available. */
  date: string | null;
  sourceUrl: string;
  isExcerpt?: boolean;
}

// Manually checked on the practice's Google Maps listing on September 22, 2026.
// Google exposed relative ages, not exact dates; do not invent publication dates.
// Source links, observed ages, and API handoff notes: docs/round3-review.md.
export const patientReviews: PatientReview[] = [
  {
    name: "Erik Nestor",
    rating: 5,
    text: "I had a great experience here. Rachel was very personable and professional, and Dr. Hunter was the same.",
    date: null,
    sourceUrl: "https://maps.app.goo.gl/dCsaPgMpgzZzMMCU6",
    isExcerpt: true,
  },
  {
    name: "Ni chol lay",
    rating: 5,
    text: "Rachel was patient and kind and made me feel so comfortable.",
    date: null,
    sourceUrl: "https://maps.app.goo.gl/fDUjK4BrQPRBiVhv6",
    isExcerpt: true,
  },
  {
    name: "Agathe Web",
    rating: 5,
    text: "She is attentive and explains everything she’s doing, taking the time to make sure you feel calm and confident.",
    date: null,
    sourceUrl: "https://maps.app.goo.gl/Px9G7hLqB65ztQLg7",
    isExcerpt: true,
  },
  {
    name: "Jessica Bird",
    rating: 5,
    text: "Everyone I meet was so friendly and kind, the facility itself was so clean and up to date.",
    date: null,
    sourceUrl: "https://maps.app.goo.gl/E1kuJpkx7Ys7wuhQ6",
    isExcerpt: true,
  },
];
