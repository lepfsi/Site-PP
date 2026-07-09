export interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
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

  const timeoutMs = options?.timeoutMs ?? 45_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 900,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    const rawBody = await res.text();

    if (!res.ok) {
      console.error("Chat LLM HTTP error:", res.status, rawBody.slice(0, 600));
      return { text: null, error: rawBody.slice(0, 200), status: res.status };
    }

    let data: { choices?: { message?: { content?: string } }[] };
    try {
      data = JSON.parse(rawBody);
    } catch {
      return { text: null, error: "invalid_json_response" };
    }

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { text: null, error: "empty_completion" };

    return { text };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Chat LLM fetch error:", msg);
    return { text: null, error: msg };
  } finally {
    clearTimeout(timer);
  }
}