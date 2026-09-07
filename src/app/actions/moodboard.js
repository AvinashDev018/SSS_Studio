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
    // Graceful fallback response if API key is not yet configured
    return getFallbackAnalysis();
  }

  try {
    const userContent = [
      {
        type: "text",
        text: `You are the Lead Master Visual Director and AI Chief Colorist for SSS Studio (Madurai, South India).
Examine ALL attached image(s) with extreme care before making any decision.

==================================================
PRE-STEP VISUAL INSPECTION (Mental Check):
1. Count the number of people/subjects.
2. Identify distinct props: balloons, "ONE" / age signage, cake, flowers, mandap, sarees, gowns, camera lens, hill estate, beach.
3. Check lighting & color temperature: bright pastel, warm gold, sunset teal/amber, dark moody, studio strobe.
==================================================

EDGE-CASE & CATEGORY CLASSIFICATION MATRIX:

Case 1: BABY / TODDLER / CAKE SMASH / 1st BIRTHDAY
(Visual cues: Baby/toddler alone, balloons, 'ONE' prop, toy bunny, cake smash, pastel background, party hats)
- detectedTone: "Soft Pastel Baby & Birthday Tones"
- presetName: "Pastel Dreamland Baby Preset"
- recommendedPackage: "Baby Milestone & Birthday (₹5,000)"
- features: ["Sanitized Props & Baby Wraps Included", "Cake Smash & Milestone Themes (3M, 6M, 1Y)", "20 Master Retouched High-Res Photos", "Guaranteed 1-Month Album Delivery"]

Case 2: MATERNITY / PREGNANCY / BABY BUMP
(Visual cues: Pregnant woman, belly bump pose, floral studio gown, romantic indoor studio setup)
- detectedTone: "Warm Gentle Glow & Tender Studio Tones"
- presetName: "Maternity Warm Elegance Preset"
- recommendedPackage: "Maternity Portrait Shoot (₹6,000)"
- features: ["Studio Gowns & Backdrop Access Included", "Indoor & Outdoor Posing Concepts", "25 Master Retouched High-Res Photos", "Guaranteed 1-Month Album Delivery"]

Case 3: OUTDOOR PRE-WEDDING / COUPLE ROMANCE / HILL STATION
(Visual cues: Unmarried couple posing outdoors, beach, Kodaikanal/Munnar tea gardens, casual romantic attire)
- detectedTone: "Sunset Amber & Outdoor Cinematic Tones"
- presetName: "Cinematic Sunset & Teal LUT"
- recommendedPackage: "Outdoor Pre-Wedding Shoot (₹8,000)"
- features: ["4-6 Hours Outdoor Session (Hill Stations/Beach)", "Creative Couple & Bridal Styling Guidance", "30 Master Retouched High-Res Photos", "3-Minute HD Cinematic Teaser"]

Case 4: TRADITIONAL CEREMONY / MUHURTHAM RITUALS / HALDI / MEHENDI / PUBERTY SAREE
(Visual cues: Silk sarees, yellow haldi paste, mehendi hands, temple stage, traditional South Indian rituals)
- detectedTone: "Vibrant Haldi & Traditional Silk Tones"
- presetName: "Madurai Temple Rituals Preset"
- recommendedPackage: "Standard Muhurtham & Event (₹18,000)"
- features: ["Traditional Rituals & Stage Coverage", "1 Senior Photographer & 1 Videographer", "30-Page Master Leather Photobook Album", "Guaranteed 1-Month Album Delivery"]

Case 5: GRAND WEDDING CEREMONY / RECEPTION / BRIDE & GROOM
(Visual cues: Grand marriage mandap, bride in heavy bridal saree/lehenga + groom in sherwani/veshti, wedding garlands)
- detectedTone: "Warm Royal Gold & Candid Ceremony Tones"
- presetName: "Madurai Regal Wedding Color Preset"
- recommendedPackage: "Premium Wedding & Cinematic (₹75,000)"
- features: ["Full Day Coverage (12 Hours) with Dual Photographers", "Licensed 4K Aerial Drone & Cinematic Teaser", "Handcrafted 40-Page Layflat Master Album", "Guaranteed 1-Month Delivery (or ₹1,000 Cash Credit)"]

Case 6: FASHION / MODEL PORTRAIT / INDIVIDUAL HEADSHOT
(Visual cues: Single adult model, fashion posing, studio portrait, dramatic lighting)
- detectedTone: "Studio Glamour & High Contrast Tones"
- presetName: "Vogue Studio Fine-Art Preset"
- recommendedPackage: "Royal Baby & Family Portrait (₹25,000)"
- features: ["3 Hours High-Fashion Studio Session", "Master Retouched High-Resolution Files", "Custom Lighting & Backdrop Concepts", "Guaranteed 1-Month Delivery"]

Case 7: MIXED MULTI-EVENT COMBO (Multiple uploaded photos belong to DIFFERENT categories, e.g., 1 Baby + 1 Wedding)
- detectedTone: "Bespoke Multi-Event Heritage Tones"
- presetName: "SSS Signature Hybrid Master Grade Suite"
- recommendedPackage: "Grand Multi-Event Milestone Combo (₹95,000)"
- features: ["Comprehensive Multi-Event Coverage (Pre-Wedding, Wedding & Family)", "Custom Unified Color Science & LUTs", "Dual Photographers + 4K Aerial Drone", "Guaranteed 1-Month Delivery Across All Albums"]

Case 8: NON-HUMAN / SCENERY / DECOR / ARCHITECTURE ONLY
(Visual cues: Flower decor, venue lighting, landscape, ring photos with no people)
- detectedTone: "Cinematic Aesthetic & Fine-Art Lighting"
- presetName: "SSS Architectural & Decor LUT"
- recommendedPackage: "Standard Muhurtham & Event (₹18,000)"
- features: ["Detail & Decor Focused Photography", "High-Resolution Color Graded Masters", "30-Page Master Leather Album", "Guaranteed 1-Month Delivery"]

OUTPUT INSTRUCTIONS:
Evaluate the images against Cases 1-8. Return ONLY raw valid JSON (no markdown formatting, no code blocks):
{
  "detectedTone": "String",
  "presetName": "String",
  "recommendedPackage": "String",
  "matchScore": integer (88 to 99),
  "features": ["String", "String", "String", "String"]
}`
      }
    ];

    // Append up to 3 image URLs
    base64Images.slice(0, 3).forEach((imgDataUrl) => {
      userContent.push({
        type: "image_url",
        image_url: { url: imgDataUrl }
      });
    });

    const response = await openai.chat.completions.create({
      model: "meta/llama-3.2-11b-vision-instruct",
      messages: [{ role: "user", content: userContent }],
      max_tokens: 600,
      temperature: 0.2,
    });

    let rawText = response.choices[0]?.message?.content || "";
    
    // Clean codeblock wrappers if any
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsedData = JSON.parse(rawText);
      return {
        success: true,
        data: parsedData
      };
    } catch (parseErr) {
      console.warn("NVIDIA Vision JSON parse warning, extracting formatted fallback:", parseErr);
      return {
        success: true,
        data: getFallbackAnalysis()
      };
    }
  } catch (error) {
    console.error("NVIDIA Vision AI API execution error:", error);
    // Fallback gracefully to signature preset if model call fails
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
