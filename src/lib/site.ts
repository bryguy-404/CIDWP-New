/** Site-wide constants. Repeated links and copy live here, not in components. */
export const site = {
  name: "Cosmetic & Implant Dentistry Westport",
  title: "Cosmetic & Implant Dentistry Westport",
  description:
    "Full-service dentistry in Westport, Kansas City, Missouri — preventive care, emergency visits, veneers, dental implants, and full-mouth restoration.",
  url: "https://cosmeticimplantdentistrywp.com/",
  locality: "Westport · Kansas City, Missouri",
  tagline: "Full-service dentistry in Westport",
  contactUrl: "https://cosmeticimplantdentistrywp.com/contact-us/",
  reviewsUrl:
    "https://www.google.com/search?q=Cosmetic+%26+Implant+Dentistry+Westport+Kansas+City+reviews",
} as const;

export const navLinks = [
  { href: "#care", label: "Our Approach" },
  { href: "#services", label: "Services" },
  { href: "#comfort", label: "Comfort" },
  { href: "#reviews", label: "Patient Reviews" },
] as const;
