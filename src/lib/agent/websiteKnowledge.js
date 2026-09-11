/**
 * Developer-trained website knowledge for SSS Photography Studio chatbot.
 * Keep this in sync with real Next.js routes and homepage sections.
 */

export const WEBSITE_MAP = {
  studio: {
    name: "SSS Photography Studio",
    nameTa: "SSS போட்டோகிராபி ஸ்டுடியோ",
    phone: "+91 98659 92379",
    whatsapp: "https://wa.me/919865992379",
    address: "7th Street, Prasanna Colony, Avaniyapuram, Madurai",
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
      name: "AI Visualizer",
      purpose: "Upload a photo and get outfit recommendations and color palette suggestions for wedding, portrait, birthday, or corporate shoots.",
      keywords: ["visualizer", "ai stylist", "style", "outfit", "color", "palette", "styling"],
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
      "How to book a shoot:\n1) Open /book or Home → “Book a Consultation”\n2) Choose event type (wedding / maternity / birthday / etc.)\n3) Share preferred date + city/venue\n4) Or WhatsApp +91 98659 92379 for instant help\n5) Studio confirms package, advance & shoot plan",
    buyFrame:
      "How to order a photo frame:\n1) Open /store OR Home → Photo Frame Price List (#frames)\n2) Pick size (e.g. 12x18, 16x20) — preview tilts in 3D on Home\n3) Tap Order → upload your photo (optional custom crop)\n4) Add to cart → apply promo code if you have one\n5) Checkout: Cash pickup at studio OR UPI home delivery\n6) Track anytime on /track with Order ID or mobile number",
    trackOrder:
      "How to track an order:\n1) Open /track\n2) Enter Order ID (SSS-...) OR your registered mobile number\n3) Or paste the ID/phone here in chat — I will look it up live",
    seePackages:
      "How to see & choose packages:\n1) Open /packages for live CMS prices (wedding, pre-wedding, maternity, baby/birthday)\n2) Compare features & price\n3) Book via /book or WhatsApp +91 98659 92379\nAsk me “list packages” anytime for the full live list.",
    seePortfolio:
      "How to browse photos & films:\n1) Home → Portfolio (wedding album flipbook + films)\n2) Full public gallery: /gallery (weddings, pre-wedding, baby, maternity, birthday, events)\n3) Ask me “recent shoots” or “wedding samples” for curated recent work cards\n4) Private proofing (after your shoot): /client-gallery/[slug] + passcode from studio",
    usePromo:
      "Promo codes: created in Admin → Promos. Enter the same code in /store cart before checkout.",
    useVisualizer:
      "AI Visualizer (/visualizer): upload a photo → choose shoot type & style → get outfit + color palette ideas.",
    buyGift:
      "Personalized gifts on /store (Magic Mug, Crystal Cube, Moon Lamp, Puzzle, keychains, etc.): add to cart → checkout like frames.",
    passport:
      "Passport / stamp photos on /store: 8 Passport ₹100 | 8 Passport + 8 Stamp ₹150 | 16 Stamp ₹100. Order online or visit studio.",
  },
};

/** Format live packages for chat replies (full list). */
export function formatPackagesCatalog(packages = [], lang = "en") {
  if (!packages.length) {
    return lang === "tanglish"
      ? "Packages load aagala — /packages page open pannunga."
      : lang === "ta"
      ? "பேக்கேஜ் பட்டியல் கிடைக்கவில்லை — /packages பாருங்கள்."
      : "No live packages loaded — open /packages.";
  }
  const lines = packages.map((p, i) => {
    const feats = Array.isArray(p.features)
      ? p.features.slice(0, 4).join(" · ")
      : typeof p.features === "string"
      ? p.features.split(",").slice(0, 4).map((f) => f.trim()).filter(Boolean).join(" · ")
      : "";
    const badge = p.popular ? (lang === "ta" ? " ★ பிரபலம்" : lang === "tanglish" ? " ★ Popular" : " ★ Popular") : "";
    const body = feats ? `\n   ${feats}` : "";
    return `${i + 1}. ${p.name} — ${p.price}${badge}${body}`;
  });
  return lines.join("\n");
}

/** Format live frames for chat replies (full list). */
export function formatFramesCatalog(frames = [], lang = "en") {
  if (!frames.length) {
    return lang === "tanglish"
      ? "Frames load aagala — /store illana Home #frames paaru."
      : lang === "ta"
      ? "பிரேம் பட்டியல் கிடைக்கவில்லை — /store அல்லது Home #frames."
      : "No live frames loaded — open /store or Home #frames.";
  }
  const lines = frames.map((f, i) => {
    const size = f.size || `${f.width}x${f.height}`;
    const price = f.price || f.priceFormatted || (f.numericPrice != null ? `₹${f.numericPrice}` : "");
    const tag = f.tag ? ` [${f.tag}]` : f.popular ? " [Popular]" : "";
    const best = f.bestFor ? ` — ${f.bestFor}` : "";
    return `${i + 1}. ${size}"${tag} · ${price}${best}`;
  });
  return lines.join("\n");
}

export function orderGuideBlock(lang = "en", kind = "frame") {
  if (kind === "package" || kind === "book") {
    if (lang === "tanglish") {
      return `\n\n📌 Epdi book pannuvathu:\n• /book open pannunga (or Home → Book a Consultation)\n• Event type + date share pannunga\n• WhatsApp: ${WEBSITE_MAP.studio.phone}\n• Full packages page: /packages`;
    }
    if (lang === "ta") {
      return `\n\n📌 முன்பதிவு எப்படி:\n• /book அல்லது Home → Book a Consultation\n• நிகழ்வு வகை + தேதி அனுப்புங்கள்\n• WhatsApp: ${WEBSITE_MAP.studio.phone}\n• பேக்கேஜ்கள்: /packages`;
    }
    return `\n\n📌 How to book:\n• Open /book or Home → Book a Consultation\n• Share event type + preferred date\n• WhatsApp: ${WEBSITE_MAP.studio.phone}\n• Compare live packages on /packages`;
  }
  if (lang === "tanglish") {
    return `\n\n📌 Epdi order pannuvathu:\n1) /store illana Home #frames\n2) Size choose → Order → photo upload\n3) Cart-la promo (optional)\n4) Cash studio pickup / UPI home delivery\n5) Track: /track (Order ID or mobile)\nWhatsApp help: ${WEBSITE_MAP.studio.phone}`;
  }
  if (lang === "ta") {
    return `\n\n📌 ஆர்டர் எப்படி:\n1) /store அல்லது Home #frames\n2) அளவு தேர்வு → Order → போட்டோ அப்லோடு\n3) கார்ட்டில் ப்ரோமோ (விருப்பம்)\n4) ஸ்டுடியோ Cash / UPI ஹோம் டெலிவரி\n5) டிராக்: /track\nWhatsApp: ${WEBSITE_MAP.studio.phone}`;
  }
  return `\n\n📌 How to order:\n1) Open /store or Home → #frames\n2) Choose size → Order → upload photo\n3) Optional promo in cart\n4) Pay: Cash at studio or UPI home delivery\n5) Track on /track with Order ID or mobile\nWhatsApp: ${WEBSITE_MAP.studio.phone}`;
}

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
