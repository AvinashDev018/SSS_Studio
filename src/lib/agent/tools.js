import fs from "fs";
import path from "path";
import { prisma } from "../prisma.js";

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
];

// 2. Deterministic Tool Executions

export async function executeAgentTool(name, args) {
  try {
    switch (name) {
      case "query_frames": {
        const framesFilePath = path.join(process.cwd(), "src", "data", "frames.json");
        let frames = [];
        if (fs.existsSync(framesFilePath)) {
          frames = JSON.parse(fs.readFileSync(framesFilePath, "utf-8"));
        }

        const maxBudget = args.max_budget || Infinity;
        const room = (args.room_type || "").toLowerCase();
        const wall = (args.wall_space || "").toLowerCase();
        const photo = (args.photo_type || "").toLowerCase();

        // Scoring frames based on room, wall space and budget
        const scored = frames
          .filter((f) => f.numericPrice <= maxBudget)
          .map((f) => {
            let score = 0;
            const bestFor = (f.bestFor || "").toLowerCase();
            const tag = (f.tag || "").toLowerCase();

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
        const query = (args.query || "").trim();
        let order = null;

        try {
          order = await prisma.order.findFirst({
            where: {
              OR: [
                { orderId: { equals: query, mode: "insensitive" } },
                { customerPhone: { contains: query } },
              ],
            },
            select: {
              orderId: true,
              customerName: true,
              status: true,
              totalAmount: true,
              createdAt: true,
              courierTrackingId: true,
            },
          });
        } catch (dbErr) {
          console.warn("DB lookup error, using fallback status:", dbErr.message);
        }

        if (order) {
          return {
            action: "TRACK_ORDER",
            found: true,
            orderId: order.orderId,
            customerName: order.customerName,
            status: order.status,
            totalAmount: `₹${order.totalAmount}`,
            courierTrackingId: order.courierTrackingId || "In Studio Processing / Lab Print",
            message: `Order ${order.orderId} is currently ${order.status}. Delivery ETA: Within 1-Month Guarantee.`,
          };
        }

        return {
          action: "TRACK_ORDER",
          found: false,
          query,
          message: `No active order found with ID or phone '${query}'. Please verify your phone or contact studio WhatsApp directly at +91 63835 65425.`,
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

      default:
        return { error: `Tool ${name} not found` };
    }
  } catch (err) {
    console.error(`Error running tool ${name}:`, err);
    return { error: err.message };
  }
}
