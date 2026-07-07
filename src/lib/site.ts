export const SITE = {
  name: "DailyOps.Tech",
  url: "https://dailyops.tech",
  contactEmail: "contact@dailyops.tech",
  github: "https://github.com/lepfsi/Site-PP",
} as const;

export type SocialId = "linkedin" | "github" | "x" | "facebook" | "rss";

export const SOCIAL_LINKS: { id: SocialId; href: string; label: string; external?: boolean }[] = [
  { id: "linkedin", href: "/about", label: "LinkedIn" },
  { id: "github", href: SITE.github, label: "GitHub", external: true },
  { id: "x", href: "/about", label: "X" },
  { id: "facebook", href: "/about", label: "Facebook" },
  { id: "rss", href: "/feed.xml", label: "RSS" },
];