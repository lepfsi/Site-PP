import { buildChatSiteContext } from "./chat-context";
import { gatherSourceContext, sourcesForReply, type ChatSource, type SourceTier } from "./chat-sources";
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
}

const ESCALATION_PATTERNS = [
  /\b(contact|expert|human|admin|support|consult|consulting|hire|partnership|devis|quote|urgent|incident|production down|speak to|parler à|expert|humain|admin|assistance|devis|partenariat|urgence|incident)\b/i,
];

function wantsEscalation(text: string): boolean {
  return ESCALATION_PATTERNS.some((p) => p.test(text));
}

function primaryTierFromContext(dailyOpsCovered: boolean, vendorCount: number, webCount: number): SourceTier {
  if (dailyOpsCovered) return "dailyops";
  if (vendorCount > 0) return "vendor";
  if (webCount > 0) return "web";
  return "model";
}

function fallbackReply(messages: ChatMessage[], lang: Language, sources: ChatSource[], primaryTier: SourceTier): ChatReply {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const lower = lastUser.toLowerCase();
  const escalate = wantsEscalation(lastUser);

  const links: ChatLink[] = sources
    .filter((s) => s.url.startsWith("/"))
    .map((s) => ({ label: s.label, href: s.url }));

  if (links.length === 0) {
    if (/article|guide|read|lire|doc/i.test(lastUser)) {
      links.push({ label: lang === "FR" ? "Tous les articles" : "All articles", href: "/articles" });
    }
    if (/network|bgp|ospf|vlan|réseau/i.test(lower)) {
      links.push({ label: "Networking", href: "/category/networking" });
    }
    if (/security|cyber|soc|siem|sécurité/i.test(lower)) {
      links.push({ label: lang === "FR" ? "Cybersécurité" : "Cybersecurity", href: "/category/cybersecurity" });
    }
    if (/cloud|k8s|kubernetes|terraform|aws/i.test(lower)) {
      links.push({ label: "Cloud", href: "/category/cloud" });
    }
    if (/contact|email|message|écrire|contacter/i.test(lower)) {
      links.push({ label: lang === "FR" ? "Formulaire contact" : "Contact form", href: "/about#contact" });
    }
  }

  if (escalate) {
    return {
      escalate: true,
      links,
      sources,
      primaryTier,
      reply:
        lang === "FR"
          ? "Votre demande semble nécessiter l'intervention directe de notre équipe. Je peux transmettre votre message à un expert — indiquez votre email ci-dessous, ou utilisez le formulaire de contact."
          : "Your request looks like it needs direct input from our team. I can forward this to an expert — share your email below, or use the contact form.",
    };
  }

  if (sources.some((s) => s.tier === "dailyops")) {
    return {
      escalate: false,
      links,
      sources,
      primaryTier: "dailyops",
      reply:
        lang === "FR"
          ? "J'ai trouvé des ressources DailyOps qui correspondent à votre recherche (source prioritaire). Consultez les liens ci-dessous — dites-moi si vous voulez creuser un sujet ou parler à un expert."
          : "I found DailyOps resources matching your question (priority source). Check the links below — tell me if you want to dig deeper or talk to an expert.",
    };
  }

  if (sources.length > 0) {
    const tierLabel =
      primaryTier === "vendor"
        ? lang === "FR"
          ? "documentation officielle éditeur"
          : "official vendor documentation"
        : lang === "FR"
          ? "recherche web"
          : "web search";

    return {
      escalate: false,
      links,
      sources,
      primaryTier,
      reply:
        lang === "FR"
          ? `DailyOps ne couvre pas encore ce sujet en détail. J'ai consulté la ${tierLabel} — voir les sources ci-dessous. Pour une aide personnalisée, contactez notre équipe.`
          : `DailyOps doesn't cover this topic in detail yet. I consulted ${tierLabel} — see sources below. For hands-on help, contact our team.`,
    };
  }

  return {
    escalate: false,
    links: [
      { label: lang === "FR" ? "À propos" : "About", href: "/about" },
      { label: lang === "FR" ? "Articles" : "Articles", href: "/articles" },
    ],
    sources: [],
    primaryTier: "model",
    reply:
      lang === "FR"
        ? "Je suis l'assistant DailyOps. Cherchez-vous un guide (réseau, cloud, sécurité…), un retour terrain, ou une aide personnalisée ? Décrivez votre besoin."
        : "I'm the DailyOps assistant. Are you looking for a guide (networking, cloud, security…), field experience, or personalized help? Describe what you need.",
  };
}

function buildSystemPrompt(lang: Language, siteContext: string, sourceContext: string): string {
  const language = lang === "FR" ? "French" : "English";

  return `You are the DailyOps.Tech website assistant — helpful, concise, production-focused.
Reply in ${language}.

## Source hierarchy (STRICT — follow this order)

1. **DailyOps documentation** — ALWAYS prioritize. Cite internal article links (/articles/...) when available.
2. **Official vendor documentation** (Fortinet, Cisco, Microsoft, VMware, AWS, etc.) — Use when DailyOps doesn't cover the topic or to validate/complete DailyOps content. Cite vendor URLs from context.
3. **Model general knowledge** — For conceptual explanations only when Tiers 1–2 are insufficient. Clearly state this is general guidance, not site content.
4. **Web search** — For CVEs, security advisories, version releases, news, and current events. Cite web URLs from context.

## Site knowledge (DailyOps catalog)
${siteContext}

## Retrieved context for this query
${sourceContext}

## Rules
- Follow the source hierarchy strictly. Lead with DailyOps when relevant articles exist.
- When using Tier 2–4, mention which tier you relied on briefly (e.g. "According to Fortinet docs…" or "Per recent advisory…").
- Suggest relevant internal links (href must start with /) in the links array.
- Include external vendor/web URLs in the sources array when you cite them.
- Set escalate=true when the visitor needs: custom consulting, hands-on production help, partnership, hiring, urgent incident support, or anything you cannot answer from available sources.
- Never invent DailyOps articles or internal URLs not in site knowledge.
- Be honest when DailyOps doesn't cover a topic — don't pretend site articles exist.
- Respond ONLY with valid JSON:
{"reply":"...","escalate":false,"links":[{"label":"...","href":"/..."}],"sources":[{"tier":"dailyops|vendor|model|web","label":"...","url":"..."}],"primaryTier":"dailyops|vendor|model|web"}`;
}

async function callLLM(
  messages: ChatMessage[],
  lang: Language,
  siteContext: string,
  sourceContext: string,
  fallbackSources: ChatSource[],
  fallbackTier: SourceTier,
): Promise<ChatReply | null> {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.CHAT_MODEL ?? "gpt-4o-mini";

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(lang, siteContext, sourceContext) },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    console.error("Chat LLM error:", await res.text());
    return null;
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      reply?: string;
      escalate?: boolean;
      links?: ChatLink[];
      sources?: ChatSource[];
      primaryTier?: SourceTier;
    };

    const llmSources = Array.isArray(parsed.sources)
      ? parsed.sources.filter((s) => s.url && s.label && s.tier)
      : [];

    const mergedSources = llmSources.length > 0 ? llmSources : fallbackSources;
    const internalLinks = Array.isArray(parsed.links)
      ? parsed.links.filter((l) => l.href?.startsWith("/"))
      : [];

    const externalFromSources = mergedSources
      .filter((s) => s.url.startsWith("http"))
      .map((s) => ({ label: s.label, href: s.url }));

    return {
      reply: parsed.reply ?? "",
      escalate: Boolean(parsed.escalate),
      links: [...internalLinks, ...externalFromSources],
      sources: mergedSources.slice(0, 6),
      primaryTier: parsed.primaryTier ?? fallbackTier,
    };
  } catch {
    return null;
  }
}

export async function generateChatReply(messages: ChatMessage[], lang: Language): Promise<ChatReply> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const sourceCtx = await gatherSourceContext(lastUser, lang);
  const sources = sourcesForReply(sourceCtx);
  const primaryTier = primaryTierFromContext(
    sourceCtx.dailyOpsCovered,
    sourceCtx.vendorSources.length,
    sourceCtx.webSources.length,
  );

  const siteContext = buildChatSiteContext(lang);
  const llm = await callLLM(messages, lang, siteContext, sourceCtx.contextBlock, sources, primaryTier);
  if (llm?.reply) return llm;

  return fallbackReply(messages, lang, sources, primaryTier);
}