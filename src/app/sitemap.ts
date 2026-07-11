import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { EXPERIENCES } from "@/lib/experiences";
import { LAB_PATHS } from "@/lib/labs";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/articles"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/experience"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/resources"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/labs"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/legal"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: new Date(`${article.date}T12:00:00Z`),
    changeFrequency: "monthly",
    priority: article.featured ? 0.9 : 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: absoluteUrl(`/category/${cat.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const experiencePages: MetadataRoute.Sitemap = EXPERIENCES.map((exp) => ({
    url: absoluteUrl(`/experience/${exp.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const labPages: MetadataRoute.Sitemap = LAB_PATHS.map((path) => ({
    url: absoluteUrl(`/labs/${path.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticPages, ...articlePages, ...categoryPages, ...experiencePages, ...labPages];
}