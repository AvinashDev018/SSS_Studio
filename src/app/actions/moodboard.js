"use server";

/**
 * Legacy Server Action — DO NOT pass large base64 image arrays here.
 * React Flight will throw "Maximum array nesting exceeded" on big nested payloads.
 * Use POST /api/moodboard/analyze with FormData instead (see MoodboardMatcherModal).
 */
export async function analyzeMoodboardAI(_input) {
  return {
    success: true,
    data: {
      detectedTone: "Soft Pastel Baby & Birthday Tones",
      presetName: "Pastel Dreamland Baby Preset",
      recommendedPackage: "Royal Baby & Family Portrait (₹25,000)",
      matchScore: 96,
      featuresText:
        "3 Hours Studio / Outdoor Creative Shoot | Custom Props, Costumes & Setup Included | Handcrafted 15-Page Layflat Baby Album | Guaranteed 1-Month Delivery",
      notice: "Use /api/moodboard/analyze with FormData for live vision analysis.",
    },
  };
}
