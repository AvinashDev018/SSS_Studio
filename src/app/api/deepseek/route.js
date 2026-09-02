import { NextResponse } from "next/server";
import { runStudioAgent } from "@/lib/agent/agentRunner";

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

    const result = await runStudioAgent({ messages });

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
