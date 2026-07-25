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

function hintFor(provider: string | undefined, issue: string | undefined): string | undefined {
  if (!issue) return undefined;
  if (issue === "invalid_api_key") {
    if (provider === "kimi") {
      return "Check LOGFARE_API_KEY (or KIMI_API_KEY) on Vercel — Bearer token only, no quotes.";
    }
    if (provider === "xai") {
      return "Check XAI_API_KEY on Vercel (no spaces, correct team key).";
    }
    return "Check OPENAI_API_KEY on Vercel.";
  }
  if (issue === "no_credits") {
    return provider === "kimi"
      ? "Logfare/Kimi account may need credits — check your Logfare dashboard."
      : "Provider has no credits — check billing.";
  }
  if (issue === "quota_exceeded") {
    return "Provider quota exceeded — check billing or switch model.";
  }
  if (issue === "invalid_model") {
    return "Set CHAT_MODEL to a model your key can use (e.g. kimi-k2.6).";
  }
  return undefined;
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
          provider: config.provider,
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
      hint: hintFor(config.provider, issue),
    });
  }

  return NextResponse.json(base);
}
