/**
 * Developer-trained website knowledge for SSS Photography Studio chatbot.
 * Keep this in sync with real Next.js routes and homepage sections.
 */

export const WEBSITE_MAP = {
  studio: {
    name: "SSS Photography Studio",
    nameTa: "SSS போட்டோகிராபி ஸ்டுடியோ",
    phone: "+91 63835 65425",
    whatsapp: "https://wa.me/916383565425",
    address: "34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012",
    hours: "Monday–Sunday, 9:00 AM – 8:00 PM",
  },
  routes: [
    {
      path: "/",
      name: "Home",
      purpose:
        "Main landing page: cinematic hero, studio guarantees, services overview, color grading before/after, portfolio (wedding album flipbook + films), photo frame pricing with 3D tilt preview, about, testimonials, studio contact/booking.",
      keywords: ["home", "homepage", "landing", "main page", "முகப்பு"],
    },
    {
      path: "/packages",
      name: "Packages & Pricing",
      purpose:
        "Live photography packages from admin CMS (weddings, pre-wedding, maternity, baby/birthday). Prices update when admin edits packages.",
      keywords: ["package", "packages", "pricing", "rate", "quote", "wedding package", "பேக்கேஜ்", "விலை"],
    },
    {
      path: "/store",
      name: "Store",
      purpose:
        "Online store for photo frames, personalized gifts, passport photos. Cart checkout with cash pickup or UPI home delivery. Promo codes from admin apply at checkout.",
      keywords: ["store", "shop", "buy", "gift", "passport", "frame order", "cart", "ஸ்டோர்"],
    },
    {
      path: "/gallery",
      name: "Gallery / Portfolio",
      purpose:
        "Public photo gallery fed by admin uploads (Weddings, Pre-Wedding, Baby, Maternity, Birthday, School & College Events). Featured photos also appear on homepage portfolio.",
      keywords: ["gallery", "portfolio", "photos", "samples", "work", "கேலரி"],
    },
    {
      path: "/book",
      name: "Book a Shoot",
      purpose:
        "Booking / consultation flow for wedding and event photography. Clients can also open booking modal from homepage CTAs.",
      keywords: ["book", "booking", "appointment", "consultation", "முன்பதிவு"],
    },
    {
      path: "/track",
      name: "Track Order",
      purpose:
        "Live order tracking with Order ID (SSS-...) or registered mobile number for prints, frames, and gifts.",
      keywords: ["track", "tracking", "order status", "where is my order", "டிராக்"],
    },
    {
      path: "/services",
      name: "Services",
      purpose: "Photography and visual services overview (weddings, events, portraits, frames).",
      keywords: ["service", "services", "சேவை"],
    },
    {
      path: "/about",
      name: "About",
      purpose: "Studio heritage, craftsmanship, and Avaniyapuram Madurai story.",
      keywords: ["about", "who", "studio story", "பற்றி"],
    },
    {
      path: "/contact",
      name: "Contact",
      purpose: "Studio address, phone/WhatsApp, and enquiry options.",
      keywords: ["contact", "phone", "whatsapp", "call", "தொடர்பு"],
    },
    {
      path: "/visualizer",
      name: "AI Visualizer / Moodboard", 
      purpose: "Advanced AI-powered mood board creation with outfit recommendations, color palette analysis, cultural styling guidance, and location matching based on uploaded photos and preferences. Includes traditional Tamil heritage concepts and modern editorial styling.",
      keywords: ["visualizer", "moodboard", "ai stylist", "style", "outfit", "color", "palette", "styling", "cultural", "tamil", "traditional", "modern", "heritage"],
    },
    {
      path: "/client-gallery/[slug]",
      name: "Private Client Proofing Gallery",
      purpose:
        "Password-protected private gallery where clients select photos for album/print. Created by admin under Client Galleries.",
      keywords: ["client gallery", "proofing", "select photos", "passcode", "private gallery"],
    },
    {
      path: "/login",
      name: "Customer Login",
      purpose: "Customer account login for profile and order history.",
      keywords: ["login", "sign in", "account", "profile"],
    },
    {
      path: "/support",
      name: "Support",
      purpose: "Customer support help for orders and studio questions.",
      keywords: ["support", "help", "complaint"],
    },
  ],
  homepageSections: [
    { id: "hero", name: "Hero", about: "Brand hero with cinematic depth photo and Book / Explore Portfolio CTAs." },
    { id: "guarantees", name: "Guarantees", about: "1-Month Album Delivery Guarantee and quality promises." },
    { id: "services", name: "Services", about: "Wedding, portrait, event, and frame services cards." },
    { id: "color-grading", name: "Color Grading Comparison", about: "Interactive before/after color grading slider." },
    { id: "portfolio", name: "Portfolio", about: "Wedding album flipbook, cinematic films, maternity, birthday stories. Featured admin gallery photos merge here." },
    { id: "frames", name: "Photo Frame Price List", about: "Live 3D tilt frame preview + size/price table. Prices from admin Frames CMS." },
    { id: "about", name: "About", about: "Studio heritage and craftsmanship." },
    { id: "testimonials", name: "Testimonials", about: "Approved client reviews from admin Reviews CMS (plus defaults if none)." },
    { id: "studio-info", name: "Studio Info / Contact", about: "Location, booking CTA, contact details." },
  ],
  howTos: {
    bookShoot:
      "Open Home → tap Book a Consultation, or visit /book. Share event type, date, and requirements. You can also WhatsApp +91 63835 65425.",
    buyFrame:
      "Open /store or homepage #frames section → choose size → Order → upload custom photo if needed → checkout with promo code optional → pay Cash at studio or UPI home delivery.",
    trackOrder:
      "Open /track → enter Order ID (SSS-...) or your mobile number. Chatbot can also track if you paste the ID or phone here.",
    seePackages:
      "Open /packages for live CMS prices. Admin updates appear on this page immediately after refresh.",
    seePortfolio:
      "Open homepage Portfolio or /gallery. Wedding album opens as a hardcover flipbook. Featured photos are starred in Admin → Gallery.",
    usePromo:
      "Admin creates promo in /admin/promos. Customer enters the same code in Store cart before checkout.",
    useMoodboardAI:
      "Visit /visualizer → Upload your photo or try demo → Select shoot type & style preference → Get AI-generated mood board with color palettes, outfit recommendations, cultural styling elements, and location suggestions. The MoodBoard AI analyzes your photo's dominant colors and provides expert styling advice tailored to Tamil cultural authenticity and modern aesthetics.",
  },
};

export function findRouteForQuery(lowerText) {
  for (const route of WEBSITE_MAP.routes) {
    if (route.keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
      return route;
    }
  }
  return null;
}

export function buildWebsiteGuideReply({ lang = "en", route = null, packagesText = "", framesText = "" }) {
  const studio = WEBSITE_MAP.studio;
  if (route) {
    if (lang === "ta") {
      return `**${route.name}** (${route.path})\n${route.purpose}\n\nஸ்டுடியோ: ${studio.address}\nWhatsApp: ${studio.phone}`;
    }
    if (lang === "tanglish") {
      return `**${route.name}** page path: ${route.path}\n${route.purpose}\n\nStudio: ${studio.address}. WhatsApp: ${studio.phone}`;
    }
    return `**${route.name}** → \`${route.path}\`\n${route.purpose}\n\nStudio: ${studio.address}\nWhatsApp: ${studio.phone}`;
  }

  const routesList = WEBSITE_MAP.routes
    .filter((r) => !r.path.includes("["))
    .map((r) => `• ${r.name}: ${r.path}`)
    .join("\n");

  if (lang === "ta") {
    return `SSS ஸ்டுடியோ இணையதள வழிகாட்டி:\n${routesList}\n\n${packagesText ? `நேரடி பேக்கேஜ்கள்:\n${packagesText}\n\n` : ""}${framesText ? `நேரடி பிரேம்கள்:\n${framesText}\n\n` : ""}எந்தப் பக்கம் வேண்டும் என்று கேளுங்கள் — நான் விரிவாகச் சொல்கிறேன்.`;
  }
  if (lang === "tanglish") {
    return `SSS Website map bro:\n${routesList}\n\n${packagesText ? `Live packages:\n${packagesText}\n\n` : ""}${framesText ? `Live frames:\n${framesText}\n\n` : ""}Ethu page pathi detail venum nu kelunga — naan explain panren.`;
  }
  return `SSS Photography Studio — website map (developer guide):\n${routesList}\n\n${packagesText ? `Live packages:\n${packagesText}\n\n` : ""}${framesText ? `Live frames:\n${framesText}\n\n` : ""}Ask about any page and I’ll explain exactly how it works and how to use it.`;
}

export function detectLangMode(analysis) {
  if (analysis.isTamilScript) return "ta";
  if (analysis.isTanglish) return "tanglish";
  return "en";
}
