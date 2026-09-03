import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");
    const shootType = formData.get("shootType") || "Portrait";
    const stylePreference = formData.get("stylePreference") || "Feminine";

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    const prompt = `You are a Master Atelier Stylist at SSS Studio in Madurai, Tamil Nadu, India.
Task: Analyze the client's photo and provide authentic, high-fashion styling recommendations for a "${shootType}" shoot (${stylePreference} preference).

Cultural Styling Rules:
1. Deeply honor Tamil & South Indian traditions (Kanjivaram Silk Sarees, Muhurtham Pattu, Traditional Silk Veshti & Angavastram, Temple Jewellery like Kempu & Kasu Malai, Madurai Malli floral styling, Bandhgala suits, Raw Silk Kurtas).
2. Balance heritage traditions with modern editorial aesthetics for Tamil community members, Indian clients, and international guests.
3. Recommend 3 distinct outfit choices with tailored reasons, a 3-color palette (HEX codes), items to avoid, hair/grooming tips (including Madurai Malli/gajra or matte beard clay), and accessory guidance.

Output MUST be strictly raw JSON (no markdown or extra text):
{
  "palette": ["#hex1", "#hex2", "#hex3"],
  "paletteNames": ["ColorName1", "ColorName2", "ColorName3"],
  "outfitRecommendations": [
    { "outfit": "Name", "description": "Details", "reason": "Cultural & Visual reason" },
    { "outfit": "Name", "description": "Details", "reason": "Cultural & Visual reason" },
    { "outfit": "Name", "description": "Details", "reason": "Cultural & Visual reason" }
  ],
  "avoidColors": ["Color1", "Color2"],
  "avoidReason": "Why it clashes with lighting or tradition",
  "hairMakeupTip": "Hair, beard, or gajra advice",
  "accessoryTip": "Temple jewellery or watch guidance",
  "generalTip": "Pro studio lighting tip"
}`;

    const nvidiaApiKey = process.env.NVIDIA_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    let responseData = null;

    // 1. Try NVIDIA NIM API (Primary)
    if (nvidiaApiKey) {
      try {
        const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${nvidiaApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta/llama-3.2-11b-vision-instruct",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
                ],
              },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        });

        if (nvRes.ok) {
          const nvJson = await nvRes.json();
          const rawContent = nvJson.choices?.[0]?.message?.content;
          if (rawContent) {
            const cleanText = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();
            responseData = JSON.parse(cleanText);
          }
        }
      } catch (nvErr) {
        console.warn("NVIDIA NIM API attempt failed, falling back:", nvErr);
      }
    }

    // 2. Fallback to Gemini API if NVIDIA is unavailable or returned error
    if (!responseData && geminiApiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mimeType, data: base64 } },
                  ],
                },
              ],
              generationConfig: {
                response_mime_type: "application/json",
                temperature: 0.7,
                max_output_tokens: 1024,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            responseData = JSON.parse(cleanText);
          }
        }
      } catch (gErr) {
        console.warn("Gemini API fallback attempt failed:", gErr);
      }
    }

    // 3. Fallback to Smart Studio Styling Engine
    if (!responseData) {
      const fallbackData = getMockRecommendation(shootType, stylePreference);
      return NextResponse.json({ ...fallbackData, isFallback: true, fallbackReason: "rule_engine" });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Visualizer API error:", error);
    return NextResponse.json({ ...getMockRecommendation(shootType, stylePreference), isFallback: true, fallbackReason: "server_error" });
  }
}

function getMockRecommendation(shootType, stylePreference = "Feminine") {
  const isMasculine = stylePreference === "Masculine";

  const recommendations = {
    Wedding: {
      palette: isMasculine ? ["#4A0E17", "#D4AF37", "#F5F0E8"] : ["#D4AF37", "#F5F0E8", "#8B6914"],
      paletteNames: isMasculine ? ["Deep Maroon", "Antique Gold", "Ivory Cream"] : ["Golden Silk", "Ivory Cream", "Rich Bronze"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Royal Sherwani Set", description: "An ivory or cream sherwani with subtle self-embroidery, paired with a maroon pocket square and churidar.", reason: "Sherwanis look exceptionally noble and classic under indoor spotlight wedding setups." },
        { outfit: "Indo-Western Bandhgala", description: "A structured bandhgala jacket in deep navy or maroon, paired with slim-fit trousers.", reason: "Combines a modern silhouette with traditional style, great for couple shoots." },
        { outfit: "Premium Silk Kurta & Dhoti", description: "A pure silk mustard or gold kurta paired with a traditional silk veshti/dhoti.", reason: "Traditional South Indian attire that highlights cultural roots beautifully." }
      ] : [
        { outfit: "Kanjivaram Silk Saree", description: "A deep jewel-toned Kanjivaram in royal blue or emerald green with gold zari border.", reason: "The rich contrast photographs beautifully under studio lighting." },
        { outfit: "Designer Lehenga Choli", description: "Pastel pink or mint lehenga with heavy embroidery and dupatta styled over one shoulder.", reason: "Flowy fabric creates elegant movement in candid shots." },
        { outfit: "Anarkali Suit", description: "A floor-length Anarkali in wine red or deep teal with mirror work embellishments.", reason: "Adds regal drama perfect for wedding portraits." }
      ],
      avoidColors: isMasculine ? ["Vibrant neon green", "Faded pastels"] : ["Neon colors", "Jet black"],
      avoidReason: isMasculine ? "These colors distract focus from the details of the wedding backdrop." : "These colors either wash out or create harsh contrasts under wedding lighting.",
      hairMakeupTip: isMasculine ? "Neatly trimmed and styled hair with a matte finish styling clay. Ensure beard is well-groomed and apply light moisturizer for a healthy glow." : "Opt for a classic updo with jasmine flowers (gajra) or a side-swept style with soft curls. Use warm-toned makeup with a subtle shimmer highlighter.",
      accessoryTip: isMasculine ? "A classic watch, a royal brooch on the sherwani lapel, or a traditional safa/turban for the main ceremony." : "Layer temple jewellery or kundan sets. A maang tikka, jhumkas, and matching glass bangles complete the traditional look perfectly.",
      generalTip: "Stand straight to keep the structure of the sherwani or jacket crisp in wedding photos."
    },
    Portrait: {
      palette: ["#2C3E50", "#ECF0F1", "#3498DB"],
      paletteNames: ["Deep Navy", "Soft White", "Sky Blue"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Solid-color Kurta", description: "A well-fitted cotton or raw silk kurta in a deep solid color like navy, burgundy, or forest green.", reason: "Solid colors draw attention to your face and expressions, not the clothing." },
        { outfit: "Mandarin Collar Nehru Shirt", description: "A crisp, well-ironed Nehru collar shirt in pastel blue or cream linen.", reason: "Indo-western style that looks clean and modern for personal portraits." },
        { outfit: "Nehru Jacket with Kurta", description: "A structured dark Nehru jacket over a light pastel colored kurta pajama set.", reason: "Classic, dignified look that adds great depth to close-up portraits." }
      ] : [
        { outfit: "Solid-color Kurti", description: "A well-fitted premium cotton kurti in a deep solid color like navy, burgundy, or forest green.", reason: "Solid colors draw attention to your face and expressions, not the clothing." },
        { outfit: "Classic Salwar Kameez", description: "A clean, pressed Salwar Kameez in soft pastel shades with a matching dupatta.", reason: "A simple and beautiful traditional look that photographs cleanly." },
        { outfit: "Ethnic Anarkali", description: "A fitted Anarkali suit in a muted jewel tone like dusty rose or sage green.", reason: "Creates an elegant, artistic portrait with cultural depth." }
      ],
      avoidColors: ["White", "Bright red"],
      avoidReason: "White can overexpose against studio lights. Bright red can distort skin tones in digital sensors.",
      hairMakeupTip: isMasculine ? "Neat grooming. Keep hair in place with a light hold product. Use a matte lip balm to prevent dry lips under flash." : "Keep makeup clean and natural. Even skin tone is the priority — use a good primer, light eyeliner, and setting powder to avoid shine under studio lights.",
      accessoryTip: isMasculine ? "A simple minimal watch or no accessories at all to keep the focus entirely on your facial expressions." : "Keep jewellery minimal — small jhumkas or a simple pendant work best. Avoid chunky pieces that distract from your face.",
      generalTip: "Iron your outfit the night before. Even small wrinkles become very visible in high-resolution studio lighting."
    },
    Birthday: {
      palette: isMasculine ? ["#1E3A8A", "#10B981", "#F59E0B"] : ["#FF6B9D", "#C84B8B", "#FFD700"],
      paletteNames: isMasculine ? ["Royal Navy", "Festive Green", "Golden Amber"] : ["Party Pink", "Deep Fuchsia", "Celebration Gold"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Printed Short Kurta", description: "A stylized short kurta in block prints or soft florals, worn with folded sleeves over jeans.", reason: "Fun, vibrant and relaxed, perfect for birthday celebrations and casual event candids." },
        { outfit: "Nehru Jacket & Kurta Pajama", description: "A lightweight pastel Nehru waistcoat worn over a simple white linen kurta pajama set.", reason: "Provides a premium, festive look that feels celebratory and polished." },
        { outfit: "Indo-Western Fusion Shirt", description: "A collared shirt featuring subtle ethnic patterns paired with dark chinos.", reason: "Gives a youthful, stylish look ideal for casual studio birthday setups." }
      ] : [
        { outfit: "Indo-Western Crop Top & Dhoti", description: "A colorful crop top paired with stylish dhoti pants and an embellished cape.", reason: "Trendy, dynamic, and photogenic, great for active, candid birthday shots." },
        { outfit: "Lehenga with Crop Top", description: "A colorful lightweight skirt lehenga with a modern halter-neck crop top.", reason: "Vibrant and celebratory, perfect for a modern birthday celebration." },
        { outfit: "Anarkali Gown", description: "A lightweight, flowy Anarkali gown in pastel peach or lavender.", reason: "Gives a fairytale princess look that makes milestone birthdays feel extra special." }
      ],
      avoidColors: ["Pale pastels", "Beige"],
      avoidReason: "These colors can look washed out and blend into the backdrop in birthday party setups.",
      hairMakeupTip: isMasculine ? "Style hair with texture and volume. A light, fresh cologne completes the look." : "Go bold! This is your day — consider a blow-out, beach waves, or a fun braid. Use a bold lip in red or fuchsia to complement the celebration vibe.",
      accessoryTip: isMasculine ? "A stylish metallic watch or a simple silver bracelet." : "Statement earrings (heavy chandbalis) or a birthday sash are encouraged! Don't shy away from glam accessories today.",
      generalTip: "Bring a backup outfit. Birthday shoots often involve fun activities (cutting cake, balloon tosses) where the original outfit might get slightly messy."
    },
    Corporate: {
      palette: ["#1A1A2E", "#E8E8E8", "#4A90D9"],
      paletteNames: ["Professional Navy", "Light Grey", "Corporate Blue"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Single-Breasted Suit", description: "A charcoal grey or dark navy blue suit with a white shirt and a solid-colored tie.", reason: "Classic corporate headshot attire that projects competence and leadership." },
        { outfit: "Modest Bandhgala Jacket", description: "A structured bandhgala or Nehru jacket in grey or navy over a crisp linen shirt.", reason: "A professional and modern Indian corporate profile look that balances culture and business." },
        { outfit: "Smart Business Casual", description: "A tucked-in light blue shirt with slim-fit khaki or dark trousers and a leather belt.", reason: "Approachable and modern — perfect for tech startups or creative agencies." }
      ] : [
        { outfit: "Formal Cotton Saree", description: "A neatly draped formal linen, cotton, or raw silk saree in subtle borders and muted colors.", reason: "Elegant, professional, and powerful corporate attire for Indian business contexts." },
        { outfit: "Formal Kurti Set", description: "A premium, well-fitted straight kurti set in solid muted tones like slate blue, olive, or charcoal.", reason: "Combines professionalism with comfort and cultural identity — excellent for company profiles." },
        { outfit: "Blazer with Trousers", description: "A fitted blazer in navy or dark grey over pressed trousers with a simple blouse.", reason: "Classic global professional look — ideal for international corporate websites and LinkedIn profiles." }
      ],
      avoidColors: ["Busy patterns", "Neon colors"],
      avoidReason: "Complex patterns are distracting in professional photos and can appear to 'vibrate' at certain camera settings.",
      hairMakeupTip: isMasculine ? "Ensure a clean shave or a neatly trimmed beard. Hair should be dry-styled or styled with matte wax (no greasy look)." : "Hair should be neat and professional — pinned back or styled cleanly. Makeup should be polished but understated: foundation, subtle contouring, and a neutral lip.",
      accessoryTip: isMasculine ? "Keep it to a minimum — a professional leather-strap watch or metal watch." : "A classic watch, simple stud earrings, and a thin gold/silver chain.",
      generalTip: "Ensure your suit, saree, or jacket is freshly pressed. First impressions in corporate photos hinge entirely on the sharpness of your look."
    }
  };
  return recommendations[shootType] || recommendations.Portrait;
}
