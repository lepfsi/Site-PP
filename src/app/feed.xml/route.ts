import { getAllArticles } from "@/lib/articles";
import { SITE } from "@/lib/site";
import { absoluteUrl, escapeXml, tEn, toRfc822Date } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";

export const dynamic = "force-static";

export async function GET() {
  const articles = [...getAllArticles()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = articles
    .map((article) => {
      const title = tEn(article.titleKey as keyof TranslationKeys);
      const description = tEn(article.excerptKey as keyof TranslationKeys);
      const link = absoluteUrl(`/articles/${article.slug}`);
      const category = tEn(article.categoryLabelKey as keyof TranslationKeys);

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822Date(article.date)}</pubDate>
      <description>${escapeXml(description)}</description>
      <category>${escapeXml(category)}</category>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${escapeXml("Production-ready guides for IT infrastructure professionals — networking, security, cloud and operations.")}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}