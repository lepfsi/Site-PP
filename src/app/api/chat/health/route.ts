import { NextResponse } from "next/server";
import { getLLMConfig, getLastLLMError, pingLLM } from "@/lib/chat-llm";

function classifyLLMError(error?: string): string | undefined {
  if (!error) return undefined;
  const lower = error.toLowerCase();
  if (lower.includes("permission-denied") || lower.includes("credits") || lower.includes("licenses")) {
    return "no_credits";
  }
  if (lower.includes("401") || lower.includes("invalid_api_key") || lower.includes("incorrect api key")) {
    return "invalid_api_key";
  }
  if (lower.includes("429") || lower.includes("quota") || lower.includes("rate limit")) {
    return "quota_exceeded";
  }
  if (lower.includes("404") && lower.includes("model")) return "invalid_model";
  return "unknown";
}

export async function GET(request: Request) {
  const config = getLLMConfig();
  const tavily = Boolean(process.env.TAVILY_API_KEY?.trim());
  const ping = new URL(request.url).searchParams.get("ping") === "1";

  const base = {
    llm: config
      ? {
          configured: true,
          model: config.model,
          baseUrl: config.baseUrl,
          provider: config.baseUrl.includes("api.x.ai") ? "xai" : "openai",
        }
      : { configured: false },
    tavily,
    lastError: getLastLLMError() ?? null,
  };

  if (ping && config) {
    const live = await pingLLM();
    const issue = live.ok ? undefined : classifyLLMError(live.error);
    return NextResponse.json({
      ...base,
      live: { ...live, issue },
      hint:
        issue === "no_credits"
          ? "xAI team has no credits — purchase at https://console.x.ai/"
          : issue === "invalid_api_key"
            ? "Check XAI_API_KEY on Vercel (no spaces, correct team key)."
            : issue === "quota_exceeded"
              ? "Provider quota exceeded — check billing or switch model."
              : undefined,
    });
  }

  return NextResponse.json(base);
}