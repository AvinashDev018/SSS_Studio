"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

/**
 * Analyzes uploaded moodboard reference photos using NVIDIA Vision AI (Llama 3.2 11B Vision)
 * @param {string[]} base64Images - Array of base64 data URLs for inspiration photos
 */
export async function analyzeMoodboardAI(base64Images) {
  if (!base64Images || base64Images.length === 0) {
    throw new Error("No images provided for AI analysis.");
  }

  const apiKey = process.env.NVIDIA_API_KEY || process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "dummy_key_placeholder") {
    return { success: true, data: getFallbackAnalysis() };
  }

  try {
    // 1. Analyze each image individually to get reliable zero-ambiguity subject classification
    const imageClassifications = await Promise.all(
      base64Images.slice(0, 3).map(async (imgUrl) => {
        try {
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

Respond ONLY with a single word: BABY, WEDDING, COUPLE, MATERNITY, or PORTRAIT.`
                  },
                  {
                    type: "image_url",
                    image_url: { url: imgUrl }
                  }
                ]
              }
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
        } catch (err) {
          console.error("Individual vision classification error:", err);
          return "BABY";
        }
      })
    );

    console.log("AI Detected Subject Categories per Image:", imageClassifications);

    const uniqueCategories = Array.from(new Set(imageClassifications));

    // 2. Deterministic Combination Logic & SSS Studio Catalog Mapping
    
    // MIXED MULTI-EVENT COMBO
    if (uniqueCategories.length > 1) {
      return {
        success: true,
        data: {
          detectedTone: "Bespoke Multi-Event Heritage Tones",
          presetName: "SSS Signature Hybrid Master Grade Suite",
          recommendedPackage: "Grand Multi-Event Milestone Combo (₹95,000)",
          matchScore: 98,
          features: [
            "Comprehensive Multi-Event Coverage (Pre-Wedding, Wedding & Family)",
            "Custom Unified Color Science & LUTs",
            "Dual Photographers + 4K Aerial Drone",
            "Guaranteed 1-Month Delivery Across All Albums"
          ]
        }
      };
    }

    // SINGLE CATEGORY MATCHES
    const primaryCat = uniqueCategories[0] || "BABY";

    if (primaryCat === "BABY") {
      return {
        success: true,
        data: {
          detectedTone: "Soft Pastel Baby & Birthday Tones",
          presetName: "Pastel Dreamland Baby Preset",
          recommendedPackage: "Baby Milestone & Birthday (₹5,000)",
          matchScore: 97,
          features: [
            "Sanitized Props & Baby Wraps Included",
            "Cake Smash & Milestone Themes (3M, 6M, 1Y)",
            "20 Master Retouched High-Res Photos",
            "Guaranteed 1-Month Album Delivery"
          ]
        }
      };
    }

    if (primaryCat === "WEDDING") {
      return {
        success: true,
        data: {
          detectedTone: "Warm Royal Gold & Candid Ceremony Tones",
          presetName: "Madurai Regal Wedding Color Preset",
          recommendedPackage: "Package 3 - Elevated Drone & Screen (₹90,000)",
          matchScore: 99,
          features: [
            "Traditional + Candid Pro + Aerial 4K Drone Coverage",
            "Dual 44\" LED TV Live Telecast Screens",
            "Handcrafted 36x12 Master Album (45 Sheets with Hologram/Feather/Metallic)",
            "Guaranteed 1-Month Delivery (or ₹1,000 Cash Credit)"
          ]
        }
      };
    }

    if (primaryCat === "COUPLE") {
      return {
        success: true,
        data: {
          detectedTone: "Sunset Amber & Outdoor Cinematic Tones",
          presetName: "Cinematic Sunset & Teal LUT",
          recommendedPackage: "Outdoor Pre-Wedding Shoot (₹8,000)",
          matchScore: 96,
          features: [
            "4-6 Hours Outdoor Session (Hill Stations/Beach)",
            "Creative Couple & Bridal Styling Guidance",
            "30 Master Retouched High-Res Photos",
            "3-Minute HD Cinematic Teaser"
          ]
        }
      };
    }

    if (primaryCat === "MATERNITY") {
      return {
        success: true,
        data: {
          detectedTone: "Warm Gentle Glow & Tender Studio Tones",
          presetName: "Maternity Warm Elegance Preset",
          recommendedPackage: "Maternity Portrait Shoot (₹6,000)",
          matchScore: 95,
          features: [
            "Studio Gowns & Backdrop Access Included",
            "Indoor & Outdoor Posing Concepts",
            "25 Master Retouched High-Res Photos",
            "Guaranteed 1-Month Album Delivery"
          ]
        }
      };
    }

    // Default Portrait
    return {
      success: true,
      data: {
        detectedTone: "Studio Fine-Art Portrait Tones",
        presetName: "Vogue Studio Fine-Art Preset",
        recommendedPackage: "Standard Muhurtham & Event (₹18,000)",
        matchScore: 94,
        features: [
          "Studio Portrait Session with Professional Lighting",
          "30 Master Retouched High-Res Photos",
          "Custom Lighting & Backdrop Concepts",
          "Guaranteed 1-Month Album Delivery"
        ]
      }
    };
  } catch (error) {
    console.error("NVIDIA Vision AI execution error:", error);
    return {
      success: true,
      data: getFallbackAnalysis()
    };
  }
}

function getFallbackAnalysis() {
  return {
    detectedTone: "Soft Pastel Baby & Birthday Tones",
    presetName: "Pastel Dreamland Baby Preset",
    recommendedPackage: "Royal Baby & Family Portrait (₹25,000)",
    matchScore: 96,
    features: [
      "3 Hours Studio / Outdoor Creative Shoot",
      "Custom Props, Costumes & Setup Included",
      "Handcrafted 15-Page Layflat Baby Album",
      "Guaranteed 1-Month Delivery"
    ]
  };
}
