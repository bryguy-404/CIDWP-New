/** Practice details and destinations verified against the existing practice site. */
export const site = {
  name: "Cosmetic & Implant Dentistry Westport",
  title: "Cosmetic & Implant Dentistry Westport | Your Kansas City Dentist",
  description: "Personal dental care in Westport, Kansas City. Explore general dentistry, veneers, dental implants, and a team that takes the time to know you.",
  url: "https://cosmeticimplantdentistrywp.com/",
  locality: "Westport · Kansas City, Missouri",
  contactUrl: "https://cosmeticimplantdentistrywp.com/contact/",
  bookingUrl: "https://onlineappointment.carestack.com/?dn=acts&ln=1",
  phone: "(816) 388-0985",
  phoneUrl: "tel:+18163880985",
  address: "638 W 39th St",
  city: "Kansas City, MO 64111",
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=Cosmetic+%26+Implant+Dentistry+Westport+638+W+39th+St+Kansas+City+MO",
  doctorsUrl: "https://cosmeticimplantdentistrywp.com/about/meet-the-doctors/",
  smileClubUrl: "https://smileclub.cosmeticimplantdentistrywp.com/",
  reviewsUrl: "https://www.google.com/search?q=Cosmetic+%26+Implant+Dentistry+Westport+Kansas+City+reviews",
  teamUrl: "https://cosmeticimplantdentistrywp.com/about/meet-the-team/",
  privacyUrl: "https://cosmeticimplantdentistrywp.com/privacy-policy/",
  accessibilityUrl: "https://cosmeticimplantdentistrywp.com/accessibility/",
  hours: "Monday–Thursday, 9:00 AM–4:00 PM",
  // Confirm these with the practice before enabling them. See docs/round2-review.md.
  textingEnabled: false,
  heroVideoUrl: null as string | null,
  instagramUrl: null as string | null,
  facebookUrl: null as string | null,
  hipaaUrl: null as string | null,
  googleReviewCount: null as number | null,
} as const;

export const navLinks = [
  { href: "#care", label: "Our Approach" },
  { href: "#services", label: "Services" },
  { href: "#comfort", label: "Your Experience" },
  { href: "#contact", label: "Visit Us" },
] as const;

export const serviceLinks = {
  general: "https://cosmeticimplantdentistrywp.com/services/general-dentistry/",
  implants: "https://cosmeticimplantdentistrywp.com/services/dental-implants/",
  veneers: "https://cosmeticimplantdentistrywp.com/services/veneers/",
  whitening: "https://cosmeticimplantdentistrywp.com/services/teeth-whitening/",
  restoration: "https://cosmeticimplantdentistrywp.com/full-mouth-restoration/",
  sedation: "https://cosmeticimplantdentistrywp.com/sedation/",
  emergency: "https://cosmeticimplantdentistrywp.com/services/emergency-dentist/",
  crowns: "https://cosmeticimplantdentistrywp.com/services/crowns-bridges/",
  clearBraces: "https://cosmeticimplantdentistrywp.com/services/braces/",
} as const;

export const navigation = [
  { label: "About", links: [
    { label: "Meet Your Dentist", href: "#doctors" },
    { label: "Our Approach", href: "#care" },
    { label: "Your Experience", href: "#comfort" },
    { label: "Smile Club", href: site.smileClubUrl },
    { label: "Visit Our Office", href: "#contact" },
  ] },
  { label: "Services", links: [
    { label: "General Dentistry", href: "#general-care" },
    { label: "Restorative Dentistry", href: "#restorative-care" },
    { label: "Cosmetic Dentistry", href: "#cosmetic-care" },
    { label: "Dental Implants", href: "#implants" },
    { label: "All Our Services", href: "#expertise" },
  ] },
  { label: "Problems We Treat", links: [
    { label: "Missing Teeth", href: serviceLinks.implants },
    { label: "Damaged Teeth", href: serviceLinks.restoration },
    { label: "Stained Teeth", href: serviceLinks.whitening },
    { label: "Dental Anxiety", href: serviceLinks.sedation },
    { label: "Urgent Dental Concerns", href: serviceLinks.emergency },
  ] },
] as const;
