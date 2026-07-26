export type ChatProviderId = "gemini" | "unikey" | "openai" | "xai" | "kimi";

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

const GEMINI_DEFAULT_BASE = "https://generativelanguage.googleapis.com/v1beta/openai";
const GEMINI_DEFAULT_MODEL = "gemini-3.5-flash-lite";

/**
 * Resolve chat LLM config from env.
 *
 * Providers (OpenAI-compatible POST /chat/completions):
 * - gemini  → GEMINI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY (priority)
 * - unikey  → UNIKEY_API_KEY
 * - openai  → OPENAI_API_KEY
 * - xai     → XAI_API_KEY
 * - kimi    → LOGFARE_API_KEY / KIMI_API_KEY (legacy; not auto-selected)
 *
 * Force: CHAT_PROVIDER=gemini|unikey|openai|xai|kimi
 * Overrides: CHAT_MODEL, GEMINI_BASE_URL, GEMINI_MODEL, UNIKEY_BASE_URL, OPENAI_BASE_URL
 */
export function getLLMConfig(): LLMConfig | null {
  const geminiKey = (
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GOOGLE_API_KEY ??
    ""
  ).trim();
  const unikeyKey = (process.env.UNIKEY_API_KEY ?? process.env.GETUNIKEY_API_KEY ?? "").trim();
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

  if (providerRaw === "gemini" || providerRaw === "google") {
    provider = geminiKey ? "gemini" : null;
  } else if (providerRaw === "unikey" || providerRaw === "getunikey") {
    provider = unikeyKey ? "unikey" : null;
  } else if (providerRaw === "kimi" || providerRaw === "logfare" || providerRaw === "logafare") {
    provider = kimiKey ? "kimi" : null;
  } else if (providerRaw === "xai") {
    provider = xaiKey ? "xai" : null;
  } else if (providerRaw === "openai") {
    provider = openaiKey ? "openai" : null;
  } else {
    // Auto: Gemini first, then UniKey, OpenAI, xAI. Logfare/Kimi never auto.
    if (geminiKey) provider = "gemini";
    else if (unikeyKey) provider = "unikey";
    else if (openaiKey) provider = "openai";
    else if (xaiKey) provider = "xai";
  }

  if (!provider) return null;

  if (provider === "gemini") {
    const baseFromEnv = (process.env.GEMINI_BASE_URL ?? "").trim().replace(/\/$/, "");
    return {
      provider: "gemini",
      apiKey: geminiKey,
      baseUrl: baseFromEnv || GEMINI_DEFAULT_BASE,
      model: (process.env.CHAT_MODEL ?? process.env.GEMINI_MODEL ?? GEMINI_DEFAULT_MODEL).trim(),
    };
  }

  if (provider === "unikey") {
    const baseFromEnv = (
      process.env.UNIKEY_BASE_URL ??
      process.env.GETUNIKEY_BASE_URL ??
      process.env.OPENAI_BASE_URL ??
      ""
    )
      .trim()
      .replace(/\/$/, "");

    return {
      provider: "unikey",
      apiKey: unikeyKey,
      baseUrl: baseFromEnv || "https://www.getunikey.ai/v1",
      model: (process.env.CHAT_MODEL ?? process.env.UNIKEY_MODEL ?? "gpt-5.6-sol").trim(),
    };
  }

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
      model: (process.env.CHAT_MODEL ?? "kimi-k2.5").trim(),
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

/**
 * Extract visible assistant text only.
 * Do NOT fall back to reasoning_content — free/broken gateways often dump garbage there.
 */
function extractMessageText(message: unknown): string {
  if (!message || typeof message !== "object") return "";

  const msg = message as Record<string, unknown>;

  const direct = msg.content;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

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

  for (const key of ["output_text", "text"]) {
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

  const requested = options?.maxTokens ?? 1200;
  // Reasoning-style gateways may burn tokens; keep a floor for kimi only
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
  if (config.provider === "gemini") {
    return [
      ...new Set([
        config.model,
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.5-pro",
      ]),
    ];
  }
  if (config.provider === "unikey") {
    // Paid UniKey: one model only — cascading alternatives multiplies latency on failure
    return [config.model];
  }
  if (config.provider === "kimi") {
    return [...new Set([config.model, "kimi-k2.5", "kimi-k2.6", "kimi-k2"])];
  }
  if (config.provider === "xai") {
    return [...new Set([config.model, "grok-3-mini", "grok-4-1-fast-non-reasoning", "grok-4.5"])];
  }
  return [...new Set([config.model, "gpt-4o-mini", "gpt-4o"])];
}

/** List configured providers in preference order (primary first). */
export function listAvailableLLMConfigs(): LLMConfig[] {
  const primary = getLLMConfig();
  const configs: LLMConfig[] = [];
  if (primary) configs.push(primary);

  const geminiKey = (
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GOOGLE_API_KEY ??
    ""
  ).trim();
  const unikeyKey = (process.env.UNIKEY_API_KEY ?? process.env.GETUNIKEY_API_KEY ?? "").trim();
  const openaiKey = (process.env.OPENAI_API_KEY ?? "").trim();
  const xaiKey = (process.env.XAI_API_KEY ?? "").trim();

  if (geminiKey && primary?.provider !== "gemini") {
    const base = (process.env.GEMINI_BASE_URL ?? "").trim().replace(/\/$/, "");
    configs.push({
      provider: "gemini",
      apiKey: geminiKey,
      baseUrl: base || GEMINI_DEFAULT_BASE,
      // Do not reuse CHAT_MODEL if primary is another provider (e.g. UniKey model id)
      model: (process.env.GEMINI_MODEL ?? GEMINI_DEFAULT_MODEL).trim(),
    });
  }

  if (unikeyKey && primary?.provider !== "unikey") {
    const base = (process.env.UNIKEY_BASE_URL ?? "").trim().replace(/\/$/, "");
    configs.push({
      provider: "unikey",
      apiKey: unikeyKey,
      baseUrl: base || "https://www.getunikey.ai/v1",
      model: (process.env.UNIKEY_MODEL ?? "gpt-5.6-sol").trim(),
    });
  }

  if (openaiKey && primary?.provider !== "openai") {
    const envBase = (process.env.OPENAI_FALLBACK_BASE_URL ?? "").trim().replace(/\/$/, "");
    configs.push({
      provider: "openai",
      apiKey: openaiKey,
      baseUrl: envBase || "https://api.openai.com/v1",
      model: (process.env.CHAT_FALLBACK_MODEL ?? process.env.OPENAI_FALLBACK_MODEL ?? "gpt-4o-mini").trim(),
    });
  }

  if (xaiKey && primary?.provider !== "xai") {
    configs.push({
      provider: "xai",
      apiKey: xaiKey,
      baseUrl: "https://api.x.ai/v1",
      model: (process.env.XAI_FALLBACK_MODEL ?? "grok-3-mini").trim(),
    });
  }

  return configs;
}

export async function callChatCompletions(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  options?: {
    maxTokens?: number;
    temperature?: number;
    timeoutMs?: number;
    config?: LLMConfig;
  },
): Promise<LLMResult & { provider?: ChatProviderId }> {
  const configs = options?.config ? [options.config] : listAvailableLLMConfigs();
  if (!configs.length) {
    return { text: null, error: "missing_api_key" };
  }

  for (const config of configs) {
    for (const model of modelFallbacks(config)) {
      const result = await requestCompletion(config, model, system, messages, options);
      if (result.text) return { ...result, provider: config.provider };
    }
  }

  return { text: null, error: lastLLMError ?? "all_models_failed" };
}

export async function pingLLM(): Promise<{ ok: boolean; model?: string; error?: string }> {
  const config = getLLMConfig();
  if (!config) return { ok: false, error: "missing_api_key" };

  const result = await requestCompletion(
    config,
    config.model,
    "Reply with exactly: OK",
    [{ role: "user", content: "ping" }],
    {
      maxTokens: 32,
      temperature: 0,
      timeoutMs: 30_000,
    },
  );

  return result.text
    ? { ok: true, model: result.model }
    : { ok: false, model: result.model, error: result.error };
}
