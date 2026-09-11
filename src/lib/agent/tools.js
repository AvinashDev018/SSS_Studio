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
      description: "Generate a formatted 1-click WhatsApp booking quote for the studio owner (+91 98659 92379) with client package details.",
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
  }
];

// 2. Deterministic Tool Executions

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
        const mapFrame = (f) => ({
          id: f.id,
          size: `${f.width}x${f.height}`,
          width: f.width,
          height: f.height,
          numericPrice: f.numericPrice,
          priceFormatted: f.price,
          bestFor: f.bestFor,
          tag: f.tag,
          popular: f.popular,
        });

        return {
          action: "RECOMMEND_FRAMES",
          status: "success",
          count: frames.length,
          recommendedFrames: recommended.map(mapFrame),
          allFrames: scored.map(mapFrame),
          finishesAvailable: ["Sparkle Lamination (Glitter/Luxury)", "Matte Finish (Anti-Glare)", "High Gloss"],
          howToOrder:
            "Open /store or Home #frames → choose size → Order → upload photo → cart → Cash pickup or UPI delivery. Track on /track.",
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
            features: typeof p.features === "string"
              ? p.features.split(",").map((f) => f.trim()).filter(Boolean)
              : p.features,
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
            stageDesc = "Ready at Studio: 7th Street, Prasanna Colony, Avaniyapuram.";
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
          message: `No active order found for '${rawQuery}'. You can search on our track page or contact studio WhatsApp directly (+91 98659 92379).`,
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

        const whatsappUrl = `https://wa.me/919865992379?text=${text}`;

        return {
          action: "WHATSAPP_DEAL",
          whatsappUrl,
          summary,
          estimatedTotal: total,
          phone: "+91 98659 92379",
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

      default:
        return { error: `Tool ${name} not found` };
    }
  } catch (err) {
    console.error(`Error running tool ${name}:`, err);
    return { error: err.message };
  }
}
