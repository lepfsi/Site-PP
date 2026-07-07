export const SITE = {
  name: "DailyOps.Tech",
  url: "https://dailyops.tech",
  contactEmail: "contact@dailyops.tech",
  github: "https://github.com/lepfsi/Site-PP",
} as const;

export const SOCIAL_LINKS = [
  { id: "github", href: SITE.github, label: "GitHub" },
  { id: "contact", href: `/about`, label: "Contact" },
  { id: "rss", href: "/feed.xml", label: "RSS" },
] as const;