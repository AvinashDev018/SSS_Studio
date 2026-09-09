import OpenAI from "openai";
import { AGENT_TOOLS, executeAgentTool } from "./tools.js";
import {
  WEBSITE_MAP,
  findRouteForQuery,
  buildWebsiteGuideReply,
  detectLangMode,
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
• Address: 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012
• Hours: Mon–Sun, 9:00 AM – 8:00 PM
• Phone / WhatsApp: +91 63835 65425
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
• /visualizer → AI moodboard / visualizer
• /client-gallery/[slug] → Private proofing gallery (passcode)
• /login → Customer login / profile
• /support → Support

Admin CMS controls: Packages, Gallery photos (+ Featured on Home), Frames prices, Promos, Testimonials approval, Orders/CRM, Client galleries, Wedding album PDF.

=========================
4. LIVE DATA RULE
=========================
For ANY price question, call tools:
• \`query_packages\` for shoot packages
• \`query_frames\` for frame sizes/prices
• \`explain_website\` for how a page works
• \`track_order\` for order/phone lookups
• \`fetch_recent_shoots\` for portfolio samples
Never invent prices. Prefer tool results.

=========================
5. GUARANTEES
=========================
• 1-Month Album Delivery Guarantee (or ₹1,000 credit)
• Free Pre-Wedding perk on complete wedding packages
• Signature South Indian color grading
• Transit damage reprint guarantee on frames/gifts

=========================
6. HOW-TO ANSWERS (DEVELOPER STYLE)
=========================
• Book shoot → Home “Book a Consultation” or /book, or WhatsApp +91 63835 65425
• Buy frame → /store or Home #frames → Order → upload photo → checkout (Cash / UPI) → optional promo
• Track → /track or paste Order ID / phone in chat
• See packages → /packages (live CMS)
• Promo → Admin creates code; customer enters it in Store cart
• Wedding album → Portfolio → open album (3D page flip). PDF hosted via admin upload (Cloudinary when configured)

=========================
7. OUT OF SCOPE
=========================
Politely refuse coding/politics/general trivia and redirect to SSS photography / website help.

=========================
8. ANSWER STYLE
=========================
Be specific: mention exact page paths, buttons, and next steps. Keep answers short, useful, and confident.`;

async function getLiveCatalogSnippets() {
  try {
    const [pkgsRes, framesRes] = await Promise.all([
      executeAgentTool("query_packages", {}),
      executeAgentTool("query_frames", { max_budget: 999999 }),
    ]);
    const packagesText = (pkgsRes.packages || [])
      .slice(0, 10)
      .map((p) => `• ${p.name}: ${p.price}`)
      .join("\n");
    const frames = pkgsRes && framesRes.recommendedFrames ? framesRes.recommendedFrames : [];
    // Prefer full frame list via second fetch if needed
    let framesText = "";
    try {
      const { getFrames } = await import("@/app/actions/frames");
      const all = await getFrames({ admin: false });
      if (all.length) {
        framesText = all
          .slice(0, 8)
          .map((f) => `• ${f.size}: ${f.price}`)
          .join("\n");
        framesText += `\n(${all.length} live sizes)`;
      }
    } catch (_) {
      framesText = frames.map((f) => `• ${f.size}: ${f.priceFormatted || f.numericPrice}`).join("\n");
    }
    return { packagesText, framesText, packages: pkgsRes, frames: framesRes };
  } catch (e) {
    return { packagesText: "", framesText: "", packages: null, frames: null };
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
    "moodboard", "services", "about", "support", "how to", "howto", "where", "open", "menu",
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

  if (lower.includes("how to order") || lower.includes("how to buy") || (lower.includes("frame") && lower.includes("how"))) {
    return {
      reply:
        lang === "tanglish"
          ? `Frame order: /store illana Home frames section → size choose → Order → photo upload → checkout (Cash / UPI). Promo optional.`
          : WEBSITE_MAP.howTos.buyFrame,
      actionCards: [],
    };
  }

  if (lower.includes("store") || lower.includes("shop") || lower.includes("cart") || lower.includes("checkout")) {
    const toolRes = await executeAgentTool("explain_website", { topic: "store" });
    return {
      reply:
        lang === "tanglish"
          ? `Store page: /store — frames, gifts, passport photos. Cart-la promo code apply panni Cash pickup illana UPI home delivery choose pannalam.`
          : lang === "ta"
          ? `ஸ்டோர் பக்கம்: /store — பிரேம்கள், பரிசுகள், பாஸ்போர்ட் போட்டோ. கார்ட்டில் ப்ரோமோ கோடும் செக்அவுட்டும் உள்ளன.`
          : `Store (/store): order frames, personalized gifts, and passport photos. Cart supports promo codes, studio cash pickup, or UPI home delivery.`,
      actionCards: [toolRes],
    };
  }

  if (lower.includes("visualizer") || lower.includes("moodboard") || lower.includes("ai stylist")) {
    return {
      reply:
        lang === "tanglish"
          ? `AI Visualizer / Moodboard: /visualizer — shoot style concepts match panna use pannunga.`
          : `Open /visualizer for the AI moodboard / styling visualizer.`,
      actionCards: [],
    };
  }

  if (lower.includes("client gallery") || lower.includes("proofing") || lower.includes("passcode") || lower.includes("select photos")) {
    return {
      reply:
        lang === "tanglish"
          ? `Private client proofing gallery: Admin create pannuvanga. Client-ku special link /client-gallery/[slug] + passcode kidaikkum — photos select panni album-ku anupalam.`
          : `Private proofing galleries live at /client-gallery/[slug] with a passcode. Admin creates them under Client Galleries so clients can select photos for album/print.`,
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
          max_tokens: 1500,
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

      const finalCompletion = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: conversation,
        temperature: 0.45,
        max_tokens: 1000,
      });

      let finalReply = finalCompletion.choices[0]?.message?.content || "";

      if (analysis.isTanglish && (!finalReply || /^(?:vanakkam! )?here are/i.test(finalReply.trim()))) {
        finalReply = `Vanakkam bro! Live packages:\n${catalog.packagesText || "See /packages"}\nFrames: see /store. WhatsApp: ${WEBSITE_MAP.studio.phone}`;
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

  if (lower.includes("passport") || lower.includes("stamp")) {
    return {
      reply:
        lang === "tanglish"
          ? "Passport photos /store-la: 8 Passport ₹100 | 8 Passport + 8 Stamp ₹150 | 16 Stamp ₹100."
          : lang === "ta"
          ? "பாஸ்போர்ட் போட்டோ (/store): 8 பாஸ்போர்ட் ₹100 | 8+8 ஸ்டாம்ப் ₹150 | 16 ஸ்டாம்ப் ₹100."
          : "Passport prints on /store: 8 Passport ₹100 | 8 Passport + 8 Stamp ₹150 | 16 Stamp ₹100.",
      actionCards: [],
    };
  }

  if (lower.includes("gift") || lower.includes("mug") || lower.includes("crystal") || lower.includes("lamp") || lower.includes("puzzle")) {
    return {
      reply:
        lang === "tanglish"
          ? "Personalized gifts /store-la irukku bro (Magic Mug, Crystal Cube, Moon Lamp, Puzzle...). Order online pannalam."
          : "Personalized gifts are on /store (Magic Mug, Crystal Cube, Moon Lamp, Puzzle, and more).",
      actionCards: [],
    };
  }

  if (lower.includes("raw") || lower.includes("unedited")) {
    return {
      reply:
        lang === "tanglish"
          ? "Raw photos thara maattom bro — graded + retouched masters thaan 1-Month Guarantee-oda deliver aagum."
          : "We don’t deliver raw/unedited files — only graded, retouched masters under the 1-Month Delivery Guarantee.",
      actionCards: [],
    };
  }

  if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("enga") || lower.includes("எங்கே")) {
    return {
      reply: `${WEBSITE_MAP.studio.address}. Hours: ${WEBSITE_MAP.studio.hours}. WhatsApp: ${WEBSITE_MAP.studio.phone}. Contact page: /contact`,
      actionCards: [],
    };
  }

  if (lower.includes("guarantee") || lower.includes("delivery") || lower.includes("month") || lower.includes("ஆல்பம்")) {
    return {
      reply:
        lang === "tanglish"
          ? "1-Month Album Delivery Guarantee: photo select panna 30 days-kulla album. Delay aana ₹1,000 credit."
          : "1-Month Album Delivery Guarantee: album within 30 days of photo selection, or ₹1,000 credit.",
      actionCards: [],
    };
  }

  if (lower.includes("frame") || lower.includes("wall") || lower.includes("size") || lower.includes("பிரேம்")) {
    const toolRes = await executeAgentTool("query_frames", {
      room_type: lower.includes("sofa") || lower.includes("living") ? "living room" : "bedroom",
      wall_space: lower,
    });
    return {
      reply:
        lang === "tanglish"
          ? `Live frame rates:\n${catalog.framesText || "See /store"}\nHome-la 3D tilt preview-um irukku. Recommend sizes 👇`
          : `Live frame catalog:\n${catalog.framesText || "See /store or homepage #frames"}\nRecommendations 👇`,
      actionCards: [toolRes],
    };
  }

  if (lower.includes("portfolio") || lower.includes("gallery") || lower.includes("sample") || lower.includes("recent") || lower.includes("photo")) {
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
          ? "Recent shoots & portfolio samples 👇 Full gallery: /gallery | Wedding album flipbook: Home → Portfolio"
          : "Recent shoot samples 👇 Full gallery: /gallery | Wedding album flipbook: Home → Portfolio",
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
        lang === "tanglish"
          ? `Live packages (/packages):\n${catalog.packagesText}\nEstimate card 👇`
          : lang === "ta"
          ? `நேரடி பேக்கேஜ்கள் (/packages):\n${catalog.packagesText}\nமதிப்பீடு 👇`
          : `Live packages from CMS (/packages):\n${catalog.packagesText}\nSample estimate 👇`,
      actionCards: [toolRes, livePackages].filter(Boolean),
    };
  }

  // Default: website map + live rates
  return {
    reply: buildWebsiteGuideReply({
      lang,
      packagesText: catalog.packagesText,
      framesText: catalog.framesText,
    }),
    actionCards: [],
  };
}
