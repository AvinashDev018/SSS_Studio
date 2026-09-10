import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

function getFallbackAnalysis() {
  return {
    detectedTone: "Soft Pastel Baby & Birthday Tones",
    presetName: "Pastel Dreamland Baby Preset",
    recommendedPackage: "Royal Baby & Family Portrait (₹25,000)",
    matchScore: 96,
    // Flat string — avoids React Flight nested-array limits if this shape is reused in Server Actions
    featuresText:
      "3 Hours Studio / Outdoor Creative Shoot | Custom Props, Costumes & Setup Included | Handcrafted 15-Page Layflat Baby Album | Guaranteed 1-Month Delivery",
  };
}

function packageForCategory(primaryCat) {
  const map = {
    BABY: {
      detectedTone: "Soft Pastel Baby & Birthday Tones",
      presetName: "Pastel Dreamland Baby Preset",
      recommendedPackage: "Baby Milestone & Birthday (₹5,000)",
      matchScore: 97,
      featuresText:
        "Sanitized Props & Baby Wraps Included | Cake Smash & Milestone Themes (3M, 6M, 1Y) | 20 Master Retouched High-Res Photos | Guaranteed 1-Month Album Delivery",
    },
    WEDDING: {
      detectedTone: "Warm Royal Gold & Candid Ceremony Tones",
      presetName: "Madurai Regal Wedding Color Preset",
      recommendedPackage: "Package 3 - Elevated Drone & Screen (₹90,000)",
      matchScore: 99,
      featuresText:
        "Traditional + Candid Pro + Aerial 4K Drone Coverage | Dual 44\" LED TV Live Telecast Screens | Handcrafted 36x12 Master Album (45 Sheets) | Guaranteed 1-Month Delivery (or ₹1,000 Cash Credit)",
    },
    COUPLE: {
      detectedTone: "Sunset Amber & Outdoor Cinematic Tones",
      presetName: "Cinematic Sunset & Teal LUT",
      recommendedPackage: "Outdoor Pre-Wedding Shoot (₹8,000)",
      matchScore: 96,
      featuresText:
        "4-6 Hours Outdoor Session (Hill Stations/Beach) | Creative Couple & Bridal Styling Guidance | 30 Master Retouched High-Res Photos | 3-Minute HD Cinematic Teaser",
    },
    MATERNITY: {
      detectedTone: "Warm Gentle Glow & Tender Studio Tones",
      presetName: "Maternity Warm Elegance Preset",
      recommendedPackage: "Maternity Portrait Shoot (₹6,000)",
      matchScore: 95,
      featuresText:
        "Studio Gowns & Backdrop Access Included | Indoor & Outdoor Posing Concepts | 25 Master Retouched High-Res Photos | Guaranteed 1-Month Album Delivery",
    },
    PORTRAIT: {
      detectedTone: "Studio Fine-Art Portrait Tones",
      presetName: "Vogue Studio Fine-Art Preset",
      recommendedPackage: "Standard Muhurtham & Event (₹18,000)",
      matchScore: 94,
      featuresText:
        "Studio Portrait Session with Professional Lighting | 30 Master Retouched High-Res Photos | Custom Lighting & Backdrop Concepts | Guaranteed 1-Month Album Delivery",
    },
    MIXED: {
      detectedTone: "Bespoke Multi-Event Heritage Tones",
      presetName: "SSS Signature Hybrid Master Grade Suite",
      recommendedPackage: "Grand Multi-Event Milestone Combo (₹95,000)",
      matchScore: 98,
      featuresText:
        "Comprehensive Multi-Event Coverage (Pre-Wedding, Wedding & Family) | Custom Unified Color Science & LUTs | Dual Photographers + 4K Aerial Drone | Guaranteed 1-Month Delivery Across All Albums",
    },
  };
  return map[primaryCat] || map.PORTRAIT;
}

async function fileToDataUrl(file) {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type || "image/jpeg";
  return `data:${mime};base64,${base64}`;
}

async function classifyImage(openai, imgUrl) {
  const resp = await openai.chat.completions.create({
    model: "meta/llama-3.2-11b-vision-instruct",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this single image and classify it into ONE category.
Look for:
- "BABY" (baby, toddler, balloons, cake smash, "ONE" prop)
- "WEDDING" (bride, groom, marriage mandap, saree couple, garlands)
- "COUPLE" (outdoor couple, beach, hill station pre-wedding)
- "MATERNITY" (pregnant woman, bump shoot, studio gown)
- "PORTRAIT" (single adult fashion portrait)

Respond ONLY with a single word: BABY, WEDDING, COUPLE, MATERNITY, or PORTRAIT.`,
          },
          { type: "image_url", image_url: { url: imgUrl } },
        ],
      },
    ],
    max_tokens: 10,
    temperature: 0.1,
  });

  const text = (resp.choices[0]?.message?.content || "").toUpperCase().trim();
  if (text.includes("BABY")) return "BABY";
  if (text.includes("WEDDING")) return "WEDDING";
  if (text.includes("COUPLE")) return "COUPLE";
  if (text.includes("MATERNITY")) return "MATERNITY";
  return "PORTRAIT";
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images").filter((f) => f && typeof f === "object" && typeof f.arrayBuffer === "function");

    if (!files.length) {
      return NextResponse.json({ success: false, error: "No images provided" }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "dummy_key_placeholder") {
      return NextResponse.json({ success: true, data: getFallbackAnalysis() });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });

    const dataUrls = await Promise.all(files.slice(0, 3).map((f) => fileToDataUrl(f)));

    const imageClassifications = await Promise.all(
      dataUrls.map(async (imgUrl) => {
        try {
          return await classifyImage(openai, imgUrl);
        } catch (err) {
          console.error("Individual vision classification error:", err);
          return "BABY";
        }
      })
    );

    const uniqueCategories = Array.from(new Set(imageClassifications));
    const primaryCat = uniqueCategories.length > 1 ? "MIXED" : uniqueCategories[0] || "PORTRAIT";

    return NextResponse.json({
      success: true,
      data: packageForCategory(primaryCat),
    });
  } catch (error) {
    console.error("Moodboard analyze API error:", error);
    return NextResponse.json({ success: true, data: getFallbackAnalysis() });
  }
}
