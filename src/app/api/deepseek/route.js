import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body.prompt || "Write a limerick about the wonders of GPU computing.";
    const systemPrompt = body.systemPrompt || "You are an intelligent studio assistant for SSS Photography Studio in Madurai.";

    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro-0813",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      top_p: 0.95,
      max_tokens: 2048,
      seed: 42,
    });

    const reply = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to query DeepSeek" }, { status: 500 });
  }
}
