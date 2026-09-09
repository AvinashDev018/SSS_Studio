import { prisma } from "@/lib/prisma";

// 1. Tool Schemas for DeepSeek Tool Calling
export const AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "query_frames",
      description: "Search the SSS Studio photo frames catalog (13 sizes from 8x10 to 24x36) to recommend the best frame size and finish based on customer room, wall space, photo type, or budget.",
      parameters: {
        type: "object",
        properties: {
          room_type: {
            type: "string",
            description: "Room location, e.g., 'living room', 'bedroom', 'study desk', 'office cabin', 'staircase passage'",
          },
          photo_type: {
            type: "string",
            description: "Type of photo, e.g., 'wedding couple portrait', 'family photo', 'baby picture', 'solo portrait'",
          },
          wall_space: {
            type: "string",
            description: "Placement, e.g., 'above 3-seater sofa', 'bedside table', 'console table', 'hall focal wall'",
          },
          max_budget: {
            type: "number",
            description: "Maximum budget in INR (optional)",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_packages",
      description: "Fetch the live SSS Studio photography packages and current prices from the database (weddings, pre-wedding, maternity, baby/birthday).",
      parameters: {
        type: "object",
        properties: {
          event_hint: {
            type: "string",
            description: "Optional event type hint such as wedding, maternity, baby, prewedding",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_package_quote",
      description: "Calculate an itemized photography and videography package quote for weddings, engagements, pre-wedding shoots, maternity sessions, and birthdays in Madurai, including 1-Month Delivery Guarantee.",
      parameters: {
        type: "object",
        properties: {
          event_type: {
            type: "string",
            enum: ["wedding", "engagement", "reception", "prewedding", "maternity", "baby", "birthday"],
            description: "The type of ceremony or photoshoot session",
          },
          styles: {
            type: "array",
            items: { type: "string", enum: ["candid", "traditional", "cinematic", "portraits"] },
            description: "Styles requested: candid (candid photos), traditional (rituals/family stage), cinematic (4K video), portraits (creative bridal/couple)",
          },
          include_drone: {
            type: "boolean",
            description: "Whether aerial drone coverage is requested",
          },
          include_master_album: {
            type: "boolean",
            description: "Whether custom handcrafted photobook album is included",
          },
          days_count: {
            type: "number",
            description: "Number of days/sessions (default 1)",
          },
        },
        required: ["event_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "track_order",
      description: "Look up client order or print status using their Order ID (e.g. SSS-...) or registered phone number.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Order ID (e.g. SSS-1234) or customer 10-digit mobile number",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_whatsapp_deal",
      description: "Generate a formatted 1-click WhatsApp booking quote for the studio owner (+91 63835 65425) with client package details.",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string", description: "Short summary of the deal (e.g. '2-Day Wedding Package with Drone')" },
          client_name: { type: "string", description: "Customer name if provided, or 'Valued Client'" },
          event_date: { type: "string", description: "Approximate date or month of the event" },
          estimated_total: { type: "string", description: "Estimated price in INR" },
        },
        required: ["summary", "estimated_total"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "explain_website",
      description: "Explain any SSS Studio website page or feature: Home, Packages, Store, Gallery, Book, Track Order, Visualizer, Contact, promo codes, how to book, how to order frames.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "Page or topic, e.g. home, packages, store, gallery, book, track, frames, promo, visualizer, contact, website",
          },
        },
        required: ["topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "fetch_recent_shoots",
      description: "Fetch recent portfolio photography shoots and real sample photos (Wedding, Muhurtham, Pre-Wedding, Maternity, Baby, 1st Birthday) to present to the user.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["all", "wedding", "pre-wedding", "baby-maternity", "birthday-events"],
            description: "Optional category filter: 'wedding', 'pre-wedding', 'baby-maternity', 'birthday-events', or 'all'",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_moodboard",
      description: "Generate a comprehensive AI-powered mood board with styling recommendations, color palettes, and visual concepts based on client preferences, shoot type, and cultural background.",
      parameters: {
        type: "object",
        properties: {
          shoot_type: {
            type: "string",
            enum: ["wedding", "maternity", "birthday", "corporate", "portrait", "family", "cultural_event"],
            description: "Type of photoshoot session",
          },
          style_preference: {
            type: "string",
            enum: ["traditional_heritage", "modern_editorial", "romantic_dreamy", "vibrant_celebration", "classic_elegance", "bohemian_free_spirit"],
            description: "Preferred aesthetic style or personality",
          },
          color_preference: {
            type: "string",
            enum: ["warm_tones", "cool_tones", "neutral_tones", "earth_tones", "vibrant_colors", "pastel_colors"],
            description: "Preferred color palette family",
          },
          cultural_background: {
            type: "string",
            enum: ["tamil", "south_indian", "indian", "international", "mixed"],
            description: "Cultural background to incorporate authentic elements",
          },
          occasion: {
            type: "string",
            description: "Specific occasion or event (e.g., 'muhurtham ceremony', 'engagement', 'first birthday', 'corporate headshots')",
          },
          dominant_colors: {
            type: "array",
            items: { type: "string" },
            description: "Dominant colors from uploaded image or outfit (optional)",
          },
        },
        required: ["shoot_type"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_style_personality",
      description: "Analyze client's style personality and preferences to recommend the most suitable mood board concepts and styling approaches.",
      parameters: {
        type: "object",
        properties: {
          style_keywords: {
            type: "array",
            items: { type: "string" },
            description: "Keywords describing preferred style (e.g., 'elegant', 'traditional', 'modern', 'colorful', 'minimal')",
          },
          inspiration_references: {
            type: "string",
            description: "Any specific inspiration or references mentioned by the client",
          },
          lifestyle: {
            type: "string",
            enum: ["traditional", "modern", "artistic", "professional", "family_oriented", "fashion_forward"],
            description: "Client's lifestyle or personality type",
          },
        },
        required: ["style_keywords"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_color_combinations",
      description: "Recommend expert color combinations and palettes based on skin tone, outfit colors, occasion, and cultural context for photography styling.",
      parameters: {
        type: "object",
        properties: {
          skin_undertone: {
            type: "string",
            enum: ["warm", "cool", "neutral", "olive"],
            description: "Client's skin undertone for optimal color matching",
          },
          outfit_colors: {
            type: "array",
            items: { type: "string" },
            description: "Colors of outfit or clothing items",
          },
          shoot_environment: {
            type: "string",
            enum: ["studio", "outdoor_natural", "indoor_traditional", "urban", "heritage_location"],
            description: "Photography environment or location type",
          },
          mood_goal: {
            type: "string",
            description: "Desired mood or emotion to convey (e.g., 'romantic', 'powerful', 'joyful', 'serene')",
          },
        },
        required: ["mood_goal"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recommend_styling_elements",
      description: "Provide detailed styling recommendations including clothing, accessories, makeup, hair, and props based on the mood board concept and client preferences.",
      parameters: {
        type: "object",
        properties: {
          primary_concept: {
            type: "string",
            description: "Primary mood board concept or aesthetic style",
          },
          gender: {
            type: "string",
            enum: ["feminine", "masculine", "non_binary", "mixed_couple"],
            description: "Gender for styling recommendations",
          },
          age_group: {
            type: "string",
            enum: ["baby", "child", "teen", "young_adult", "adult", "senior", "multi_generational"],
            description: "Age group for appropriate styling",
          },
          budget_range: {
            type: "string",
            enum: ["budget_friendly", "mid_range", "premium", "luxury"],
            description: "Budget range for styling recommendations",
          },
          special_requirements: {
            type: "string",
            description: "Any special requirements or considerations (e.g., 'pregnant', 'wheelchair accessible', 'religious considerations')",
          },
        },
        required: ["primary_concept", "gender"],
      },
    },
  },
];

// 2. Deterministic Tool Executions

// Helper functions for MoodBoard AI
function analyzeColorHarmony(outfitColors, recommendedColors) {
  const harmonious = outfitColors.filter(color => 
    recommendedColors.some(rec => 
      color.toLowerCase().includes(rec.toLowerCase()) || 
      rec.toLowerCase().includes(color.toLowerCase())
    )
  );
  
  if (harmonious.length === outfitColors.length) {
    return "Excellent harmony - all outfit colors complement your skin undertone";
  } else if (harmonious.length > outfitColors.length / 2) {
    return "Good harmony - most outfit colors work well with your undertone";
  } else {
    return "Consider adjusting some outfit colors for better harmony with your skin undertone";
  }
}

function getMoodSpecificPalette(mood, undertone) {
  const moodPalettes = {
    romantic: undertone === "warm" ? 
      ["Blush Pink", "Soft Gold", "Cream", "Dusty Rose"] : 
      ["Lavender", "Silver", "Soft Blue", "Pearl White"],
    powerful: undertone === "warm" ?
      ["Deep Red", "Gold", "Black", "Burgundy"] :
      ["Navy Blue", "Silver", "Charcoal", "Royal Purple"],
    joyful: ["Bright Yellow", "Coral", "Turquoise", "Warm Orange"],
    serene: ["Sage Green", "Soft Gray", "Cream", "Pale Blue"],
    elegant: undertone === "warm" ?
      ["Champagne", "Taupe", "Cream", "Soft Gold"] :
      ["Pearl Gray", "Platinum", "Ivory", "Cool Silver"]
  };
  
  return moodPalettes[mood.toLowerCase()] || moodPalettes.elegant;
}

function generateGenderSpecificStyling(gender, concept, ageGroup) {
  const baseRecommendations = {
    feminine: {
      clothing: [
        concept.includes('traditional') ? "Silk sarees or lehengas with cultural significance" : "Elegant dresses or well-fitted separates",
        concept.includes('modern') ? "Contemporary Indo-western wear" : "Classic traditional attire",
        "Fabrics that photograph well - silk, cotton, chiffon",
        "Colors that complement skin tone and concept"
      ],
      accessories: [
        concept.includes('traditional') ? "Temple jewelry, jhumkas, bangles" : "Minimalist or statement pieces as appropriate",
        "Hair accessories that complement the hairstyle",
        "Appropriate footwear that won't distract"
      ],
      makeup_hair: concept.includes('traditional') ?
        "Traditional styling with kajal, bold lips, jasmine in hair" :
        "Natural or glamorous makeup depending on concept, professional hair styling",
      poses: [
        "Graceful hand positions",
        "Elegant posture with shoulders relaxed",
        "Natural expressions that convey the desired mood",
        "Traditional poses if culturally appropriate"
      ]
    },
    masculine: {
      clothing: [
        concept.includes('traditional') ? "Silk kurtas, veshtis, or sherwanis" : "Well-tailored shirts, suits, or ethnic wear",
        concept.includes('modern') ? "Contemporary formal or smart casual" : "Traditional men's attire",
        "Proper fit is crucial for masculine styling",
        "Colors that enhance masculine features"
      ],
      accessories: [
        concept.includes('traditional') ? "Traditional watches, rings, or cultural accessories" : "Minimal, quality accessories",
        "Pocket squares or traditional scarves if appropriate",
        "Classic footwear that complements the outfit"
      ],
      makeup_hair: "Groomed appearance, styled hair, minimal makeup for photography enhancement",
      poses: [
        "Strong, confident posture",
        "Natural hand positions",
        "Expressions that convey strength and character",
        "Traditional masculine poses if culturally relevant"
      ]
    },
    mixed_couple: {
      clothing: ["Coordinated but not matching outfits", "Colors that complement each other", "Similar level of formality"],
      accessories: ["Balanced accessory levels", "Complementary metals and styles"],
      makeup_hair: "Coordinated styling that doesn't compete for attention",
      poses: ["Natural interactions", "Complementary positioning", "Authentic emotional connection"]
    }
  };

  return baseRecommendations[gender] || baseRecommendations.feminine;
}

function generateBudgetOptions(budget, concept) {
  const budgetGuides = {
    budget_friendly: [
      "Utilize existing wardrobe pieces that fit the concept",
      "DIY accessories and simple makeup",
      "Rent traditional wear if needed",
      "Focus on fit and styling over expensive pieces"
    ],
    mid_range: [
      "Invest in one key piece per concept",
      "Mix high and low elements strategically", 
      "Professional makeup worth the investment",
      "Quality accessories that can be reused"
    ],
    premium: [
      "Custom-tailored pieces for perfect fit",
      "Professional styling services",
      "High-quality fabrics and accessories",
      "Complete cohesive looks"
    ],
    luxury: [
      "Designer pieces or custom couture",
      "Professional hair and makeup team",
      "Premium accessories and jewelry",
      "Complete styling transformation"
    ]
  };

  return budgetGuides[budget] || budgetGuides.mid_range;
}

function generateAgeAppropriate(ageGroup, concept, gender) {
  const ageGuidelines = {
    baby: ["Soft, comfortable fabrics", "Safe, non-restrictive clothing", "Minimal accessories", "Natural, gentle styling"],
    child: ["Age-appropriate colors and styles", "Comfortable, playful elements", "Fun but tasteful accessories", "Natural expressions encouraged"],
    teen: ["Trendy but timeless elements", "Age-appropriate sophistication", "Balanced between youthful and mature", "Confidence-building styling"],
    young_adult: ["Fashion-forward choices", "Full range of styling options", "Personal expression encouraged", "Contemporary aesthetics"],
    adult: ["Sophisticated, professional options", "Classic and contemporary balance", "Quality over trendiness", "Mature, elegant styling"],
    senior: ["Elegant, timeless choices", "Comfortable, dignified styling", "Classic colors and cuts", "Respectful, honoring approach"],
    multi_generational: ["Coordinated but individually appropriate", "Respectful of all age groups", "Balanced styling levels", "Harmonious group aesthetic"]
  };

  return ageGuidelines[ageGroup] || ageGuidelines.adult;
}

function generateSpecialAccommodations(requirements, concept) {
  const accommodationGuides = {
    pregnant: [
      "Empire waist or A-line silhouettes",
      "Comfortable, stretchy fabrics",
      "Poses that celebrate the pregnancy",
      "Comfortable seating options available"
    ],
    wheelchair: [
      "Focus on upper body styling",
      "Accessible venue considerations",
      "Comfortable positioning options",
      "Dignified, empowering approach"
    ],
    religious: [
      "Appropriate modesty considerations",
      "Culturally respectful styling",
      "Religious symbol inclusion if desired",
      "Consultation with religious guidelines"
    ]
  };

  const reqLower = requirements.toLowerCase();
  
  if (reqLower.includes('pregnant')) return accommodationGuides.pregnant;
  if (reqLower.includes('wheelchair')) return accommodationGuides.wheelchair;
  if (reqLower.includes('religious')) return accommodationGuides.religious;
  
  return ["Custom accommodations will be made based on specific needs discussed during consultation"];
}

export async function executeAgentTool(name, args) {
  try {
    switch (name) {
      case "query_frames": {
        const { getFrames } = await import("@/app/actions/frames");
        const frames = await getFrames({ admin: false });

        const maxBudget = args.max_budget || Infinity;
        const room = (args.room_type || "").toLowerCase();
        const wall = (args.wall_space || "").toLowerCase();

        const scored = frames
          .filter((f) => f.numericPrice <= maxBudget)
          .map((f) => {
            let score = 0;
            const bestFor = (f.bestFor || "").toLowerCase();

            if (wall.includes("sofa") || room.includes("living") || wall.includes("hall")) {
              if (f.width >= 16) score += 5;
            } else if (wall.includes("bedside") || wall.includes("table") || room.includes("study")) {
              if (f.width <= 12) score += 5;
            }

            if (bestFor.includes(room) || (room && bestFor.split(" ").some((w) => room.includes(w)))) score += 3;
            if (f.popular) score += 2;

            return { ...f, score };
          })
          .sort((a, b) => b.score - a.score);

        const recommended = scored.slice(0, 3);

        return {
          action: "RECOMMEND_FRAMES",
          status: "success",
          count: recommended.length,
          recommendedFrames: recommended.map((f) => ({
            id: f.id,
            size: `${f.width}x${f.height}`,
            numericPrice: f.numericPrice,
            priceFormatted: f.price,
            bestFor: f.bestFor,
            tag: f.tag,
            popular: f.popular,
          })),
          finishesAvailable: ["Sparkle Lamination (Glitter/Luxury)", "Matte Finish (Anti-Glare)", "High Gloss"],
        };
      }

      case "query_packages": {
        const { getPackages } = await import("@/app/actions/packages");
        const packages = await getPackages();
        return {
          action: "LIST_PACKAGES",
          status: "success",
          count: packages.length,
          packages: packages.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            features: p.features,
            popular: p.popular,
          })),
        };
      }

      case "calculate_package_quote": {
        const eventType = args.event_type || "wedding";
        const styles = args.styles || ["candid", "traditional"];
        const includeDrone = !!args.include_drone;
        const includeAlbum = args.include_master_album !== false;
        const days = Math.max(1, args.days_count || 1);

        // Base event rates
        const eventBaseRates = {
          wedding: 18000,
          reception: 12000,
          engagement: 10000,
          prewedding: 8000,
          maternity: 6000,
          baby: 5000,
          birthday: 5000,
        };

        const basePrice = (eventBaseRates[eventType] || 10000) * days;
        let styleCost = 0;
        if (styles.includes("candid")) styleCost += 6000 * days;
        if (styles.includes("traditional")) styleCost += 4000 * days;
        if (styles.includes("cinematic")) styleCost += 9000 * days;
        if (styles.includes("portraits")) styleCost += 4000 * days;

        const droneCost = includeDrone ? 6000 * days : 0;
        const albumCost = includeAlbum ? 5500 : 0;

        const totalEstimated = basePrice + styleCost + droneCost + albumCost;

        const deliverables = [
          "1-Month Album Delivery Guarantee (or ₹1,000 cash credit)",
          `${days > 1 ? days + " Days" : "Full Event"} Professional Coverage`,
          "All High-Resolution Master Edited Photos",
          "Private Cloud Gallery for Family Sharing (6 Months)",
        ];

        if (includeAlbum) deliverables.push("Handcrafted 30-Page Master Leather Photobook Album");
        if (includeDrone) deliverables.push("Licensed 4K Aerial Drone Coverage & Highlights");
        if (styles.includes("cinematic")) deliverables.push("Signature 3-Minute 4K Cinematic Teaser Video");

        return {
          action: "PACKAGE_QUOTE",
          status: "success",
          eventType,
          days,
          breakdown: {
            baseCoverage: `₹${basePrice.toLocaleString("en-IN")}`,
            photographyStyles: `₹${styleCost.toLocaleString("en-IN")}`,
            aerialDrone: includeDrone ? `₹${droneCost.toLocaleString("en-IN")}` : "Not included",
            masterAlbum: includeAlbum ? `₹${albumCost.toLocaleString("en-IN")}` : "Not included",
          },
          totalEstimated: `₹${totalEstimated.toLocaleString("en-IN")}`,
          totalNumeric: totalEstimated,
          deliverables,
          deliveryGuarantee: "Guaranteed 1-Month Delivery to your door",
        };
      }

      case "track_order": {
        const rawQuery = (args.query || "").trim();
        const digitsOnly = rawQuery.replace(/\D/g, "");
        let order = null;
        let isBooking = false;

        try {
          if (digitsOnly.length >= 7) {
            const matchPattern = digitsOnly.slice(-10);
            order = await prisma.order.findFirst({
              where: { customerPhone: { contains: matchPattern } },
              orderBy: { createdAt: "desc" },
            });
            if (!order) {
              const booking = await prisma.booking.findFirst({
                where: { phone: { contains: matchPattern } },
                orderBy: { createdAt: "desc" },
              });
              if (booking) {
                isBooking = true;
                order = {
                  orderId: `SHOOT-${booking.id.slice(0, 6).toUpperCase()}`,
                  customerName: booking.name,
                  status: booking.status,
                  totalAmount: 0,
                  createdAt: booking.createdAt,
                  courierTrackingId: null,
                  eventType: booking.eventType,
                };
              }
            }
          } else {
            order = await prisma.order.findFirst({
              where: { orderId: { equals: rawQuery.toUpperCase(), mode: "insensitive" } },
            });
            if (!order && rawQuery.toUpperCase().startsWith("SHOOT-")) {
              const shortId = rawQuery.toUpperCase().replace("SHOOT-", "").toLowerCase();
              const booking = await prisma.booking.findFirst({
                where: { id: { startsWith: shortId } },
              });
              if (booking) {
                isBooking = true;
                order = {
                  orderId: rawQuery.toUpperCase(),
                  customerName: booking.name,
                  status: booking.status,
                  totalAmount: 0,
                  createdAt: booking.createdAt,
                  courierTrackingId: null,
                  eventType: booking.eventType,
                };
              }
            }
          }
        } catch (dbErr) {
          console.warn("DB lookup error:", dbErr.message);
        }

        if (order) {
          const status = (order.status || "PENDING").toUpperCase();
          let progress = 25;
          let stageLabel = "Order Placed & Confirmed";
          let stageDesc = "Order verified. Sent to Avaniyapuram lab.";

          if (status === "PROCESSING") {
            progress = 65;
            stageLabel = isBooking ? "Color Grading & Retouching" : "Fine-Art Printing & Framing";
            stageDesc = isBooking
              ? "Master editing on Sony FX3 raw portraits."
              : "Sparkle / Matte lamination mounting in progress.";
          } else if (status === "READY_FOR_PICKUP") {
            progress = 90;
            stageLabel = "Ready for Studio Pickup";
            stageDesc = "Ready at Studio: 34, Prasanna New Colony, Avaniyapuram.";
          } else if (status === "SHIPPED") {
            progress = 85;
            stageLabel = "Shipped via Courier";
            stageDesc = order.courierTrackingId
              ? `In transit with courier tracking ID: ${order.courierTrackingId}`
              : "Dispatched with courier partner.";
          } else if (status === "DELIVERED" || status === "PICKED_UP" || status === "COMPLETED") {
            progress = 100;
            stageLabel = "Delivered / Completed";
            stageDesc = "Handcrafted delivery completed. Thank you!";
          }

          return {
            action: "TRACK_ORDER",
            found: true,
            orderId: order.orderId,
            customerName: order.customerName,
            status,
            stageLabel,
            stageDesc,
            progress,
            totalAmount: order.totalAmount ? `₹${order.totalAmount}` : null,
            courierTrackingId: order.courierTrackingId || null,
            isBooking,
            eventType: order.eventType || null,
            trackUrl: `/track?id=${order.orderId}`,
            message: `Found ${isBooking ? 'shoot booking' : 'order'} ${order.orderId} for ${order.customerName}. Current status: ${stageLabel}.`,
          };
        }

        return {
          action: "TRACK_ORDER",
          found: false,
          query: rawQuery,
          message: `No active order found for '${rawQuery}'. You can search on our track page or contact studio WhatsApp directly (+91 63835 65425).`,
        };
      }

      case "create_whatsapp_deal": {
        const summary = args.summary || "Photography Package Inquiry";
        const total = args.estimated_total || "Custom Quote";
        const clientName = args.client_name || "Valued Customer";
        const eventDate = args.event_date || "Upcoming Date";

        const text = encodeURIComponent(
          `Hi SSS Studio! 👋\nI am interested in booking:\n• Package: ${summary}\n• Estimated Total: ${total}\n• Name: ${clientName}\n• Date: ${eventDate}\n\nPlease confirm availability and let's finalize the date!`
        );

        const whatsappUrl = `https://wa.me/916383565425?text=${text}`;

        return {
          action: "WHATSAPP_DEAL",
          whatsappUrl,
          summary,
          estimatedTotal: total,
          phone: "+91 63835 65425",
        };
      }

      case "explain_website": {
        const { WEBSITE_MAP, findRouteForQuery, buildWebsiteGuideReply } = await import("./websiteKnowledge.js");
        const topic = String(args.topic || "website").toLowerCase();
        const route = findRouteForQuery(topic) || WEBSITE_MAP.routes.find((r) => topic.includes(r.path.replace("/", "")) || topic.includes(r.name.toLowerCase()));

        let packagesText = "";
        let framesText = "";
        try {
          const { getPackages } = await import("@/app/actions/packages");
          const { getFrames } = await import("@/app/actions/frames");
          const pkgs = await getPackages();
          const frames = await getFrames({ admin: false });
          packagesText = pkgs.slice(0, 8).map((p) => `• ${p.name}: ${p.price}`).join("\n");
          const prices = frames.map((f) => f.numericPrice);
          framesText =
            frames.length > 0
              ? `• ${frames.length} live sizes from ₹${Math.min(...prices).toLocaleString("en-IN")} to ₹${Math.max(...prices).toLocaleString("en-IN")}`
              : "";
        } catch (_) {}

        let howto = null;
        if (topic.includes("book")) howto = WEBSITE_MAP.howTos.bookShoot;
        if (topic.includes("frame") || topic.includes("buy") || topic.includes("order") || topic.includes("store")) howto = WEBSITE_MAP.howTos.buyFrame;
        if (topic.includes("track")) howto = WEBSITE_MAP.howTos.trackOrder;
        if (topic.includes("promo") || topic.includes("coupon") || topic.includes("voucher")) howto = WEBSITE_MAP.howTos.usePromo;
        if (topic.includes("package") || topic.includes("price")) howto = WEBSITE_MAP.howTos.seePackages;
        if (topic.includes("gallery") || topic.includes("portfolio")) howto = WEBSITE_MAP.howTos.seePortfolio;

        return {
          action: "EXPLAIN_WEBSITE",
          status: "success",
          topic,
          route: route
            ? { path: route.path, name: route.name, purpose: route.purpose }
            : null,
          howto,
          homepageSections: WEBSITE_MAP.homepageSections,
          guide: buildWebsiteGuideReply({
            lang: "en",
            route,
            packagesText,
            framesText,
          }),
          studio: WEBSITE_MAP.studio,
        };
      }

      case "fetch_recent_shoots": {
        const catFilter = (args.category || "all").toLowerCase();
        const portfolioProjects = [
          {
            id: 1,
            title: "The Wedding of Srijitha + Sreeraj",
            category: "wedding",
            categoryLabel: "Wedding",
            clientName: "Srijitha & Sreeraj",
            image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788882990/sss_wedding_srijitha_sreeraj/srijitha_sreeraj_spread_1.png",
            description: "Sacred South Indian Muhurtham, garland exchange, Mangalya Dhaaranam, and grand starlight reception captured on 11.05.2025.",
          },
          {
            id: 4,
            title: "Master K.K. Sathvik 1st Birthday Royal Celebration",
            category: "birthday-events",
            categoryLabel: "Birthdays & Events",
            clientName: "Sathvik 1st B'day",
            image: "/images/birthday/sathvik-1st-birthday-portrait.jpg",
            description: "Grand 1st birthday milestone celebration with royal purple theme decor, tender parent moments, cake cutting, and full family celebration.",
          },
          {
            id: 5,
            title: "Royal Crimson Sangeet & Reception Shoot",
            category: "birthday-events",
            categoryLabel: "Events & Shoots",
            clientName: "Sangeet Shoot",
            image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886066/sss_festive_sangeet_shoot/festive_sangeet_sisters_stage_pose.jpg",
            description: "Glamorous crimson silk lehenga styling, ornate bridal jewelry, candid sisterhood moments, and festive warm ambient stage lighting.",
          },
          {
            id: 8,
            title: "Traditional Puberty Ceremony Highlights — Loshi",
            category: "birthday-events",
            categoryLabel: "Traditional Ceremony",
            clientName: "Puberty Function",
            image: "https://res.cloudinary.com/e5pnwpo5/image/upload/v1788886049/sss_festive_sangeet_shoot/festive_sangeet_sister_duo_portrait.jpg",
            description: "Traditional South Indian Puberty Function (Manjal Neerattu Vizha / Half Saree celebration) captured with vibrant colors, floral decor, sacred blessings, and joy.",
          },
        ];

        const matches = portfolioProjects.filter((p) =>
          catFilter === "all" ? true : p.category === catFilter || p.category.includes(catFilter)
        );

        return {
          action: "SHOW_RECENT_SHOOTS",
          status: "success",
          count: matches.length > 0 ? matches.length : portfolioProjects.length,
          shoots: matches.length > 0 ? matches : portfolioProjects,
        };
      }

      case "create_moodboard": {
        const { 
          shoot_type = "portrait", 
          style_preference = "modern_editorial", 
          color_preference = "warm_tones",
          cultural_background = "tamil",
          occasion = "general",
          dominant_colors = []
        } = args;

        const { 
          generateMoodBoardRecommendations, 
          createExpertMoodBoard, 
          MOODBOARD_CONCEPTS 
        } = await import("./moodboardKnowledge.js");

        // Generate comprehensive mood board recommendations
        const recommendations = generateMoodBoardRecommendations({
          shootType: shoot_type,
          stylePersonality: style_preference,
          colorPreference: color_preference,
          culturalBackground: cultural_background,
          occasion,
          season: "all_seasons"
        });

        // Create detailed mood board
        const moodBoard = createExpertMoodBoard({
          primaryMood: style_preference,
          colorPalette: recommendations.color_palette,
          culturalElements: recommendations.cultural_elements,
          occasion
        });

        // Add specific recommendations based on shoot type
        let shootSpecificTips = {};
        if (MOODBOARD_CONCEPTS.shoot_moods[shoot_type]) {
          const shootMood = MOODBOARD_CONCEPTS.shoot_moods[shoot_type];
          shootSpecificTips = shootMood.specific_concepts || {};
        }

        return {
          action: "CREATE_MOODBOARD",
          status: "success",
          concept_name: `${style_preference.replace('_', ' ')} ${shoot_type} session`,
          primary_mood: style_preference,
          color_palette: recommendations.color_palette.slice(0, 6),
          styling_elements: recommendations.styling_elements.slice(0, 8),
          cultural_elements: recommendations.cultural_elements,
          location_suggestions: recommendations.location_suggestions.length > 0 
            ? recommendations.location_suggestions 
            : ["Indoor studio with cultural backdrop", "Heritage location in Madurai", "Natural outdoor setting"],
          lighting_recommendations: recommendations.lighting_recommendations || "Soft, warm lighting to enhance the chosen color palette",
          clothing_recommendations: recommendations.clothing_recommendations.slice(0, 6),
          makeup_hair_tips: recommendations.makeup_hair_tips || `Hair and makeup should complement the ${style_preference.replace('_', ' ')} aesthetic with attention to ${cultural_background} cultural elements`,
          shoot_specific_concepts: Object.keys(shootSpecificTips).map(key => ({
            concept: key.replace('_', ' '),
            description: shootSpecificTips[key].description,
            must_haves: shootSpecificTips[key].must_haves || [],
            color_scheme: shootSpecificTips[key].color_scheme || []
          })),
          expert_tips: [
            `This ${style_preference.replace('_', ' ')} approach works exceptionally well for ${shoot_type} sessions`,
            `Incorporate ${cultural_background} cultural elements authentically without overwhelming the composition`,
            `The ${color_preference.replace('_', ' ')} palette will create the perfect emotional atmosphere`,
            "Consider the client's comfort level with traditional vs. modern styling elements"
          ]
        };
      }

      case "analyze_style_personality": {
        const { style_keywords = [], inspiration_references = "", lifestyle = "balanced" } = args;
        
        const { MOODBOARD_CONCEPTS } = await import("./moodboardKnowledge.js");
        
        // Analyze keywords to determine style personality
        let recommendedPersonality = "classic_elegance"; // Default
        let confidenceScore = 0.5;
        
        const personalityScores = {};
        
        // Score each personality based on keywords
        Object.keys(MOODBOARD_CONCEPTS.style_personalities).forEach(personality => {
          const personalityData = MOODBOARD_CONCEPTS.style_personalities[personality];
          let score = 0;
          
          style_keywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            
            // Check against characteristics
            personalityData.characteristics.forEach(char => {
              if (char.toLowerCase().includes(lowerKeyword)) score += 2;
            });
            
            // Check against suitable_for
            personalityData.suitable_for.forEach(suitable => {
              if (suitable.toLowerCase().includes(lowerKeyword)) score += 1.5;
            });
            
            // Check against description
            if (personalityData.description.toLowerCase().includes(lowerKeyword)) {
              score += 1;
            }
          });
          
          personalityScores[personality] = score;
        });
        
        // Find the personality with the highest score
        const sortedPersonalities = Object.entries(personalityScores)
          .sort(([,a], [,b]) => b - a);
        
        if (sortedPersonalities[0][1] > 0) {
          recommendedPersonality = sortedPersonalities[0][0];
          confidenceScore = Math.min(sortedPersonalities[0][1] / (style_keywords.length * 2), 1);
        }
        
        const personalityData = MOODBOARD_CONCEPTS.style_personalities[recommendedPersonality];
        
        return {
          action: "ANALYZE_STYLE_PERSONALITY",
          status: "success",
          recommended_personality: recommendedPersonality,
          personality_name: recommendedPersonality.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          confidence_score: Math.round(confidenceScore * 100),
          description: personalityData.description,
          key_characteristics: personalityData.characteristics,
          best_suited_for: personalityData.suitable_for,
          elements_to_avoid: personalityData.avoid,
          secondary_personalities: sortedPersonalities.slice(1, 3).map(([name, score]) => ({
            name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            score: Math.round((score / (style_keywords.length * 2)) * 100),
            description: MOODBOARD_CONCEPTS.style_personalities[name].description
          })),
          styling_recommendations: [
            `Embrace ${personalityData.characteristics.join(', ').toLowerCase()} in your outfit choices`,
            `Focus on ${personalityData.suitable_for[0]?.toLowerCase()} styling elements`,
            `Avoid ${personalityData.avoid.join(', ').toLowerCase()} to maintain authenticity`
          ],
          mood_board_suggestions: Object.keys(MOODBOARD_CONCEPTS.aesthetics)
            .filter(aesthetic => {
              const aestheticData = MOODBOARD_CONCEPTS.aesthetics[aesthetic];
              return style_keywords.some(keyword => 
                aestheticData.keywords.some(ak => ak.toLowerCase().includes(keyword.toLowerCase()))
              );
            })
            .map(aesthetic => aesthetic.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))
        };
      }

      case "suggest_color_combinations": {
        const { 
          skin_undertone = "neutral", 
          outfit_colors = [], 
          shoot_environment = "studio",
          mood_goal = "elegant"
        } = args;
        
        const { MOODBOARD_CONCEPTS } = await import("./moodboardKnowledge.js");
        
        // Base color recommendations by undertone
        const undertoneColors = {
          warm: {
            primary: ["Gold", "Warm Red", "Peach", "Coral", "Warm Yellow", "Orange"],
            accent: ["Deep Forest Green", "Warm Brown", "Cream", "Ivory"],
            avoid: ["Cool Blue", "Silver", "Icy Pink", "Pure White"]
          },
          cool: {
            primary: ["Cool Blue", "Emerald", "Purple", "Cool Pink", "Silver", "Navy"],
            accent: ["Cool Gray", "Platinum", "Icy Blue", "Lavender"],
            avoid: ["Orange", "Warm Yellow", "Gold", "Warm Red"]
          },
          neutral: {
            primary: ["Soft Gold", "Dusty Rose", "Sage Green", "Warm Gray", "Taupe"],
            accent: ["Cream", "Soft Blue", "Muted Purple", "Champagne"],
            avoid: ["Very bright or neon colors", "Extremely warm or cool tones"]
          },
          olive: {
            primary: ["Earth Green", "Warm Brown", "Deep Gold", "Rich Purple", "Burgundy"],
            accent: ["Cream", "Soft Yellow", "Dusty Pink", "Warm Gray"],
            avoid: ["Bright Orange", "Hot Pink", "Cool Blue", "Silver"]
          }
        };

        // Environment-specific adjustments
        const environmentAdjustments = {
          studio: "Choose colors that won't clash with studio lighting - avoid highly reflective or neon colors",
          outdoor_natural: "Earth tones and natural colors work best in outdoor settings",
          indoor_traditional: "Rich, deep colors complement traditional indoor environments",
          urban: "Bold, modern colors can work well in urban environments",
          heritage_location: "Classical and culturally appropriate colors enhance heritage locations"
        };

        const recommendedColors = undertoneColors[skin_undertone];
        
        // Analyze outfit colors for harmony
        const colorHarmony = outfit_colors.length > 0 
          ? analyzeColorHarmony(outfit_colors, recommendedColors.primary)
          : "No outfit colors provided - recommendations based on skin undertone only";

        return {
          action: "SUGGEST_COLOR_COMBINATIONS", 
          status: "success",
          skin_undertone,
          primary_colors: recommendedColors.primary,
          accent_colors: recommendedColors.accent,
          colors_to_avoid: recommendedColors.avoid,
          environment_note: environmentAdjustments[shoot_environment],
          outfit_harmony: colorHarmony,
          mood_specific_palette: getMoodSpecificPalette(mood_goal, skin_undertone),
          expert_combinations: [
            {
              name: "Classic Elegance",
              colors: undertoneColors[skin_undertone].primary.slice(0, 2).concat(["Cream", "Deep Navy"]),
              best_for: "Formal portraits, corporate shoots, wedding photography"
            },
            {
              name: "Cultural Traditional",  
              colors: ["Rich Gold", "Deep Red", "Cream", "Forest Green"],
              best_for: "Traditional ceremonies, cultural events, heritage shoots"
            },
            {
              name: "Modern Sophisticated",
              colors: recommendedColors.primary.slice(1, 3).concat(["Charcoal", "Soft White"]),
              best_for: "Contemporary portraits, fashion shoots, editorial work"
            }
          ],
          technical_notes: [
            `${skin_undertone} undertones work best with the recommended primary colors`,
            `Avoid ${recommendedColors.avoid.join(', ')} as they may wash out or clash`,
            `Consider the ${shoot_environment} environment when making final color choices`,
            `The mood goal of '${mood_goal}' suggests focusing on colors that evoke this emotion`
          ]
        };
      }

      case "recommend_styling_elements": {
        const { 
          primary_concept, 
          gender, 
          age_group = "adult", 
          budget_range = "mid_range",
          special_requirements = ""
        } = args;
        
        const { MOODBOARD_CONCEPTS } = await import("./moodboardKnowledge.js");
        
        // Get concept-specific styling
        let conceptStyling = {};
        if (MOODBOARD_CONCEPTS.aesthetics[primary_concept]) {
          conceptStyling = MOODBOARD_CONCEPTS.aesthetics[primary_concept];
        }

        // Gender-specific recommendations
        const genderStyling = generateGenderSpecificStyling(gender, primary_concept, age_group);
        
        // Budget-appropriate options
        const budgetOptions = generateBudgetOptions(budget_range, primary_concept);
        
        // Age-appropriate modifications
        const ageModifications = generateAgeAppropriate(age_group, primary_concept, gender);

        return {
          action: "RECOMMEND_STYLING_ELEMENTS",
          status: "success",
          concept: primary_concept.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          target_demographic: `${gender} ${age_group}`,
          clothing_recommendations: genderStyling.clothing,
          accessory_suggestions: genderStyling.accessories,
          makeup_hair_guide: genderStyling.makeup_hair,
          pose_suggestions: genderStyling.poses,
          prop_recommendations: conceptStyling.styling_elements?.slice(3, 6) || ["Minimal props to maintain focus", "Cultural artifacts if appropriate", "Natural elements"],
          budget_alternatives: budgetOptions,
          age_considerations: ageModifications,
          special_accommodations: special_requirements ? 
            generateSpecialAccommodations(special_requirements, primary_concept) : 
            "No special requirements specified",
          technical_styling_tips: [
            "Ensure all clothing is properly fitted and pressed before the shoot",
            "Avoid small patterns that may cause moiré effects on camera",
            "Choose makeup that photographs well under studio lighting",
            "Consider the color temperature of the lighting when selecting colors",
            "Bring backup styling options in case adjustments are needed"
          ],
          cultural_authenticity_notes: primary_concept.includes('traditional') || primary_concept.includes('heritage') ?
            [
              "Ensure cultural elements are worn and styled correctly",
              "Research traditional styling methods for authenticity", 
              "Consult with cultural experts if unsure about specific elements",
              "Respect cultural significance while creating beautiful imagery"
            ] : 
            ["Focus on contemporary styling that feels natural and comfortable"],
          final_checklist: [
            "All styling elements complement the chosen color palette",
            "Outfit choices reflect the client's personality and comfort level",
            "Accessories enhance rather than overwhelm the overall look",
            "Hair and makeup are cohesive with the overall concept",
            "Special requirements and cultural considerations are addressed"
          ]
        };
      }

      default:
        return { error: `Tool ${name} not found` };
    }
  } catch (err) {
    console.error(`Error running tool ${name}:`, err);
    return { error: err.message };
  }
}
