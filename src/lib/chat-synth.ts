import { CATEGORIES } from "./categories";
import { translations, type Language } from "./translations";
import type { ChatMessage } from "./chat-assistant";
import type { RoutePlan } from "./chat-router";

function userTurns(messages: ChatMessage[]): string[] {
  return messages.filter((m) => m.role === "user").map((m) => m.content);
}

function threadText(messages: ChatMessage[]): string {
  return userTurns(messages).join(" ").toLowerCase();
}

function isAboutThread(messages: ChatMessage[], route: RoutePlan): boolean {
  if (route.type === "about_brand") return true;
  return /\bdaily\s*ops\b/.test(threadText(messages));
}

function wantsPublishDetails(last: string): boolean {
  return /\b(concrètement|publiez|publie|contenu|articles|guides|playbooks|retours|experience|expérience|what do you publish|what do you publish)\b/i.test(
    last,
  );
}

function wantsAudience(last: string): boolean {
  return /\b(pour qui|who is it for|public|cible|audience|destiné)\b/i.test(last);
}

export function synthesizeConversationalReply(
  messages: ChatMessage[],
  lang: Language,
  route: RoutePlan,
): string | null {
  if (!isAboutThread(messages, route)) return null;

  const t = translations[lang];
  const turns = userTurns(messages);
  const last = turns.at(-1) ?? "";
  const domains = CATEGORIES.map((c) => t[c.nameKey as keyof typeof t] as string).join(", ");

  if (lang === "FR") {
    if (turns.length > 1 && wantsPublishDetails(last)) {
      return `Concrètement, on publie quatre familles de contenu sur DailyOps.Tech :

• Des **guides et playbooks** prêts pour la prod — baselines réseau, durcissement, checklists cloud, CI/CD Ansible, etc.
• Des **retours d'expérience terrain** — incidents réels, RCA, migrations, optimisations (pas du théorique).
• Des **ressources par domaine** : ${domains}.
• Une ligne éditoriale claire : documenter ce qui tourne vraiment en production, validé par des équipes NOC/SOC.

Si un sujet vous intéresse — BGP, SOC, Kubernetes, troubleshooting — je peux vous pointer le bon guide ou creuser avec vous.`;
    }

    if (turns.length > 1 && wantsAudience(last)) {
      return `DailyOps s'adresse aux **professionnels de l'infrastructure** qui vivent la production au quotidien : ingénieurs réseau, analystes cyber, architectes cloud, admins système, équipes NOC/SOC.

Le fil rouge : des gens pour qui **l'indisponibilité n'est pas une option** — banque, aéroport, infra critique, environnements régulés. On ne fait pas du contenu "débutant LinkedIn" ; on documente ce qui se déploie, se troubleshoot, et tient en prod.

Vous êtes dans quel domaine ? Je peux vous orienter vers les ressources les plus utiles pour vous.`;
    }

    if (turns.length > 1) {
      return `Pour compléter : DailyOps a été fondé par **${t["about.author_name"]}**, ${t["about.author_role"].toLowerCase()}, après des années en environnements exigeants (banque, aéroports, infra critique). L'idée était simple — partager les playbooks et leçons acquises sur le terrain, pas refaire de la doc générique.

On couvre six domaines : ${domains}. Chaque contenu est pensé pour être **actionnable** en prod.

Qu'est-ce qui vous intéresse le plus — un domaine précis, un type de contenu, ou un sujet technique ?`;
    }

    return `DailyOps.Tech, c'est la plateforme sur laquelle vous êtes — une base de connaissances **orientée production** pour les ops, réseau, cyber et infra.

En deux mots : on documente ce qui **tourne vraiment en prod** — playbooks, baselines, retours d'incidents réels — sur six domaines (${domains}). Pas de marketing, pas de théorie creuse : du contenu validé face aux contraintes NOC/SOC.

La plateforme a été lancée par ${t["about.author_name"]}, ingénieur cyber devenu ops full-spectrum, pour partager ce qu'on apprend quand l'indisponibilité n'est pas une option.

Vous voulez qu'on creuse **ce qu'on publie**, **pour qui**, ou un **sujet technique** en particulier ?`;
  }

  if (turns.length > 1 && wantsPublishDetails(last)) {
    return `Specifically, we publish four types of content on DailyOps.Tech:

• **Production-ready guides & playbooks** — network baselines, hardening, cloud checklists, Ansible CI/CD, and more.
• **Real field experience reports** — actual incidents, RCAs, migrations, optimizations.
• **Domain-organized resources**: ${domains}.
• A clear editorial line: document what actually runs in production, validated by NOC/SOC teams.

Interested in BGP, SOC, Kubernetes, or troubleshooting? I can point you to the right guide or dig deeper with you.`;
  }

  if (turns.length > 1 && wantsAudience(last)) {
    return `DailyOps is built for **infrastructure professionals** living production daily — network engineers, security analysts, cloud architects, sysadmins, NOC/SOC teams.

The common thread: people where **downtime isn't an option** — banking, airports, critical infra, regulated environments. Not beginner fluff — deployable, troubleshootable, production-grade content.

What domain are you in? I can steer you to the most relevant resources.`;
  }

  if (turns.length > 1) {
    return `To add context: DailyOps was founded by **${t["about.author_name"]}**, a ${t["about.author_role"].toLowerCase()}, after years in high-stakes environments. The goal — share field playbooks and lessons, not generic docs.

We cover six domains: ${domains}. Everything is meant to be **actionable** in prod.

What interests you most — a specific domain, content type, or technical topic?`;
  }

  return `DailyOps.Tech is the platform you're on — a **production-first knowledge base** for ops, networking, security, and infrastructure.

In short: we document what **actually runs in production** — playbooks, baselines, real incident learnings — across six domains (${domains}). No marketing fluff, no empty theory: content validated against NOC/SOC constraints.

Founded by ${t["about.author_name"]}, a cybersecurity engineer turned full-spectrum ops, to share what you learn when downtime isn't an option.

Want to dig into **what we publish**, **who it's for**, or a **specific technical topic**?`;
}