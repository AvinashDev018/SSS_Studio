import OpenAI from "openai";
import { AGENT_TOOLS, executeAgentTool } from "./tools.js";

// Complete Grounded Studio Knowledge Base extracted from the entire SSS Photography Studio website
const SYSTEM_PROMPT = `You are the Autonomous AI Studio Concierge for "SSS Photography Studio" (SSS போட்டோகிராபி ஸ்டுடியோ), based in Avaniyapuram, Madurai, Tamil Nadu (Phone & WhatsApp: +91 63835 65425).

=========================
1. STUDIO IDENTITY & CONTACT
=========================
- Studio Name: SSS Photography Studio (SSS போட்டோகிராபி ஸ்டுடியோ)
- Studio Address: 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012
- Opening Hours: Monday to Sunday, 9:00 AM – 8:00 PM
- Direct Phone & WhatsApp: +91 63835 65425
- Location & Directions: 34, Prasanna New Colony, Avaniyapuram, Madurai (landmark near Avaniyapuram main junction).
- Lead Equipment: Sony FX3 & A7IV full-frame cinema cameras, prime master glass, gimbal stabilization, high-fidelity wireless audio, licensed 4K aerial drone coverage.

=========================
2. SIGNATURE GUARANTEES & SPECIAL PERKS
=========================
- "1-Month Album Delivery Guarantee": Flush-mount, handcrafted leather photobook albums and master digital edits delivered within 30 days (1 month) of client photo selection, or the client receives a ₹1,000 cash credit. (Standard industry turnarounds take 3 to 6 months).
- "Free Pre-Wedding Shoot Perk": Book a complete multi-day wedding package and receive a complimentary outdoor pre-wedding couple photoshoot with styling concepts.
- "Signature Color Grading": Skin-true, rich South Indian traditional ceremony tones and cinematic color grading.
- "Transit Damage Replacement Guarantee": 100% free re-print & replacement if any frame or acrylic gift is damaged in shipping.

=========================
3. PHOTOGRAPHY SERVICES & STARTING RATES
=========================
- Wedding & Muhurtham Ceremony: Traditional rituals, candid emotion capture, 4K cinematic video, drone aerials, master photobook album (Starts ~₹18,000 - ₹75,000+).
- Pre-Wedding & Post-Wedding Outdoor Shoots: Scenic hill stations (Kodaikanal, Munnar), tea estates, heritage temples (Starts ~₹8,000).
- Outdoor & Studio Maternity Sessions: Safe, tender, creative poses with sanitized studio gowns and backdrops (Starts ~₹6,000).
- Baby & 1st Birthday / Cake Smash: Sanitized wraps & wooden props, milestone themes (3M, 6M, 1Y) (Starts ~₹5,000).
- School / College / Corporate Functions: Stage coverage, graduation days, group and individual portraits (Starts ~₹5,000).
- Biometric Passport Prints: Indian & international passport/visa specs with instant studio record lookup.

=========================
4. 13-TIER HANDCRAFTED PHOTO FRAMES (COMPLETE PRICE LIST)
=========================
All frames include premium photo mounting and client choice of Sparkle Lamination (Glitter/Luxury), Matte Finish (Anti-Glare), or High Gloss:
1. 8x10 (₹349) - Bedside Table, Study Desk, Office Cabin
2. 8x12 (₹499) - Bookshelf Display, Dressing Mirror (Best Value)
3. 10x12 (₹699) - Console Table, Bedside Wall Hanging
4. 10x15 (₹799) - Passage Gallery, Staircase Collage Wall
5. 12x15 (₹899) - Bedroom Side Wall, Compact Dining
6. 12x18 (₹1,099) - Living Room Accent, Compact Wall (Most Popular)
7. 14x20 (₹1,299) - Hallway Centerpiece, Living Room Side
8. 16x20 (₹1,799) - Drawing Room Wall, Couple Portrait Feature
9. 16x24 (₹1,999) - Reception Backdrop, Main Living Room Gallery (Grand Pick)
10. 18x24 (₹2,499) - Large Bedroom Focal Wall, Over-Bed Centerpiece
11. 20x24 (₹2,799) - Dining Area Feature, Family Portrait Wall
12. 20x30 (₹3,499) - Luxury Living Room Feature Wall, Villa Foyer (Statement Art)
13. 24x36 (₹4,999) - Grand Reception Hall, Master Villa Wall (Royal Size)

Frame Finish Options: Synthetic Wood, Sparkle Glitter Lamination, Anti-Glare Matte, Floating Acrylic, Canvas Wrap.

=========================
5. STUDIO STORE: PASSPORT PACKAGES & PERSONALIZED GIFTS
=========================
Passport Photo Packages:
- 8 Passport Size Photos: ₹100
- 8 Passport + 8 Stamp Size Photos: ₹150
- 16 Stamp Size Photos: ₹100
(Note: Studio photo lookup available using client mobile number / reference photo!)

Personalized Birthday & Special Gifts:
- Classic Wooden Photo Frame: ₹899
- Personalized Magic Mug: ₹499 (Heat-sensitive color reveal)
- 3D Crystal Photo Cube: ₹1,499 (Sub-surface laser engraving with LED base)
- Romantic Heart Frame: ₹650
- Acoustic Guitar Custom Frame: ₹1,299
- Butterfly Wing Custom Frame: ₹1,150
- Mr & Mrs Wedding Frame: ₹1,099
- LOVE Text Collage Frame: ₹950
- Custom Family Photo Puzzle: ₹550
- Personalized 3D Moon Lamp: ₹1,100
- Acrylic Desk LED Night Lamp: ₹1,199
- High-Gloss Metal Keychain: ₹299

=========================
6. WEBSITE PAGES & END-TO-END EXPLANATION
=========================
When the user asks to "explain about this page", "explain home page", "explain booking", "explain pricing card", "explain contact details", or any section of the website:
- Home Page ("explain home page", "what is on home page"): Explain that SSS Photography Studio showcases recent shoot stories, our signature 1-Month Album Delivery Guarantee badge, South Indian ceremony color grading comparison, client reviews, and direct booking forms.
- Booking & Packages ("explain booking", "explain pricing card"): Explain our transparent default packages (Weddings starting ₹18,000 to ₹75,000+ Premium, Pre-wedding ₹8,000, Maternity ₹6,000, Baby/Birthday ₹5,000), itemized breakdown (Candid, Traditional, 4K Cinematic, Drone), 1-Month Delivery Guarantee, and instant WhatsApp booking quotes.
- Contact Details ("explain contact", "contact details"): 34, Prasanna New Colony, Avaniyapuram, Madurai 625012 (Landmark near Avaniyapuram main junction). Open Mon-Sun 9 AM - 8 PM. Phone & WhatsApp: +91 63835 65425.
- Store & Visualizer Page: 13 photo frame sizes visualizer, instant biometric passport prints, and personalized gifts (3D Crystal Cube ₹1,499, Magic Mug ₹499, 3D Moon Lamp ₹1,100).
- Track Order Page: Real-time status lookup using Order ID (e.g. SSS-1002) or 10-digit registered Mobile Number.

=========================
7. POLICIES & FREQUENTLY ASKED QUESTIONS
=========================
- Travel Policy: Based in Avaniyapuram, Madurai; covers all of Tamil Nadu and South India (travel & accommodation charges apply outside Madurai).
- Raw Photo Policy: SSS Studio does NOT provide unedited or raw camera files. All delivered photographs undergo professional culling, color-grading, and master retouching.
- Booking Deposit: 30% advance deposit required to lock event date.
- Digital Cloud Gallery: High-res photos delivered via private cloud link, hosted active for 6 months.

=========================
8. AGENTIC TOOL INSTRUCTIONS
=========================
You have access to DETERMINISTIC TOOLS. YOU MUST CALL TOOLS whenever client intent matches:
1. Frame advice or wall sizing -> CALL "query_frames".
2. Pricing, package calculation, wedding/maternity cost -> CALL "calculate_package_quote".
3. Order or tracking query, phone number, Order ID -> CALL "track_order".
4. Ready to book or wants WhatsApp quote -> CALL "create_whatsapp_deal".
5. Client asks for recent photos, sample pictures, gallery, previous shoot images, recent projects -> CALL "fetch_recent_shoots".

=========================
9. PERFECT 3-WAY LANGUAGE & DIALECT MATCHING (STRICT MANDATE)
=========================
YOU MUST ACCURATELY IDENTIFY AND MATCH THE USER'S INPUT LANGUAGE & STYLE AT ALL TIMES:

A. TANGLISH (Tamil words typed in English alphabet, e.g. "photo frame pathi sollu", "order panna aprm epdi pakuradhu", "bro frame price enna", "wedding package eppadi book panradhu", "studio enga irukku", "delivery eppo varum", "bro package rate enna bro"):
- YOU MUST RESPOND IN NATURAL, FRIENDLY, HIGH-CONVERTING TANGLISH!
- NEVER EVER RESPOND IN ENGLISH WHEN THE USER SPEAKS IN TANGLISH!
- Example for "order panna aprm epdi pakuradhu":
  "Order panna aprm, unga Order ID (e.g. SSS-1002) & Mobile Number vachu Website top header-la irukku **'Track Order'** page-la check pannalam bro! Illana unga Order ID or Phone Number ingeyae type panna naan live status solren! 🚚"
- Example for phone number response in Tanglish:
  "Ungaludaiya mobile number / Order ID check panni live tracking status keenje pottu irukkom bro! 👇"

B. TAMIL SCRIPT (Tamil characters, e.g. "வணக்கம், போட்டோ பிரேம் விலை என்ன?", "ஆர்டர் செய்த பிறகு எப்படி பார்ப்பது?"):
- YOU MUST RESPOND IN RESPECTFUL, ELEGANT TAMIL SCRIPT!
- NEVER USE ENGLISH OR TANGLISH WHEN THE USER TYPES IN TAMIL SCRIPT!

C. ENGLISH:
- RESPOND IN CLEAR, ENTHUSIASTIC, HIGH-CONVERTING ENGLISH!

D. OUT OF SCOPE / UNRELATED TOPICS (STRICT REGULATION):
If the user asks about ANYTHING outside SSS Photography Studio (e.g. coding/programming, weather, politics, recipes, general math, sports, external non-studio topics):
- POLITELY DECLINE AND REDIRECT TO STUDIO SERVICES IN THE USER'S EXACT LANGUAGE:
  - Tanglish Response: "Sry bro/sis! Naan SSS Studio-vodha AI Assistant. Naan photo frames, wedding packages, Avaniyapuram studio location & order tracking pathi thaan help panna mudiyum. Ungalukku photo sethu enna help venum? 📸"
  - Tamil Script Response: "மன்னிக்கவும்! நான் SSS போட்டோகிராபி ஸ்டுடியோவின் AI உதவி மையம். புகைப்பட பிரேம்கள், திருமண பேக்கேஜ்கள் மற்றும் மதுரையில் உள்ள எங்கள் ஸ்டுடியோ பற்றிய தகவல்களை மட்டுமே என்னால் வழங்க முடியும். உங்களுக்கு என்ன உதவி தேவை? 📸"
  - English Response: "Sorry! I am SSS Studio's AI Assistant. I can only assist with our photo frames, wedding/event photography packages, studio location in Avaniyapuram Madurai, and order tracking. How can I help with your photography or frame needs today? 📸"`;

// Comprehensive Language & Intent Detector for deterministic fallbacks and domain boundaries
function analyzeUserMessage(userMsg = "", messages = []) {
  const text = userMsg.trim();
  const lower = text.toLowerCase();

  // 1. Language Script Detection
  const isTamilScript = /[\u0B80-\u0BFF]/.test(text);

  // Check if query is a Phone Number or Order ID or pure numbers (e.g. 6383565425, SSS-1002, 1002)
  const cleanDigits = text.replace(/[\s\-\+\(\)]/g, "");
  const isPhoneNumberOrOrderId = /^\d{5,15}$/.test(cleanDigits) || /^(sss|shoot|ord)-?\d{3,10}$/i.test(text);

  // Check if conversation history has Tanglish
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

  // Extensive Tanglish Vocabulary & Verb Particles
  const tanglishTokens = [
    "pathi", "sollu", "solunga", "solu", "solm", "enna", "eppadi", "epdi", "enga", "engae", "varum",
    "vandhu", "irukku", "irukaa", "iruka", "bro", "sis", "ji", "panra", "panradhu", "panla", "panren",
    "panna", "pannu", "pannalam", "kudunga", "kudu", "tharanum", "thara", "teriyuma", "theriyum", "romba",
    "nalla", "paka", "paaka", "paarkanum", "pakuradhu", "pakradhu", "pakurathu", "paakuradhu", "aprm", "apram",
    "kitta", "velai", "sonninga", "pottu", "namba", "unga", "vanakkam", "solanum", "mudiyuma", "mudiyaadhu",
    "kaelu", "vanganum", "vaanga", "evvalavu", "kuduka", "aana", "aachu", "solanga", "paakkanum", "aama",
    "illa", "rate", "kaasu", "vilai", "yaaru", "kalyanam", "seemantham", "valaikappu", "venum", "vendaam",
    "dhaan", "thaan", "la", "le", "kulla", "oda", "nalladhaa", "tharuvingala", "tharrom", "venum", "solatuma",
    "edhu", "ethu", "vango", "vangalam", "edukalam", "varuma", "kedaikuma", "kidaikuma", "parunga"
  ];

  const hasTanglishWord = tanglishTokens.some(tok => new RegExp(`(?:^|\\s|\\b)${tok}(?:$|\\s|\\b)`, "i").test(lower));
  const isTanglish = !isTamilScript && (hasTanglishWord || (isPhoneNumberOrOrderId && isPreviousTanglish));
  const effectiveTamilScript = isTamilScript || (isPhoneNumberOrOrderId && isPreviousTamilScript);

  // 2. Studio Domain Keywords
  const studioKeywords = [
    "frame", "photo", "wedding", "shoot", "package", "price", "cost", "location", "address",
    "madurai", "avaniyapuram", "album", "delivery", "track", "order", "maternity", "baby",
    "birthday", "gift", "crystal", "mug", "lamp", "deposit", "raw", "camera", "contact",
    "phone", "whatsapp", "guarantee", "muhurtham", "candid", "drone", "studio", "booking",
    "rate", "vilai", "kaasu", "pathi", "sollu", "passport", "puzzle", "keychain", "heart", "moon",
    "aprm", "epdi", "pakuradhu", "panna", "status", "explain", "page", "website", "home", "card",
    "details", "recent", "sample", "gallery", "portfolio",
    "பிரேம்", "போட்டோ", "திருமணம்", "விலை", "ஸ்டுடியோ", "மதுரை", "அவனியாபுரம்", "ஆல்பம்", "பரிசு"
  ];
  const isStudioRelated = isPhoneNumberOrOrderId || studioKeywords.some(kw => lower.includes(kw));

  // 3. Explicit Out-of-Scope Triggers (coding, weather, general trivia, politics, recipes, etc.)
  const outOfScopeTokens = [
    "python", "java", "code", "coding", "script", "html", "css", "react", "bug", "recipe",
    "biryani", "weather", "modi", "cricket", "football", "president", "prime minister",
    "homework", "math", "solve", "calculator", "who is", "joke", "stock", "crypto", "news"
  ];
  const isExplicitOutOfScope = outOfScopeTokens.some(tok => lower.includes(tok));

  return {
    isTamilScript: effectiveTamilScript,
    isTanglish,
    isStudioRelated,
    isPhoneNumberOrOrderId,
    isOutOfScope: isExplicitOutOfScope || (!isStudioRelated && text.length > 3 && !["hi", "hello", "vanakkam", "வணக்கம்"].includes(lower))
  };
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

  // If query is strictly out of scope, return immediate polite decline in user's exact language
  if (analysis.isOutOfScope) {
    if (analysis.isTamilScript) {
      return {
        reply: "மன்னிக்கவும்! நான் SSS போட்டோகிராபி ஸ்டுடியோவின் AI உதவி மையம். புகைப்பட பிரேம்கள், திருமண பேக்கேஜ்கள் மற்றும் மதுரையில் உள்ள எங்கள் ஸ்டுடியோ பற்றிய தகவல்களை மட்டுமே என்னால் வழங்க முடியும். உங்களுக்கு என்ன உதவி தேவை? 📸",
        actionCards: [],
      };
    }
    if (analysis.isTanglish) {
      return {
        reply: "Sry bro/sis! Naan SSS Studio-vodha AI Assistant. Naan photo frames, wedding packages, Avaniyapuram studio location & order tracking pathi thaan help panna mudiyum. Ungalukku photo sethu enna help venum? 📸",
        actionCards: [],
      };
    }
    return {
      reply: "Sorry! I am SSS Studio's AI Assistant. I can only assist with our photo frames, wedding/event photography packages, studio location in Avaniyapuram Madurai, and order tracking. How can I help with your photography or frame needs today? 📸",
      actionCards: [],
    };
  }

  const conversation = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  let actionCards = [];

  try {
    // If input is explicitly a phone number or Order ID, trigger track_order immediately
    if (analysis.isPhoneNumberOrOrderId) {
      const toolResult = await executeAgentTool("track_order", { query: lastUserMsg });
      actionCards.push(toolResult);

      const statusText = toolResult.stageLabel ? `${toolResult.stageLabel} (${toolResult.stageDesc || ''})` : 'Under Processing';
      return {
        reply: analysis.isTanglish
          ? `Unga Order / Mobile Number (${lastUserMsg}) track panni irukkom bro! 👇 Status: ${statusText}`
          : analysis.isTamilScript
          ? `உங்கள் ஆர்டர் / மொபைல் எண் (${lastUserMsg}) சரிபார்க்கப்பட்டது! நிலை: ${statusText}`
          : `We found tracking details for ${lastUserMsg}! Current Status: ${statusText}`,
        actionCards,
      };
    }

    // 1. Initial agent call with tools enabled (with 18s timeout)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("NVIDIA_TIMEOUT")), 18000)
    );

    const completionPromise = openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: conversation,
      tools: AGENT_TOOLS,
      tool_choice: "auto",
      temperature: 0.6,
      max_tokens: 1500,
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    const responseMessage = completion.choices[0]?.message;

    // 2. If agent calls tools:
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      conversation.push(responseMessage);

      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        let args = {};
        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch (e) {
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

      // 3. Second call so agent can speak naturally based on tool observations
      const finalCompletion = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-70b-instruct",
        messages: conversation,
        temperature: 0.6,
        max_tokens: 1000,
      });

      let finalReply = finalCompletion.choices[0]?.message?.content || "";

      // Ensure if user asked in Tanglish, reply NEVER slips into English
      if (analysis.isTanglish && (!finalReply || /^(?:vanakkam! )?here are/i.test(finalReply.trim()))) {
        finalReply = "Vanakkam bro! Enga SSS Studio-la 13 custom photo frame sizes irukku (Starting at ₹349). Sparkle illana Matte lamination-oda custom-a mount panni 1-Month Delivery Guarantee-oda tharrom. Keelayulla sizes & prices paarkalam:";
      }

      return {
        reply: finalReply,
        actionCards,
      };
    }

    // Direct answer if no tools needed
    return {
      reply: responseMessage?.content || (analysis.isTanglish ? "Vanakkam bro! SSS Photography Studio-la ungalukku eppadi help pannanum?" : analysis.isTamilScript ? "வணக்கம்! SSS போட்டோகிராபி ஸ்டுடியோவில் உங்களுக்கு எவ்வாறு உதவ வேண்டும்?" : "Vanakkam! How can SSS Photography Studio make your celebration memorable today?"),
      actionCards,
    };
  } catch (error) {
    // Smart Multilingual Fallback Engine
    const lower = lastUserMsg.toLowerCase();

    // 1. Order Tracking / Order Status / Phone Number or Order ID input
    if (analysis.isPhoneNumberOrOrderId || lower.includes("order") || lower.includes("track") || lower.includes("status") || lower.includes("pakuradhu") || lower.includes("pakradhu") || lower.includes("paarkka") || lower.includes("aprm")) {
      const toolRes = await executeAgentTool("track_order", { query: lastUserMsg });
      return {
        reply: analysis.isTanglish
          ? "Unga Order ID or Mobile Number vachu track panni irukkom bro! Website-la 'Track Order' page-lum live updates paarkalam 👇"
          : analysis.isTamilScript
          ? "உங்கள் ஆர்டர் எண் / மொபைல் எண் சரிபார்க்கப்பட்டது! விவரங்களை கீழே காணலாம் 👇"
          : "We checked your order / mobile number details! You can see the live tracking details below 👇",
        actionCards: [toolRes],
      };
    }

    // 2. Passport Photos
    if (lower.includes("passport") || lower.includes("stamp")) {
      return {
        reply: analysis.isTanglish
          ? "Enga SSS Studio-la Passport Photos available bro! 8 Passport size ₹100, 8 Passport + 8 Stamp size ₹150, 16 Stamp size ₹100. Old photo record lookup-um irukku bro!"
          : analysis.isTamilScript
          ? "SSS ஸ்டுடியோவில் பாஸ்போர்ட் போட்டோக்கள் கிடைக்கும்! 8 பாஸ்போர்ட் அளவு ₹100, 8 பாஸ்போர்ட் + 8 ஸ்டாம்ப் அளவு ₹150, 16 ஸ்டாம்ப் அளவு ₹100."
          : "We provide instant biometric passport & stamp size prints at SSS Studio! 8 Passport prints for ₹100, 8 Passport + 8 Stamp prints for ₹150, and 16 Stamp prints for ₹100.",
        actionCards: [],
      };
    }

    // 3. Personalized Store Gifts (Mug, Crystal, Lamp, Keychain, etc.)
    if (lower.includes("gift") || lower.includes("mug") || lower.includes("crystal") || lower.includes("lamp") || lower.includes("keychain") || lower.includes("puzzle") || lower.includes("moon")) {
      return {
        reply: analysis.isTanglish
          ? "Enga Studio Store-la custom personalized gifts irukku bro! 3D Crystal Photo Cube (₹1,499), Magic Photo Mug (₹499), 3D Moon Lamp (₹1,100), Acrylic LED Lamp (₹1,199), Metal Keychain (₹299), Custom Photo Puzzle (₹550). Complete catalog-ஐ Store page-ல பாக்கலாம் bro!"
          : analysis.isTamilScript
          ? "எங்கள் ஸ்டுடியோ ஸ்டோரில் 3D கிரிஸ்டல் கியூப் (₹1,499), மேஜிக் கப் (₹499), 3D மூன் லேம்ப் (₹1,100), அக்ரிலிக் எல்இடி லேம்ப் (₹1,199) போன்ற பல பிரத்யேக பிறந்தநாள் பரிசுகள் உள்ளன!"
          : "Explore personalized gifts at SSS Studio Store: 3D Crystal Photo Cube (₹1,499), Magic Photo Mug (₹499), 3D Moon Lamp (₹1,100), Acrylic Desk LED Lamp (₹1,199), and Metal Keychain (₹299). Visit our Store tab to order online!",
        actionCards: [],
      };
    }

    // 4. Raw Photos Policy
    if (lower.includes("raw") || lower.includes("unedited")) {
      return {
        reply: analysis.isTanglish
          ? "Enga SSS Studio-la raw/unedited photos thara maattom bro. Absolute color accuracy, culling & master retouching panni perfect-a 1-Month Delivery Guarantee-oda tharrom!"
          : analysis.isTamilScript
          ? "நாங்கள் Raw புகைப்படங்களை வழங்குவதில்லை. உயர்தர கலர் கிரேடிங் மற்றும் பினிஷிங் செய்து மட்டுமே ஆல்பம் வழங்கி வருகிறோம்."
          : "We do not provide raw or unedited files. Part of our premium service is meticulous culling, color grading, and retouching to ensure every delivered photograph meets SSS Studio's signature excellence.",
        actionCards: [],
      };
    }

    // 5. Studio Location & Timings
    if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("எங்கே") || lower.includes("enga")) {
      return {
        reply: analysis.isTanglish
          ? "Enga SSS Photography Studio location: 34, Prasanna New Colony, Avaniyapuram, Madurai - 625012. Morning 9 AM to Night 8 PM varai open-a irukku bro! Phone / WhatsApp: +91 63835 65425."
          : analysis.isTamilScript
          ? "SSS போட்டோகிராபி ஸ்டுடியோ முகவரி: 34, பிரசன்னா நியூ காலனி, அவனியாபுரம், மதுரை 625012. காலை 9 மணி முதல் இரவு 8 மணி வரை திறந்திருக்கும். தொடர்புக்கு: +91 63835 65425."
          : "SSS Photography Studio is located at 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012. We are open Monday to Sunday, 9:00 AM to 8:00 PM. Call or WhatsApp us at +91 63835 65425!",
        actionCards: [],
      };
    }

    // 6. Guarantees & Deliveries
    if (lower.includes("guarantee") || lower.includes("delivery") || lower.includes("month") || lower.includes("உறுதி") || lower.includes("ஆல்பம்")) {
      return {
        reply: analysis.isTanglish
          ? "Enga signature '1-Month Album Delivery Guarantee' la photo select panna 30 நாட்கள் (1 மாதம்)-kulla master album & HD photos kailae vandhurum! Delay aana ₹1,000 cash credit tharrom bro!"
          : analysis.isTamilScript
          ? "எங்களின் '1-மாத ஆல்பம் டெலிவரி உத்தரவாதம்' மூலம் போட்டோ தேர்வு செய்த 30 நாட்களுக்குள் உங்கள் பிரீமியம் லெதர் ஆல்பம் ஒப்படைக்கப்படும்!"
          : "Our signature '1-Month Album Delivery Guarantee' promises your handcrafted flush-mount leather album and master retouched high-res photos within 30 days of photo selection — or you receive a ₹1,000 cash credit!",
        actionCards: [],
      };
    }

    // 7. Frames Recommendation & Sizing
    if (lower.includes("frame") || lower.includes("wall") || lower.includes("size") || lower.includes("framing") || lower.includes("பிரேம்")) {
      const toolRes = await executeAgentTool("query_frames", {
        room_type: lower.includes("sofa") || lower.includes("hall") || lower.includes("living") ? "living room" : "bedroom",
        wall_space: lower,
      });
      return {
        reply: analysis.isTanglish
          ? "Vanakkam bro! Enga SSS Studio-la 13 custom photo frame sizes irukku (Starting at ₹349). Sparkle illana Matte lamination-oda custom-a mount panni 1-Month Delivery Guarantee-oda tharrom. Keelayulla frame sizes & rates paarkalam:"
          : analysis.isTamilScript
          ? "வணக்கம்! SSS போட்டோகிராபி ஸ்டுடியோவின் 13 வகையான கஸ்டம் போட்டோ பிரேம்கள் (₹349 முதல்) விவரங்கள் கீழே உள்ளன:"
          : "Vanakkam! Here are our top recommended handcrafted photo frame sizes for your wall. Each includes custom photo mounting with your choice of Sparkle or Matte lamination:",
        actionCards: [toolRes],
      };
    }

    // 8. Recent Photos / Portfolio Samples Trigger
    if (lower.includes("recent") || lower.includes("photo") || lower.includes("sample") || lower.includes("portfolio") || lower.includes("gallery") || lower.includes("work") || lower.includes("image") || lower.includes("picture") || lower.includes("பார்க்க")) {
      const toolRes = await executeAgentTool("fetch_recent_shoots", {
        category: lower.includes("wedding") ? "wedding" : lower.includes("pre") ? "pre-wedding" : lower.includes("maternity") || lower.includes("baby") ? "baby-maternity" : lower.includes("birthday") ? "birthday-events" : "all",
      });
      return {
        reply: analysis.isTanglish
          ? "Vanakkam bro! Enga SSS Studio-vodha recent shoot photos & real client stories keenje irukku bro 👇 Tap panni HD photos paarkalam!"
          : analysis.isTamilScript
          ? "வணக்கம்! SSS போட்டோகிராபி ஸ்டுடியோவின் சமீபத்திய புகைப்படத் தொகுப்புகள் கீழே உள்ளன 👇 போட்டோக்களைக் கிளிக் செய்து காணலாம்:"
          : "Vanakkam! Here are some of our recent photography shoots and real client stories at SSS Studio 👇 Tap to view high-resolution samples:",
        actionCards: [toolRes],
      };
    }

    // 9. Page Explanation (Explain Home, Services, Packages, Booking, Contact, Pricing)
    if (lower.includes("explain") || lower.includes("page") || lower.includes("home") || lower.includes("card") || lower.includes("details")) {
      if (lower.includes("home")) {
        return {
          reply: analysis.isTanglish
            ? "Enga **Home Page** -la SSS Studio-vodha recent client stories, signature **1-Month Album Delivery Guarantee** badge, South Indian traditional ceremony color grading slider, customer reviews & direct booking quote forms irukku bro!"
            : analysis.isTamilScript
            ? "எங்கள் **முகப்பு பக்கத்தில் (Home Page)** சமீபத்திய போட்டோ கதைகள், **1-மாத ஆல்பம் டெலிவரி உத்தரவாதம்**, வாடிக்கையாளர் கருத்துக்கள் மற்றும் நேரடி முன்பதிவு படிவங்கள் உள்ளன!"
            : "Our **Home Page** features our signature 1-Month Album Delivery Guarantee badge, recent client shoot stories, South Indian ceremony color grading comparison slider, authentic client reviews, and direct booking consultation forms!",
          actionCards: [],
        };
      }
      if (lower.includes("contact")) {
        return {
          reply: analysis.isTanglish
            ? "Enga Studio Contact Details: 34, Prasanna New Colony, Avaniyapuram, Madurai 625012. Open all 7 days (9 AM to 8 PM). Call or WhatsApp: +91 63835 65425 📞"
            : analysis.isTamilScript
            ? "ஸ்டுடியோ முகவரி: 34, பிரசன்னா நியூ காலனி, அவனியாபுரம், மதுரை 625012. அனைத்து நாட்களும் திறந்திருக்கும் (காலை 9 முதல் இரவு 8 மணி வரை). தொடர்புக்கு: +91 63835 65425 📞"
            : "SSS Studio Contact Info: 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012. Open Mon-Sun (9:00 AM - 8:00 PM). Phone & WhatsApp: +91 63835 65425 📞",
          actionCards: [],
        };
      }
      if (lower.includes("booking") || lower.includes("package") || lower.includes("pricing") || lower.includes("card")) {
        const toolRes = await executeAgentTool("calculate_package_quote", {
          event_type: "wedding",
          include_drone: true,
          include_master_album: true,
        });
        return {
          reply: analysis.isTanglish
            ? "Enga **Packages & Pricing** page-la Weddings (Starting ₹18,000 to ₹75,000+ Premium), Pre-wedding (₹8,000), Maternity (₹6,000), Baby/Birthday (₹5,000) default rates irukku. 1-Month Delivery Guarantee & free pre-wedding shoot perk-oda tharrom bro! Sample quote card 👇"
            : analysis.isTamilScript
            ? "எங்களின் **கட்டணம் & பேக்கேஜ் (Pricing & Packages)** பக்கத்தில் திருமணம் (₹18,000 முதல்), ப்ரீ-வெடிங் (₹8,000), மெட்டர்னிட்டி (₹6,000) போன்ற தெளிவான கட்டண விவரங்கள் உள்ளன. கணக்கிடப்பட்ட மாதிரி கார்டு கீழே உள்ளது 👇"
            : "Our **Packages & Pricing** section features transparent default rates (Weddings starting ₹18,000 up to ₹75,000+ Premium, Pre-wedding ₹8,000, Maternity ₹6,000, Baby/Birthday ₹5,000) with our 1-Month Album Delivery Guarantee! Here is an itemized estimate card 👇",
          actionCards: [toolRes],
        };
      }

      // General Page Explanation Fallback
      return {
        reply: analysis.isTanglish
          ? "Enga **SSS Photography Studio Website** -la Home (Client Stories & 1-Month Album Guarantee), Services & Packages (Weddings ₹18k-₹75k, Pre-wedding ₹8k, Maternity ₹6k, Baby ₹5k), 13 Photo Frame Visualizer Store (₹349-₹4,999) & Live Track Order features irukku bro! Enna section pathi theriya venum?"
          : analysis.isTamilScript
          ? "எங்கள் **SSS போட்டோகிராபி ஸ்டுடியோ இணையதளத்தில்** முகப்பு (சமீபத்திய கதைகள் & 1-மாத ஆல்பம் உத்தரவாதம்), சேவைகள் & பேக்கேஜ்கள் (திருமணம் ₹18,000 முதல், மெட்டர்னிட்டி ₹6,000), 13 பிரேம் சைஸ் ஸ்டோர் மற்றும் ஆர்டர் டிராக்கிங் வசதிகள் உள்ளன!"
          : "Welcome to SSS Photography Studio! Our website includes:\n• **Home Page**: Recent client shoot stories, signature 1-Month Album Delivery Guarantee, and color grading comparison.\n• **Packages & Pricing**: Weddings (starting ₹18,000 to ₹75,000+), Pre-wedding (₹8,000), Maternity (₹6,000), Baby (₹5,000).\n• **Frame Studio**: 13 custom handcrafted photo frame sizes (₹349 to ₹4,999).\n• **Track Order**: Live real-time order status tracking with your Order ID or Mobile Number.",
        actionCards: [],
      };
    }

    // 10. Package Quotes & Pricing
    if (lower.includes("quote") || lower.includes("price") || lower.includes("cost") || lower.includes("wedding") || lower.includes("package") || lower.includes("maternity") || lower.includes("baby") || lower.includes("birthday") || lower.includes("திருமணம்") || lower.includes("விலை") || lower.includes("evvalavu") || lower.includes("rate")) {
      const toolRes = await executeAgentTool("calculate_package_quote", {
        event_type: lower.includes("maternity") ? "maternity" : lower.includes("baby") || lower.includes("birthday") ? "birthday" : "wedding",
        include_drone: lower.includes("drone"),
        include_master_album: true,
      });
      return {
        reply: analysis.isTanglish
          ? "Vanakkam bro! SSS Studio Wedding & Event Photography Package Quote estimate keenje irukku bro. 1-Month Album Delivery Guarantee-oda tharrom. Tap panni details paarkalam:"
          : analysis.isTamilScript
          ? "வணக்கம்! உங்கள் விசேஷத்திற்கான கணக்கிடப்பட்ட பேக்கேஜ் விவரங்கள் கீழே கொடுக்கப்பட்டுள்ளன:"
          : "Here is the estimated quote for your session with our signature 1-Month Delivery Guarantee! You can tap below to customize or chat directly on WhatsApp:",
        actionCards: [toolRes],
      };
    }

    // Default Fallback
    return {
      reply: analysis.isTanglish
        ? "Vanakkam bro! 🙏 SSS Photography Studio-la ungalukku photo frames (13 sizes), wedding packages, passport photos, personalized gifts, illana order status pathi help pannanuma? Ungalukku enna details venum bro?"
        : analysis.isTamilScript
        ? "வணக்கம்! 🙏 SSS போட்டோகிராபி ஸ்டுடியோவில் புகைப்பட பிரேம்கள், திருமண பேக்கேஜ்கள், பாஸ்போர்ட் போட்டோக்கள் மற்றும் ஆர்டர் நிலைகள் பற்றிய விவரங்களை அறிய கேட்கலாம்."
        : "Vanakkam! 🙏 Welcome to SSS Photography Studio in Avaniyapuram, Madurai. We specialize in weddings, outdoor pre-wedding shoots, maternity, baby milestones, 13 sizes of handcrafted custom photo frames, passport photos, and personalized gifts with our 1-Month Album Delivery Guarantee. How can we help you today?",
      actionCards: [],
    };
  }
}
