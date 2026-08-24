// ============================================================
// GENWEBZY — SITE DATA
// Admin-managed sections (Reviews, Projects, Services, Pricing,
// FAQ, Contact) live in content.json — edit them from /admin.
// Other sections below are still edited manually here.
// ============================================================
import _content from './content.json';

const getSiteContent = () => {
  try {
    const local = typeof window !== 'undefined' && window.localStorage.getItem('genwebzy_site_content');
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {}
  return _content;
};

const activeContent = getSiteContent();

export const CONTACT  = activeContent.contact || _content.contact;
export const SERVICES = (activeContent.services || _content.services || []).filter(s => s.visible !== false);
export const PROJECTS = (activeContent.projects || _content.projects || []).filter(p => p.visible !== false);
export const PRICING  = (activeContent.pricing || _content.pricing || []).filter(p => p.visible !== false);
export const FAQ      = (activeContent.faq || _content.faq || []).filter(f => f.visible !== false);
export const REVIEWS  = (activeContent.reviews || _content.reviews || []).filter(r => r.visible !== false);







// ─── DEMO WEBSITES ───────────────────────────────────────────
// Replace DEMO_URL_XX with actual live demo URLs when available.
// Replace image paths with actual preview screenshots.
export const DEMOS = [
  {
    id: "DEMO_01",
    name: "Restaurant Template",
    category: "Restaurant",
    description:
      "A warm, modern template for restaurants and cafés featuring a menu section, gallery, reservations and contact.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: null,           // Replace with: "/demos/restaurant-preview.jpg"
    liveUrl: "DEMO_URL_01", // Replace with actual URL
  },
  {
    id: "DEMO_02",
    name: "Photography Studio",
    category: "Photography",
    description:
      "A visually clean template for photographers to showcase their portfolio, packages and booking information.",
    technologies: ["React", "CSS"],
    image: null,
    liveUrl: "DEMO_URL_02",
  },
  {
    id: "DEMO_03",
    name: "Salon & Spa",
    category: "Salon",
    description:
      "An elegant template for salons and spas with service listings, team profiles, booking CTA and testimonial area.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: null,
    liveUrl: "DEMO_URL_03",
  },
  {
    id: "DEMO_04",
    name: "Fitness & Gym",
    category: "Gym",
    description:
      "A bold, energetic template for gyms and fitness centers with class schedules, membership plans and enquiry form.",
    technologies: ["React", "CSS"],
    image: null,
    liveUrl: "DEMO_URL_04",
  },
  {
    id: "DEMO_05",
    name: "Real Estate Agency",
    category: "Real Estate",
    description:
      "A clean property listing template for real estate agencies with property cards, agent profiles and contact form.",
    technologies: ["React", "CSS"],
    image: null,
    liveUrl: "DEMO_URL_05",
  },
  {
    id: "DEMO_06",
    name: "Portfolio Template",
    category: "Portfolio",
    description:
      "A minimal developer/designer portfolio template with project showcase, skills section and a contact form.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: null,
    liveUrl: "DEMO_URL_06",
  },
];

// ─── TEAM MEMBERS ────────────────────────────────────────────
// Replace placeholder values with actual names, roles and bios.
export const TEAM = [
  {
    id: "TEAM_MEMBER_01",
    name: "TEAM_MEMBER_01",       // Replace with actual name
    role: "Founder / Project Lead",
    bio: "Leads the team and manages client relationships, project planning and overall delivery.",
    skills: ["Project Management", "Web Strategy", "Client Communication"],
    linkedin: null,                // Replace with LinkedIn URL
    github: null,                  // Replace with GitHub URL
    photo: null,                   // Replace with photo path
  },
  {
    id: "TEAM_MEMBER_02",
    name: "TEAM_MEMBER_02",
    role: "Frontend Developer",
    bio: "Responsible for building responsive, pixel-perfect interfaces that work across all devices.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    linkedin: null,
    github: null,
    photo: null,
  },
  {
    id: "TEAM_MEMBER_03",
    name: "TEAM_MEMBER_03",
    role: "Backend Developer",
    bio: "Handles server-side logic, databases and API integrations to power the websites we build.",
    skills: ["Node.js", "Express", "MongoDB", "Python"],
    linkedin: null,
    github: null,
    photo: null,
  },
  {
    id: "TEAM_MEMBER_04",
    name: "TEAM_MEMBER_04",
    role: "UI/UX Designer",
    bio: "Shapes the visual identity, layout and user experience of every project we take on.",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    linkedin: null,
    github: null,
    photo: null,
  },
  {
    id: "TEAM_MEMBER_05",
    name: "TEAM_MEMBER_05",
    role: "Marketing & Client Relations",
    bio: "Manages client onboarding, outreach and helps bridge communication between clients and the team.",
    skills: ["Client Relations", "Social Media", "Content Strategy", "SEO Basics"],
    linkedin: null,
    github: null,
    photo: null,
  },
];

// ─── TECHNOLOGIES ────────────────────────────────────────────
// Remove or add technologies based on what the team actually uses.
export const TECHNOLOGIES = [
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "Python", category: "Backend" },
  { name: "Django", category: "Backend" },
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "Figma", category: "Design" },
];



// ─── PROCESS STEPS ───────────────────────────────────────────
export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discover",
    description: "We understand your business, goals, audience and requirements.",
  },
  {
    number: "02",
    title: "Design",
    description: "We create the structure and visual direction for the website.",
  },
  {
    number: "03",
    title: "Develop",
    description: "We turn the approved design into a responsive working website.",
  },
  {
    number: "04",
    title: "Review",
    description: "You review the website and provide feedback.",
  },
  {
    number: "05",
    title: "Deploy",
    description: "We prepare and launch the website.",
  },
  {
    number: "06",
    title: "Support",
    description: "We remain available for updates, fixes and improvements.",
  },
];

// ─── WHY GENWEBZY ────────────────────────────────────────────
export const WHY_US = [
  {
    title: "Direct Communication",
    description:
      "You communicate directly with the team working on your project.",
  },
  {
    title: "Custom Approach",
    description:
      "We build around your requirements instead of forcing your business into a generic template.",
  },
  {
    title: "Responsive Design",
    description:
      "Your website is designed to work across mobile, tablet and desktop devices.",
  },
  {
    title: "Transparent Pricing",
    description:
      "Project scope, pricing and deliverables are discussed before development begins.",
  },
  {
    title: "Practical Solutions",
    description:
      "We focus on features that actually help your business instead of unnecessary complexity.",
  },
  {
    title: "Post-Launch Support",
    description:
      "We can continue helping with updates, fixes and improvements after launch.",
  },
];


