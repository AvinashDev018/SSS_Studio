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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // If no Gemini key, return a smart mock response
      return NextResponse.json(getMockRecommendation(shootType, stylePreference));
    }

    const prompt = `You are a professional photography stylist at SSS Studio, a premium photography studio in Madurai, India.
    
A client has shared their photo and wants to book a "${shootType}" photoshoot. Analyze their appearance carefully and provide highly personalized outfit and styling recommendations.

IMPORTANT: The client has selected a preference for "${stylePreference}" outfit styling. 
- If Masculine: Recommend men's wear (like suits, sherwanis, kurtas, dhotis, blazers). Do NOT recommend sarees, lehengas, or women's clothing.
- If Feminine: Recommend women's wear (like sarees, lehengas, Anarkalis, dresses, gowns). Do NOT recommend men's suits or sherwanis.

Return a JSON object with this exact structure (no markdown, just raw JSON):
{
  "palette": ["#hex1", "#hex2", "#hex3"],
  "paletteNames": ["Color 1 name", "Color 2 name", "Color 3 name"],
  "outfitRecommendations": [
    { "outfit": "Outfit name", "description": "Detailed description", "reason": "Why it works for them" },
    { "outfit": "Outfit name", "description": "Detailed description", "reason": "Why it works for them" },
    { "outfit": "Outfit name", "description": "Detailed description", "reason": "Why it works for them" }
  ],
  "avoidColors": ["Color to avoid 1", "Color to avoid 2"],
  "avoidReason": "Why to avoid these colors",
  "hairMakeupTip": "Specific hair/grooming and makeup advice",
  "accessoryTip": "Jewellery and accessory recommendations",
  "generalTip": "One powerful overall tip for this specific person"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API error:", errorBody);
      // Fallback to mock on API error
      return NextResponse.json(getMockRecommendation(shootType, stylePreference));
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return NextResponse.json(getMockRecommendation(shootType, stylePreference));
    }

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Visualizer API error:", error);
    return NextResponse.json(getMockRecommendation("Portrait", "Feminine"));
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
        { outfit: "Premium Silk Kurta & Dhoti", description: "A pure silk mustard or gold kurta paired with a traditional silk veshti/dhoti.", reason: "Traditional attire that highlights cultural roots beautifully." }
      ] : [
        { outfit: "Kanjivaram Silk Saree", description: "A deep jewel-toned Kanjivaram in royal blue or emerald green with gold zari border.", reason: "The rich contrast photographs beautifully under studio lighting." },
        { outfit: "Designer Lehenga Choli", description: "Pastel pink or mint lehenga with heavy embroidery and dupatta styled over one shoulder.", reason: "Flowy fabric creates elegant movement in candid shots." },
        { outfit: "Anarkali Suit", description: "A floor-length Anarkali in wine red or deep teal with mirror work embellishments.", reason: "Adds regal drama perfect for wedding portraits." }
      ],
      avoidColors: isMasculine ? ["Vibrant neon green", "Faded pastels"] : ["Neon colors", "Jet black"],
      avoidReason: isMasculine ? "These colors distract focus from the details of the wedding backdrop." : "These colors either wash out or create harsh contrasts under wedding lighting.",
      hairMakeupTip: isMasculine ? "Neatly trimmed and styled hair with a matte finish styling clay. Ensure beard is well-groomed and apply light moisturizer for a healthy glow." : "Opt for a classic updo with jasmine flowers or a side-swept style with soft curls. Use warm-toned makeup with a subtle shimmer highlighter.",
      accessoryTip: isMasculine ? "A classic watch, a royal brooch on the sherwani lapel, or a traditional safa/turban for the main ceremony." : "Layer temple jewellery or kundan sets. A maang tikka and matching bangles complete the bridal look perfectly.",
      generalTip: "Stand straight to keep the structure of the sherwani or jacket crisp in portrait shots."
    },
    Portrait: {
      palette: ["#2C3E50", "#ECF0F1", "#3498DB"],
      paletteNames: ["Deep Navy", "Soft White", "Sky Blue"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Solid-color Kurta", description: "A well-fitted kurta in a deep solid color like navy, burgundy, or forest green.", reason: "Solid colors draw attention to your face and expressions, not the clothing." },
        { outfit: "Smart Casual Oxford Shirt", description: "A crisp, well-ironed oxford or linen shirt in subtle checks or solid pastel.", reason: "Timeless and professional — ideal for LinkedIn or personal headshots." },
        { outfit: "Blazer with Crew Neck", description: "A dark blazer paired with a clean white crew neck t-shirt underneath.", reason: "A modern, stylish look that bridges casual and professional seamlessly." }
      ] : [
        { outfit: "Solid-color Top/Kurti", description: "A well-fitted top or kurti in a deep solid color like navy, burgundy, or forest green.", reason: "Solid colors draw attention to your face and expressions, not the clothing." },
        { outfit: "Smart Casual Shirt", description: "A crisp, well-ironed oxford or linen shirt in subtle checks or solid pastel.", reason: "Timeless and professional — ideal for LinkedIn or corporate headshots." },
        { outfit: "Ethnic Anarkali", description: "A fitted Anarkali suit in a muted jewel tone like dusty rose or sage green.", reason: "Creates an elegant, artistic portrait with cultural depth." }
      ],
      avoidColors: ["White", "Bright red"],
      avoidReason: "White can overexpose against studio lights. Bright red can distort skin tones in digital sensors.",
      hairMakeupTip: isMasculine ? "Neat grooming. Keep hair in place with a light hold product. Use a matte lip balm to prevent dry lips under flash." : "Keep makeup clean and natural. Even skin tone is the priority — use a good primer and setting powder to avoid shine under studio lights.",
      accessoryTip: isMasculine ? "A simple minimal watch or no accessories at all to keep the focus entirely on your facial expressions." : "Keep jewellery minimal — small stud earrings or a simple pendant work best. Avoid chunky pieces that distract from your face.",
      generalTip: "Iron your outfit the night before. Even small wrinkles become very visible in high-resolution studio lighting."
    },
    Birthday: {
      palette: isMasculine ? ["#1E3A8A", "#10B981", "#F59E0B"] : ["#FF6B9D", "#C84B8B", "#FFD700"],
      paletteNames: isMasculine ? ["Royal Navy", "Festive Green", "Golden Amber"] : ["Party Pink", "Deep Fuchsia", "Celebration Gold"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Trendy Print Shirt", description: "A stylized micro-print or soft floral shirt in cotton, worn with rolled-up sleeves.", reason: "Fun and relaxed, perfect for birthday portraits and event candids." },
        { outfit: "Casual Suit with Tee", description: "A lightweight cotton suit in sky blue, olive, or beige, worn over a plain white tee.", reason: "Provides a premium, clean look that feels celebratory but casual." },
        { outfit: "Denim Jacket Layering", description: "A clean dark denim jacket over a solid t-shirt and chinos.", reason: "Gives a youthful, stylish look ideal for outdoor or casual studio birthday setups." }
      ] : [
        { outfit: "Sequin or Shimmer Dress", description: "A knee-length sequin dress in gold, rose gold, or electric blue.", reason: "Shimmery fabrics catch studio lights beautifully, creating a celebratory sparkle." },
        { outfit: "Lehenga with Crop Top", description: "A colorful skirt lehenga with an embellished crop top — perfect for a modern birthday look.", reason: "Vibrant and photogenic, great for both posed and candid birthday shots." },
        { outfit: "Smart Blazer with Jeans", description: "A bold-colored blazer over a white tee with dark-wash jeans for a stylish, modern celebration look.", reason: "Gives a confident, contemporary vibe for milestone birthday portraits." }
      ],
      avoidColors: ["Pale pastels", "Beige"],
      avoidReason: "These colors can look washed out and blend into the backdrop in birthday party setups.",
      hairMakeupTip: isMasculine ? "Style hair with texture and volume. A light, fresh cologne completes the look." : "Go bold! This is your day — consider a blow-out, beach waves, or a fun updo. Use a bold lip in red or fuchsia to complement the celebration vibe.",
      accessoryTip: isMasculine ? "A stylish metallic watch, minimalist silver chain, or a party hat for fun photos." : "Statement earrings and a birthday sash or tiara are encouraged! Don't shy away from glam accessories today.",
      generalTip: "Bring a backup outfit. Birthday shoots often involve fun activities (cutting cake, balloon tosses) where the original outfit might get slightly messy."
    },
    Corporate: {
      palette: ["#1A1A2E", "#E8E8E8", "#4A90D9"],
      paletteNames: ["Professional Navy", "Light Grey", "Corporate Blue"],
      outfitRecommendations: isMasculine ? [
        { outfit: "Single-Breasted Suit", description: "A charcoal grey or dark navy blue suit with a white shirt and a solid-colored tie.", reason: "Classic corporate headshot attire that projects competence and leadership." },
        { outfit: "Modest Bandhgala Jacket", description: "A structured bandhgala or Nehru jacket in grey or navy over a crisp linen shirt.", reason: "A professional and modern Indian corporate profile look." },
        { outfit: "Smart Business Casual", description: "A tucked-in light blue shirt with slim-fit khaki or dark trousers and a leather belt.", reason: "Approachable and modern — perfect for tech startups or creative agencies." }
      ] : [
        { outfit: "Business Formal Suit", description: "A well-tailored charcoal grey or navy suit with a white or light blue shirt and a subtle tie.", reason: "Classic corporate look that exudes authority and trustworthiness in headshots." },
        { outfit: "Formal Kurta Set", description: "A premium, well-fitted kurta set in muted tones like slate blue, olive, or charcoal for a professional Indian business look.", reason: "Combines professionalism with cultural identity — powerful for Indian business contexts." },
        { outfit: "Blazer with Trousers", description: "A fitted blazer in a rich jewel tone (deep green, navy, burgundy) over pressed trousers with a simple blouse/shirt.", reason: "Projects confidence and approachability — ideal for LinkedIn profiles and company websites." }
      ],
      avoidColors: ["Busy patterns", "Neon colors"],
      avoidReason: "Complex patterns are distracting in professional photos and can appear to 'vibrate' at certain camera settings.",
      hairMakeupTip: isMasculine ? "Ensure a clean shave or a neatly trimmed beard. Hair should be dry-styled or styled with matte wax (no greasy look)." : "Hair should be neat and professional — pinned back or styled cleanly. Makeup should be polished but understated: foundation, subtle contouring, and a neutral lip.",
      accessoryTip: isMasculine ? "Keep it to a minimum — a professional leather-strap watch or metal watch." : "A classic watch, simple cufflinks, or a subtle lapel pin. Keep jewellery elegant and minimal — a thin chain or small earrings.",
      generalTip: "Ensure your suit or jacket is freshly dry-cleaned and lint-rolled. First impressions in corporate photos hinge entirely on the sharpness of your look."
    }
  };
  return recommendations[shootType] || recommendations.Portrait;
}
