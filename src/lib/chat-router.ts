import type { Language } from "./translations";

export type QuestionType =
  | "about_brand"
  | "site_navigation"
  | "concept"
  | "vendor_howto"
  | "cve_security"
  | "validation"
  | "experience"
  | "incident"
  | "contact"
  | "general";

export interface TierFlags {
  dailyops: boolean;
  experience: boolean;
  vendor: boolean;
  web: boolean;
  model: boolean;
}

export interface RoutePlan {
  type: QuestionType;
  tiers: TierFlags;
  forceEscalate: boolean;
  label: string;
  instruction: string;
}

interface TypeRule {
  type: QuestionType;
  patterns: RegExp[];
  weight: number;
}

const TYPE_RULES: TypeRule[] = [
  {
    type: "contact",
    weight: 100,
    patterns: [
      /\b(contact|contacter|écrire|email|message|formulaire|devis|quote|partnership|partenariat|hire|embaucher|consulting|consultant|speak to|talk to|parler à|joindre|reach out)\b/i,
    ],
  },
  {
    type: "incident",
    weight: 95,
    patterns: [
      /\b(incident|urgent|urgence|p1|p2|sev[12]|production down|prod down|outage|panne|site down|service down|down right now|en panne|critique|emergency|war room|bridage|bridge call)\b/i,
    ],
  },
  {
    type: "about_brand",
    weight: 92,
    patterns: [
      /\b(parle[- ]moi (de |d[''])?daily\s*ops|tell me about daily\s*ops|what is daily\s*ops|what'?s daily\s*ops|qu['']est[- ]ce que daily\s*ops|c['']est quoi daily\s*ops|who are you|qui êtes[- ]vous|présent(e|ez)[- ]?(moi )?daily\s*ops|present daily\s*ops|about daily\s*ops|à propos de daily\s*ops|dailyops\.tech|what do you do|que faites[- ]vous|your mission|votre mission|connais[- ]tu daily\s*ops|know daily\s*ops)\b/i,
      /\b(c['']est quoi ce site|what is this site|what is this platform|c['']est quoi cette plateforme|présente[- ]?moi (le site|la plateforme)|present (the site|the platform))\b/i,
    ],
  },
  {
    type: "cve_security",
    weight: 90,
    patterns: [
      /\bcve-\d{4}-\d+/i,
      /\b(vulnerability|vulnérabilité|exploit|zero[- ]day|0-day|security advisory|advisory|bulletin|patch tuesday|cvss)\b/i,
    ],
  },
  {
    type: "validation",
    weight: 85,
    patterns: [
      /\b(still valid|still current|up to date|à jour|encore d'actualité|toujours valide|compatible with|compatible avec|deprecated|déprécié|end of life|eol|fin de support|supported version|version supportée|correct\?|accurate|exact)\b/i,
    ],
  },
  {
    type: "experience",
    weight: 80,
    patterns: [
      /\b(field experience|retour[s]? d['']expérience|retour terrain|case study|real[- ]world|vécu|terrain|postmortem|post-mortem|incident report|rapport d'incident|lessons learned|leçons tirées)\b/i,
    ],
  },
  {
    type: "site_navigation",
    weight: 75,
    patterns: [
      /\b(where is|where can i find|find (the |your )?(article|guide|doc)|show me|point me to|lien vers|où est|où trouver|quel article|quelle page|avez-vous un guide|do you have a guide|link to)\b/i,
    ],
  },
  {
    type: "vendor_howto",
    weight: 70,
    patterns: [
      /\b(how (to|do i)|how can i|comment (faire|configurer|mettre en place|déployer)|configure|configuration|setup|set up|install|deploy|déployer|mettre en place|procédure|step[- ]by[- ]step|cli command)\b/i,
    ],
  },
  {
    type: "concept",
    weight: 60,
    patterns: [
      /\b(what is|what are|what's|qu['']est[- ]ce que|c'est quoi|explain|expliquer|definition|définition|difference between|différence entre|vs\.?|versus|pourquoi|why does|how does .+ work|fonctionnement|principle|principe|overview|aperçu)\b/i,
    ],
  },
];

const ROUTE_PLANS: Record<QuestionType, Omit<RoutePlan, "type" | "label" | "instruction"> & { labelEn: string; labelFr: string; instructionEn: string; instructionFr: string }> = {
  about_brand: {
    tiers: { dailyops: true, experience: false, vendor: false, web: false, model: true },
    forceEscalate: false,
    labelEn: "About DailyOps",
    labelFr: "À propos de DailyOps",
    instructionEn: "Visitor asks about DailyOps itself (mission, identity, what the site offers). Answer from the BRAND KNOWLEDGE section in site knowledge — summarize clearly in 2–4 sentences, then offer relevant links (/about, /articles, /experience). Do NOT say you lack information.",
    instructionFr: "Le visiteur demande ce qu'est DailyOps (mission, identité, contenu du site). Répondre depuis la section BRAND KNOWLEDGE — résumer clairement en 2–4 phrases, puis proposer des liens (/about, /articles, /experience). Ne PAS dire que vous manquez d'informations.",
  },
  site_navigation: {
    tiers: { dailyops: true, experience: false, vendor: false, web: false, model: true },
    forceEscalate: false,
    labelEn: "Site navigation",
    labelFr: "Navigation site",
    instructionEn: "Visitor wants DailyOps content. Search Tier 1 only — point to articles/categories. Do NOT search vendor docs or web unless nothing matches.",
    instructionFr: "Le visiteur cherche du contenu DailyOps. Tier 1 uniquement — orienter vers articles/catégories. Pas de recherche vendor/web sauf si rien ne correspond.",
  },
  concept: {
    tiers: { dailyops: true, experience: false, vendor: false, web: false, model: true },
    forceEscalate: false,
    labelEn: "Conceptual question",
    labelFr: "Question conceptuelle",
    instructionEn: "Conceptual question. Check DailyOps first; if no article, use Tier 3 (general knowledge). Keep it concise and educational. No vendor/web search needed.",
    instructionFr: "Question conceptuelle. Vérifier DailyOps d'abord ; sinon Tier 3 (connaissances générales). Réponse concise et pédagogique. Pas de recherche vendor/web.",
  },
  vendor_howto: {
    tiers: { dailyops: true, experience: false, vendor: true, web: false, model: true },
    forceEscalate: false,
    labelEn: "Vendor how-to",
    labelFr: "Procédure éditeur",
    instructionEn: "Product-specific how-to. Priority: DailyOps article if exists, then Tier 2 vendor docs. Use Tier 3 only for general context. No web search.",
    instructionFr: "Procédure spécifique à un produit. Priorité : article DailyOps si existant, puis Tier 2 doc éditeur. Tier 3 pour le contexte général uniquement. Pas de recherche web.",
  },
  cve_security: {
    tiers: { dailyops: false, experience: false, vendor: true, web: true, model: false },
    forceEscalate: false,
    labelEn: "CVE / security advisory",
    labelFr: "CVE / advisory sécurité",
    instructionEn: "Security/CVE query. Use Tier 4 (web) + Tier 2 (vendor advisory if product named). Do NOT rely on model knowledge for CVE details — cite sources only.",
    instructionFr: "Requête CVE/sécurité. Utiliser Tier 4 (web) + Tier 2 (advisory éditeur si produit cité). Ne pas inventer de détails CVE — citer les sources uniquement.",
  },
  validation: {
    tiers: { dailyops: true, experience: false, vendor: true, web: true, model: false },
    forceEscalate: false,
    labelEn: "Validation / compatibility",
    labelFr: "Validation / compatibilité",
    instructionEn: "Visitor wants to validate or check currency/compatibility. Cross-check DailyOps with Tier 2 vendor docs and Tier 4 web for version/EOL info. Cite all sources used.",
    instructionFr: "Le visiteur veut valider ou vérifier l'actualité/compatibilité. Croiser DailyOps avec Tier 2 doc éditeur et Tier 4 web pour versions/EOL. Citer toutes les sources.",
  },
  experience: {
    tiers: { dailyops: false, experience: true, vendor: false, web: false, model: true },
    forceEscalate: false,
    labelEn: "Field experience",
    labelFr: "Retour terrain",
    instructionEn: "Visitor wants real-world field experience. Prioritize Tier 1 experience reports (/experience/...). Supplement with Tier 3 only if needed.",
    instructionFr: "Le visiteur cherche des retours terrain. Prioriser les rapports d'expérience DailyOps (/experience/...). Tier 3 en complément si nécessaire.",
  },
  incident: {
    tiers: { dailyops: true, experience: false, vendor: false, web: false, model: false },
    forceEscalate: true,
    labelEn: "Production incident",
    labelFr: "Incident production",
    instructionEn: "Production incident detected. Set escalate=true immediately. Optionally link troubleshooting articles. Do NOT attempt remote diagnosis — route to human expert.",
    instructionFr: "Incident production détecté. Mettre escalate=true immédiatement. Lier éventuellement des articles troubleshooting. Pas de diagnostic à distance — orienter vers un expert.",
  },
  contact: {
    tiers: { dailyops: false, experience: false, vendor: false, web: false, model: true },
    forceEscalate: true,
    labelEn: "Contact / expert request",
    labelFr: "Contact / demande expert",
    instructionEn: "Visitor wants human contact. Set escalate=true. Point to /about#contact. Keep reply brief and helpful.",
    instructionFr: "Le visiteur souhaite un contact humain. Mettre escalate=true. Orienter vers /about#contact. Réponse brève et utile.",
  },
  general: {
    tiers: { dailyops: true, experience: true, vendor: true, web: true, model: true },
    forceEscalate: false,
    labelEn: "General question",
    labelFr: "Question générale",
    instructionEn: "General question — apply full source hierarchy. Activate vendor/web only when context provides results.",
    instructionFr: "Question générale — appliquer la hiérarchie complète. Activer vendor/web uniquement si le contexte fournit des résultats.",
  },
};

function scoreTypes(query: string): Map<QuestionType, number> {
  const scores = new Map<QuestionType, number>();

  for (const rule of TYPE_RULES) {
    let hits = 0;
    for (const pattern of rule.patterns) {
      if (pattern.test(query)) hits++;
    }
    if (hits > 0) {
      scores.set(rule.type, rule.weight + hits * 5);
    }
  }

  return scores;
}

function resolveType(scores: Map<QuestionType, number>, hasVendor: boolean): QuestionType {
  if (scores.size === 0) return "general";

  const sorted = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const second = sorted[1]?.[0];

  if (top === "vendor_howto" && !hasVendor && second) return second;
  if (second === "vendor_howto" && top === "concept" && hasVendor) return "vendor_howto";

  if (top === "contact" && scores.has("incident") && scores.get("incident")! >= (scores.get("contact") ?? 0) - 10) {
    return "incident";
  }

  return top;
}

export function isAboutBrandQuery(query: string): boolean {
  return TYPE_RULES.some(
    (rule) => rule.type === "about_brand" && rule.patterns.some((p) => p.test(query)),
  );
}

export function classifyQuery(query: string, lang: Language, hasVendor = false): RoutePlan {
  const scores = scoreTypes(query);
  const type = resolveType(scores, hasVendor);
  const plan = ROUTE_PLANS[type];

  return {
    type,
    tiers: { ...plan.tiers },
    forceEscalate: plan.forceEscalate,
    label: lang === "FR" ? plan.labelFr : plan.labelEn,
    instruction: lang === "FR" ? plan.instructionFr : plan.instructionEn,
  };
}

export function buildRouteContext(plan: RoutePlan, lang: Language): string {
  const activeTiers = (Object.entries(plan.tiers) as [keyof TierFlags, boolean][])
    .filter(([, on]) => on)
    .map(([tier]) => tier)
    .join(", ");

  const header =
    lang === "FR"
      ? `## Routage — Type: ${plan.label} (${plan.type})\nTiers actifs: ${activeTiers}`
      : `## Routing — Type: ${plan.label} (${plan.type})\nActive tiers: ${activeTiers}`;

  return `${header}\n${plan.instruction}${plan.forceEscalate ? (lang === "FR" ? "\n⚠ Escalade forcée." : "\n⚠ Forced escalation.") : ""}`;
}