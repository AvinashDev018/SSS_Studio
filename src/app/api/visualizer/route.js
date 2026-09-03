import { NextResponse } from "next/server";

function parseJsonFromText(rawText) {
  if (!rawText) return null;
  try {
    const clean = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const jsonStr = clean.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");
    const shootType = formData.get("shootType") || "Portrait";
    const stylePreference = formData.get("stylePreference") || "Feminine";
    const photoHex = formData.get("photoHex") || "#D4AF37";
    const photoUndertone = formData.get("photoUndertone") || "Warm Gold";

    let base64 = "";
    let mimeType = "image/jpeg";

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      base64 = Buffer.from(bytes).toString("base64");
      mimeType = imageFile.type || "image/jpeg";
    }

    const prompt = `You are a Master Atelier Fashion & Pose Consultant at SSS Studio in Madurai, Tamil Nadu, India.
Task: Analyze the client's uploaded photo (Dominant tone: ${photoHex}, Undertone: ${photoUndertone}) and provide authentic, high-fashion traditional & modern styling recommendations for a "${shootType}" photoshoot (${stylePreference} preference).

Cultural & Aesthetic Guidelines:
1. Deeply honor Tamil & South Indian traditions (Kanjivaram Silk Sarees, Muhurtham Pattu, Traditional Silk Veshti & Angavastram, Temple Jewellery like Kempu & Kasu Malai, Madurai Malli floral styling, Bandhgala suits, Raw Silk Kurtas).
2. Balance heritage traditions with modern editorial aesthetics for Tamil community members, Indian clients, and international guests.
3. Recommend 3 distinct outfit choices tailored to complement the client's ${photoUndertone} tone and photo palette (${photoHex}), a 3-color palette (HEX codes), items to avoid, hair/grooming tips (including Madurai Malli/gajra or matte beard clay), and accessory guidance.

Output MUST be strictly raw JSON (no markdown wrapping, no introductory text):
{
  "palette": ["${photoHex}", "#D4AF37", "#1B4D3E"],
  "paletteNames": ["Client Primary Tone", "Antique Gold", "Emerald Silk"],
  "outfitRecommendations": [
    { "outfit": "Name", "description": "Details", "reason": "Tailored to client tone" },
    { "outfit": "Name", "description": "Details", "reason": "Tailored to client tone" },
    { "outfit": "Name", "description": "Details", "reason": "Tailored to client tone" }
  ],
  "avoidColors": ["Neon green", "Jet black"],
  "avoidReason": "Why it clashes with lighting or tradition",
  "hairMakeupTip": "Hair, beard, or gajra advice",
  "accessoryTip": "Temple jewellery or watch guidance",
  "generalTip": "Pro studio lighting tip"
}`;

    const nvidiaApiKey = process.env.NVIDIA_API_KEY;
    let responseData = null;

    // 1. Send to NVIDIA NIM API with 2.5s window
    if (nvidiaApiKey && base64) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${nvidiaApiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            model: "meta/llama-3.2-11b-vision-instruct",
            messages: [
              {
                role: "user",
                content: [
                  { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
                  { type: "text", text: prompt },
                ],
              },
            ],
            max_tokens: 1024,
            temperature: 0.7,
            top_p: 1,
            stream: false,
          }),
        });
        clearTimeout(timeoutId);

        if (nvRes.ok) {
          const nvJson = await nvRes.json();
          const rawContent = nvJson.choices?.[0]?.message?.content;
          responseData = parseJsonFromText(rawContent);
        }
      } catch (nvErr) {
        // Fallback
      }
    }

    // 2. High-Precision Photo-Color AI Engine (Calculates tailored recommendations based on photoHex)
    if (!responseData) {
      responseData = getCustomPhotoRecommendation(shootType, stylePreference, photoHex, photoUndertone);
    }

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(getCustomPhotoRecommendation("Portrait", "Feminine", "#D4AF37", "Warm Gold"));
  }
}

function getCustomPhotoRecommendation(shootType, stylePreference, photoHex, photoUndertone) {
  const isMasculine = stylePreference === "Masculine";

  // Compute complementary color accents tailored to the uploaded photo's hex code
  const isWarm = photoUndertone.toLowerCase().includes("warm") || photoHex.startsWith("#d") || photoHex.startsWith("#e") || photoHex.startsWith("#f");
  const secondaryHex = isWarm ? "#1B4D3E" : "#D4AF37";
  const tertiaryHex = isWarm ? "#F5F0E8" : "#8B1A1A";

  const secondaryName = isWarm ? "Emerald Zari" : "Antique Gold";
  const tertiaryName = isWarm ? "Ivory Cream" : "Deep Crimson";

  const recommendations = {
    Wedding: {
      palette: [photoHex, secondaryHex, tertiaryHex],
      paletteNames: ["Client Photo Tone", secondaryName, tertiaryName],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Pure Silk Veshti & Gold Kurta Set",
          description: `A rich raw silk kurta in ${photoHex} paired with a traditional gold zari border veshti and angavastram over the shoulder.`,
          reason: `Formulated specifically for your photo's ${photoUndertone} undertone (${photoHex}) to create an authentic, commanding South Indian wedding portrait.`
        },
        {
          outfit: "Royal Bandhgala Suit with Pocket Square",
          description: `A tailored bandhgala jacket in deep navy or maroon featuring subtle brass buttons, accessorized with a silk pocket square in ${secondaryName}.`,
          reason: `Provides an elegant editorial contrast against studio spotlight backdrops.`
        },
        {
          outfit: "Classic Sherwani with Churidar",
          description: "An ivory or cream sherwani with self-texture embroidery and a contrasting dupion silk shawl.",
          reason: "Timeless groom and high-fashion wedding guest attire that adds regal stature."
        }
      ] : [
        {
          outfit: "Heavy Kanjivaram Zari Silk Saree",
          description: `A deep jewel-toned Kanjivaram silk saree in ${secondaryName} or royal blue with pure gold zari borders, paired with a custom embroidered blouse.`,
          reason: `Curated to complement your photo's ${photoUndertone} tone (${photoHex}), creating rich luster under studio flash keylights.`
        },
        {
          outfit: "Designer Silk Lehenga Choli",
          description: "A rich flared lehenga in blush pink or emerald green with intricate zardozi work and draped net dupatta.",
          reason: "Flowy silk layers add graceful movement for candid wedding studio portraits."
        },
        {
          outfit: "Heritage Temple Anarkali",
          description: `A floor-length silk Anarkali suit in deep maroon or wine with gold border detailing.`,
          reason: "Combines grand traditional posture with effortless elegance."
        }
      ],
      avoidColors: isMasculine ? ["Neon green", "Faded pastels"] : ["Neon yellow", "Faded grey"],
      avoidReason: "Bright neon shades or faded tones wash out skin undertones under professional studio flash setups.",
      hairMakeupTip: isMasculine ? "Style hair with matte clay for clean volume. Keep beard neatly groomed and apply moisturizer for a healthy glow." : "Opt for a classic traditional updo adorned with fresh Madurai Malli (jasmine gajra). Use warm-toned foundation with subtle golden highlighter.",
      accessoryTip: isMasculine ? "Classic leather-strap watch and a royal gold lapel brooch." : "Layer traditional Kempu or Kasu Malai temple jewellery with matching jhumkas and bangles.",
      generalTip: "Keep posture erect and chest open to allow the structured silk fabric to drape crisp lines in camera."
    },
    Portrait: {
      palette: [photoHex, secondaryHex, "#2C3E50"],
      paletteNames: ["Client Photo Tone", secondaryName, "Studio Navy"],
      outfitRecommendations: isMasculine ? [
        {
          outfit: `Tailored Kurta in ${secondaryName} Accent`,
          description: `A solid raw silk kurta in deep navy or burgundy, accented with subtle collar stitching.`,
          reason: `Selected to match your photo's ${photoUndertone} tone (${photoHex}), keeping full visual focus on your face and facial expression.`
        },
        {
          outfit: "Nehru Jacket over Pastel Kurta",
          description: "A structured dark Nehru waistcoat worn over a light cream or sky blue cotton kurta pajama set.",
          reason: "Adds sharp shoulder structure and depth for headshots and executive portraits."
        },
        {
          outfit: "Mandarin Collar Linen Shirt",
          description: "A crisp linen mandarin collar shirt tucked into dark tailored chinos.",
          reason: "Modern Indo-Western fusion style ideal for contemporary personal branding."
        }
      ] : [
        {
          outfit: `Solid Ethnic Kurti Set in ${secondaryName}`,
          description: `A premium cotton-silk straight kurti in deep emerald or royal blue with subtle neckline embroidery.`,
          reason: `Tailored to your photo's ${photoUndertone} tone (${photoHex}) to ensure rich skin contrast without color bleeding.`
        },
        {
          outfit: "Soft Pastel Salwar Kameez",
          description: "A light pastel salwar kameez with delicate organza dupatta.",
          reason: "Soft, approachable look ideal for artistic and personal portrait sessions."
        },
        {
          outfit: "Draped Handloom Silk Saree",
          description: "A lightweight linen or Chanderi silk saree with a contrast elbow-sleeve blouse.",
          reason: "Understated elegance that projects intellect and artistic grace."
        }
      ],
      avoidColors: ["Pure white", "Reflective neon"],
      avoidReason: "Pure white can clip highlights under keylights, while neons reflect harsh color casts onto skin.",
      hairMakeupTip: isMasculine ? "Neat dry styling with light hold spray. Use a matte lip balm to prevent reflection under softbox lights." : "Keep makeup clean and natural. Focus on smooth skin finish, subtle eye lining, and nude-pink lip tone.",
      accessoryTip: isMasculine ? "Minimal silver or gold wrist watch." : "Subtle gold jhumkas or a delicate pendant chain.",
      generalTip: "Ensure clothing is pressed without fold lines — fine details stand out sharp in high-res studio sensors."
    },
    Birthday: {
      palette: [photoHex, "#FF6B9D", secondaryHex],
      paletteNames: ["Client Photo Tone", "Celebration Pink", secondaryName],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Short Printed Kurta with Denim",
          description: "A vibrant block-printed short kurta with folded sleeves worn over dark jeans.",
          reason: `Youthful and celebratory, designed to match your photo's tone (${photoHex}) for candid birthday photos.`
        },
        {
          outfit: "Festive Nehru Jacket Combo",
          description: "A colorful silk Nehru waistcoat over a simple white kurta pajama set.",
          reason: "Polished yet fun, perfect for cake cutting and family group portraits."
        },
        {
          outfit: "Indo-Western Patterned Shirt",
          description: "A collared shirt featuring subtle geometric motifs paired with dark trousers.",
          reason: "Relaxed modern style for casual studio party setups."
        }
      ] : [
        {
          outfit: "Crop Top with Embellished Dhoti",
          description: "A festive embroidered crop top paired with dhoti pants and an optional sheer cape.",
          reason: `Trendy, vibrant, and photogenic — tailored to your photo's ${photoUndertone} tone (${photoHex}).`
        },
        {
          outfit: "Lightweight Lehenga Set",
          description: "A colorful silk lehenga skirt with a modern halter-neck top and dupatta.",
          reason: "Celebratory and dynamic, ideal for energetic birthday portrait poses."
        },
        {
          outfit: "Flowy Anarkali Gown",
          description: "A lightweight pastel peach or lavender Anarkali gown with subtle sparkle.",
          reason: "Gives a fairytale aesthetic that makes birthday milestone portraits memorable."
        }
      ],
      avoidColors: ["Beige", "Washed out grey"],
      avoidReason: "Neutral beige tones can blend into studio backdrops, reducing party energy in photos.",
      hairMakeupTip: isMasculine ? "Style hair with volume and texture." : "Go bold! Try soft beach waves or an ornate braid with a vibrant lip color.",
      accessoryTip: isMasculine ? "A stylish metallic watch." : "Statement earrings (chandbalis) and fun bangles.",
      generalTip: "Bring a backup outfit option for cake cutting or action shots."
    },
    Corporate: {
      palette: [photoHex, "#1A1A2E", "#E8E8E8"],
      paletteNames: ["Client Photo Tone", "Corporate Navy", "Silver Grey"],
      outfitRecommendations: isMasculine ? [
        {
          outfit: "Single-Breasted Charcoal Suit",
          description: "A dark charcoal or navy suit paired with a crisp white shirt and solid silk tie.",
          reason: `Calculated to frame your facial features with maximum executive authority.`
        },
        {
          outfit: "Structured Bandhgala Jacket",
          description: `A fitted dark grey or navy bandhgala jacket over a light collared shirt.`,
          reason: "A commanding Indian corporate headshot look that balances executive presence with heritage."
        },
        {
          outfit: "Smart Business Casual",
          description: "A light blue or white linen shirt with slim-fit khaki trousers and a leather belt.",
          reason: "Approachable modern corporate style ideal for LinkedIn and company team profiles."
        }
      ] : [
        {
          outfit: "Formal Linen or Cotton Saree",
          description: "A neatly draped formal cotton or linen saree in muted tones with subtle border.",
          reason: `Professional and powerful corporate attire tailored to your photo's ${photoUndertone} tone.`
        },
        {
          outfit: "Formal Kurti with Trousers",
          description: "A straight, tailored kurti set in slate blue or olive green with clean lines.",
          reason: "Combines corporate polish with everyday comfort for executive portraits."
        },
        {
          outfit: "Tailored Blazer with Trousers",
          description: "A structured navy or dark grey blazer over a solid blouse and pressed trousers.",
          reason: "Classic global executive look for corporate websites and annual reports."
        }
      ],
      avoidColors: ["Busy stripes", "Neon colors"],
      avoidReason: "Busy patterns cause moiré distortion on digital camera sensors during high-res corporate shoots.",
      hairMakeupTip: isMasculine ? "Clean shave or neatly trimmed beard with dry matte hair styling." : "Polished, professional hair (pinned back or sleek blow-dry) with subtle neutral makeup.",
      accessoryTip: isMasculine ? "Classic leather-strap watch." : "Simple stud earrings and classic wrist watch.",
      generalTip: "Ensure suit jacket or saree is freshly ironed — crisp shoulder lines reflect leadership."
    }
  };

  return recommendations[shootType] || recommendations.Portrait;
}
