/**
 * Integration tests for MoodBoard AI with the chatbot agent
 * Testing the full workflow from user query to MoodBoard AI responses
 */

import { describe, test, expect } from "vitest";
import { executeAgentTool } from "./tools.js";

describe("MoodBoard AI Agent Integration", () => {
  
  describe("create_moodboard tool", () => {
    test("should create comprehensive traditional Tamil wedding moodboard", async () => {
      const result = await executeAgentTool("create_moodboard", {
        shoot_type: "wedding",
        style_preference: "traditional_heritage",
        color_preference: "warm_tones",
        cultural_background: "tamil",
        occasion: "muhurtham ceremony"
      });

      expect(result.action).toBe("CREATE_MOODBOARD");
      expect(result.status).toBe("success");
      expect(result.concept_name).toContain("traditional heritage");
      expect(result.concept_name).toContain("wedding");
      expect(result.primary_mood).toBe("traditional_heritage");
      expect(result.cultural_elements.length).toBeGreaterThan(0);
      expect(result.cultural_elements).toContain("Traditional Tamil jewelry (Kempu, Kasu Malai)");
      expect(result.color_palette.length).toBeGreaterThan(0);
      expect(result.styling_elements.length).toBeGreaterThan(0);
      expect(result.expert_tips.length).toBeGreaterThan(0);
    });

    test("should create modern editorial corporate moodboard", async () => {
      const result = await executeAgentTool("create_moodboard", {
        shoot_type: "corporate",
        style_preference: "modern_editorial", 
        color_preference: "neutral_tones",
        cultural_background: "international",
        occasion: "professional headshots"
      });

      expect(result.action).toBe("CREATE_MOODBOARD");
      expect(result.status).toBe("success");
      expect(result.concept_name).toContain("modern editorial");
      expect(result.concept_name).toContain("corporate");
      expect(result.primary_mood).toBe("modern_editorial");
      expect(result.color_palette).toContain("White");
      expect(result.color_palette).toContain("Black");
      expect(result.styling_elements.length).toBeGreaterThan(0);
    });

    test("should create vibrant birthday celebration moodboard", async () => {
      const result = await executeAgentTool("create_moodboard", {
        shoot_type: "birthday",
        style_preference: "vibrant_celebration",
        color_preference: "vibrant_colors", // This will fallback to warm_tones
        cultural_background: "mixed"
      });

      expect(result.action).toBe("CREATE_MOODBOARD");
      expect(result.status).toBe("success");
      expect(result.concept_name).toContain("vibrant celebration");
      expect(result.concept_name).toContain("birthday");
      expect(result.primary_mood).toBe("vibrant_celebration");
      expect(result.styling_elements.length).toBeGreaterThan(0);
    });
  });

  describe("analyze_style_personality tool", () => {
    test("should analyze traditional Tamil style personality", async () => {
      const result = await executeAgentTool("analyze_style_personality", {
        style_keywords: ["traditional", "cultural", "heritage", "tamil", "authentic"],
        inspiration_references: "Traditional Tamil wedding ceremonies",
        lifestyle: "traditional"
      });

      expect(result.action).toBe("ANALYZE_STYLE_PERSONALITY");
      expect(result.status).toBe("success");
      expect(result.recommended_personality).toBe("cultural_traditional");
      expect(result.personality_name).toBe("Cultural Traditional");
      expect(result.confidence_score).toBeGreaterThan(50);
      expect(result.description).toContain("cultural");
      expect(result.key_characteristics.length).toBeGreaterThan(0);
      expect(result.styling_recommendations.length).toBeGreaterThan(0);
    });

    test("should analyze modern minimalist style personality", async () => {
      const result = await executeAgentTool("analyze_style_personality", {
        style_keywords: ["modern", "clean", "minimalist", "elegant", "sophisticated"],
        inspiration_references: "Contemporary fashion magazines",
        lifestyle: "professional"
      });

      expect(result.action).toBe("ANALYZE_STYLE_PERSONALITY");
      expect(result.status).toBe("success");
      expect(result.recommended_personality).toBe("classic_elegance");
      expect(result.confidence_score).toBeGreaterThan(0);
      expect(result.description).toContain("sophisticated");
      expect(result.styling_recommendations.length).toBeGreaterThan(0);
    });

    test("should handle mixed keywords with secondary recommendations", async () => {
      const result = await executeAgentTool("analyze_style_personality", {
        style_keywords: ["glamorous", "dramatic", "bold", "statement"],
        lifestyle: "fashion_forward"
      });

      expect(result.action).toBe("ANALYZE_STYLE_PERSONALITY");
      expect(result.status).toBe("success");
      expect(result.recommended_personality).toBe("glamorous_drama");
      expect(result.secondary_personalities.length).toBeGreaterThan(0);
      expect(result.mood_board_suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("suggest_color_combinations tool", () => {
    test("should suggest colors for warm undertone Tamil wedding", async () => {
      const result = await executeAgentTool("suggest_color_combinations", {
        skin_undertone: "warm",
        outfit_colors: ["red", "gold", "cream"],
        shoot_environment: "heritage_location",
        mood_goal: "romantic"
      });

      expect(result.action).toBe("SUGGEST_COLOR_COMBINATIONS");
      expect(result.status).toBe("success");
      expect(result.skin_undertone).toBe("warm");
      expect(result.primary_colors).toContain("Gold");
      expect(result.primary_colors).toContain("Warm Red");
      expect(result.accent_colors.length).toBeGreaterThan(0);
      expect(result.colors_to_avoid).toContain("Cool Blue");
      expect(result.expert_combinations.length).toBe(3);
      expect(result.technical_notes.length).toBeGreaterThan(0);
      expect(result.mood_specific_palette.length).toBeGreaterThan(0);
    });

    test("should suggest colors for cool undertone corporate shoot", async () => {
      const result = await executeAgentTool("suggest_color_combinations", {
        skin_undertone: "cool",
        outfit_colors: ["navy", "white"],
        shoot_environment: "studio",
        mood_goal: "powerful"
      });

      expect(result.action).toBe("SUGGEST_COLOR_COMBINATIONS");
      expect(result.status).toBe("success");
      expect(result.primary_colors).toContain("Cool Blue");
      expect(result.primary_colors).toContain("Navy");
      expect(result.colors_to_avoid).toContain("Orange");
      expect(result.mood_specific_palette.length).toBeGreaterThan(0);
      // Should suggest powerful colors for cool undertones
      expect(result.mood_specific_palette).toEqual(
        expect.arrayContaining(["Navy Blue", "Silver", "Charcoal", "Royal Purple"])
      );
    });

    test("should analyze outfit color harmony", async () => {
      const result = await executeAgentTool("suggest_color_combinations", {
        skin_undertone: "warm",
        outfit_colors: ["bright orange", "hot pink"], // Colors that don't match warm undertone
        mood_goal: "elegant"
      });

      expect(result.outfit_harmony).toContain("Consider adjusting");
    });
  });

  describe("recommend_styling_elements tool", () => {
    test("should recommend traditional Tamil bridal styling", async () => {
      const result = await executeAgentTool("recommend_styling_elements", {
        primary_concept: "traditional_heritage",
        gender: "feminine",
        age_group: "young_adult",
        budget_range: "premium"
      });

      expect(result.action).toBe("RECOMMEND_STYLING_ELEMENTS");
      expect(result.status).toBe("success");
      expect(result.concept).toBe("Traditional Heritage");
      expect(result.target_demographic).toBe("feminine young_adult");
      expect(result.clothing_recommendations.length).toBeGreaterThan(0);
      expect(result.accessory_suggestions.length).toBeGreaterThan(0);
      expect(result.makeup_hair_guide).toContain("traditional");
      expect(result.pose_suggestions.length).toBeGreaterThan(0);
      expect(result.cultural_authenticity_notes.length).toBeGreaterThan(0);
      expect(result.final_checklist.length).toBeGreaterThan(0);
    });

    test("should recommend modern masculine corporate styling", async () => {
      const result = await executeAgentTool("recommend_styling_elements", {
        primary_concept: "modern_editorial",
        gender: "masculine", 
        age_group: "adult",
        budget_range: "mid_range"
      });

      expect(result.action).toBe("RECOMMEND_STYLING_ELEMENTS");
      expect(result.status).toBe("success");
      expect(result.concept).toBe("Modern Editorial");
      expect(result.clothing_recommendations).toContain("Well-tailored shirts, suits, or ethnic wear");
      expect(result.accessory_suggestions).toContain("Minimal, quality accessories");
      expect(result.makeup_hair_guide).toContain("Groomed appearance");
      expect(result.pose_suggestions).toContain("Strong, confident posture");
    });

    test("should handle special requirements for pregnancy", async () => {
      const result = await executeAgentTool("recommend_styling_elements", {
        primary_concept: "romantic_dreamy",
        gender: "feminine",
        age_group: "adult",
        budget_range: "mid_range",
        special_requirements: "pregnant maternity shoot"
      });

      expect(result.action).toBe("RECOMMEND_STYLING_ELEMENTS");
      expect(result.status).toBe("success");
      expect(result.special_accommodations).toEqual(
        expect.arrayContaining([
          "Empire waist or A-line silhouettes",
          "Comfortable, stretchy fabrics",
          "Poses that celebrate the pregnancy",
          "Comfortable seating options available"
        ])
      );
    });

    test("should provide budget-appropriate recommendations", async () => {
      const result = await executeAgentTool("recommend_styling_elements", {
        primary_concept: "vibrant_celebration",
        gender: "feminine",
        age_group: "teen",
        budget_range: "budget_friendly"
      });

      expect(result.budget_alternatives).toEqual(
        expect.arrayContaining([
          "Utilize existing wardrobe pieces that fit the concept",
          "DIY accessories and simple makeup",
          "Rent traditional wear if needed",
          "Focus on fit and styling over expensive pieces"
        ])
      );
    });
  });

  describe("Error handling and edge cases", () => {
    test("should handle missing required parameters gracefully", async () => {
      const result = await executeAgentTool("create_moodboard", {});

      expect(result.action).toBe("CREATE_MOODBOARD");
      expect(result.status).toBe("success");
      // Should use defaults
      expect(result.concept_name).toBeDefined();
      expect(result.primary_mood).toBeDefined();
    });

    test("should handle invalid style preference", async () => {
      const result = await executeAgentTool("create_moodboard", {
        shoot_type: "wedding",
        style_preference: "invalid_style",
        cultural_background: "tamil"
      });

      expect(result.action).toBe("CREATE_MOODBOARD");
      expect(result.status).toBe("success");
      // Should fallback gracefully
      expect(result.concept_name).toBeDefined();
    });

    test("should provide meaningful recommendations for empty style keywords", async () => {
      const result = await executeAgentTool("analyze_style_personality", {
        style_keywords: []
      });

      expect(result.action).toBe("ANALYZE_STYLE_PERSONALITY");
      expect(result.status).toBe("success");
      expect(result.recommended_personality).toBe("classic_elegance"); // Default
      expect(result.confidence_score).toBe(50); // Base score
    });
  });

  describe("Cultural authenticity and sensitivity", () => {
    test("should provide culturally authentic Tamil wedding recommendations", async () => {
      const result = await executeAgentTool("create_moodboard", {
        shoot_type: "wedding",
        style_preference: "traditional_heritage",
        cultural_background: "tamil",
        occasion: "muhurtham ceremony"
      });

      expect(result.cultural_elements).toEqual(
        expect.arrayContaining([
          "Traditional Tamil jewelry (Kempu, Kasu Malai)",
          "Kanjivaram silk sarees",
          "Fresh jasmine flower decorations"
        ])
      );

      // Should include specific Tamil concepts
      const tamilConcept = result.shoot_specific_concepts.find(c => 
        c.concept.includes('muhurtham') || c.description.includes('Tamil')
      );
      expect(tamilConcept).toBeDefined();
    });

    test("should respect cultural sensitivity in styling recommendations", async () => {
      const result = await executeAgentTool("recommend_styling_elements", {
        primary_concept: "traditional_heritage",
        gender: "feminine",
        special_requirements: "religious considerations"
      });

      expect(result.special_accommodations).toEqual(
        expect.arrayContaining([
          "Appropriate modesty considerations",
          "Culturally respectful styling",
          "Religious symbol inclusion if desired",
          "Consultation with religious guidelines"
        ])
      );
    });
  });

  describe("Performance and comprehensive coverage", () => {
    test("should handle complex multi-parameter moodboard creation", async () => {
      const result = await executeAgentTool("create_moodboard", {
        shoot_type: "maternity",
        style_preference: "romantic_dreamy",
        color_preference: "earth_tones",
        cultural_background: "mixed",
        occasion: "expecting parents celebration",
        dominant_colors: ["soft pink", "cream", "gold"]
      });

      expect(result.action).toBe("CREATE_MOODBOARD");
      expect(result.status).toBe("success");
      expect(result.concept_name).toContain("romantic dreamy");
      expect(result.concept_name).toContain("maternity");
      expect(result.primary_mood).toBe("romantic_dreamy");
      
      // Should integrate all parameters meaningfully
      expect(result.color_palette.length).toBeGreaterThan(0);
      expect(result.styling_elements.length).toBeGreaterThan(0);
      expect(result.expert_tips.length).toBeGreaterThan(0);
    });

    test("all MoodBoard AI tools should execute without errors", async () => {
      const tools = [
        { name: "create_moodboard", args: { shoot_type: "portrait" } },
        { name: "analyze_style_personality", args: { style_keywords: ["elegant"] } },
        { name: "suggest_color_combinations", args: { mood_goal: "elegant" } },
        { name: "recommend_styling_elements", args: { primary_concept: "modern_editorial", gender: "feminine" } }
      ];

      for (const tool of tools) {
        const result = await executeAgentTool(tool.name, tool.args);
        expect(result.status).toBe("success");
        expect(result.action).toBeDefined();
      }
    });
  });
});