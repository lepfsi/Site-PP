export type ChatProviderId = "openai" | "xai" | "kimi";

export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  provider: ChatProviderId;
}

let lastLLMError: string | undefined;

export function getLastLLMError(): string | undefined {
  return lastLLMError;
}

/**
 * Resolve chat LLM config from env.
 *
 * Supported providers (OpenAI-compatible /chat/completions):
 * - kimi / logfare → LOGFARE_API_KEY or KIMI_API_KEY, default https://logfare.ai/v1, model kimi-k2.6
 * - xai → XAI_API_KEY, default https://api.x.ai/v1
 * - openai → OPENAI_API_KEY, default https://api.openai.com/v1
 *
 * Force with CHAT_PROVIDER=kimi|logfare|xai|openai
 * Overrides: CHAT_MODEL, OPENAI_BASE_URL (or LOGFARE_BASE_URL / KIMI_BASE_URL)
 */
export function getLLMConfig(): LLMConfig | null {
  const openaiKey = (process.env.OPENAI_API_KEY ?? "").trim();
  const xaiKey = (process.env.XAI_API_KEY ?? "").trim();
  const kimiKey = (
    process.env.LOGFARE_API_KEY ??
    process.env.KIMI_API_KEY ??
    process.env.LOGAFARE_API_KEY ??
    ""
  ).trim();

  const providerRaw = (process.env.CHAT_PROVIDER ?? "").toLowerCase().trim();

  let provider: ChatProviderId | null = null;

  if (providerRaw === "kimi" || providerRaw === "logfare" || providerRaw === "logafare") {
    provider = kimiKey ? "kimi" : null;
  } else if (providerRaw === "xai") {
    provider = xaiKey ? "xai" : null;
  } else if (providerRaw === "openai") {
    provider = openaiKey ? "openai" : null;
  } else {
    if (kimiKey) provider = "kimi";
    else if (openaiKey) provider = "openai";
    else if (xaiKey) provider = "xai";
  }

  if (!provider) return null;

  if (provider === "kimi") {
    const baseFromEnv = (
      process.env.LOGFARE_BASE_URL ??
      process.env.KIMI_BASE_URL ??
      process.env.OPENAI_BASE_URL ??
      ""
    )
      .trim()
      .replace(/\/$/, "");

    return {
      provider: "kimi",
      apiKey: kimiKey,
      baseUrl: baseFromEnv || "https://logfare.ai/v1",
      // Logfare docs default to kimi-k2.5; k2.6 also accepted when available
      model: (process.env.CHAT_MODEL ?? "kimi-k2.6").trim(),
    };
  }

  if (provider === "xai") {
    const envBase = (process.env.OPENAI_BASE_URL ?? "").trim().replace(/\/$/, "");
    return {
      provider: "xai",
      apiKey: xaiKey,
      baseUrl: envBase || "https://api.x.ai/v1",
      model: (process.env.CHAT_MODEL ?? "grok-3-mini").trim(),
    };
  }

  const envBase = (process.env.OPENAI_BASE_URL ?? "").trim().replace(/\/$/, "");
  return {
    provider: "openai",
    apiKey: openaiKey,
    baseUrl: envBase || "https://api.openai.com/v1",
    model: (process.env.CHAT_MODEL ?? "gpt-4o-mini").trim(),
  };
}

export interface LLMResult {
  text: string | null;
  error?: string;
  status?: number;
  model?: string;
}

/** Extract text from OpenAI-style or Kimi/reasoning variants. */
function extractMessageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";

  const msg = message as Record<string, unknown>;

  const direct = msg.content;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  // Multimodal / parts array: [{ type: "text", text: "..." }]
  if (Array.isArray(direct)) {
    const joined = direct
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") {
          const p = part as Record<string, unknown>;
          if (typeof p.text === "string") return p.text;
          if (typeof p.content === "string") return p.content;
        }
        return "";
      })
      .join("")
      .trim();
    if (joined) return joined;
  }

  // Reasoning models sometimes put the visible answer here after internal thought
  for (const key of ["reasoning_content", "reasoning", "output_text", "text"]) {
    const value = msg[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function extractCompletionText(data: unknown): {
  text: string;
  finishReason?: string;
  emptyDetail?: string;
} {
  if (!data || typeof data !== "object") {
    return { text: "", emptyDetail: "not_an_object" };
  }

  const root = data as Record<string, unknown>;
  const choices = root.choices;

  if (!Array.isArray(choices) || choices.length === 0) {
    return { text: "", emptyDetail: "no_choices" };
  }

  const choice = choices[0] as Record<string, unknown>;
  const finishReason =
    typeof choice.finish_reason === "string" ? choice.finish_reason : undefined;

  const fromMessage = extractMessageText(choice.message);
  if (fromMessage) return { text: fromMessage, finishReason };

  // Some gateways put text on the choice itself
  if (typeof choice.text === "string" && choice.text.trim()) {
    return { text: choice.text.trim(), finishReason };
  }

  const delta = extractMessageText(choice.delta);
  if (delta) return { text: delta, finishReason };

  return {
    text: "",
    finishReason,
    emptyDetail: finishReason ? `finish_reason=${finishReason}` : "empty_message_content",
  };
}

async function requestCompletion(
  config: LLMConfig,
  model: string,
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  options?: { maxTokens?: number; temperature?: number; timeoutMs?: number },
): Promise<LLMResult> {
  const timeoutMs = options?.timeoutMs ?? 55_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Kimi/Logfare reasoning models burn tokens on thought; never use tiny max_tokens
  const requested = options?.maxTokens ?? 1200;
  const maxTokens =
    config.provider === "kimi" ? Math.max(requested, 256) : requested;

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: options?.temperature ?? 0.7,
        max_tokens: maxTokens,
        messages: system
          ? [{ role: "system", content: system }, ...messages]
          : messages,
      }),
    });

    const rawBody = await res.text();

    if (!res.ok) {
      const err = `${res.status}: ${rawBody.slice(0, 300)}`;
      lastLLMError = err;
      console.error("Chat LLM HTTP error:", err);
      return { text: null, error: err, status: res.status, model };
    }

    let data: unknown;
    try {
      data = JSON.parse(rawBody);
    } catch {
      lastLLMError = "invalid_json_response";
      return { text: null, error: "invalid_json_response", model };
    }

    const { text, emptyDetail, finishReason } = extractCompletionText(data);
    if (!text) {
      const detail = emptyDetail ?? "empty_completion";
      const err =
        finishReason === "length"
          ? `empty_completion:max_tokens_too_low(${maxTokens})`
          : `empty_completion:${detail}`;
      lastLLMError = err;
      console.error("Chat LLM empty completion:", err, "body:", rawBody.slice(0, 400));
      return { text: null, error: err, model };
    }

    lastLLMError = undefined;
    return { text, model };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    lastLLMError = msg;
    console.error("Chat LLM fetch error:", msg);
    return { text: null, error: msg, model };
  } finally {
    clearTimeout(timer);
  }
}

function modelFallbacks(config: LLMConfig): string[] {
  if (config.provider === "kimi") {
    // Logfare documents kimi-k2.5; keep k2.6 first when configured
    return [...new Set([config.model, "kimi-k2.6", "kimi-k2.5", "kimi-k2"])];
  }
  if (config.provider === "xai") {
    return [...new Set([config.model, "grok-3-mini", "grok-4-1-fast-non-reasoning", "grok-4.5"])];
  }
  return [...new Set([config.model, "gpt-4o-mini", "gpt-4o"])];
}

export async function callChatCompletions(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  options?: { maxTokens?: number; temperature?: number; timeoutMs?: number },
): Promise<LLMResult> {
  const config = getLLMConfig();
  if (!config) {
    return { text: null, error: "missing_api_key" };
  }

  for (const model of modelFallbacks(config)) {
    const result = await requestCompletion(config, model, system, messages, options);
    if (result.text) return result;
  }

  return { text: null, error: lastLLMError ?? "all_models_failed" };
}

export async function pingLLM(): Promise<{ ok: boolean; model?: string; error?: string }> {
  const config = getLLMConfig();
  if (!config) return { ok: false, error: "missing_api_key" };

  // Kimi needs enough tokens for a short answer (reasoning overhead)
  const result = await requestCompletion(
    config,
    config.model,
    config.provider === "kimi" ? "" : "Reply with exactly: OK",
    [
      {
        role: "user",
        content:
          config.provider === "kimi"
            ? "Reply with exactly the two letters OK and nothing else."
            : "ping",
      },
    ],
    {
      maxTokens: config.provider === "kimi" ? 64 : 32,
      temperature: 0,
      timeoutMs: 30_000,
    },
  );

  return result.text
    ? { ok: true, model: result.model }
    : { ok: false, model: result.model, error: result.error };
}
