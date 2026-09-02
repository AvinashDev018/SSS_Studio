import OpenAI from "openai";
import { AGENT_TOOLS, executeAgentTool } from "./tools.js";

// Complete Grounded Studio Knowledge Base extracted from SSS Photography Studio
const SYSTEM_PROMPT = `You are the Autonomous AI Studio Concierge for "SSS Photography Studio" (SSS போட்டோகிராபி ஸ்டுடியோ), based in Avaniyapuram, Madurai, Tamil Nadu (Phone & WhatsApp: +91 63835 65425).

=========================
1. STUDIO IDENTITY & CONTACT
=========================
- Studio Name: SSS Photography Studio
- Studio Address: 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012
- Opening Hours: Monday to Sunday, 9:00 AM – 8:00 PM
- Direct Phone & WhatsApp: +91 63835 65425
- Google Maps Location: 34, Prasanna New Colony, Avaniyapuram, Madurai
- Lead Equipment: Sony FX3 & A7IV full-frame cameras, prime master glass, gimbal stabilization, high-fidelity wireless audio, licensed 4K aerial drone coverage.

=========================
2. SIGNATURE GUARANTEES & PERKS
=========================
- "1-Month Album Delivery Guarantee": Flush-mount, handcrafted leather photobook albums and master digital edits delivered within 30 days of client photo selection, or the client receives a ₹1,000 cash credit. (Standard studios take 3-6 months).
- "Free Pre-Wedding Shoot Perk": Book a complete multi-day wedding package and receive a complimentary outdoor pre-wedding couple photoshoot with styling concepts.
- "Signature Color Grading": Skin-true, rich South Indian traditional ceremony tones and cinematic color grading.
- "Damage Replacement Guarantee": In case of any transit damage to frames or albums, SSS Studio provides 100% free re-print & replacement.

=========================
3. PHOTOGRAPHY SERVICES & RATES
=========================
- Wedding & Muhurtham Ceremony: Traditional rituals, candid emotion capture, 4K cinematic video, drone aerials, master photobook album (Starts ~₹18,000 - ₹75,000+).
- Pre-Wedding & Post-Wedding Outdoor Shoots: Scenic hill stations (Kodaikanal, Munnar), tea estates, heritage temples (Starts ~₹8,000).
- Outdoor & Studio Maternity Sessions: Safe, tender, creative poses with sanitized studio gowns and backdrops (Starts ~₹6,000).
- Baby & 1st Birthday / Cake Smash: Sanitized wraps & wooden props, milestone themes (3M, 6M, 1Y) (Starts ~₹5,000).
- School / College / Corporate Functions: Stage coverage, graduation days, group and individual portraits (Starts ~₹5,000).
- Biometric Passport Prints: Indian & international passport/visa specs with studio record lookup.

=========================
4. 13-TIER HANDCRAFTED PHOTO FRAMES (PRICE LIST)
=========================
All frames include premium photo mounting and client choice of Sparkle Lamination (Glitter/Luxury), Matte Finish (Anti-Glare), or High Gloss:
- 8x10 (₹349) - Bedside Table, Study Desk, Office Cabin
- 8x12 (₹499) - Bookshelf Display, Dressing Mirror (Best Value)
- 10x12 (₹699) - Console Table, Bedside Wall Hanging
- 10x15 (₹799) - Passage Gallery, Staircase Collage Wall
- 12x15 (₹899) - Bedroom Side Wall, Compact Dining
- 12x18 (₹1,099) - Living Room Accent, Compact Wall (Most Popular)
- 14x20 (₹1,299) - Hallway Centerpiece, Living Room Side
- 16x20 (₹1,799) - Drawing Room Wall, Couple Portrait Feature
- 16x24 (₹1,999) - Reception Backdrop, Main Living Room Gallery (Grand Pick)
- 18x24 (₹2,499) - Large Bedroom Focal Wall, Over-Bed Centerpiece
- 20x24 (₹2,799) - Dining Area Feature, Family Portrait Wall
- 20x30 (₹3,499) - Luxury Living Room Feature Wall, Villa Foyer (Statement Art)
- 24x36 (₹4,999) - Grand Reception Hall, Master Villa Wall (Royal Size)

=========================
5. PERSONALIZED BIRTHDAY GIFTS
=========================
- 3D Crystal Photo Cube (₹1,499) - Sub-surface laser engraving with LED base.
- Customized Wooden Photo Plaque (₹899) - Handcrafted natural pinewood print.
- Magic Photo Mug (₹449) - Heat-sensitive color reveal.
- High-Gloss Metal Keychain (₹299) - Pocket-sized keepsake.
- Acrylic Desk LED Night Lamp (₹1,199) - Warm glow customized acrylic.

=========================
6. FREQUENTLY ASKED QUESTIONS (POLICIES)
=========================
- Travel: Based in Avaniyapuram, Madurai; covers all of Tamil Nadu and South India (travel charges apply outside Madurai).
- Raw Photos: SSS Studio does NOT provide raw/unprocessed files. All delivered photos are curated, color-graded, and master retouched.
- Booking Deposit: 30% advance deposit secures event dates.
- Digital Delivery: High-resolution photos delivered via secure private cloud gallery (stored for 6 months).

=========================
7. AGENTIC TOOL INSTRUCTIONS
=========================
You have access to DETERMINISTIC TOOLS. YOU MUST CALL TOOLS whenever client intent matches:
1. Frame advice or wall sizing -> CALL "query_frames".
2. Pricing, package calculation, wedding/maternity cost -> CALL "calculate_package_quote".
3. Order or tracking query -> CALL "track_order".
4. Ready to book or wants WhatsApp quote -> CALL "create_whatsapp_deal".

=========================
8. LANGUAGE & TONE
=========================
- Fluent in English, Tamil (தமிழ்), and Tanglish.
- Greet with "Vanakkam! 🙏" or warm South Indian hospitality.
- When answering in Tamil/Tanglish, use natural friendly phrasing (e.g. "Vanakkam! Enga Madurai studio-la 1-Month Delivery Guarantee irukku...").
- Keep replies concise, positive, and direct clients to the interactive action cards.`;

export async function runStudioAgent({ messages = [], apiKey = null }) {
  const effectiveApiKey = apiKey || process.env.NVIDIA_API_KEY;

  if (!effectiveApiKey) {
    throw new Error("NVIDIA_API_KEY is not configured.");
  }

  const openai = new OpenAI({
    apiKey: effectiveApiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  const conversation = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  let actionCards = [];

  try {
    // 1. Initial agent call with tools enabled (with 8s timeout for snappy user experience)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("NVIDIA_TIMEOUT")), 8000)
    );

    const completionPromise = openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro-0813",
      messages: conversation,
      tools: AGENT_TOOLS,
      tool_choice: "auto",
      temperature: 0.6,
      max_tokens: 1500,
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    const responseMessage = completion.choices[0]?.message;

    // 2. If DeepSeek calls tools:
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

      // 3. Second call so DeepSeek can speak naturally based on tool observations
      const finalCompletion = await openai.chat.completions.create({
        model: "deepseek-ai/deepseek-v4-pro-0813",
        messages: conversation,
        temperature: 0.6,
        max_tokens: 1000,
      });

      const finalReply = finalCompletion.choices[0]?.message?.content || "";
      return {
        reply: finalReply,
        actionCards,
      };
    }

    // Direct answer if no tools needed
    return {
      reply: responseMessage?.content || "Vanakkam! How can SSS Photography Studio make your celebration memorable today?",
      actionCards,
    };
  } catch (error) {
    console.error("DeepSeek Agent Error:", error);

    // Fallback: If NVIDIA endpoint times out or is queued, perform smart intent fallback
    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const lower = lastUserMsg.toLowerCase();

    if (lower.includes("frame") || lower.includes("size") || lower.includes("wall") || lower.includes("photo") || lower.includes("விலை")) {
      const toolRes = await executeAgentTool("query_frames", {
        room_type: lower.includes("sofa") || lower.includes("hall") || lower.includes("living") ? "living room" : "bedroom",
        wall_space: lower,
      });
      return {
        reply: "Vanakkam! Here are our top recommended handcrafted photo frame sizes for your wall. Each includes custom photo mounting with your choice of Sparkle or Matte lamination:",
        actionCards: [toolRes],
      };
    }

    if (lower.includes("quote") || lower.includes("price") || lower.includes("cost") || lower.includes("wedding") || lower.includes("package") || lower.includes("திருமணம்")) {
      const toolRes = await executeAgentTool("calculate_package_quote", {
        event_type: lower.includes("maternity") ? "maternity" : lower.includes("baby") || lower.includes("birthday") ? "birthday" : "wedding",
        include_drone: lower.includes("drone"),
        include_master_album: true,
      });
      return {
        reply: `Here is the estimated quote for your session with our signature 1-Month Delivery Guarantee! You can tap below to customize or chat directly on WhatsApp:`,
        actionCards: [toolRes],
      };
    }

    if (lower.includes("track") || lower.includes("status") || lower.includes("order")) {
      return {
        reply: "You can track your photo frame order or album by entering your 10-digit mobile number or Order ID below:",
        actionCards: [{ action: "TRACK_ORDER", message: "Enter your 10-digit phone number or Order ID (e.g. SSS-1234) on the Track Order page." }],
      };
    }

    if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("எங்கே") || lower.includes("நேரம்")) {
      return {
        reply: "SSS Photography Studio is located at 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu 625012. We are open Monday to Sunday, 9:00 AM to 8:00 PM. Call or WhatsApp us at +91 63835 65425!",
        actionCards: [],
      };
    }

    if (lower.includes("guarantee") || lower.includes("delivery") || lower.includes("month") || lower.includes("உறுதி") || lower.includes("ஆல்பம்")) {
      return {
        reply: "Our signature '1-Month Album Delivery Guarantee' promises your handcrafted flush-mount leather album and master retouched high-res photos within 30 days of photo selection — or you receive a ₹1,000 cash credit! Standard studios take 3–6 months.",
        actionCards: [],
      };
    }

    if (lower.includes("gift") || lower.includes("crystal") || lower.includes("mug") || lower.includes("keychain") || lower.includes("lamp") || lower.includes("பரிசு")) {
      return {
        reply: "We craft personalized birthday & anniversary gifts:\n• 3D Crystal Photo Cube with LED base (₹1,499)\n• Custom Wooden Photo Plaque (₹899)\n• Magic Color-Changing Photo Mug (₹449)\n• Acrylic LED Night Lamp (₹1,199)\n• High-Gloss Metal Keychain (₹299)\nYou can order directly with photo upload in our Store section!",
        actionCards: [],
      };
    }

    if (lower.includes("raw") || lower.includes("unedited")) {
      return {
        reply: "We do not provide raw or unedited files. Part of our premium service is meticulous culling, color grading, and retouching to ensure every delivered photograph meets SSS Studio's signature excellence.",
        actionCards: [],
      };
    }

    if (lower.includes("deposit") || lower.includes("advance") || lower.includes("book") || lower.includes("முன்பணம்")) {
      return {
        reply: "To secure your event date with SSS Studio, a 30% advance deposit is required. You can book directly on our website or message us on WhatsApp (+91 63835 65425).",
        actionCards: [],
      };
    }

    if (lower.includes("travel") || lower.includes("outstation") || lower.includes("பயணம்")) {
      return {
        reply: "Yes! While we are based in Avaniyapuram, Madurai, we travel across Tamil Nadu and South India for weddings and events. Travel fees apply for locations outside Madurai district.",
        actionCards: [],
      };
    }

    if (lower.includes("camera") || lower.includes("equipment") || lower.includes("gear")) {
      return {
        reply: "We shoot with cinema-grade Sony FX3 & A7IV full-frame cameras, prime lenses, gimbal stabilization, high-fidelity wireless audio, and licensed 4K aerial drones.",
        actionCards: [],
      };
    }

    if (lower.includes("contact") || lower.includes("phone") || lower.includes("whatsapp") || lower.includes("number") || lower.includes("தொடர்பு")) {
      return {
        reply: "You can reach SSS Photography Studio directly on Phone or WhatsApp at +91 63835 65425. We are open Monday to Sunday, 9:00 AM to 8:00 PM at 34, Prasanna New Colony, Avaniyapuram, Madurai.",
        actionCards: [],
      };
    }

    return {
      reply: "Vanakkam! 🙏 Welcome to SSS Photography Studio in Avaniyapuram, Madurai. We specialize in weddings, outdoor pre-wedding shoots, maternity, baby milestones, and 13 sizes of handcrafted custom photo frames with our 1-Month Album Delivery Guarantee. How can we help you today?",
      actionCards: [],
    };
  }
}
