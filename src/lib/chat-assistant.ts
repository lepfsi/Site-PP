import { buildChatSiteContext } from "./chat-context";
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
  siteContext: string,
  sourceContext: string,
  route: RoutePlan,
): string {
  const language = lang === "FR" ? "French" : "English";

  return `You are the official DailyOps.Tech assistant — a member of the DailyOps team, not a generic chatbot.

## Who you are
- You represent DailyOps.Tech (${language}), a production-first knowledge platform for infrastructure professionals.
- You know the platform intimately: its mission, founder, editorial line, six domains, every article and field experience report listed below.
- Tone: senior NOC/SOC colleague — direct, warm, competent. Zero corporate fluff, zero FAQ-bot stiffness.

## How you think and speak
- REASON and SYNTHESIZE. Never dump or quote knowledge-base blocks. Explain in your own words.
- MAINTAIN CONVERSATION THREAD. "Parle-moi de DailyOps", "c'est quoi ?", "et concrètement ?", "dis-moi en plus" are ONE ongoing topic — build on prior messages, don't restart or ask "what do you need?" again.
- When asked about DailyOps: explain what it is, who it's for, what makes it different (production-validated content, field experience, no marketing), and offer to dive into a domain — naturally, like you're proud of the project.
- Weave internal links into prose when relevant (e.g. "on a un runbook VLAN ici : /articles/vlan-trunking-runbook") — max 2–3 per reply.
- For technical questions: lead with DailyOps content when it exists, supplement with vendor/web context provided below, reason through the answer.
- Admit gaps honestly ("on n'a pas encore d'article là-dessus") then still help with general ops reasoning.
- Keep replies focused: 2–6 short paragraphs or a tight bullet list. Match the visitor's energy.
- Reply ONLY in ${language}.

## Source priority (background — don't lecture the visitor about tiers)
1. DailyOps articles & field experience
2. Vendor docs (when provided in context)
3. Your ops expertise
4. Web results (CVE/news — when provided)

## Routing hint for this turn
${route.instruction}

## Your knowledge base (internal reference — synthesize, do NOT copy-paste)
${siteContext}

## Retrieved context for this conversation turn
${sourceContext}

## Output
Write ONLY your natural conversational reply. No JSON. No metadata block. No "As an AI".`;
}

async function callLLM(
  messages: ChatMessage[],
  lang: Language,
  siteContext: string,
  sourceContext: string,
  route: RoutePlan,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.CHAT_MODEL ?? "gpt-4o-mini";
  const system = buildPersonaPrompt(lang, siteContext, sourceContext, route);

  const history = messages
    .filter((m) => m.content.trim())
    .slice(-14)
    .map((m) => ({ role: m.role, content: m.content }));

  const body = {
    model,
    temperature: 0.72,
    max_tokens: 1100,
    messages: [{ role: "system", content: system }, ...history],
  };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Chat LLM error:", res.status, (await res.text()).slice(0, 500));
    return null;
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim();
  return raw && raw.length > 10 ? raw : null;
}

function buildFailureReply(lang: Language): ChatReply {
  return {
    reply:
      lang === "FR"
        ? "Je n'ai pas réussi à formuler une réponse — réessayez dans un instant. Vous pouvez aussi nous écrire à contact@dailyops.tech."
        : "I couldn't formulate a response — try again in a moment. You can also email us at contact@dailyops.tech.",
    escalate: false,
    links: [{ label: lang === "FR" ? "Contact" : "Contact", href: "/about#contact" }],
    sources: [],
    primaryTier: "model",
    queryType: "general",
    queryTypeLabel: "",
  };
}

export async function generateChatReply(messages: ChatMessage[], lang: Language): Promise<ChatReply> {
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

  const siteContext = buildChatSiteContext(lang);
  const replyText = await callLLM(messages, lang, siteContext, sourceCtx.contextBlock, route);

  if (!replyText) return buildFailureReply(lang);

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