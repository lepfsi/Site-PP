import type { CategorySlug } from "./categories";

export type ArticleFormat = "i18n" | "markdown";

export interface Article {
  slug: string;
  category: CategorySlug;
  titleKey: string;
  excerptKey: string;
  bodyKey?: string;
  categoryLabelKey: string;
  readTime: string;
  date: string;
  color: string;
  bg: string;
  featured?: boolean;
  format?: ArticleFormat;
}

export const ARTICLES: Article[] = [
  {
    slug: "prometheus-grafana-production-stack",
    category: "observability",
    titleKey: "articles.14.title",
    excerptKey: "articles.14.excerpt",
    categoryLabelKey: "articles.14.category",
    readTime: "14 min",
    date: "2026-07-10",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    format: "markdown",
  },
  {
    slug: "ai-ops-assistant-production",
    category: "ai",
    titleKey: "articles.15.title",
    excerptKey: "articles.15.excerpt",
    categoryLabelKey: "articles.15.category",
    readTime: "12 min",
    date: "2026-07-10",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    format: "markdown",
  },
  {
    slug: "ansible-cicd-pipeline",
    category: "automation",
    titleKey: "articles.8.title",
    excerptKey: "articles.8.excerpt",
    categoryLabelKey: "articles.8.category",
    readTime: "16 min",
    date: "2026-01-20",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    format: "markdown",
  },
  {
    slug: "vlan-trunking-runbook",
    category: "networking",
    titleKey: "articles.9.title",
    excerptKey: "articles.9.excerpt",
    categoryLabelKey: "articles.9.category",
    readTime: "12 min",
    date: "2026-02-01",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    format: "markdown",
  },
  {
    slug: "soc-incident-response-playbook",
    category: "cybersecurity",
    titleKey: "articles.10.title",
    excerptKey: "articles.10.excerpt",
    categoryLabelKey: "articles.10.category",
    readTime: "14 min",
    date: "2026-02-03",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    format: "markdown",
  },
  {
    slug: "linux-hardening-baseline",
    category: "infrastructure",
    titleKey: "articles.11.title",
    excerptKey: "articles.11.excerpt",
    categoryLabelKey: "articles.11.category",
    readTime: "15 min",
    date: "2026-02-05",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    format: "markdown",
  },
  {
    slug: "eks-production-checklist",
    category: "cloud",
    titleKey: "articles.12.title",
    excerptKey: "articles.12.excerpt",
    categoryLabelKey: "articles.12.category",
    readTime: "13 min",
    date: "2026-02-07",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    format: "markdown",
  },
  {
    slug: "packet-loss-diagnosis",
    category: "troubleshooting",
    titleKey: "articles.13.title",
    excerptKey: "articles.13.excerpt",
    categoryLabelKey: "articles.13.category",
    readTime: "11 min",
    date: "2026-02-09",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    format: "markdown",
  },
  {
    slug: "bgp-communities-policy-routing",
    category: "networking",
    titleKey: "articles.featured.title",
    excerptKey: "articles.featured.excerpt",
    bodyKey: "articles.featured.body",
    categoryLabelKey: "articles.featured.category",
    readTime: "15 min",
    date: "2025-01-15",
    color: "text-blue-500",
    bg: "bg-blue-500/20",
    featured: true,
  },
  {
    slug: "zero-trust-freeipa-vault",
    category: "cybersecurity",
    titleKey: "articles.1.title",
    excerptKey: "articles.1.excerpt",
    bodyKey: "articles.1.body",
    categoryLabelKey: "articles.1.category",
    readTime: "12 min",
    date: "2025-01-12",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    slug: "terraform-multicloud-patterns",
    category: "cloud",
    titleKey: "articles.4.title",
    excerptKey: "articles.4.excerpt",
    bodyKey: "articles.4.body",
    categoryLabelKey: "articles.4.category",
    readTime: "18 min",
    date: "2025-01-10",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    slug: "ospf-neighbor-init-diagnosis",
    category: "troubleshooting",
    titleKey: "articles.5.title",
    excerptKey: "articles.5.excerpt",
    bodyKey: "articles.5.body",
    categoryLabelKey: "articles.5.category",
    readTime: "8 min",
    date: "2025-01-08",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    slug: "proxmox-ha-cluster-guide",
    category: "infrastructure",
    titleKey: "articles.6.title",
    excerptKey: "articles.6.excerpt",
    bodyKey: "articles.6.body",
    categoryLabelKey: "articles.6.category",
    readTime: "20 min",
    date: "2025-01-05",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    slug: "wireguard-enterprise-deployment",
    category: "networking",
    titleKey: "articles.7.title",
    excerptKey: "articles.7.excerpt",
    bodyKey: "articles.7.body",
    categoryLabelKey: "articles.7.category",
    readTime: "14 min",
    date: "2025-01-03",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    slug: "kubernetes-network-policies",
    category: "cloud",
    titleKey: "articles.2.title",
    excerptKey: "articles.2.excerpt",
    bodyKey: "articles.2.body",
    categoryLabelKey: "articles.2.category",
    readTime: "10 min",
    date: "2024-12-28",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    slug: "bgp-route-reflection-confederation",
    category: "networking",
    titleKey: "articles.3.title",
    excerptKey: "articles.3.excerpt",
    bodyKey: "articles.3.body",
    categoryLabelKey: "articles.3.category",
    readTime: "20 min",
    date: "2024-12-15",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: CategorySlug): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getFeaturedArticle(): Article {
  return ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
}

export function getRecentArticles(limit = 6): Article[] {
  return ARTICLES.filter((a) => !a.featured).slice(0, limit);
}

export function getAllArticles(): Article[] {
  return ARTICLES;
}