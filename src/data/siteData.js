// ============================================================
// GENWEBZY — SITE DATA
// Edit this file to update content across the entire website.
// ============================================================

// ─── CONTACT DETAILS ────────────────────────────────────────
export const CONTACT = {
  email: "GENWEBZY_EMAIL",            // Replace with actual email
  whatsapp: "WHATSAPP_NUMBER",        // Replace with actual WhatsApp number (digits only, with country code)
  whatsappLink: "https://wa.me/WHATSAPP_NUMBER", // Replace WHATSAPP_NUMBER with actual number
  instagram: "INSTAGRAM_URL",         // Replace with full Instagram profile URL
  linkedin: "LINKEDIN_URL",           // Replace with full LinkedIn page URL
  github: "GITHUB_URL",               // Replace with full GitHub profile URL
};

// ─── SERVICES ───────────────────────────────────────────────
export const SERVICES = [
  {
    id: "01",
    title: "Business Websites",
    description:
      "Professional websites for small businesses and growing companies.",
    extras: ["Domain & Hosting Setup", "Contact Forms", "Google Maps Integration", "Basic SEO"],
  },
  {
    id: "02",
    title: "Portfolio Websites",
    description:
      "Personal and professional portfolio websites for individuals, developers, designers, photographers and creators.",
    extras: ["Custom Design", "Responsive Layout", "Project Showcase"],
  },
  {
    id: "03",
    title: "Landing Pages",
    description:
      "Focused landing pages for products, services, campaigns and promotions.",
    extras: ["Conversion-focused Design", "WhatsApp Integration", "Fast Loading"],
  },
  {
    id: "04",
    title: "E-Commerce Websites",
    description:
      "Online stores with product listings, shopping functionality and required integrations.",
    extras: ["Payment Integration", "Product Management", "Database Integration"],
  },
  {
    id: "05",
    title: "Custom Web Development",
    description:
      "Websites and web applications built according to specific business requirements.",
    extras: ["Custom Features", "API Integrations", "Backend Development"],
  },
  {
    id: "06",
    title: "Website Maintenance",
    description:
      "Updates, improvements, bug fixes and ongoing website support.",
    extras: ["Regular Updates", "Bug Fixes", "Performance Monitoring"],
  },
];

// ─── PROJECTS (SELECTED WORK) ────────────────────────────────
// Replace placeholder images and URLs with actual project details.
export const PROJECTS = [
  {
    id: 1,
    title: "Photography Studio",
    category: "Business Website",
    description:
      "A clean and visual-first website for a local photography studio, designed to showcase portfolios and drive booking enquiries.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: null,           // Replace with: "/projects/photography-studio.jpg"
    projectUrl: null,      // Replace with: "https://actual-project-url.com"
    isConcept: true,       // Set to false when it's an actual client project
  },
  {
    id: 2,
    title: "Restaurant Website",
    category: "Business Website",
    description:
      "A warm, inviting website for a restaurant featuring the menu, opening hours, location and an online reservation form.",
    technologies: ["React", "CSS"],
    image: null,
    projectUrl: null,
    isConcept: true,
  },
  {
    id: 3,
    title: "Personal Portfolio",
    category: "Portfolio",
    description:
      "A minimal personal portfolio for a frontend developer showcasing projects, skills and a contact form.",
    technologies: ["React", "CSS"],
    image: null,
    projectUrl: null,
    isConcept: true,
  },
  {
    id: 4,
    title: "Local Business Website",
    category: "Business Website",
    description:
      "A professional five-page website for a local service business with service listings, about page and an enquiry form.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: null,
    projectUrl: null,
    isConcept: true,
  },
];

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

// ─── PRICING ─────────────────────────────────────────────────
// Replace ₹X,XXX with actual starting prices when decided.
export const PRICING = [
  {
    id: 1,
    name: "Starter Website",
    audience: "For individuals and small businesses.",
    price: "₹X,XXX",              // Replace with actual starting price
    priceNote: "Starting from",
    features: [
      "Up to 5 pages",
      "Responsive design",
      "Contact form",
      "Basic SEO setup",
      "Domain & hosting guidance",
    ],
    cta: "Get a Quote",
    highlighted: false,
  },
  {
    id: 2,
    name: "Business Website",
    audience: "For businesses requiring a complete online presence.",
    price: "₹X,XXX",
    priceNote: "Starting from",
    features: [
      "Up to 10 pages",
      "Custom design",
      "Contact & enquiry forms",
      "Google Maps integration",
      "WhatsApp integration",
      "Basic SEO setup",
    ],
    cta: "Get a Quote",
    highlighted: true,
  },
  {
    id: 3,
    name: "Custom Website",
    audience: "For e-commerce, dashboards and custom requirements.",
    price: "Let's Discuss",
    priceNote: "",
    features: [
      "Custom pages & features",
      "E-commerce functionality",
      "Payment integration",
      "Database integration",
      "Ongoing support available",
    ],
    cta: "Start a Conversation",
    highlighted: false,
  },
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

// ─── FAQ ─────────────────────────────────────────────────────
export const FAQ = [
  {
    question: "How long does a website take?",
    answer:
      "Timeline depends on the number of pages, features and revision requirements. We discuss and agree on a timeline before development begins.",
  },
  {
    question: "Do you provide domain and hosting?",
    answer:
      "Yes. If required, GenWebZy can help with domain and hosting setup as part of the project.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes. Existing websites can be redesigned and modernized based on the requirement.",
  },
  {
    question: "Will my website work on mobile?",
    answer:
      "Yes. Websites are designed responsively to work on mobile, tablet and desktop devices.",
  },
  {
    question: "Can I request changes?",
    answer:
      "Yes. Revision limits and requirements are discussed before the project begins.",
  },
  {
    question: "Do you provide support after launch?",
    answer:
      "Yes. Maintenance and support can be discussed depending on the project.",
  },
  {
    question: "How does payment work?",
    answer:
      "Payment terms are clearly mentioned in the project quotation before development begins.",
  },
];
