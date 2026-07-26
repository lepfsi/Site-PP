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
    if (provider === "gemini") {
      return "Check GEMINI_API_KEY on Vercel (Google AI Studio → Get API key).";
    }
    if (provider === "unikey") {
      return "Check UNIKEY_API_KEY on Vercel (Bearer key from https://www.getunikey.ai/).";
    }
    if (provider === "kimi") {
      return "Check LOGFARE_API_KEY / KIMI_API_KEY.";
    }
    if (provider === "xai") {
      return "Check XAI_API_KEY on Vercel.";
    }
    return "Check OPENAI_API_KEY on Vercel.";
  }
  if (issue === "no_credits") {
    if (provider === "gemini") {
      return "Check Gemini API quotas / billing in Google AI Studio.";
    }
    return provider === "unikey"
      ? "Top up AI Credits on https://www.getunikey.ai/"
      : "Provider has no credits — check billing.";
  }
  if (issue === "quota_exceeded") {
    return "Provider quota exceeded — check billing or switch model.";
  }
  if (issue === "invalid_model") {
    if (provider === "gemini") {
      return "Set CHAT_MODEL or GEMINI_MODEL (e.g. gemini-2.5-flash). See https://ai.google.dev/gemini-api/docs/models";
    }
    return "Set CHAT_MODEL to a model your provider supports (e.g. gpt-5.6-sol for UniKey).";
  }
  return undefined;
}

function classifyEmpty(error?: string): string | undefined {
  if (!error) return undefined;
  if (error.includes("max_tokens_too_low")) return "max_tokens_too_low";
  if (error.startsWith("empty_completion")) return "empty_completion";
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
    const issue = live.ok
      ? undefined
      : classifyLLMError(live.error) ?? classifyEmpty(live.error) ?? "unknown";
    return NextResponse.json({
      ...base,
      live: { ...live, issue },
      hint: hintFor(config.provider, issue),
    });
  }

  return NextResponse.json(base);
}
