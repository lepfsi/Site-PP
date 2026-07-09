import { buildChatSiteContext } from "./chat-context";
import { callChatCompletions, getLLMConfig } from "./chat-llm";
import { classifyQuery, buildRouteContext, type QuestionType, type RoutePlan } from "./chat-router";
import { detectVendors, gatherSourceContext, sourcesForReply, type ChatSource, type SourceTier } from "./chat-sources";
import type { Language } from "./translations";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatReply {
  reply: string;
  escalate: boolean;
  links: ChatLink[];
  sources: ChatSource[];
  primaryTier: SourceTier;
  queryType: QuestionType;
  queryTypeLabel: string;
}

function getConversationQuery(messages: ChatMessage[]): string {
  return messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content)
    .join("\n");
}

function getLastUserMessage(messages: ChatMessage[]): string {
  return [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
}

function wantsHumanEscalation(messages: ChatMessage[], route: RoutePlan): boolean {
  if (route.forceEscalate) return true;
  const last = getLastUserMessage(messages);
  return /\b(contact|expert|humain|human|parler à|speak to|consulting|devis|quote|partenariat|partnership|incident prod|production down|panne prod|urgence prod)\b/i.test(
    last,
  );
}

function primaryTierFromContext(dailyOpsCovered: boolean, vendorCount: number, webCount: number): SourceTier {
  if (dailyOpsCovered) return "dailyops";
  if (vendorCount > 0) return "vendor";
  if (webCount > 0) return "web";
  return "model";
}

function sourcesToLinks(sources: ChatSource[]): ChatLink[] {
  return sources.slice(0, 4).map((s) => ({ label: s.label, href: s.url }));
}

function buildPersonaPrompt(
  lang: Language,
  knowledge: string,
  retrievalContext: string,
  route: RoutePlan,
): string {
  const language = lang === "FR" ? "French" : "English";

  return `You are the DailyOps.Tech in-house assistant — you work for DailyOps. You are NOT a FAQ bot.

Personality: senior NOC/SOC engineer — warm, direct, you reason through problems step by step.

Conversation rules:
- Answer the user's LATEST message first. Follow the thread naturally.
- Never repeat a previous answer verbatim. Never re-introduce DailyOps if already discussed.
- Synthesize — do not paste knowledge blocks. No markdown bold (**).
- Use vendor/web context below for technical questions (Fortinet, Cisco, etc.).
- Plain text only, ${language}.

DailyOps knowledge (internal reference):
${knowledge}

Routing hint (${route.type}): ${route.instruction}

Retrieved sources for this message:
${retrievalContext || "(none)"}`;
}

function buildHistory(messages: ChatMessage[]): { role: "user" | "assistant"; content: string }[] {
  return messages
    .filter((m) => m.content.trim())
    .slice(-14)
    .map((m) => ({ role: m.role, content: m.content }));
}

async function generateReplyText(
  messages: ChatMessage[],
  lang: Language,
  knowledge: string,
  retrievalContext: string,
  route: RoutePlan,
): Promise<{ text: string | null; error?: string }> {
  const system = buildPersonaPrompt(lang, knowledge, retrievalContext, route);
  const history = buildHistory(messages);

  const result = await callChatCompletions(system, history, {
    temperature: 0.7,
    maxTokens: 1200,
    timeoutMs: 55_000,
  });

  return { text: result.text, error: result.error };
}

function buildErrorReply(lang: Language, route: RoutePlan, error?: string): ChatReply {
  const hint =
    lang === "FR"
      ? "L'assistant IA n'a pas pu répondre. Réessayez dans un instant."
      : "The AI assistant could not respond. Please try again shortly.";

  console.error("Chat reply failed:", error);

  return {
    reply: hint,
    escalate: false,
    links: [{ label: lang === "FR" ? "Contact" : "Contact", href: "/about#contact" }],
    sources: [],
    primaryTier: "model",
    queryType: route.type,
    queryTypeLabel: "",
  };
}

export async function generateChatReply(messages: ChatMessage[], lang: Language): Promise<ChatReply> {
  const lastUser = getLastUserMessage(messages);
  const conversationQuery = getConversationQuery(messages);

  const route = classifyQuery(lastUser, lang, detectVendors(lastUser).length > 0);
  const routeContext = buildRouteContext(route, lang);

  const sourceCtx = await gatherSourceContext(lastUser, conversationQuery, lang, route, routeContext);
  const sources = sourcesForReply(sourceCtx);
  const primaryTier = primaryTierFromContext(
    sourceCtx.dailyOpsCovered,
    sourceCtx.vendorSources.length,
    sourceCtx.webSources.length,
  );

  if (!getLLMConfig()) {
    return buildErrorReply(lang, route, "missing_api_key");
  }

  const knowledge = buildChatSiteContext(lang, true);
  const { text, error } = await generateReplyText(messages, lang, knowledge, sourceCtx.contextBlock, route);

  if (text) {
    return {
      reply: text,
      escalate: wantsHumanEscalation(messages, route),
      links: sourcesToLinks(sources),
      sources: sources.slice(0, 4),
      primaryTier,
      queryType: route.type,
      queryTypeLabel: "",
    };
  }

  return buildErrorReply(lang, route, error);
}