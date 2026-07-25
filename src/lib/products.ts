/**
 * DailyOps product suite catalog.
 * House = knowledge (Site-PP). Software products grow toward a security platform.
 */

export type ProductStatus = "live" | "early_access" | "prototype" | "planned";

export type ProductTier = "software" | "platform" | "roadmap";

export interface ProductEntry {
  id: string;
  tier: ProductTier;
  status: ProductStatus;
  name: string;
  /** Anchor for /products#id */
  href: string;
  /** Primary CTA destination */
  ctaHref: string;
  secondaryHref?: string;
  github?: string;
  articleSlug?: string;
}

/** Software products (Ops* suite) */
export const SOFTWARE_PRODUCTS: ProductEntry[] = [
  {
    id: "opsgate",
    tier: "software",
    status: "early_access",
    name: "OpsGate",
    href: "/products#opsgate",
    ctaHref: "/about#contact",
    secondaryHref: "/articles/genai-dlp-sensitive-data-leaks",
    github: "https://github.com/lepfsi/ops-gate",
    articleSlug: "genai-dlp-sensitive-data-leaks",
  },
  {
    id: "opsvault",
    tier: "software",
    status: "prototype",
    name: "OpsVault",
    href: "/products#opsvault",
    ctaHref: "/about#contact",
    github: "https://github.com/lepfsi/ops-vault",
  },
];

/** Free platform surfaces under DailyOps.Tech */
export const PLATFORM_PRODUCTS: ProductEntry[] = [
  {
    id: "hub",
    tier: "platform",
    status: "live",
    name: "DailyOps Hub",
    href: "/products#platform",
    ctaHref: "/articles",
  },
  {
    id: "labs",
    tier: "platform",
    status: "live",
    name: "Ops Labs",
    href: "/products#platform",
    ctaHref: "/labs",
  },
  {
    id: "opsmail",
    tier: "platform",
    status: "live",
    name: "Ops Mail",
    href: "/products#platform",
    ctaHref: "/#newsletter",
  },
];

/** Future suite — shown soft, not sold yet */
export const ROADMAP_PRODUCTS: ProductEntry[] = [
  {
    id: "opsaudit",
    tier: "roadmap",
    status: "planned",
    name: "OpsAudit",
    href: "/products#roadmap",
    ctaHref: "/about#contact",
  },
  {
    id: "opsinsight",
    tier: "roadmap",
    status: "planned",
    name: "OpsInsight",
    href: "/products#roadmap",
    ctaHref: "/about#contact",
  },
];

export const ALL_PRODUCTS = [
  ...SOFTWARE_PRODUCTS,
  ...PLATFORM_PRODUCTS,
  ...ROADMAP_PRODUCTS,
] as const;
