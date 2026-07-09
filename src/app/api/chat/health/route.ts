import { NextResponse } from "next/server";
import { getLLMConfig, getLastLLMError, pingLLM } from "@/lib/chat-llm";

export async function GET(request: Request) {
  const config = getLLMConfig();
  const tavily = Boolean(process.env.TAVILY_API_KEY?.trim());
  const ping = new URL(request.url).searchParams.get("ping") === "1";

  const base = {
    llm: config
      ? { configured: true, model: config.model, baseUrl: config.baseUrl }
      : { configured: false },
    tavily,
    lastError: getLastLLMError() ?? null,
  };

  if (ping && config) {
    const live = await pingLLM();
    return NextResponse.json({ ...base, live });
  }

  return NextResponse.json(base);
}