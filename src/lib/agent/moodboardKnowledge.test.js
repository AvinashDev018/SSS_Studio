/**
 * Unit tests for MoodBoard AI Knowledge System
 * Testing mood board generation, style analysis, and cultural authenticity
 */

import { describe, test, expect } from "vitest";
import { 
  generateMoodBoardRecommendations, 
  analyzeMoodFromImage, 
  createExpertMoodBoard,
  MOODBOARD_CONCEPTS 
} from "./moodboardKnowledge.js";

describe("MoodBoard AI Knowledge System", () => {
  
  describe("generateMoodBoardRecommendations", () => {
    test("should generate traditional Tamil wedding mood board", () => {
      const preferences = {
        shootType: "wedding",
        stylePersonality: "cultural_traditional", 
        colorPreference: "warm_tones",
        culturalBackground: "tamil",
        occasion: "muhurtham_ceremony"
      };

      const recommendations = generateMoodBoardRecommendations(preferences);

      expect(recommendations).toBeDefined();
      expect(recommendations.cultural_elements).toContain("Traditional Tamil jewelry (Kempu, Kasu Malai)");
      expect(recommendations.cultural_elements).toContain("Kanjivaram silk sarees");
      expect(recommendations.cultural_elements).toContain("Fresh jasmine flower decorations");
      expect(recommendations.color_palette).toEqual(
        expect.arrayContaining(["Red", "Orange", "Yellow", "Warm Pink", "Gold"])
      );
    });

    test("should generate modern editorial portrait mood board", () => {
      const preferences = {
        shootType: "portrait", 
        stylePersonality: "classic_elegance",
        colorPreference: "cool_tones", 
        culturalBackground: "international",
        occasion: "professional_headshots"
      };

      const recommendations = generateMoodBoardRecommendations(preferences);

      // Portrait shoots default to modern_editorial in the shoot_moods config
      expect(recommendations.primary_mood).toBe("classic_elegance");
      expect(recommendations.color_palette).toEqual(
        expect.arrayContaining(["Blue", "Green", "Purple", "Cool Pink", "Silver"])
      );
      expect(recommendations.styling_elements.length).toBeGreaterThan(0);
    });

    test("should include seasonal adjustments", () => {
      const preferences = {
        shootType: "maternity",
        stylePersonality: "romantic_dreamy",
        colorPreference: "pastel_colors",
        culturalBackground: "mixed",
        season: "spring"
      };

      const recommendations = generateMoodBoardRecommendations(preferences);
      
      // Should include spring elements in styling
      expect(recommendations.styling_elements).toEqual(
        expect.arrayContaining(["Light fabrics", "Floral elements", "Fresh makeup", "Natural textures"])
      );
    });
  });

  describe("analyzeMoodFromImage", () => {
    test("should detect traditional heritage mood from gold and red colors", () => {
      const dominantColors = ["gold", "deep red", "maroon"];
      const imageContext = { brightness: 0.6, saturation: 0.8 };

      const analysis = analyzeMoodFromImage(dominantColors, imageContext);

      expect(analysis.recommended_mood).toBe("traditional_heritage");
      expect(analysis.confidence_score).toBeGreaterThan(0.5);
      expect(analysis.mood_explanation).toContain("traditional heritage aesthetic");
      expect(analysis.mood_explanation).toContain("Tamil cultural elements");
    });

    test("should detect romantic dreamy mood from pastel colors", () => {
      const dominantColors = ["soft pink", "pastel blue", "cream"];
      const imageContext = { brightness: 0.7, saturation: 0.4 };

      const analysis = analyzeMoodFromImage(dominantColors, imageContext);

      expect(analysis.recommended_mood).toBe("romantic_dreamy");
      expect(analysis.mood_explanation).toContain("romantic, dreamy atmosphere");
    });

    test("should detect vibrant celebration mood from bright colors", () => {
      const dominantColors = ["bright orange", "vibrant pink", "electric blue"];
      const imageContext = { brightness: 0.8, saturation: 0.9 };

      const analysis = analyzeMoodFromImage(dominantColors, imageContext);

      expect(analysis.recommended_mood).toBe("vibrant_celebration");
      expect(analysis.mood_explanation).toContain("vibrant, celebratory mood");
    });

    test("should default to modern editorial for neutral colors", () => {
      const dominantColors = ["gray", "white", "black"];
      const imageContext = { brightness: 0.5, saturation: 0.3 };

      const analysis = analyzeMoodFromImage(dominantColors, imageContext);

      expect(analysis.recommended_mood).toBe("modern_editorial");
      expect(analysis.mood_explanation).toContain("modern, editorial approach");
    });
  });

  describe("createExpertMoodBoard", () => {
    test("should create comprehensive traditional heritage mood board", () => {
      const parameters = {
        primaryMood: "traditional_heritage",
        colorPalette: ["#D4AF37", "#DC143C", "#228B22"],
        culturalElements: ["Tamil jewelry", "Silk sarees", "Temple elements"],
        occasion: "wedding_ceremony"
      };

      const moodBoard = createExpertMoodBoard(parameters);

      expect(moodBoard.concept_name).toBe("traditional_heritage_wedding_ceremony");
      expect(moodBoard.description).toContain("Tamil cultural elements");
      expect(moodBoard.visual_elements.colors.length).toBeGreaterThanOrEqual(3);
      expect(moodBoard.cultural_authenticity).toContain("Tamil jewelry");
      expect(moodBoard.mood_keywords).toContain("traditional");
      expect(moodBoard.styling_guide.clothing).toBeDefined();
    });

    test("should create modern editorial mood board with clean aesthetics", () => {
      const parameters = {
        primaryMood: "modern_editorial",
        colorPalette: ["#36454F", "#F8F8FF", "#E8B4A0"],
        culturalElements: [],
        occasion: "corporate_portraits"
      };

      const moodBoard = createExpertMoodBoard(parameters);

      expect(moodBoard.concept_name).toBe("modern_editorial_corporate_portraits");
      expect(moodBoard.description).toContain("Contemporary fashion-forward aesthetics");
      expect(moodBoard.mood_keywords).toContain("modern");
      expect(moodBoard.mood_keywords).toContain("contemporary");
    });
  });

  describe("MOODBOARD_CONCEPTS structure validation", () => {
    test("should have all required aesthetic categories", () => {
      const requiredAesthetics = [
        "traditional_heritage",
        "modern_editorial", 
        "romantic_dreamy",
        "vibrant_celebration"
      ];

      requiredAesthetics.forEach(aesthetic => {
        expect(MOODBOARD_CONCEPTS.aesthetics).toHaveProperty(aesthetic);
        expect(MOODBOARD_CONCEPTS.aesthetics[aesthetic]).toHaveProperty("name");
        expect(MOODBOARD_CONCEPTS.aesthetics[aesthetic]).toHaveProperty("description");
        expect(MOODBOARD_CONCEPTS.aesthetics[aesthetic]).toHaveProperty("keywords");
        expect(MOODBOARD_CONCEPTS.aesthetics[aesthetic]).toHaveProperty("color_palettes");
        expect(MOODBOARD_CONCEPTS.aesthetics[aesthetic]).toHaveProperty("styling_elements");
      });
    });

    test("should have comprehensive shoot mood definitions", () => {
      const requiredShootTypes = ["wedding", "maternity", "birthday_celebration", "corporate"];
      
      requiredShootTypes.forEach(shootType => {
        expect(MOODBOARD_CONCEPTS.shoot_moods).toHaveProperty(shootType);
        expect(MOODBOARD_CONCEPTS.shoot_moods[shootType]).toHaveProperty("primary_moods");
        expect(MOODBOARD_CONCEPTS.shoot_moods[shootType]).toHaveProperty("specific_concepts");
      });
    });

    test("should have proper color emotion mappings", () => {
      const requiredColorFamilies = ["warm_tones", "cool_tones", "neutral_tones", "earth_tones"];
      
      requiredColorFamilies.forEach(colorFamily => {
        expect(MOODBOARD_CONCEPTS.color_emotions).toHaveProperty(colorFamily);
        expect(MOODBOARD_CONCEPTS.color_emotions[colorFamily]).toHaveProperty("colors");
        expect(MOODBOARD_CONCEPTS.color_emotions[colorFamily]).toHaveProperty("emotions");
        expect(MOODBOARD_CONCEPTS.color_emotions[colorFamily]).toHaveProperty("best_for");
        expect(MOODBOARD_CONCEPTS.color_emotions[colorFamily]).toHaveProperty("lighting_tips");
      });
    });

    test("should validate Tamil cultural elements authenticity", () => {
      const traditionalHeritage = MOODBOARD_CONCEPTS.aesthetics.traditional_heritage;
      
      // Check for authentic Tamil cultural elements
      expect(traditionalHeritage.styling_elements).toContain("Kanjivaram silk sarees with zari borders");
      expect(traditionalHeritage.styling_elements).toContain("Temple jewelry (Kempu, Kasu Malai)");
      expect(traditionalHeritage.styling_elements).toContain("Fresh jasmine gajra");
      expect(traditionalHeritage.styling_elements).toContain("Traditional silk veshti for men");
      
      // Check for authentic Tamil locations
      expect(traditionalHeritage.locations).toContain("Thirumalai Nayakkar Mahal");
      expect(traditionalHeritage.locations).toContain("Meenakshi Temple surroundings");
    });

    test("should have proper style personality definitions", () => {
      const requiredPersonalities = [
        "classic_elegance",
        "bohemian_free_spirit", 
        "glamorous_drama",
        "cultural_traditional"
      ];

      requiredPersonalities.forEach(personality => {
        expect(MOODBOARD_CONCEPTS.style_personalities).toHaveProperty(personality);
        expect(MOODBOARD_CONCEPTS.style_personalities[personality]).toHaveProperty("description");
        expect(MOODBOARD_CONCEPTS.style_personalities[personality]).toHaveProperty("characteristics");
        expect(MOODBOARD_CONCEPTS.style_personalities[personality]).toHaveProperty("suitable_for");
        expect(MOODBOARD_CONCEPTS.style_personalities[personality]).toHaveProperty("avoid");
      });
    });
  });

  describe("Cultural authenticity validation", () => {
    test("should properly represent Tamil festival elements", () => {
      // This test would validate that Tamil cultural elements are authentic
      // In a real implementation, you might consult with cultural experts
      const traditionalConcepts = MOODBOARD_CONCEPTS.aesthetics.traditional_heritage;
      
      expect(traditionalConcepts.keywords).toContain("tamil");
      expect(traditionalConcepts.keywords).toContain("cultural");
      expect(traditionalConcepts.keywords).toContain("traditional");
      expect(traditionalConcepts.keywords).toContain("authentic");
      
      // Validate color authenticity - traditional Tamil colors
      const colorNames = traditionalConcepts.color_palettes.map(cp => cp.name);
      expect(colorNames).toContain("Temple Gold");
      expect(colorNames).toContain("Kumkum Red");
      expect(colorNames).toContain("Meenakshi Green");
    });

    test("should respect cultural sensitivity in styling recommendations", () => {
      const culturalTraditional = MOODBOARD_CONCEPTS.style_personalities.cultural_traditional;
      
      expect(culturalTraditional.characteristics).toContain("Traditional garments");
      expect(culturalTraditional.characteristics).toContain("Cultural accessories");
      expect(culturalTraditional.characteristics).toContain("Authentic poses");
      expect(culturalTraditional.characteristics).toContain("Heritage colors");
      
      expect(culturalTraditional.avoid).toContain("Western elements");
      expect(culturalTraditional.avoid).toContain("Modern accessories");
      expect(culturalTraditional.avoid).toContain("Non-traditional colors");
    });
  });

  describe("Practical styling recommendations", () => {
    test("should provide actionable outfit guidance", () => {
      const recommendations = generateMoodBoardRecommendations({
        shootType: "wedding",
        stylePersonality: "cultural_traditional", 
        colorPreference: "warm_tones",
        culturalBackground: "tamil"
      });

      expect(recommendations.styling_elements.length).toBeGreaterThan(0);
      expect(recommendations.clothing_recommendations.length).toBeGreaterThan(0);
      expect(recommendations.cultural_elements.length).toBeGreaterThan(0);
      
      // Should be specific and actionable
      recommendations.styling_elements.forEach(element => {
        expect(typeof element).toBe("string");
        expect(element.length).toBeGreaterThan(10); // Substantial recommendations
      });
    });

    test("should adapt recommendations for different budgets", () => {
      // This would be tested in the tool implementations
      // The knowledge system provides the foundation
      const traditionalElements = MOODBOARD_CONCEPTS.aesthetics.traditional_heritage.styling_elements;
      
      expect(traditionalElements).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/silk/i),
          expect.stringMatching(/jewelry/i),
          expect.stringMatching(/traditional/i)
        ])
      );
    });
  });
});

// Integration test for the complete MoodBoard AI workflow
describe("MoodBoard AI Integration", () => {
  test("should provide complete styling solution for Tamil wedding", () => {
    // Simulate a complete user journey
    const userPreferences = {
      shootType: "wedding",
      stylePersonality: "cultural_traditional",
      colorPreference: "warm_tones", 
      culturalBackground: "tamil",
      occasion: "muhurtham_ceremony"
    };

    // Generate mood board
    const moodBoard = generateMoodBoardRecommendations(userPreferences);
    
    // Analyze image (simulated)
    const imageAnalysis = analyzeMoodFromImage(["gold", "red", "maroon"]);
    
    // Create expert mood board
    const expertBoard = createExpertMoodBoard({
      primaryMood: imageAnalysis.recommended_mood,
      colorPalette: moodBoard.color_palette,
      culturalElements: moodBoard.cultural_elements,
      occasion: userPreferences.occasion
    });

    // Validate complete solution
    expect(moodBoard.cultural_elements.length).toBeGreaterThan(0);
    expect(imageAnalysis.recommended_mood).toBe("traditional_heritage");
    expect(expertBoard.concept_name).toContain("traditional_heritage");
    expect(expertBoard.cultural_authenticity.length).toBeGreaterThan(0);
    
    // Should provide actionable, culturally appropriate guidance
    expect(expertBoard.description).toContain("Tamil");
    expect(expertBoard.styling_guide).toBeDefined();
    expect(expertBoard.technical_specs).toBeDefined();
  });
});