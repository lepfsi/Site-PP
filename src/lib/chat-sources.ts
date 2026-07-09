import { getAllArticles } from "./articles";
import { CATEGORIES } from "./categories";
import { getMarkdownBody } from "./markdown";
import { translations, type Language } from "./translations";

export type SourceTier = "dailyops" | "vendor" | "model" | "web";

export interface ChatSource {
  tier: SourceTier;
  label: string;
  url: string;
  snippet?: string;
}

export interface DailyOpsMatch {
  slug: string;
  title: string;
  href: string;
  score: number;
  excerpt?: string;
}

export interface SourceContext {
  dailyOpsMatches: DailyOpsMatch[];
  dailyOpsCovered: boolean;
  vendorSources: ChatSource[];
  webSources: ChatSource[];
  detectedVendors: string[];
  needsWebSearch: boolean;
  contextBlock: string;
}

const VENDOR_DOCS: Record<string, { name: string; domain: string; aliases: string[] }> = {
  fortinet: { name: "Fortinet", domain: "docs.fortinet.com", aliases: ["fortigate", "fortios", "fortianalyzer"] },
  cisco: { name: "Cisco", domain: "cisco.com", aliases: ["ios", "nx-os", "asa", "meraki"] },
  microsoft: { name: "Microsoft", domain: "learn.microsoft.com", aliases: ["azure", "windows server", "entra", "intune", "powershell"] },
  vmware: { name: "VMware", domain: "docs.vmware.com", aliases: ["vsphere", "esxi", "vcenter", "nsx"] },
  aws: { name: "AWS", domain: "docs.aws.amazon.com", aliases: ["amazon web services", "ec2", "s3", "iam"] },
  paloalto: { name: "Palo Alto", domain: "docs.paloaltonetworks.com", aliases: ["pan-os", "palo alto networks"] },
  juniper: { name: "Juniper", domain: "juniper.net", aliases: ["junos", "srx"] },
  redhat: { name: "Red Hat", domain: "access.redhat.com", aliases: ["rhel", "openshift", "ansible"] },
  kubernetes: { name: "Kubernetes", domain: "kubernetes.io", aliases: ["k8s", "kubectl"] },
};

const WEB_SEARCH_PATTERNS = [
  /\bcve-\d{4}-\d+/i,
  /\b(latest|newest|recent|current|nouveau|nouvelle|dernière?|actuel)\b/i,
  /\b(version|release|patch|update|advisory|bulletin|announcement|annonce)\b/i,
  /\b(202[4-9]|security\s+advisory|zero[- ]day|0-day)\b/i,
  /\b(eol|end of life|fin de support|deprecat)/i,
];

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "must", "shall", "can", "need", "want",
  "how", "what", "when", "where", "why", "which", "who", "whom",
  "this", "that", "these", "those", "it", "its", "they", "them",
  "i", "me", "my", "we", "our", "you", "your", "he", "she", "his", "her",
  "and", "or", "but", "if", "then", "else", "for", "with", "about",
  "from", "into", "through", "during", "before", "after", "above", "below",
  "to", "of", "in", "on", "at", "by", "as", "up", "out", "off", "over",
  "le", "la", "les", "un", "une", "des", "du", "de", "et", "ou", "mais",
  "si", "que", "qui", "quoi", "comment", "pourquoi", "où", "quand",
  "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "mon", "ton",
  "son", "notre", "votre", "leur", "ce", "cette", "ces", "est", "sont",
  "être", "avoir", "faire", "dans", "sur", "avec", "pour", "par", "en",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9àâäéèêëïîôùûüç\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function detectVendors(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const [key, vendor] of Object.entries(VENDOR_DOCS)) {
    if (lower.includes(key) || vendor.aliases.some((a) => lower.includes(a))) {
      found.push(key);
    }
  }
  return found;
}

function needsWebSearch(text: string): boolean {
  return WEB_SEARCH_PATTERNS.some((p) => p.test(text));
}

function scoreArticle(
  queryTokens: string[],
  title: string,
  excerpt: string,
  slug: string,
  categoryTags: string[],
): number {
  const corpus = `${title} ${excerpt} ${slug.replace(/-/g, " ")} ${categoryTags.join(" ")}`.toLowerCase();
  let score = 0;

  for (const token of queryTokens) {
    if (corpus.includes(token)) score += 1;
    if (slug.includes(token)) score += 2;
    if (title.toLowerCase().includes(token)) score += 2;
  }

  return score;
}

export function matchDailyOpsArticles(query: string, lang: Language): DailyOpsMatch[] {
  const t = translations[lang];
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const articles = getAllArticles();
  const scored: DailyOpsMatch[] = [];

  for (const article of articles) {
    const cat = CATEGORIES.find((c) => c.slug === article.category);
    const title = t[article.titleKey as keyof typeof t] as string;
    const excerpt = t[article.excerptKey as keyof typeof t] as string;
    const score = scoreArticle(queryTokens, title, excerpt, article.slug, cat?.tags ?? []);

    if (score >= 2) {
      const body = article.format === "markdown" ? getMarkdownBody(article.slug, lang) : null;
      scored.push({
        slug: article.slug,
        title,
        href: `/articles/${article.slug}`,
        score,
        excerpt: body ? body.slice(0, 1200) : excerpt,
      });
    }
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}

async function searchTavily(
  query: string,
  options?: { includeDomains?: string[]; maxResults?: number },
): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: options?.maxResults ?? 4,
        include_domains: options?.includeDomains,
      }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return (data.results ?? []).map((r: { title?: string; url?: string; content?: string }) => ({
      title: r.title ?? "",
      url: r.url ?? "",
      snippet: r.content?.slice(0, 300),
    }));
  } catch {
    return [];
  }
}

async function searchSerper(query: string, maxResults = 4): Promise<SearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num: maxResults }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const organic = data.organic ?? [];
    return organic.map((r: { title?: string; link?: string; snippet?: string }) => ({
      title: r.title ?? "",
      url: r.link ?? "",
      snippet: r.snippet,
    }));
  } catch {
    return [];
  }
}

async function webSearch(query: string, includeDomains?: string[]): Promise<SearchResult[]> {
  if (process.env.TAVILY_API_KEY) {
    return searchTavily(query, { includeDomains, maxResults: 4 });
  }
  const q = includeDomains?.length ? `${query} site:${includeDomains[0]}` : query;
  return searchSerper(q, 4);
}

async function searchVendorDocs(query: string, vendorKeys: string[]): Promise<ChatSource[]> {
  const sources: ChatSource[] = [];

  for (const key of vendorKeys.slice(0, 2)) {
    const vendor = VENDOR_DOCS[key];
    if (!vendor) continue;

    const results = await webSearch(`${query} ${vendor.name}`, [vendor.domain]);
    for (const r of results.slice(0, 2)) {
      if (r.url && r.title) {
        sources.push({
          tier: "vendor",
          label: `${vendor.name}: ${r.title}`,
          url: r.url,
          snippet: r.snippet,
        });
      }
    }
  }

  return sources;
}

async function searchWebNews(query: string): Promise<ChatSource[]> {
  const results = await webSearch(query);
  return results
    .filter((r) => r.url && r.title)
    .map((r) => ({
      tier: "web" as const,
      label: r.title,
      url: r.url,
      snippet: r.snippet,
    }));
}

function buildContextBlock(
  lang: Language,
  dailyOpsMatches: DailyOpsMatch[],
  vendorSources: ChatSource[],
  webSources: ChatSource[],
  dailyOpsCovered: boolean,
): string {
  const sections: string[] = [];

  if (dailyOpsMatches.length > 0) {
    const articles = dailyOpsMatches
      .map((m) => {
        const body = m.excerpt ? `\n  Excerpt:\n  ${m.excerpt}` : "";
        return `- [Tier 1 — DailyOps] ${m.title} (${m.href})${body}`;
      })
      .join("\n\n");
    sections.push(`## Tier 1 — DailyOps documentation (PRIORITY)\n${articles}`);
  } else {
    sections.push(
      lang === "FR"
        ? "## Tier 1 — DailyOps: aucun article correspondant trouvé pour cette requête."
        : "## Tier 1 — DailyOps: no matching article found for this query.",
    );
  }

  if (vendorSources.length > 0) {
    const vendors = vendorSources
      .map((s) => `- [Tier 2 — Vendor] ${s.label}\n  URL: ${s.url}${s.snippet ? `\n  Snippet: ${s.snippet}` : ""}`)
      .join("\n");
    sections.push(`## Tier 2 — Official vendor documentation\n${vendors}`);
  }

  if (webSources.length > 0) {
    const web = webSources
      .map((s) => `- [Tier 4 — Web] ${s.label}\n  URL: ${s.url}${s.snippet ? `\n  Snippet: ${s.snippet}` : ""}`)
      .join("\n");
    sections.push(`## Tier 4 — Web search (CVE, news, versions)\n${web}`);
  }

  sections.push(
    dailyOpsCovered
      ? lang === "FR"
        ? "## Couverture: DailyOps couvre partiellement ce sujet — privilégier Tier 1, compléter avec Tier 2 si utile."
        : "## Coverage: DailyOps partially covers this topic — prioritize Tier 1, supplement with Tier 2 if useful."
      : lang === "FR"
        ? "## Couverture: DailyOps ne couvre pas ce sujet — utiliser Tier 2 (vendor) puis Tier 3 (connaissances générales), Tier 4 si actualité/CVE."
        : "## Coverage: DailyOps does not cover this topic — use Tier 2 (vendor), then Tier 3 (general knowledge), Tier 4 for news/CVE.",
  );

  return sections.join("\n\n");
}

export async function gatherSourceContext(query: string, lang: Language): Promise<SourceContext> {
  const dailyOpsMatches = matchDailyOpsArticles(query, lang);
  const dailyOpsCovered = dailyOpsMatches.length > 0 && dailyOpsMatches[0].score >= 3;
  const detectedVendors = detectVendors(query);
  const webNeeded = needsWebSearch(query);

  const hasSearchApi = Boolean(process.env.TAVILY_API_KEY || process.env.SERPER_API_KEY);

  let vendorSources: ChatSource[] = [];
  let webSources: ChatSource[] = [];

  if (hasSearchApi) {
    const vendorNeeded = detectedVendors.length > 0 && (!dailyOpsCovered || dailyOpsMatches.length < 2);
    if (vendorNeeded) {
      vendorSources = await searchVendorDocs(query, detectedVendors);
    }
    if (webNeeded) {
      webSources = await searchWebNews(query);
    }
  }

  const contextBlock = buildContextBlock(lang, dailyOpsMatches, vendorSources, webSources, dailyOpsCovered);

  return {
    dailyOpsMatches,
    dailyOpsCovered,
    vendorSources,
    webSources,
    detectedVendors,
    needsWebSearch: webNeeded,
    contextBlock,
  };
}

export function sourcesForReply(ctx: SourceContext): ChatSource[] {
  const internal: ChatSource[] = ctx.dailyOpsMatches.map((m) => ({
    tier: "dailyops",
    label: m.title,
    url: m.href,
  }));

  return [...internal, ...ctx.vendorSources, ...ctx.webSources].slice(0, 6);
}