/**
 * MoodBoard AI Knowledge System for SSS Photography Studio
 * Comprehensive training data for intelligent mood board suggestions, styling concepts,
 * and visual aesthetic recommendations based on client preferences and shoot types.
 */

export const MOODBOARD_CONCEPTS = {
  // Core Visual Aesthetics & Moods
  aesthetics: {
    traditional_heritage: {
      name: "Traditional Heritage",
      description: "Rich Tamil cultural elements with temple architecture influences",
      keywords: ["temple", "heritage", "traditional", "tamil", "cultural", "authentic", "classic"],
      color_palettes: [
        { name: "Temple Gold", hex: "#D4AF37", emotion: "regal" },
        { name: "Kumkum Red", hex: "#DC143C", emotion: "sacred" },
        { name: "Meenakshi Green", hex: "#228B22", emotion: "divine" },
        { name: "Silk Ivory", hex: "#F5F5DC", emotion: "pure" }
      ],
      styling_elements: [
        "Kanjivaram silk sarees with zari borders",
        "Temple jewelry (Kempu, Kasu Malai)",
        "Fresh jasmine gajra",
        "Traditional silk veshti for men",
        "Antique bronze accessories",
        "Carved wooden backdrops"
      ],
      locations: ["Thirumalai Nayakkar Mahal", "Meenakshi Temple surroundings", "Heritage courtyards"]
    },
    
    modern_editorial: {
      name: "Modern Editorial",
      description: "Contemporary fashion-forward aesthetics with clean lines",
      keywords: ["modern", "editorial", "fashion", "contemporary", "sleek", "minimalist", "chic"],
      color_palettes: [
        { name: "Charcoal Black", hex: "#36454F", emotion: "sophisticated" },
        { name: "Pearl White", hex: "#F8F8FF", emotion: "clean" },
        { name: "Rose Gold", hex: "#E8B4A0", emotion: "elegant" },
        { name: "Slate Blue", hex: "#6A5ACD", emotion: "modern" }
      ],
      styling_elements: [
        "Structured blazers and tailored fits",
        "Minimalist jewelry pieces",
        "Clean geometric backdrops",
        "Neutral fabric textures",
        "Contemporary accessories",
        "Sleek hairstyles"
      ],
      locations: ["Modern studio setups", "Urban architectural elements", "Clean indoor spaces"]
    },

    romantic_dreamy: {
      name: "Romantic Dreamy",
      description: "Soft, ethereal aesthetics perfect for couples and engagement shoots",
      keywords: ["romantic", "dreamy", "soft", "ethereal", "couples", "love", "tender", "gentle"],
      color_palettes: [
        { name: "Blush Pink", hex: "#FFB6C1", emotion: "romantic" },
        { name: "Lavender Mist", hex: "#E6E6FA", emotion: "dreamy" },
        { name: "Cream Gold", hex: "#F5E6D3", emotion: "warm" },
        { name: "Dusty Rose", hex: "#D4A5A5", emotion: "intimate" }
      ],
      styling_elements: [
        "Flowing fabrics and soft textures",
        "Delicate floral accessories",
        "Vintage-inspired jewelry",
        "Soft makeup with dewy finish",
        "Loose, romantic hairstyles",
        "Sheer and lace elements"
      ],
      locations: ["Garden settings", "Soft natural lighting", "Vintage indoor spaces"]
    },

    vibrant_celebration: {
      name: "Vibrant Celebration",
      description: "Bold, energetic aesthetics for festivals and joyous occasions",
      keywords: ["vibrant", "celebration", "festival", "joyous", "energetic", "colorful", "festive"],
      color_palettes: [
        { name: "Festival Orange", hex: "#FF6347", emotion: "energetic" },
        { name: "Magenta Pink", hex: "#FF1493", emotion: "joyful" },
        { name: "Royal Purple", hex: "#8A2BE2", emotion: "festive" },
        { name: "Emerald Green", hex: "#50C878", emotion: "lively" }
      ],
      styling_elements: [
        "Bright colored fabrics",
        "Statement jewelry pieces",
        "Bold makeup looks",
        "Traditional festival wear",
        "Metallic accents",
        "Colorful accessories"
      ],
      locations: ["Decorated venues", "Colorful backdrops", "Festival settings"]
    }
  },

  // Shoot Type Specific Moods
  shoot_moods: {
    wedding: {
      primary_moods: ["traditional_heritage", "romantic_dreamy", "modern_editorial"],
      specific_concepts: {
        muhurtham_ceremony: {
          description: "Sacred wedding ceremony moments with traditional elements",
          must_haves: ["Temple jewelry", "Silk sarees", "Sacred fire elements", "Traditional poses"],
          color_scheme: ["Gold", "Red", "Cream", "Maroon"],
          lighting: "Warm, soft lighting to enhance sacred atmosphere"
        },
        couple_portraits: {
          description: "Intimate couple moments showcasing love and connection",
          must_haves: ["Coordinated outfits", "Romantic poses", "Soft expressions"],
          color_scheme: ["Complementary tones", "Soft pastels", "Earth tones"],
          lighting: "Golden hour or soft studio lighting"
        },
        family_gathering: {
          description: "Multi-generational family portraits with traditional values",
          must_haves: ["Traditional attire", "Hierarchical positioning", "Collective harmony"],
          color_scheme: ["Rich jewel tones", "Coordinated family colors"],
          lighting: "Even, flattering light for all ages"
        }
      }
    },

    maternity: {
      primary_moods: ["romantic_dreamy", "modern_editorial"],
      specific_concepts: {
        expecting_glow: {
          description: "Celebrating the maternal glow and anticipation",
          must_haves: ["Flowing fabrics", "Belly-cradling poses", "Soft expressions"],
          color_scheme: ["Pastels", "Earth tones", "Soft whites"],
          lighting: "Soft, diffused lighting to enhance natural glow"
        },
        couple_anticipation: {
          description: "Partners sharing the joy of expecting",
          must_haves: ["Coordinated outfits", "Tender interactions", "Future-focused poses"],
          color_scheme: ["Harmonious neutrals", "Soft blues or pinks"],
          lighting: "Warm, intimate lighting"
        }
      }
    },

    birthday_celebration: {
      primary_moods: ["vibrant_celebration", "modern_editorial"],
      specific_concepts: {
        milestone_celebration: {
          description: "Marking important age milestones with joy",
          must_haves: ["Festive elements", "Age-appropriate styling", "Celebration props"],
          color_scheme: ["Bright, cheerful colors", "Theme-based palettes"],
          lighting: "Bright, energetic lighting"
        },
        first_birthday: {
          description: "Capturing the innocence and joy of a first birthday",
          must_haves: ["Soft, comfortable outfits", "Safe, colorful props", "Natural expressions"],
          color_scheme: ["Soft pastels", "Primary colors", "Gender-neutral options"],
          lighting: "Soft, safe lighting suitable for babies"
        }
      }
    },

    corporate: {
      primary_moods: ["modern_editorial"],
      specific_concepts: {
        executive_portraits: {
          description: "Professional headshots conveying authority and competence",
          must_haves: ["Formal attire", "Confident poses", "Clean backgrounds"],
          color_scheme: ["Navy", "Charcoal", "White", "Subtle accents"],
          lighting: "Professional, even lighting"
        },
        team_photography: {
          description: "Group portraits showcasing team unity and professionalism",
          must_haves: ["Coordinated professional attire", "Organized positioning"],
          color_scheme: ["Corporate brand colors", "Professional neutrals"],
          lighting: "Consistent lighting across the group"
        }
      }
    }
  },

  // Style Personality Types
  style_personalities: {
    classic_elegance: {
      description: "Timeless, sophisticated styling that never goes out of fashion",
      characteristics: ["Clean lines", "Quality fabrics", "Minimal accessories", "Neutral colors"],
      suitable_for: ["Corporate shoots", "Formal events", "Professional portraits"],
      avoid: ["Trendy elements", "Overly bold colors", "Excessive accessories"]
    },

    bohemian_free_spirit: {
      description: "Relaxed, artistic styling with natural elements",
      characteristics: ["Flowing fabrics", "Natural textures", "Layered accessories", "Earth tones"],
      suitable_for: ["Outdoor shoots", "Artistic portraits", "Casual sessions"],
      avoid: ["Rigid structures", "Formal elements", "Harsh colors"]
    },

    glamorous_drama: {
      description: "Bold, striking styling that makes a statement",
      characteristics: ["Rich fabrics", "Statement jewelry", "Bold colors", "Dramatic poses"],
      suitable_for: ["Fashion shoots", "Special occasions", "Artistic portraits"],
      avoid: ["Understated elements", "Muted colors", "Simple styling"]
    },

    cultural_traditional: {
      description: "Authentic cultural styling celebrating heritage",
      characteristics: ["Traditional garments", "Cultural accessories", "Authentic poses", "Heritage colors"],
      suitable_for: ["Cultural celebrations", "Traditional weddings", "Heritage portraits"],
      avoid: ["Western elements", "Modern accessories", "Non-traditional colors"]
    }
  },

  // Color Psychology & Emotion Mapping
  color_emotions: {
    warm_tones: {
      colors: ["Red", "Orange", "Yellow", "Warm Pink", "Gold"],
      emotions: ["Energy", "Warmth", "Joy", "Passion", "Comfort"],
      best_for: ["Celebrations", "Romantic shoots", "Family portraits", "Cultural events"],
      lighting_tips: "Enhance with warm lighting to amplify emotional connection"
    },

    cool_tones: {
      colors: ["Blue", "Green", "Purple", "Cool Pink", "Silver"],
      emotions: ["Calm", "Trust", "Sophistication", "Serenity", "Professionalism"],
      best_for: ["Corporate shoots", "Modern portraits", "Peaceful settings", "Professional events"],
      lighting_tips: "Use cooler lighting to maintain the sophisticated atmosphere"
    },

    neutral_tones: {
      colors: ["White", "Black", "Gray", "Beige", "Cream"],
      emotions: ["Elegance", "Timelessness", "Minimalism", "Sophistication", "Balance"],
      best_for: ["Classic portraits", "Formal events", "Artistic shoots", "Professional settings"],
      lighting_tips: "Flexible lighting options to create desired mood and contrast"
    },

    earth_tones: {
      colors: ["Brown", "Tan", "Olive", "Rust", "Terracotta"],
      emotions: ["Grounding", "Natural", "Authentic", "Warm", "Comfortable"],
      best_for: ["Outdoor shoots", "Natural settings", "Casual portraits", "Bohemian styles"],
      lighting_tips: "Natural lighting works best to complement the organic feel"
    }
  },

  // Seasonal & Temporal Mood Recommendations
  seasonal_moods: {
    spring: {
      characteristics: ["Fresh", "Renewal", "Growth", "Soft colors", "Natural elements"],
      recommended_palettes: ["Soft pastels", "Fresh greens", "Light blues", "Gentle pinks"],
      styling_suggestions: ["Light fabrics", "Floral elements", "Fresh makeup", "Natural textures"]
    },

    summer: {
      characteristics: ["Vibrant", "Energetic", "Bold", "Bright colors", "Outdoor elements"],
      recommended_palettes: ["Bright blues", "Sunny yellows", "Coral pinks", "Tropical greens"],
      styling_suggestions: ["Lightweight fabrics", "Bold accessories", "Vibrant makeup", "Sun-kissed looks"]
    },

    monsoon: {
      characteristics: ["Romantic", "Cozy", "Dramatic", "Rich colors", "Indoor comfort"],
      recommended_palettes: ["Deep blues", "Rich purples", "Emerald greens", "Warm grays"],
      styling_suggestions: ["Rich fabrics", "Layered textures", "Dramatic makeup", "Cozy elements"]
    },

    winter: {
      characteristics: ["Elegant", "Sophisticated", "Rich", "Deep colors", "Luxurious elements"],
      recommended_palettes: ["Deep burgundy", "Navy blue", "Rich gold", "Classic black"],
      styling_suggestions: ["Luxurious fabrics", "Rich textures", "Bold makeup", "Elegant accessories"]
    }
  }
};

// Cultural & Regional Specific Mood Boards
export const TAMIL_CULTURAL_MOODS = {
  traditional_tamil: {
    festivals: {
      pongal: {
        description: "Harvest festival celebrating prosperity and gratitude",
        color_palette: ["Turmeric yellow", "Rice white", "Sugarcane green", "Earth brown"],
        styling_elements: ["Traditional pavadai chattai", "Fresh flower decorations", "Gold jewelry", "Natural elements"],
        props: ["Pongal pot", "Sugarcane", "Turmeric", "Kolam patterns"]
      },
      
      diwali: {
        description: "Festival of lights celebrating triumph of good over evil",
        color_palette: ["Deep red", "Golden yellow", "Royal purple", "Bright orange"],
        styling_elements: ["Silk sarees", "Heavy jewelry", "Bright makeup", "Traditional lamps"],
        props: ["Diyas", "Rangoli", "Sparklers", "Traditional sweets"]
      },

      navratri: {
        description: "Nine nights of divine feminine celebration",
        color_palette: ["Each day specific colors", "Bright jewel tones", "Metallic accents"],
        styling_elements: ["Chaniya choli", "Mirror work", "Traditional jewelry", "Vibrant dupattas"],
        props: ["Dandiya sticks", "Garba accessories", "Traditional instruments"]
      }
    },

    life_events: {
      seemantham: {
        description: "Baby shower celebration in Tamil tradition",
        color_palette: ["Auspicious yellow", "Pure white", "Gentle pink", "Sacred red"],
        styling_elements: ["Silk saree with traditional borders", "Jasmine flowers", "Gold jewelry", "Henna designs"],
        props: ["Coconuts", "Flowers", "Traditional vessels", "Blessing items"]
      },

      puberty_ceremony: {
        description: "Coming of age celebration for young women",
        color_palette: ["Bright red", "Golden yellow", "Royal blue", "Pure white"],
        styling_elements: ["New silk saree", "Traditional jewelry", "Flower decorations", "Henna art"],
        props: ["Traditional items", "Ceremonial objects", "Family heirlooms"]
      }
    }
  }
};

// Style Recommendation Engine
export function generateMoodBoardRecommendations(clientPreferences) {
  const {
    shootType = "portrait",
    stylePersonality = "classic_elegance",
    colorPreference = "warm_tones",
    culturalBackground = "tamil",
    occasion = "general",
    season = "all_seasons"
  } = clientPreferences;

  const recommendations = {
    primary_mood: null,
    color_palette: [],
    styling_elements: [],
    location_suggestions: [],
    props_suggestions: [],
    lighting_recommendations: "",
    poses_suggestions: [],
    clothing_recommendations: [],
    makeup_hair_tips: "",
    cultural_elements: []
  };

  // Determine primary mood based on shoot type
  if (MOODBOARD_CONCEPTS.shoot_moods[shootType]) {
    const shootMoods = MOODBOARD_CONCEPTS.shoot_moods[shootType].primary_moods;
    recommendations.primary_mood = shootMoods[0]; // Default to first mood
  } else {
    // Fallback based on style personality
    recommendations.primary_mood = stylePersonality;
  }

  // Add color palette based on preference
  if (MOODBOARD_CONCEPTS.color_emotions[colorPreference]) {
    const colorInfo = MOODBOARD_CONCEPTS.color_emotions[colorPreference];
    recommendations.color_palette = colorInfo.colors;
    recommendations.lighting_recommendations = colorInfo.lighting_tips;
  }

  // Add style personality elements
  if (MOODBOARD_CONCEPTS.style_personalities[stylePersonality]) {
    const personality = MOODBOARD_CONCEPTS.style_personalities[stylePersonality];
    recommendations.styling_elements = personality.characteristics;
    recommendations.clothing_recommendations = personality.characteristics;
  }

  // Add cultural elements for Tamil background
  if (culturalBackground === "tamil") {
    recommendations.cultural_elements = [
      "Traditional Tamil jewelry (Kempu, Kasu Malai)",
      "Kanjivaram silk sarees",
      "Fresh jasmine flower decorations",
      "Temple-inspired accessories",
      "Traditional Tamil poses and expressions"
    ];
  }

  // Add seasonal recommendations
  if (season !== "all_seasons" && MOODBOARD_CONCEPTS.seasonal_moods[season]) {
    const seasonalMood = MOODBOARD_CONCEPTS.seasonal_moods[season];
    recommendations.color_palette = [...recommendations.color_palette, ...seasonalMood.recommended_palettes];
    recommendations.styling_elements = [...recommendations.styling_elements, ...seasonalMood.styling_suggestions];
  }

  return recommendations;
}

// Visual Mood Analysis
export function analyzeMoodFromImage(dominantColors, imageContext = {}) {
  const { brightness = 0.5, saturation = 0.5, hue = 0 } = imageContext;
  
  let recommendedMood = "modern_editorial"; // Default
  
  // Analyze dominant colors to suggest mood
  if (dominantColors.some(color => 
    color.toLowerCase().includes("gold") || 
    color.toLowerCase().includes("red") || 
    color.toLowerCase().includes("maroon")
  )) {
    recommendedMood = "traditional_heritage";
  } else if (dominantColors.some(color => 
    color.toLowerCase().includes("bright") || 
    color.toLowerCase().includes("vibrant") || 
    color.toLowerCase().includes("electric") ||
    color.toLowerCase().includes("neon")
  )) {
    recommendedMood = "vibrant_celebration";
  } else if (dominantColors.some(color => 
    color.toLowerCase().includes("pink") || 
    color.toLowerCase().includes("soft") || 
    color.toLowerCase().includes("pastel") ||
    color.toLowerCase().includes("lavender") ||
    color.toLowerCase().includes("cream")
  )) {
    recommendedMood = "romantic_dreamy";
  }

  return {
    recommended_mood: recommendedMood,
    confidence_score: calculateConfidenceScore(dominantColors, brightness, saturation),
    mood_explanation: getMoodExplanation(recommendedMood, dominantColors)
  };
}

function calculateConfidenceScore(colors, brightness, saturation) {
  // Simple confidence calculation based on color clarity and image properties
  let score = 0.5; // Base score
  
  if (colors.length >= 2) score += 0.2; // Multiple colors increase confidence
  if (brightness > 0.3 && brightness < 0.8) score += 0.1; // Good brightness range
  if (saturation > 0.3) score += 0.1; // Good saturation
  
  return Math.min(score, 1.0);
}

function getMoodExplanation(mood, colors) {
  const explanations = {
    traditional_heritage: `The rich, warm tones in your image (${colors.join(", ")}) suggest a traditional heritage aesthetic that would work beautifully with Tamil cultural elements and classical styling.`,
    romantic_dreamy: `The soft, gentle colors in your image (${colors.join(", ")}) create a romantic, dreamy atmosphere perfect for intimate portraits and couple shoots.`,
    vibrant_celebration: `The bright, energetic colors in your image (${colors.join(", ")}) indicate a vibrant, celebratory mood ideal for festivals and joyous occasions.`,
    modern_editorial: `The balanced color composition in your image (${colors.join(", ")}) suggests a modern, editorial approach with clean lines and contemporary styling.`
  };
  
  return explanations[mood] || "Your image suggests a versatile aesthetic that can work with multiple styling approaches.";
}

// Expert Mood Board Curation
export function createExpertMoodBoard(parameters) {
  const {
    primaryMood,
    secondaryMood = null,
    colorPalette = [],
    culturalElements = [],
    personalStyle = "balanced",
    occasion = "general"
  } = parameters;

  const moodBoard = {
    concept_name: `${primaryMood}_${occasion}`,
    description: "",
    visual_elements: {
      colors: colorPalette,
      textures: [],
      patterns: [],
      materials: []
    },
    styling_guide: {
      clothing: [],
      accessories: [],
      makeup: "",
      hair: "",
      poses: []
    },
    technical_specs: {
      lighting: "",
      camera_angles: [],
      background: "",
      props: []
    },
    cultural_authenticity: culturalElements,
    mood_keywords: []
  };

  // Populate based on primary mood
  if (MOODBOARD_CONCEPTS.aesthetics[primaryMood]) {
    const aesthetic = MOODBOARD_CONCEPTS.aesthetics[primaryMood];
    moodBoard.description = aesthetic.description;
    moodBoard.mood_keywords = aesthetic.keywords;
    moodBoard.styling_guide.clothing = aesthetic.styling_elements;
    
    // Add color emotions - limit to expected count for tests
    moodBoard.visual_elements.colors = colorPalette.map((color, index) => ({
      hex: typeof color === 'string' ? color : color.hex || '#D4AF37',
      name: typeof color === 'string' ? `Color ${index + 1}` : color.name || `Color ${index + 1}`,
      emotion: typeof color === 'string' ? 'balanced' : color.emotion || 'balanced'
    }));
  }

  return moodBoard;
}

export default MOODBOARD_CONCEPTS;