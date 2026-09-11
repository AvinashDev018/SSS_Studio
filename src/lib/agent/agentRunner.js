import OpenAI from "openai";
import { AGENT_TOOLS, executeAgentTool } from "./tools.js";
import {
  WEBSITE_MAP,
  findRouteForQuery,
  buildWebsiteGuideReply,
  detectLangMode,
  formatPackagesCatalog,
  formatFramesCatalog,
  orderGuideBlock,
} from "./websiteKnowledge.js";

const SYSTEM_PROMPT = `You are the Official AI Studio Concierge AND product guide for the SSS Photography Studio website (built for Avaniyapuram, Madurai).

You think like the developer who built this site: you know every public route, homepage section, checkout flow, and what is driven by the Admin CMS vs hardcoded.

=========================
1. LANGUAGE RULE (MANDATORY)
=========================
• Tamil script → answer in elegant Tamil script
• Tanglish → answer in friendly Tanglish
• English → answer in clear professional English
Never mix languages unless the customer mixes first.

=========================
2. STUDIO FACTS
=========================
• Name: SSS Photography Studio
• Address: 7th Street, Prasanna Colony, Avaniyapuram, Madurai
• Hours: Mon–Sun, 9:00 AM – 8:00 PM
• Phone / WhatsApp: +91 98659 92379
• Gear: Sony FX3 & A7IV, drone, cinematic lighting

=========================
3. WEBSITE MAP (ALWAYS USE THESE PATHS)
=========================
• / → Home (hero depth photo, guarantees, services, color grading slider, portfolio + wedding album flipbook, 3D frame pricing, about, testimonials, contact)
• /packages → Live photography packages from Admin CMS
• /store → Frames, gifts, passport photos + cart + promo codes
• /gallery → Public gallery from Admin uploads
• /book → Book consultation / shoot
• /track → Track order by Order ID or phone
• /services → Services overview
• /about → Studio story
• /contact → Contact details
• /visualizer → AI outfit / style visualizer
• /client-gallery/[slug] → Private proofing gallery (passcode)
• /login → Customer login / profile
• /support → Support

Admin CMS controls: Packages, Gallery photos (+ Featured on Home), Frames prices, Promos, Testimonials approval, Orders/CRM, Client galleries, Wedding album PDF.

=========================
4. LIVE DATA RULE
=========================
For ANY catalog / price / sample question, ALWAYS call tools (never invent):
• \`query_packages\` → list ALL live packages with prices & features
• \`query_frames\` → list ALL frame sizes/prices (plus top recommendations)
• \`fetch_recent_shoots\` → recent portfolio photos/videos samples
• \`explain_website\` → how a page works
• \`track_order\` → Order ID / phone lookup
• \`calculate_package_quote\` → itemized estimate when they ask for quote

=========================
5. GUARANTEES
=========================
• 1-Month Album Delivery Guarantee (or ₹1,000 credit)
• Free Pre-Wedding perk on complete wedding packages
• Signature South Indian color grading
• Transit damage reprint guarantee on frames/gifts

=========================
6. HOW-TO (ALWAYS TEACH THE NEXT STEP)
=========================
When listing products, ALWAYS end with a clear order/book guide:
• Frames → /store or Home #frames → size → Order → upload photo → cart → Cash / UPI → /track
• Packages → show full list → /book or WhatsApp +91 98659 92379 to confirm date
• Portfolio → Home Portfolio flipbook + /gallery; private proofing /client-gallery/[slug]
• Gifts / passport → /store checkout
• Track → /track or paste ID/phone here

=========================
7. OUT OF SCOPE
=========================
Politely refuse coding/politics/general trivia and redirect to SSS photography / website help.

=========================
8. ANSWER STYLE (DETAILED — MANDATORY)
=========================
NEVER give one-line answers when catalog data exists.
Structure every product reply like this:
1) Short friendly intro
2) FULL numbered list (all packages OR all frames — not 2–3 items)
3) Include size/price (and best-for / popular tags when available)
4) Finishes / what’s included when relevant
5) Step-by-step “How to order / book” (paths + buttons)
6) Offer WhatsApp +91 98659 92379 and ask one clarifying question (room size, event date, budget)

If the user seems unsure (“epdi order”, “enna irukku”, “list”, “show all”), be EXTRA thorough.
Use line breaks so lists are easy to read. Be confident, warm, and specific.`;

async function getLiveCatalogSnippets() {
  try {
    const [pkgsRes, framesRes] = await Promise.all([
      executeAgentTool("query_packages", {}),
      executeAgentTool("query_frames", { max_budget: 999999 }),
    ]);

    let allFrames = framesRes?.allFrames || [];
    try {
      const { getFrames } = await import("@/app/actions/frames");
      const fetched = await getFrames({ admin: false });
      if (fetched?.length) {
        allFrames = fetched.map((f) => ({
          id: f.id,
          size: f.size || `${f.width}x${f.height}`,
          width: f.width,
          height: f.height,
          price: f.price,
          priceFormatted: f.price,
          numericPrice: f.numericPrice,
          bestFor: f.bestFor,
          tag: f.tag,
          popular: f.popular,
        }));
      }
    } catch (_) {
      /* keep tool frames */
    }

    const packagesList = pkgsRes?.packages || [];
    const packagesText = formatPackagesCatalog(packagesList, "en");
    const framesText = formatFramesCatalog(allFrames, "en");

    return {
      packagesText,
      framesText,
      packages: pkgsRes,
      frames: framesRes,
      packagesList,
      allFrames,
    };
  } catch (e) {
    return {
      packagesText: "",
      framesText: "",
      packages: null,
      frames: null,
      packagesList: [],
      allFrames: [],
    };
  }
}

function analyzeUserMessage(userMsg = "", messages = []) {
  const text = userMsg.trim();
  const lower = text.toLowerCase();

  const isTamilScript = /[\u0B80-\u0BFF]/.test(text);
  const requestsTanglish = /tamil\s*(la|lo|le)\s*(pesu|explain|sollu|solunga|tell|chat)/i.test(lower) || /tanglish/i.test(lower);
  const requestsTamilScript = /pure\s*tamil/i.test(lower) || /tamil\s*script/i.test(lower) || /தமிழ்\s*(இல்|ல)/.test(text);
  const requestsEnglish = /english\s*(la|le|in|only)?\s*(pesu|speak|explain|tell|sollu)?/i.test(lower) && !requestsTanglish;

  const cleanDigits = text.replace(/[\s\-\+\(\)]/g, "");
  const isPhoneNumberOrOrderId = /^\d{5,15}$/.test(cleanDigits) || /^(sss|shoot|ord)-?\d{3,10}$/i.test(text);

  let isPreviousTanglish = false;
  let isPreviousTamilScript = false;
  if (Array.isArray(messages) && messages.length > 0) {
    for (const msg of messages) {
      if (msg.role === "user") {
        if (/[\u0B80-\u0BFF]/.test(msg.content)) isPreviousTamilScript = true;
        if (/pathi|sollu|solunga|panna|epdi|aprm|bro|enga|irukku|panradhu|pakuradhu/i.test(msg.content)) {
          isPreviousTanglish = true;
        }
      }
    }
  }

  const tanglishTokens = [
    "pathi", "sollu", "solunga", "solu", "solm", "enna", "eppadi", "epdi", "enga", "engae", "varum",
    "vandhu", "irukku", "irukaa", "iruka", "bro", "sis", "ji", "panra", "panradhu", "panla", "panren",
    "panna", "pannu", "pannalam", "kudunga", "kudu", "tharanum", "thara", "teriyuma", "theriyum", "romba",
    "nalla", "paka", "paaka", "paarkanum", "pakuradhu", "pakradhu", "pakurathu", "paakuradhu", "aprm", "apram",
    "kitta", "velai", "sonninga", "pottu", "namba", "unga", "vanakkam", "solanum", "mudiyuma", "mudiyaadhu",
    "kaelu", "vanganum", "vaanga", "evvalavu", "kuduka", "aana", "aachu", "solanga", "paakkanum", "aama",
    "illa", "rate", "kaasu", "vilai", "yaaru", "kalyanam", "seemantham", "valaikappu", "venum", "vendaam",
    "dhaan", "thaan", "la", "le", "kulla", "oda", "nalladhaa", "tharuvingala", "tharrom", "solatuma",
    "edhu", "ethu", "vango", "vangalam", "edukalam", "varuma", "kedaikuma", "kidaikuma", "parunga", "pesu",
  ];

  const hasTanglishWord = tanglishTokens.some((tok) => new RegExp(`(?:^|\\s|\\b)${tok}(?:$|\\s|\\b)`, "i").test(lower));
  const isTanglish = !requestsEnglish && (requestsTanglish || (!isTamilScript && (hasTanglishWord || (isPhoneNumberOrOrderId && isPreviousTanglish))));
  const effectiveTamilScript = !requestsEnglish && !requestsTanglish && (requestsTamilScript || isTamilScript || (isPhoneNumberOrOrderId && isPreviousTamilScript));

  const studioKeywords = [
    "frame", "photo", "wedding", "shoot", "package", "price", "cost", "location", "address",
    "madurai", "avaniyapuram", "album", "delivery", "track", "order", "maternity", "baby",
    "birthday", "gift", "crystal", "mug", "lamp", "deposit", "raw", "camera", "contact",
    "phone", "whatsapp", "guarantee", "muhurtham", "candid", "drone", "studio", "booking",
    "book", "rate", "vilai", "kaasu", "pathi", "sollu", "passport", "puzzle", "keychain",
    "status", "explain", "page", "website", "site", "home", "homepage", "card", "details",
    "recent", "sample", "gallery", "portfolio", "ballroom", "wall", "store", "shop", "cart",
    "checkout", "promo", "coupon", "voucher", "discount", "login", "profile", "visualizer",
    "services", "about", "support", "how to", "howto", "where", "open", "menu",
    "navbar", "section", "flipbook", "pdf", "featured", "cms", "admin",
    "பிரேம்", "போட்டோ", "திருமணம்", "விலை", "ஸ்டுடியோ", "மதுரை", "அவனியாபுரம்", "ஆல்பம்",
    "பரிசு", "முகப்பு", "பேக்கேஜ்", "ஸ்டோர்", "கேலரி", "முன்பதிவு",
  ];
  const isStudioRelated = isPhoneNumberOrOrderId || studioKeywords.some((kw) => lower.includes(kw));

  const outOfScopeTokens = [
    "python", "java", "code", "coding", "script", "html", "css", "react", "bug", "recipe",
    "biryani", "modi", "cricket", "football", "president", "prime minister",
    "homework", "math", "solve", "calculator", "who is", "joke", "stock", "crypto", "news",
  ];
  // "react" alone shouldn't block website questions about "reaction" etc - keep as is
  const isExplicitOutOfScope = outOfScopeTokens.some((tok) => lower.includes(tok));

  return {
    isTamilScript: effectiveTamilScript,
    isTanglish,
    isStudioRelated,
    isPhoneNumberOrOrderId,
    isOutOfScope: isExplicitOutOfScope || (!isStudioRelated && text.length > 3 && !["hi", "hello", "hey", "vanakkam", "வணக்கம்", "hi!", "hello!"].includes(lower)),
  };
}

/** Deterministic website Q&A — runs before LLM for perfect site answers */
async function answerWebsiteIntent(lastUserMsg, analysis, catalog) {
  const lower = lastUserMsg.toLowerCase();
  const lang = detectLangMode(analysis);
  const route = findRouteForQuery(lower);

  const wantsWebsiteGuide =
    lower.includes("website") ||
    lower.includes("site map") ||
    lower.includes("what pages") ||
    lower.includes("which page") ||
    lower.includes("how does this site") ||
    lower.includes("explain the site") ||
    lower.includes("enna pages") ||
    lower.includes("site-la enna") ||
    (lower.includes("explain") && (lower.includes("page") || lower.includes("website") || lower.includes("home")));

  if (wantsWebsiteGuide || (lower.includes("explain") && route)) {
    const guide = buildWebsiteGuideReply({
      lang,
      route: wantsWebsiteGuide && !route ? null : route,
      packagesText: catalog.packagesText,
      framesText: catalog.framesText,
    });
    const toolRes = await executeAgentTool("explain_website", { topic: route?.name || "website" });
    return { reply: guide, actionCards: [toolRes] };
  }

  if (lower.includes("promo") || lower.includes("coupon") || lower.includes("voucher") || lower.includes("discount code")) {
    const howto = WEBSITE_MAP.howTos.usePromo;
    return {
      reply:
        lang === "ta"
          ? `ப்ரோமோ கோடுகள் Admin → Promos-ல் உருவாக்கப்படும். வாடிக்கையாளர் /store கார்ட்டில் அதே கோட்டை உள்ளிட வேண்டும்.\n${howto}`
          : lang === "tanglish"
          ? `Promo codes Admin → Promos-la create aagum. Customer /store cart-la same code enter pannanum.\n${howto}`
          : `Promo codes are created in Admin → Promos and redeemed in the Store cart at checkout.\n${howto}`,
      actionCards: [],
    };
  }

  if (lower.includes("how to book") || lower.includes("eppadi book") || (lower.includes("book") && (lower.includes("how") || lower.includes("epdi") || lower.includes("பதிவு")))) {
    return {
      reply:
        lang === "ta"
          ? WEBSITE_MAP.howTos.bookShoot
          : lang === "tanglish"
          ? `Shoot book panna: Home-la "Book a Consultation" click pannunga, illana /book open pannunga, illana WhatsApp ${WEBSITE_MAP.studio.phone}.`
          : WEBSITE_MAP.howTos.bookShoot,
      actionCards: [],
    };
  }

  if (lower.includes("how to order") || lower.includes("how to buy") || lower.includes("epdi order") || lower.includes("eppadi order") || (lower.includes("frame") && (lower.includes("how") || lower.includes("epdi") || lower.includes("order")))) {
    const framesList = formatFramesCatalog(catalog.allFrames || [], lang);
    return {
      reply:
        (lang === "tanglish"
          ? `Frame order guide ready bro!\n\n🖼 Full frame list:\n${framesList}\n`
          : lang === "ta"
          ? `பிரேம் ஆர்டர் வழிகாட்டி:\n\n🖼 முழு பிரேம் பட்டியல்:\n${framesList}\n`
          : `Here’s exactly how to order a frame.\n\n🖼 Full frame catalog:\n${framesList}\n`) +
        orderGuideBlock(lang, "frame") +
        `\n\n${WEBSITE_MAP.howTos.buyFrame}`,
      actionCards: [catalog.frames || (await executeAgentTool("query_frames", { max_budget: 999999 }))].filter(Boolean),
    };
  }

  // Full frames catalog + order guide
  if (
    lower.includes("frame") ||
    lower.includes("frames") ||
    lower.includes("பிரேம்") ||
    lower.includes("wall size") ||
    (lower.includes("size") && (lower.includes("photo") || lower.includes("inch")))
  ) {
    const framesList = formatFramesCatalog(catalog.allFrames || [], lang);
    const toolRes = catalog.frames || (await executeAgentTool("query_frames", { max_budget: 999999, wall_space: lower }));
    const intro =
      lang === "tanglish"
        ? `SSS Studio-la live custom photo frames (${(catalog.allFrames || []).length || "many"} sizes). Full list:`
        : lang === "ta"
        ? `SSS ஸ்டுடியோவின் நேரடி கஸ்டம் பிரேம்கள் (${(catalog.allFrames || []).length || "பல"} அளவுகள்):`
        : `Here is our full live custom photo frame catalog (${(catalog.allFrames || []).length || "all"} sizes):`;
    const finishes =
      lang === "tanglish"
        ? `\n\n✨ Finishes: Sparkle Lamination · Matte (anti-glare) · High Gloss`
        : lang === "ta"
        ? `\n\n✨ பூச்சுகள்: Sparkle Lamination · Matte · High Gloss`
        : `\n\n✨ Finishes available: Sparkle Lamination · Matte (anti-glare) · High Gloss`;
    return {
      reply: `${intro}\n\n${framesList}${finishes}${orderGuideBlock(lang, "frame")}\n\n${
        lang === "tanglish"
          ? "Sofa / bedroom / budget sollunga — best size recommend panren."
          : lang === "ta"
          ? "அறை / பட்ஜெட் சொல்லுங்கள் — சிறந்த அளவைப் பரிந்துரைக்கிறேன்."
          : "Tell me your room (sofa wall / bedroom) or budget — I’ll recommend the best size."
      }`,
      actionCards: [toolRes],
    };
  }

  // Full packages catalog + book guide
  if (
    lower.includes("package") ||
    lower.includes("packages") ||
    lower.includes("பேக்கேஜ்") ||
    lower.includes("pricing") ||
    (lower.includes("price") && !lower.includes("frame")) ||
    lower.includes("rate list") ||
    lower.includes("evvalavu") ||
    lower.includes("விலை")
  ) {
    const pkgs = formatPackagesCatalog(catalog.packagesList || catalog.packages?.packages || [], lang);
    const livePackages = catalog.packages || (await executeAgentTool("query_packages", {}));
    const intro =
      lang === "tanglish"
        ? `Live photography packages (/packages) — full list:`
        : lang === "ta"
        ? `நேரடி போட்டோகிராபி பேக்கேஜ்கள் (/packages):`
        : `Live photography packages from our CMS (/packages) — full list:`;
    return {
      reply: `${intro}\n\n${pkgs}${orderGuideBlock(lang, "package")}\n\n${WEBSITE_MAP.howTos.seePackages}\n\nEvent type (wedding / maternity / birthday) + date sollunga — quote refine panren.`,
      actionCards: [livePackages],
    };
  }

  // Portfolio / recent photos & videos
  if (
    lower.includes("portfolio") ||
    lower.includes("gallery") ||
    lower.includes("sample") ||
    lower.includes("recent") ||
    lower.includes("photos") ||
    lower.includes("videos") ||
    lower.includes("film") ||
    lower.includes("shoots") ||
    lower.includes("கேலரி")
  ) {
    const toolRes = await executeAgentTool("fetch_recent_shoots", {
      category: lower.includes("wedding")
        ? "wedding"
        : lower.includes("pre")
          ? "pre-wedding"
          : lower.includes("maternity") || lower.includes("baby")
            ? "baby-maternity"
            : lower.includes("birthday")
              ? "birthday-events"
              : "all",
    });
    const guide =
      lang === "tanglish"
        ? `Recent shoots cards keezha irukku 👇\n\n${WEBSITE_MAP.howTos.seePortfolio}\n\nWedding album flipbook: Home → Portfolio. Full gallery: /gallery.`
        : lang === "ta"
        ? `சமீபத்திய ஷூட்கள் கீழே 👇\n\n${WEBSITE_MAP.howTos.seePortfolio}`
        : `Recent studio shoots are below 👇\n\n${WEBSITE_MAP.howTos.seePortfolio}`;
    return { reply: guide, actionCards: [toolRes] };
  }

  if (lower.includes("store") || lower.includes("shop") || lower.includes("cart") || lower.includes("checkout")) {
    const framesList = formatFramesCatalog(catalog.allFrames || [], lang);
    const toolRes = await executeAgentTool("explain_website", { topic: "store" });
    return {
      reply:
        (lang === "tanglish"
          ? `Store (/store): frames, gifts, passport photos + cart + promo.\n\n🖼 Frames:\n${framesList}`
          : lang === "ta"
          ? `ஸ்டோர் (/store): பிரேம்கள், பரிசுகள், பாஸ்போர்ட் + கார்ட் + ப்ரோமோ.\n\n🖼 பிரேம்கள்:\n${framesList}`
          : `Store (/store): frames, personalized gifts, passport photos, cart, promos.\n\n🖼 Frames:\n${framesList}`) +
        orderGuideBlock(lang, "frame"),
      actionCards: [toolRes, catalog.frames].filter(Boolean),
    };
  }

  if (lower.includes("visualizer") || lower.includes("ai stylist") || lower.includes("styling") || lower.includes("outfit") || lower.includes("color palette")) {
    return {
      reply:
        lang === "tanglish"
          ? `AI Visualizer detailed guide:\n${WEBSITE_MAP.howTos.useVisualizer}\nPath: /visualizer`
          : lang === "ta"
          ? `AI விஷுவலைசர்:\n${WEBSITE_MAP.howTos.useVisualizer}\nபாதை: /visualizer`
          : `AI Visualizer detailed guide:\n${WEBSITE_MAP.howTos.useVisualizer}\nOpen: /visualizer`,
      actionCards: [],
    };
  }

  if (lower.includes("client gallery") || lower.includes("proofing") || lower.includes("passcode") || lower.includes("select photos")) {
    return {
      reply:
        lang === "tanglish"
          ? `Private client proofing gallery:\n• Admin create pannuvanga after shoot\n• Link: /client-gallery/[slug] + passcode\n• Photos select panni album/print-ku confirm pannalam\nWhatsApp: ${WEBSITE_MAP.studio.phone}`
          : `Private proofing galleries:\n• Created by studio after your shoot\n• Open /client-gallery/[slug] with your passcode\n• Select photos for album / print\nWhatsApp help: ${WEBSITE_MAP.studio.phone}`,
      actionCards: [],
    };
  }

  if (route && (lower.includes("open") || lower.includes("where") || lower.includes("link") || lower.includes("page") || lower.includes("section"))) {
    const guide = buildWebsiteGuideReply({ lang, route, packagesText: catalog.packagesText, framesText: catalog.framesText });
    return { reply: guide, actionCards: [] };
  }

  return null;
}

export async function runStudioAgent({ messages = [], apiKey = null }) {
  const effectiveApiKey = apiKey || process.env.NVIDIA_API_KEY;

  if (!effectiveApiKey) {
    throw new Error("NVIDIA_API_KEY is not configured.");
  }

  const openai = new OpenAI({
    apiKey: effectiveApiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  const lastUserMsg = messages[messages.length - 1]?.content || "";
  const analysis = analyzeUserMessage(lastUserMsg, messages);
  const catalog = await getLiveCatalogSnippets();

  if (analysis.isOutOfScope) {
    if (analysis.isTamilScript) {
      return {
        reply: "மன்னிக்கவும்! நான் SSS போட்டோகிராபி ஸ்டுடியோவின் AI உதவி. இணையதளப் பக்கங்கள், பிரேம்கள், பேக்கேஜ்கள், முன்பதிவு மற்றும் ஆர்டர் டிராக்கிங் பற்றி மட்டுமே உதவ முடியும். என்ன வேண்டும்? 📸",
        actionCards: [],
      };
    }
    if (analysis.isTanglish) {
      return {
        reply: "Sorry bro! Naan SSS Studio website AI. Pages, frames, packages, booking & order tracking pathi thaan help panna mudiyum. Enna venum bro? 📸",
        actionCards: [],
      };
    }
    return {
      reply: "I am SSS Studio’s website AI guide. I can help with our pages, packages, frames store, booking, gallery, and order tracking. What do you need? 📸",
      actionCards: [],
    };
  }

  // Phone / Order ID → track immediately
  if (analysis.isPhoneNumberOrOrderId) {
    const toolResult = await executeAgentTool("track_order", { query: lastUserMsg });
    const statusText = toolResult.stageLabel ? `${toolResult.stageLabel} (${toolResult.stageDesc || ""})` : "Under Processing";
    return {
      reply: analysis.isTanglish
        ? `Unga Order / Mobile (${lastUserMsg}) track aachu bro! Status: ${statusText}. Full page: /track`
        : analysis.isTamilScript
        ? `ஆர்டர் / மொபைல் (${lastUserMsg}) நிலை: ${statusText}. முழு விவரம்: /track`
        : `Tracking for ${lastUserMsg}: ${statusText}. See full details on /track`,
      actionCards: [toolResult],
    };
  }

  // Deterministic website answers first (developer-perfect)
  const siteAnswer = await answerWebsiteIntent(lastUserMsg, analysis, catalog);
  if (siteAnswer) return siteAnswer;

  const liveContext = `
=========================
LIVE CMS SNAPSHOT (authoritative right now)
=========================
PACKAGES:
${catalog.packagesText || "(load /packages)"}

FRAMES:
${catalog.framesText || "(load /store or homepage frames)"}
`;

  const conversation = [
    { role: "system", content: SYSTEM_PROMPT + "\n" + liveContext },
    ...messages,
  ];

  let actionCards = [];

  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("NVIDIA_TIMEOUT")), 18000));

    const candidateModels = [
      "nvidia/nemotron-3-super-120b-a12b",
      "mistralai/mistral-7b-instruct-v0.2",
      "nvidia/neva-22b",
    ];

    let completion = null;
    for (const modelId of candidateModels) {
      try {
        const completionPromise = openai.chat.completions.create({
          model: modelId,
          messages: conversation,
          tools: AGENT_TOOLS,
          tool_choice: "auto",
          temperature: 0.45,
          max_tokens: 2200,
        });
        completion = await Promise.race([completionPromise, timeoutPromise]);
        if (completion) break;
      } catch (_) {
        continue;
      }
    }

    if (!completion) {
      throw new Error("All NVIDIA AI models are currently busy. Please try again.");
    }

    const responseMessage = completion.choices[0]?.message;

    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      conversation.push(responseMessage);

      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        let args = {};
        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch (_) {
          args = {};
        }

        const toolResult = await executeAgentTool(functionName, args);
        actionCards.push(toolResult);

        conversation.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(toolResult),
        });
      }

      conversation.push({
        role: "system",
        content:
          "Write a DETAILED customer reply using the tool JSON. Include: full numbered list of all packages/frames/shoots returned, prices, then a step-by-step how-to-order/book section with exact paths (/store, /packages, /book, /gallery, /track). Do not summarize down to 1–2 items when more exist. End with WhatsApp +91 98659 92379 and one clarifying question.",
      });

      const finalCompletion = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: conversation,
        temperature: 0.4,
        max_tokens: 1800,
      });

      let finalReply = finalCompletion.choices[0]?.message?.content || "";

      if (analysis.isTanglish && (!finalReply || /^(?:vanakkam! )?here are/i.test(finalReply.trim()))) {
        finalReply = `Vanakkam bro!\n\n📦 Packages:\n${catalog.packagesText || "See /packages"}\n\n🖼 Frames:\n${catalog.framesText || "See /store"}${orderGuideBlock("tanglish", "frame")}\n\nWhatsApp: ${WEBSITE_MAP.studio.phone}`;
      }

      return { reply: finalReply, actionCards };
    }

    return {
      reply:
        responseMessage?.content ||
        (analysis.isTanglish
          ? "Vanakkam bro! Website pages, packages, frames, booking — enna venum?"
          : analysis.isTamilScript
          ? "வணக்கம்! இணையதளம், பேக்கேஜ், பிரேம், முன்பதிவு — என்ன வேண்டும்?"
          : "Vanakkam! Ask me about any page, package, frame, booking, or order tracking."),
      actionCards,
    };
  } catch (error) {
    return handleSmartFallback(lastUserMsg, analysis, catalog);
  }
}

async function handleSmartFallback(lastUserMsg, analysis, catalog) {
  const lower = lastUserMsg.toLowerCase();
  const lang = detectLangMode(analysis);

  if (analysis.isPhoneNumberOrOrderId || lower.includes("order") || lower.includes("track") || lower.includes("status") || lower.includes("pakuradhu")) {
    const toolRes = await executeAgentTool("track_order", { query: lastUserMsg });
    return {
      reply:
        lang === "tanglish"
          ? "Order track panni irukkom bro! /track page-layum paarkalam 👇"
          : lang === "ta"
          ? "ஆர்டர் விவரங்கள் கீழே. முழு பக்கம்: /track 👇"
          : "Tracking details below. Full page: /track 👇",
      actionCards: [toolRes],
    };
  }

  if (lower.includes("gift") || lower.includes("mug") || lower.includes("crystal") || lower.includes("lamp") || lower.includes("puzzle")) {
    return {
      reply:
        (lang === "tanglish"
          ? `Personalized gifts /store-la irukku (Magic Mug, Crystal Cube, Moon Lamp, Puzzle, keychain...).\n${WEBSITE_MAP.howTos.buyGift}`
          : `${WEBSITE_MAP.howTos.buyGift}`) + orderGuideBlock(lang, "frame"),
      actionCards: [],
    };
  }

  if (lower.includes("passport") || lower.includes("stamp")) {
    return {
      reply: WEBSITE_MAP.howTos.passport + orderGuideBlock(lang, "frame"),
      actionCards: [],
    };
  }

  if (lower.includes("frame") || lower.includes("wall") || lower.includes("size") || lower.includes("பிரேம்")) {
    const framesList = formatFramesCatalog(catalog.allFrames || [], lang);
    const toolRes = await executeAgentTool("query_frames", {
      room_type: lower.includes("sofa") || lower.includes("living") ? "living room" : "bedroom",
      wall_space: lower,
      max_budget: 999999,
    });
    return {
      reply:
        (lang === "tanglish"
          ? `Full live frame catalog:\n${framesList}`
          : `Full live frame catalog:\n${framesList}`) +
        orderGuideBlock(lang, "frame"),
      actionCards: [toolRes],
    };
  }

  if (lower.includes("portfolio") || lower.includes("gallery") || lower.includes("sample") || lower.includes("recent") || lower.includes("photo") || lower.includes("video")) {
    const toolRes = await executeAgentTool("fetch_recent_shoots", {
      category: lower.includes("wedding")
        ? "wedding"
        : lower.includes("pre")
          ? "pre-wedding"
          : lower.includes("maternity") || lower.includes("baby")
            ? "baby-maternity"
            : lower.includes("birthday")
              ? "birthday-events"
              : "all",
    });
    return {
      reply:
        lang === "tanglish"
          ? `Recent shoots 👇\n${WEBSITE_MAP.howTos.seePortfolio}`
          : `${WEBSITE_MAP.howTos.seePortfolio}\n\nSample cards below 👇`,
      actionCards: [toolRes],
    };
  }

  if (
    lower.includes("package") ||
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("quote") ||
    lower.includes("wedding") ||
    lower.includes("maternity") ||
    lower.includes("birthday") ||
    lower.includes("விலை") ||
    lower.includes("rate") ||
    lower.includes("evvalavu")
  ) {
    const pkgs = formatPackagesCatalog(catalog.packagesList || catalog.packages?.packages || [], lang);
    const livePackages = catalog.packages || (await executeAgentTool("query_packages", {}));
    const toolRes = await executeAgentTool("calculate_package_quote", {
      event_type: lower.includes("maternity")
        ? "maternity"
        : lower.includes("baby") || lower.includes("birthday")
          ? "birthday"
          : "wedding",
      include_drone: lower.includes("drone"),
      include_master_album: true,
    });
    return {
      reply:
        (lang === "tanglish"
          ? `Live packages (/packages):\n${pkgs}`
          : lang === "ta"
          ? `நேரடி பேக்கேஜ்கள் (/packages):\n${pkgs}`
          : `Live packages from CMS (/packages):\n${pkgs}`) +
        orderGuideBlock(lang, "package") +
        `\n\nSample estimate card 👇`,
      actionCards: [toolRes, livePackages].filter(Boolean),
    };
  }

  if (lower.includes("raw") || lower.includes("unedited")) {
    return {
      reply:
        lang === "tanglish"
          ? "Raw / unedited files thara maattom bro — graded + retouched masters thaan 1-Month Guarantee-oda deliver aagum."
          : "We don’t deliver raw/unedited files — only graded, retouched masters under the 1-Month Delivery Guarantee.",
      actionCards: [],
    };
  }

  if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("enga") || lower.includes("எங்கே")) {
    return {
      reply: `📍 ${WEBSITE_MAP.studio.address}\nHours: ${WEBSITE_MAP.studio.hours}\nWhatsApp: ${WEBSITE_MAP.studio.phone}\nMap / contact page: /contact\nBook shoot: /book`,
      actionCards: [],
    };
  }

  if (lower.includes("guarantee") || lower.includes("delivery") || lower.includes("month") || lower.includes("ஆல்பம்")) {
    return {
      reply:
        lang === "tanglish"
          ? "1-Month Album Delivery Guarantee: photo select pannathukku apram 30 days-kulla album. Delay aana ₹1,000 credit. Full story: Home → Guarantees."
          : "1-Month Album Delivery Guarantee: album within 30 days of photo selection, or ₹1,000 studio credit. See Home → Guarantees.",
      actionCards: [],
    };
  }

  // Default: website map + live rates
  return {
    reply:
      buildWebsiteGuideReply({
        lang,
        packagesText: catalog.packagesText,
        framesText: catalog.framesText,
      }) +
      `\n\nTip: Ask “list frames”, “list packages”, or “recent shoots” for full detailed catalogs.`,
    actionCards: [catalog.packages, catalog.frames].filter(Boolean),
  };
}
