export interface ExperienceCase {
  slug: string;
  id: string;
  titleKey: string;
  descKey: string;
  bodyKey: string;
  footerKey?: string;
  badgeKey?: string;
  tagKeys?: readonly string[];
  readTime?: string;
  views?: string;
  relatedArticleSlug?: string;
  relatedCategory?: string;
}

export const EXPERIENCES: ExperienceCase[] = [
  {
    slug: "bgp-hijacking-15min",
    id: "01",
    titleKey: "exp.1.title",
    descKey: "exp.1.desc",
    bodyKey: "exp.1.body",
    tagKeys: ["exp.1.tag1", "exp.1.tag2", "exp.1.tag3"],
    readTime: "25 min",
    views: "8.2K",
    relatedArticleSlug: "bgp-communities-policy-routing",
    relatedCategory: "networking",
  },
  {
    slug: "aws-migration-500-vms",
    id: "02",
    titleKey: "exp.2.title",
    descKey: "exp.2.desc",
    bodyKey: "exp.2.body",
    tagKeys: ["exp.2.tag1", "exp.2.tag2", "exp.2.tag3"],
    readTime: "30 min",
    views: "12.5K",
    relatedArticleSlug: "terraform-multicloud-patterns",
    relatedCategory: "cloud",
  },
  {
    slug: "kubernetes-latency-optimization",
    id: "03",
    titleKey: "exp.3.title",
    descKey: "exp.3.desc",
    bodyKey: "exp.3.body",
    tagKeys: ["exp.3.tag1", "exp.3.tag2", "exp.3.tag3"],
    readTime: "22 min",
    views: "9.8K",
    relatedArticleSlug: "kubernetes-network-policies",
    relatedCategory: "cloud",
  },
  {
    slug: "bgp-route-leak-provider",
    id: "04",
    titleKey: "exp.4.title",
    descKey: "exp.4.desc",
    bodyKey: "exp.4.body",
    footerKey: "exp.4.footer",
    badgeKey: "exp.badge_incident",
    relatedArticleSlug: "bgp-route-reflection-confederation",
    relatedCategory: "networking",
  },
  {
    slug: "proxmox-ceph-migration",
    id: "05",
    titleKey: "exp.5.title",
    descKey: "exp.5.desc",
    bodyKey: "exp.5.body",
    footerKey: "exp.5.footer",
    badgeKey: "exp.badge_optimization",
    relatedArticleSlug: "proxmox-ha-cluster-guide",
    relatedCategory: "infrastructure",
  },
  {
    slug: "siem-lateral-movement",
    id: "06",
    titleKey: "exp.6.title",
    descKey: "exp.6.desc",
    bodyKey: "exp.6.body",
    footerKey: "exp.6.footer",
    badgeKey: "exp.badge_security",
    relatedArticleSlug: "zero-trust-freeipa-vault",
    relatedCategory: "cybersecurity",
  },
];

export const EXP_HOME_ORDER = ["04", "05", "06", "01", "02", "03"] as const;

export function getExperienceBySlug(slug: string): ExperienceCase | undefined {
  return EXPERIENCES.find((e) => e.slug === slug);
}

export function getExperiencesForHome(): ExperienceCase[] {
  return EXP_HOME_ORDER.map((id) => EXPERIENCES.find((e) => e.id === id)!);
}