import { prisma } from "@/lib/prisma";

/**
 * Normalizes user prompt by lowercasing, removing punctuation, and collapsing whitespace.
 */
export function normalizeUserQuery(userMsg = "") {
  return userMsg
    .toLowerCase()
    .replace(/[^\w\s\u0B80-\u0BFF]/g, "") // Keep English, Numbers, and Tamil characters
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if the prompt is dynamic (order IDs, phone numbers, tracking, specific date availability).
 * Dynamic queries MUST bypass cache to fetch live data.
 */
export function isDynamicOrTrackingQuery(userMsg = "") {
  const text = (userMsg || "").trim();
  const lower = text.toLowerCase();
  const cleanDigits = text.replace(/[\s\-\+\(\)]/g, "");

  // Phone numbers, Order IDs, or explicit tracking/availability terms
  const isPhoneOrOrder = /^\d{5,15}$/.test(cleanDigits) || /^(sss|shoot|ord)-?\d{3,10}$/i.test(text);
  const isDynamicTerm = /track|status|order|available|date|otps|coupon|cart/i.test(lower);

  return isPhoneOrOrder || isDynamicTerm;
}

/**
 * Derives query category for cache invalidation tagging
 */
export function getCategoryFromPrompt(userMsg = "") {
  const lower = (userMsg || "").toLowerCase();
  if (lower.includes("frame") || lower.includes("size") || lower.includes("wall")) return "FRAMES";
  if (lower.includes("price") || lower.includes("cost") || lower.includes("package") || lower.includes("rate") || lower.includes("quote")) return "PRICE";
  if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("contact")) return "LOCATION";
  return "GENERAL";
}

/**
 * Attempts to retrieve a cached response from PostgreSQL via Prisma
 */
export async function getCachedResponse(normalizedKey) {
  if (!normalizedKey || normalizedKey.length < 3) return null;

  try {
    // Check if Prisma Client has ChatCache delegate generated
    if (!prisma?.chatCache) {
      console.warn("ChatCache delegate not available on Prisma Client.");
      return null;
    }

    const entry = await prisma.chatCache.findUnique({
      where: { normalizedQuery: normalizedKey },
    });

    if (entry) {
      // Asynchronously increment hit counter without blocking execution
      prisma.chatCache
        .update({
          where: { id: entry.id },
          data: { hitCount: { increment: 1 } },
        })
        .catch(() => {});

      return {
        reply: entry.botReply?.reply || entry.botReply?.text || "",
        actionCards: entry.botReply?.actionCards || [],
        cached: true,
      };
    }
  } catch (err) {
    // Table missing or DB unavailable — fall through cleanly to live AI model
    return null;
  }

  return null;
}

/**
 * Asynchronously saves a new AI response to PostgreSQL cache & logs the interaction
 */
export async function saveToCacheAndLog({ userPrompt, normalizedKey, result, language = "en" }) {
  if (!normalizedKey || normalizedKey.length < 3 || !result || !result.reply) return;

  try {
    // Check if Prisma Client has ChatCache delegate generated
    if (!prisma?.chatCache) {
      return;
    }

    const category = getCategoryFromPrompt(userPrompt);

    // Save or update ChatCache
    await prisma.chatCache.upsert({
      where: { normalizedQuery: normalizedKey },
      update: {
        botReply: {
          reply: result.reply,
          actionCards: result.actionCards || [],
        },
        category,
      },
      create: {
        normalizedQuery: normalizedKey,
        category,
        botReply: {
          reply: result.reply,
          actionCards: result.actionCards || [],
        },
      },
    });

    // Log conversation audit entry
    if (prisma?.chatLog) {
      await prisma.chatLog.create({
        data: {
          userPrompt,
          botReply: result.reply,
          language,
          wasCached: false,
        },
      });
    }
  } catch (err) {
    // Silently ignore if table is not created yet
    return;
  }
}
