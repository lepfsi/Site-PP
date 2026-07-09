export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

let lastLLMError: string | undefined;

export function getLastLLMError(): string | undefined {
  return lastLLMError;
}

export function getLLMConfig(): LLMConfig | null {
  const apiKey = (process.env.OPENAI_API_KEY ?? process.env.XAI_API_KEY ?? "").trim();
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = (process.env.CHAT_MODEL ?? "gpt-4o-mini").trim();

  return { apiKey, baseUrl, model };
}

export interface LLMResult {
  text: string | null;
  error?: string;
  status?: number;
  model?: string;
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
        max_tokens: options?.maxTokens ?? 1200,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    const rawBody = await res.text();

    if (!res.ok) {
      const err = `${res.status}: ${rawBody.slice(0, 300)}`;
      lastLLMError = err;
      console.error("Chat LLM HTTP error:", err);
      return { text: null, error: err, status: res.status, model };
    }

    let data: { choices?: { message?: { content?: string } }[] };
    try {
      data = JSON.parse(rawBody);
    } catch {
      lastLLMError = "invalid_json_response";
      return { text: null, error: "invalid_json_response", model };
    }

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      lastLLMError = "empty_completion";
      return { text: null, error: "empty_completion", model };
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

export async function callChatCompletions(
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
  options?: { maxTokens?: number; temperature?: number; timeoutMs?: number },
): Promise<LLMResult> {
  const config = getLLMConfig();
  if (!config) {
    return { text: null, error: "missing_api_key" };
  }

  const fallbacks = [...new Set([config.model, "gpt-4o-mini", "gpt-4o"])];

  for (const model of fallbacks) {
    const result = await requestCompletion(config, model, system, messages, options);
    if (result.text) return result;
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
    { maxTokens: 10, temperature: 0, timeoutMs: 15_000 },
  );

  return result.text
    ? { ok: true, model: result.model }
    : { ok: false, model: result.model, error: result.error };
}