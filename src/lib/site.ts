export const SITE = {
  name: "DailyOps.Tech",
  url: "https://dailyops.tech",
  contactEmail: "contact@dailyops.tech",
  github: "https://github.com/lepfsi/Site-PP",
  linkedin: "https://www.linkedin.com/company/dailyops-tech/",
  x: "https://x.com/DailyOpsTech",
  facebook: "https://www.facebook.com/share/1DWHkEdQH/",
  kofi: process.env.NEXT_PUBLIC_KOFI_URL ?? "https://ko-fi.com/dailyops",
} as const;

export type SocialId = "linkedin" | "x" | "github" | "facebook" | "rss";

export const SOCIAL_LINKS: { id: SocialId; href: string; label: string; external?: boolean }[] = [
  { id: "linkedin", href: SITE.linkedin, label: "LinkedIn", external: true },
  { id: "x", href: SITE.x, label: "X", external: true },
  { id: "facebook", href: SITE.facebook, label: "Facebook", external: true },
  { id: "github", href: SITE.github, label: "GitHub", external: true },
  { id: "rss", href: "/feed.xml", label: "RSS" },
];