import type { ImageMetadata } from "astro";
import hero from "../assets/hero-care.jpg";
import team from "../assets/team-member.jpg";
import office from "../assets/practice-interior.jpg";
import clinical from "../assets/round2/clinical-care.jpg";
import hunter from "../assets/round2/hunter-mcareavy.png";
import rianne from "../assets/round2/rianne-chisum.png";
import rachel from "../assets/round2/rachel-converse.jpg";
import chrissy from "../assets/round2/chrissy.jpg";
import konner from "../assets/round2/konner-lawson.png";
import { serviceLinks, site } from "./site";

export const photos = { hero, team, office, clinical, hunter };
export const teamPortraits = [
  { image: rianne, name: "RiAnne Chisum", role: "office manager" },
  { image: konner, name: "Konner Lawson", role: "patient care coordinator" },
  { image: chrissy, name: "Chrissy", role: "dental assistant" },
  { image: rachel, name: "Rachel Converse", role: "registered dental hygienist" },
];

// Technology types are listed on the official Smile Club site. Equipment photos
// are still requested; the cards currently use existing practice photography.
export const technology = [
  { title: "a clearer view with digital X-rays", description: "Digital X-rays help us look beyond what we can see during an exam. We use that information to talk through your dental health and the care you may need.", image: office, alt: "A treatment room at our Westport practice", source: site.smileClubUrl },
  { title: "see what we see with intraoral cameras", description: "Small cameras let us take a closer look inside your mouth. Images can help make conversations about your teeth and treatment easier to follow.", image: clinical, alt: "A member of the dental team caring for a patient", source: site.smileClubUrl },
  { title: "another perspective with 3D imaging", description: "Cone beam CT provides three-dimensional images for a more detailed view. Our team can explain when this kind of imaging is appropriate for your care.", image: team, alt: "The Westport dental team together in the office", source: site.smileClubUrl },
];

export const services = [
  { id: "general-care", title: "keep your smile healthy", label: "routine dental care", description: "From regular checkups and cleanings to fillings and mouth guards, we help you look after your teeth through every stage of life.", image: clinical, alt: "A clinician providing dental care at the practice", href: serviceLinks.general, cta: "explore general dentistry" },
  { id: "restorative-care", title: "get back to smiling comfortably", label: "restorative dentistry", description: "Missing or damaged teeth can make everyday life harder. Explore implants, crowns, bridges, and full-mouth restoration with a plan built around your needs.", image: office, alt: "A bright treatment room ready for an appointment", href: serviceLinks.restoration, cta: "explore restorative care" },
  { id: "cosmetic-care", title: "make your smile feel more like you", label: "cosmetic dentistry", description: "Tell us what you’d like to change about your smile. We’ll walk through options such as veneers and whitening, with your preferences and goals in mind.", image: team, alt: "Our Westport dental team sharing a lighthearted moment", href: serviceLinks.veneers, cta: "explore cosmetic care" },
];

export const expertise = [
  { label: "veneers", href: serviceLinks.veneers },
  { label: "dental implants", href: serviceLinks.implants },
  { label: "crowns & bridges", href: serviceLinks.crowns },
  { label: "teeth whitening", href: serviceLinks.whitening },
  { label: "clear braces", href: serviceLinks.clearBraces },
  { label: "full-mouth restoration", href: serviceLinks.restoration },
  { label: "general dentistry", href: serviceLinks.general },
  { label: "sedation options", href: serviceLinks.sedation },
  { label: "emergency dentistry", href: serviceLinks.emergency },
];

export const gallery = [
  { image: office, alt: "Large windows and natural light in a Westport treatment room" },
  { image: team, alt: "Our team together at the practice" },
  { image: clinical, alt: "Personal attention during a dental visit" },
  { image: hero, alt: "The Cosmetic & Implant Dentistry Westport team" },
];

export interface PatientReview { quote: string; name: string; source: string }
// Short verbatim excerpts from the practice's published Smile Club testimonials.
// Two further Google reviews and a current count are requested for final review.
export const patientReviews: PatientReview[] = [
  { quote: "Would recommend to anyone in midtown.", name: "Laura S.", source: site.smileClubUrl },
  { quote: "Thanks for a GREAT first visit!", name: "Allan B.", source: site.smileClubUrl },
  { quote: "Customer service was amazing from the time I step through the door.", name: "Arteshia W.", source: site.smileClubUrl },
];

export interface TrustBadge { name: string; image: ImageMetadata; href?: string }
export interface InstagramPost { image: ImageMetadata; alt: string; href: string }
// The review view reserves these positions without inventing affiliations/posts.
export const trustBadges: TrustBadge[] = [];
export const instagramPosts: InstagramPost[] = [];

export const reviewNeeds = [
  { section: "doctors", title: "current doctor roster + headshots", detail: "The current doctors page identifies Dr. Hunter McAreavy. Please confirm which doctors should appear and supply their current professional headshots. The preview uses Dr. Hunter’s published photo and a clearly identified team photo." },
  { section: "technology", title: "three equipment photos", detail: "Smile Club lists digital X-rays, intraoral cameras, and cone beam CT. Please confirm these are used at the Westport location and send one photo of each. Current cards use general practice photography." },
  { section: "comfort", title: "office + amenity photography", detail: "Please send around ten distinct reception, treatment-room, exterior, amenity, and candid practice photos. Four existing practice photos are shown; six extra positions are reserved in the review view." },
  { section: "reviews", title: "five current Google reviews", detail: "Please provide five selected Google review links and the current rating/count. Three short excerpts are available from Smile Club. Two further quotes are needed; no unverified review count is displayed." },
  { section: "credentials", title: "association + award logos", detail: "Please confirm the memberships and awards CIDWP may display and provide the approved logo files. No associations have been assumed." },
  { section: "instagram", title: "Instagram account + four recent posts", detail: "Please send the official account URL and four post links/images, or details of the existing feed integration. The review view shows the four intended positions." },
  { section: "contact", title: "hours, texting + policy links", detail: "The homepage and Smile Club list Mon–Thu 9–4; the contact page also lists Friday. Please confirm Friday hours, whether the phone accepts texts, and the HIPAA notice URL. Privacy and accessibility links come from the current site." },
];
