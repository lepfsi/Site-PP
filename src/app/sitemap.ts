import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { EXPERIENCES } from "@/lib/experiences";
import { LAB_PATHS } from "@/lib/labs";
import { LOCALES } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/articles",
    "/experience",
    "/about",
    "/resources",
    "/labs",
    "/products",
    "/legal",
    "/privacy",
  ];

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map((p) => ({
      url: absoluteUrl(`/${locale}${p}`),
      lastModified: now,
      changeFrequency: (p === "/articles" ? "daily" : p === "" ? "weekly" : "weekly") as
        | "daily"
        | "weekly",
      priority: p === "" ? 1 : p === "/articles" ? 0.9 : 0.75,
    }))
  );

  const articlePages: MetadataRoute.Sitemap = getAllArticles().flatMap((article) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(`/${locale}/articles/${article.slug}`),
      lastModified: new Date(`${article.date}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: article.featured ? 0.9 : 0.8,
    }))
  );

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.flatMap((cat) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(`/${locale}/category/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const experiencePages: MetadataRoute.Sitemap = EXPERIENCES.flatMap((exp) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(`/${locale}/experience/${exp.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const labPages: MetadataRoute.Sitemap = LAB_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(`/${locale}/labs/${path.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  );

  return [...staticPages, ...articlePages, ...categoryPages, ...experiencePages, ...labPages];
}
