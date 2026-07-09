import { buildChatSiteContext } from "./chat-context";
import { callChatCompletions, getLLMConfig } from "./chat-llm";
import { classifyQuery, buildRouteContext, type QuestionType, type RoutePlan } from "./chat-router";
import { synthesizeConversationalReply } from "./chat-synth";
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
    .slice(-4)
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

  return `You are the DailyOps.Tech in-house assistant — you WORK for DailyOps, you are not a generic bot.

PERSONALITY
- Senior NOC/SOC colleague: warm, direct, competent, proud of the platform.
- You REASON and SYNTHESIZE — never paste knowledge blocks, never sound like a FAQ.
- You KEEP CONVERSATION THREAD: follow-ups ("et concrètement ?", "c'est quoi ?", "pour qui ?") continue the same topic — never restart with "what do you need?".

ABOUT DAILYOPS (internalize — explain naturally when asked)
${knowledge}

THIS TURN (${route.type}): ${route.instruction}

RETRIEVED CONTEXT (articles, vendor docs, web — use when relevant)
${retrievalContext || "(none — rely on your DailyOps knowledge and ops expertise)"}

RULES
- Reply in ${language} only.
- 2–5 short paragraphs max, or a tight bullet list when listing content types.
- Weave 0–2 internal links naturally when relevant (/articles/..., /experience/..., /category/...).
- For technical topics: reason through the answer, cite DailyOps content first when it exists.
- Never say "I don't have information about DailyOps" — you work here.
- Never output JSON or metadata — plain conversational text only.`;
}

function buildHistory(messages: ChatMessage[]): { role: "user" | "assistant"; content: string }[] {
  return messages
    .filter((m) => m.content.trim())
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content }));
}

async function generateReplyText(
  messages: ChatMessage[],
  lang: Language,
  knowledge: string,
  retrievalContext: string,
  route: RoutePlan,
): Promise<string | null> {
  const system = buildPersonaPrompt(lang, knowledge, retrievalContext, route);
  const history = buildHistory(messages);

  const primary = await callChatCompletions(system, history, {
    temperature: 0.75,
    maxTokens: 1000,
    timeoutMs: 50_000,
  });

  if (primary.text) return primary.text;

  console.error("Chat LLM primary failed:", primary.error, primary.status);

  const minimalKnowledge = knowledge.slice(0, 4000);
  const retry = await callChatCompletions(
    buildPersonaPrompt(lang, minimalKnowledge, "", route),
    history.slice(-6),
    { temperature: 0.75, maxTokens: 800, timeoutMs: 40_000 },
  );

  if (retry.text) return retry.text;

  console.error("Chat LLM retry failed:", retry.error, retry.status);
  return null;
}

function buildConfigErrorReply(lang: Language): ChatReply {
  return {
    reply:
      lang === "FR"
        ? "L'assistant IA n'est pas joignable sur ce déploiement — la clé serveur (OPENAI_API_KEY) est absente. Vérifiez les variables d'environnement Vercel puis redéployez."
        : "The AI assistant is unreachable on this deployment — server key (OPENAI_API_KEY) is missing. Check Vercel environment variables and redeploy.",
    escalate: false,
    links: [{ label: lang === "FR" ? "Contact" : "Contact", href: "/about#contact" }],
    sources: [],
    primaryTier: "model",
    queryType: "general",
    queryTypeLabel: "",
  };
}

function buildSynthReply(
  messages: ChatMessage[],
  lang: Language,
  route: RoutePlan,
  sources: ChatSource[],
  primaryTier: SourceTier,
): ChatReply | null {
  const text = synthesizeConversationalReply(messages, lang, route);
  if (!text) return null;

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

export async function generateChatReply(messages: ChatMessage[], lang: Language): Promise<ChatReply> {
  if (!getLLMConfig()) {
    const synth = buildSynthReply(messages, lang, classifyQuery(getConversationQuery(messages), lang, false), [], "dailyops");
    return synth ?? buildConfigErrorReply(lang);
  }

  const conversationQuery = getConversationQuery(messages);
  const route = classifyQuery(conversationQuery, lang, detectVendors(conversationQuery).length > 0);
  const routeContext = buildRouteContext(route, lang);
  const sourceCtx = await gatherSourceContext(conversationQuery, lang, route, routeContext);
  const sources = sourcesForReply(sourceCtx);
  const primaryTier = primaryTierFromContext(
    sourceCtx.dailyOpsCovered,
    sourceCtx.vendorSources.length,
    sourceCtx.webSources.length,
  );

  const knowledge = buildChatSiteContext(lang, true);
  const replyText = await generateReplyText(messages, lang, knowledge, sourceCtx.contextBlock, route);

  if (replyText) {
    return {
      reply: replyText,
      escalate: wantsHumanEscalation(messages, route),
      links: sourcesToLinks(sources),
      sources: sources.slice(0, 4),
      primaryTier,
      queryType: route.type,
      queryTypeLabel: "",
    };
  }

  const synth = buildSynthReply(messages, lang, route, sources, primaryTier);
  if (synth) return synth;

  return {
    reply:
      lang === "FR"
        ? "Le modèle IA n'a pas répondu à temps. Réessayez — si le problème persiste, vérifiez CHAT_MODEL et OPENAI_BASE_URL dans Vercel."
        : "The AI model didn't respond in time. Try again — if it persists, check CHAT_MODEL and OPENAI_BASE_URL in Vercel.",
    escalate: false,
    links: [{ label: lang === "FR" ? "Contact" : "Contact", href: "/about#contact" }],
    sources: [],
    primaryTier: "model",
    queryType: route.type,
    queryTypeLabel: "",
  };
}