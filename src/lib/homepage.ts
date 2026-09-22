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
import veneers from "../assets/expertise/veneers.png";
import implants from "../assets/expertise/implants.png";
import crowns from "../assets/expertise/crowns.png";
import whitening from "../assets/expertise/whitening.png";
import aligners from "../assets/expertise/aligners.png";
import restoration from "../assets/expertise/restoration.png";
import emergency from "../assets/expertise/emergency.png";
import { serviceLinks, site } from "./site";

export const photos = { hero, team, office, clinical, hunter };
export const teamPortraits = [
  { image: rianne, name: "RiAnne Chisum", role: "Office Manager" },
  { image: konner, name: "Konner Lawson", role: "Patient Care Coordinator" },
  { image: chrissy, name: "Chrissy", role: "Dental Assistant" },
  { image: rachel, name: "Rachel Converse", role: "Registered Dental Hygienist" },
];

// Technology types are listed on the official Smile Club site. Equipment photos
// are still requested; the cards currently use existing practice photography.
export const technology = [
  { title: "A Clearer View With Digital X-Rays", description: "Digital X-rays help us look beyond what we can see during an exam. We use that information to talk through your dental health and the care you may need.", image: office, alt: "A treatment room at our Westport practice", source: site.smileClubUrl },
  { title: "See What We See With Intraoral Cameras", description: "Small cameras let us take a closer look inside your mouth. Images can help make conversations about your teeth and treatment easier to follow.", image: clinical, alt: "A member of the dental team caring for a patient", source: site.smileClubUrl },
  { title: "Another Perspective With 3D Imaging", description: "Cone beam CT provides three-dimensional images for a more detailed view. Our team can explain when this kind of imaging is appropriate for your care.", image: team, alt: "The Westport dental team together in the office", source: site.smileClubUrl },
];

export const services = [
  { id: "general-care", title: "Keep Your Smile Healthy", label: "Routine Dental Care", description: "From regular checkups and cleanings to fillings and mouth guards, we help you look after your teeth through every stage of life.", image: clinical, alt: "A clinician providing dental care at the practice", href: serviceLinks.general, cta: "Explore General Dentistry" },
  { id: "restorative-care", title: "Get Back To Smiling Comfortably", label: "Restorative Dentistry", description: "Missing or damaged teeth can make everyday life harder. Explore implants, crowns, bridges, and full-mouth restoration with a plan built around your needs.", image: office, alt: "A bright treatment room ready for an appointment", href: serviceLinks.restoration, cta: "Explore Restorative Care" },
  { id: "cosmetic-care", title: "Make Your Smile Feel More Like You", label: "Cosmetic Dentistry", description: "Tell us what you’d like to change about your smile. We’ll walk through options such as veneers and whitening, with your preferences and goals in mind.", image: team, alt: "Our Westport dental team sharing a lighthearted moment", href: serviceLinks.veneers, cta: "Explore Cosmetic Care" },
];

// Original illustrative service imagery plus two existing practice photos.
// Generation prompts and provenance: docs/expertise-imagery.md.
export const expertise: { label: string; href: string; image: ImageMetadata; position: string }[] = [
  { label: "Veneers", href: serviceLinks.veneers, image: veneers, position: "50% 50%" },
  { label: "Dental Implants", href: serviceLinks.implants, image: implants, position: "50% 50%" },
  { label: "Crowns & Bridges", href: serviceLinks.crowns, image: crowns, position: "50% 50%" },
  { label: "Teeth Whitening", href: serviceLinks.whitening, image: whitening, position: "50% 50%" },
  { label: "Clear Braces", href: serviceLinks.clearBraces, image: aligners, position: "50% 50%" },
  { label: "Full-Mouth Restoration", href: serviceLinks.restoration, image: restoration, position: "50% 50%" },
  { label: "General Dentistry", href: serviceLinks.general, image: clinical, position: "50% 44%" },
  { label: "Sedation Options", href: serviceLinks.sedation, image: office, position: "50% 50%" },
  { label: "Emergency Dentistry", href: serviceLinks.emergency, image: emergency, position: "50% 45%" },
];

export const gallery = [
  { image: office, alt: "Large windows and natural light in a Westport treatment room" },
  { image: team, alt: "Our team together at the practice" },
  { image: clinical, alt: "Personal attention during a dental visit" },
  { image: hero, alt: "The Cosmetic & Implant Dentistry Westport team" },
];

export interface TrustBadge { name: string; image: ImageMetadata; href?: string }
// The review view reserves these positions without inventing affiliations.
export const trustBadges: TrustBadge[] = [];

export const reviewNeeds = [
  { section: "doctors", title: "Current Doctor Roster + Headshots", detail: "The current doctors page identifies Dr. Hunter McAreavy. Please confirm which doctors should appear and supply their current professional headshots. The preview uses Dr. Hunter’s published photo and a clearly identified team photo." },
  { section: "technology", title: "3D Printer + Equipment Photos", detail: "Pam’s equipment photos are pending. Please include the 3D printer photo, its intended card placement, and a brief description of how the practice uses it. One current technology card will be replaced when those details arrive; the cards still use general practice photography." },
  { section: "comfort", title: "Office + Team Photography", detail: "Pam’s photo batch and placement notes are pending. Replace repeated images across the homepage and fill the comfort gallery to roughly ten distinct photos. Four existing gallery photos remain for now. After the batch arrives, send KO one consolidated list of any remaining photo placeholders." },
  { section: "credentials", title: "Association + Award Logos", detail: "Please confirm the memberships and awards CIDWP may display and provide the approved logo files. No associations have been assumed." },
  { section: "contact", title: "Hours, Texting + Policy Links", detail: "The homepage and Smile Club list Mon–Thu 9–4; the contact page also lists Friday. Please confirm Friday hours, whether the phone accepts texts, and the HIPAA notice URL. Privacy and accessibility links come from the current site." },
];
