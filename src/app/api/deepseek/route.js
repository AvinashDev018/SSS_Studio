import { NextResponse } from "next/server";
import { runStudioAgent } from "@/lib/agent/agentRunner";
import {
  normalizeUserQuery,
  isDynamicOrTrackingQuery,
  getCachedResponse,
  saveToCacheAndLog,
} from "@/lib/agent/chatCache";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    let messages = body.messages || [];

    if (messages.length === 0 && body.prompt) {
      messages = [{ role: "user", content: body.prompt }];
    }

    if (messages.length === 0) {
      return NextResponse.json({ error: "No prompt or messages provided" }, { status: 400 });
    }

    const lastUserMsg = messages[messages.length - 1]?.content || "";
    const normalizedKey = normalizeUserQuery(lastUserMsg);

    // 1. Check if input is a dynamic / tracking / phone number query
    const isDynamic = isDynamicOrTrackingQuery(lastUserMsg);

    // 2. If NOT dynamic, attempt to fetch cached answer from PostgreSQL DB (<50ms fast path)
    if (!isDynamic && normalizedKey) {
      const cachedResult = await getCachedResponse(normalizedKey);
      if (cachedResult) {
        return NextResponse.json(cachedResult);
      }
    }

    // 3. Cache miss or dynamic query: Run AI Agent
    const result = await runStudioAgent({ messages });

    // 4. Save response to cache asynchronously if non-dynamic
    if (!isDynamic && normalizedKey && result && !result.error) {
      saveToCacheAndLog({
        userPrompt: lastUserMsg,
        normalizedKey,
        result,
      }).catch((err) => console.warn("Async cache save error:", err));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent Route Error:", error);
    return NextResponse.json(
      {
        reply: "Vanakkam! SSS Studio is ready to assist. You can reach our lead photographer directly on WhatsApp at +91 63835 65425.",
        actionCards: [],
        error: error.message,
      },
      { status: 200 }
    );
  }
}
