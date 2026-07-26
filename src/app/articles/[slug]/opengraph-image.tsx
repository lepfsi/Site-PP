import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { tEn } from "@/lib/seo";
import type { TranslationKeys } from "@/lib/translations";

export const runtime = "edge";
export const alt = "DailyOps article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article
    ? tEn(article.titleKey as keyof TranslationKeys)
    : "DailyOps.Tech";
  const category = article
    ? tEn(article.categoryLabelKey as keyof TranslationKeys)
    : "Guide";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0A1128 0%, #111C44 55%, #0c1a30 100%)",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#2BD9C5", fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
            DAILYOPS.TECH
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: 2,
              border: "1px solid #334155",
              borderRadius: 8,
              padding: "8px 14px",
            }}
          >
            {category}
          </div>
        </div>
        <div
          style={{
            color: "#f8fafc",
            fontSize: title.length > 70 ? 40 : 48,
            fontWeight: 800,
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ color: "#64748b", fontSize: 20 }}>www.dailyops.tech/articles</div>
      </div>
    ),
    { ...size }
  );
}
