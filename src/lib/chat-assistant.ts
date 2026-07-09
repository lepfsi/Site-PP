import { buildChatSiteContext } from "./chat-context";
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
}

const ESCALATION_PATTERNS = [
  /\b(contact|expert|human|admin|support|consult|consulting|hire|partnership|devis|quote|urgent|incident|production down|speak to|parler à|expert|humain|admin|assistance|devis|partenariat|urgence|incident)\b/i,
];

function wantsEscalation(text: string): boolean {
  return ESCALATION_PATTERNS.some((p) => p.test(text));
}

function fallbackReply(messages: ChatMessage[], lang: Language): ChatReply {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const lower = lastUser.toLowerCase();
  const escalate = wantsEscalation(lastUser);

  const links: ChatLink[] = [];

  if (/article|guide|read|lire|doc/i.test(lastUser)) {
    links.push({ label: lang === "FR" ? "Tous les articles" : "All articles", href: "/articles" });
  }
  if (/network|bgp|ospf|vlan|réseau/i.test(lower)) {
    links.push({ label: lang === "FR" ? "Networking" : "Networking", href: "/category/networking" });
  }
  if (/security|cyber|soc|siem|sécurité/i.test(lower)) {
    links.push({ label: lang === "FR" ? "Cybersécurité" : "Cybersecurity", href: "/category/cybersecurity" });
  }
  if (/cloud|k8s|kubernetes|terraform|aws/i.test(lower)) {
    links.push({ label: lang === "FR" ? "Cloud" : "Cloud", href: "/category/cloud" });
  }
  if (/contact|email|message|écrire|contacter/i.test(lower)) {
    links.push({ label: lang === "FR" ? "Formulaire contact" : "Contact form", href: "/about#contact" });
  }

  if (escalate) {
    return {
      escalate: true,
      links,
      reply:
        lang === "FR"
          ? "Votre demande semble nécessiter l'intervention directe de notre équipe. Je peux transmettre votre message à un expert — indiquez votre email ci-dessous, ou utilisez le formulaire de contact."
          : "Your request looks like it needs direct input from our team. I can forward this to an expert — share your email below, or use the contact form.",
    };
  }

  if (links.length > 0) {
    return {
      escalate: false,
      links,
      reply:
        lang === "FR"
          ? "Voici des ressources DailyOps qui correspondent à votre recherche. Dites-moi si vous voulez creuser un sujet précis ou parler à un expert."
          : "Here are DailyOps resources that match your question. Tell me if you want to dig into a specific topic or talk to an expert.",
    };
  }

  return {
    escalate: false,
    links: [
      { label: lang === "FR" ? "À propos" : "About", href: "/about" },
      { label: lang === "FR" ? "Articles" : "Articles", href: "/articles" },
    ],
    reply:
      lang === "FR"
        ? "Je suis l'assistant DailyOps. Cherchez-vous un guide (réseau, cloud, sécurité…), un retour terrain, ou une aide personnalisée ? Décrivez votre besoin."
        : "I'm the DailyOps assistant. Are you looking for a guide (networking, cloud, security…), field experience, or personalized help? Describe what you need.",
  };
}

async function callLLM(messages: ChatMessage[], lang: Language): Promise<ChatReply | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.CHAT_MODEL ?? "gpt-4o-mini";
  const context = buildChatSiteContext(lang);

  const system = `You are the DailyOps.Tech website assistant — helpful, concise, production-focused.
Language: reply in ${lang === "FR" ? "French" : "English"}.

Site knowledge:
${context}

Rules:
- Help visitors find articles, categories, resources, and contact options.
- Answer general IT ops questions briefly using site content when possible.
- Suggest relevant internal links (href must start with /).
- Set escalate=true when the visitor needs: custom consulting, hands-on production help, partnership, hiring, urgent incident support, or anything you cannot answer from public site content.
- Never invent articles or URLs not in site knowledge.
- Respond ONLY with valid JSON: {"reply":"...","escalate":false,"links":[{"label":"...","href":"/..."}]}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
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
    const parsed = JSON.parse(raw) as { reply?: string; escalate?: boolean; links?: ChatLink[] };
    return {
      reply: parsed.reply ?? "",
      escalate: Boolean(parsed.escalate),
      links: Array.isArray(parsed.links) ? parsed.links.filter((l) => l.href?.startsWith("/")) : [],
    };
  } catch {
    return null;
  }
}

export async function generateChatReply(messages: ChatMessage[], lang: Language): Promise<ChatReply> {
  const llm = await callLLM(messages, lang);
  if (llm?.reply) return llm;
  return fallbackReply(messages, lang);
}