import { NextResponse } from "next/server";
import { getLLMConfig } from "@/lib/chat-llm";

export async function GET() {
  const config = getLLMConfig();
  const tavily = Boolean(process.env.TAVILY_API_KEY?.trim());

  return NextResponse.json({
    llm: config
      ? { configured: true, model: config.model, baseUrl: config.baseUrl }
      : { configured: false },
    tavily,
  });
}