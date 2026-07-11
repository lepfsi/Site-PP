import { NextResponse } from "next/server";
import type { NewsletterEditionInput } from "@/lib/email-templates";
import { isNewsletterAdminAuthorized } from "@/lib/newsletter-admin";
import {
  buildNewsletterEditionFromInput,
  buildSampleNewsletterEdition,
} from "@/lib/newsletter-edition";
import type { Language } from "@/lib/translations";

function parseLang(value: string | null): Language {
  return value === "FR" ? "FR" : "EN";
}

function usageNotes(lang: Language): string[] {
  if (lang === "FR") {
    return [
      "Resend → Broadcasts → New → coller le HTML (mode Custom HTML / Import).",
      "Conserver {{{RESEND_UNSUBSCRIBE_URL}}} dans le footer — géré par Resend.",
      "Audience : segment Newsletter DailyOps.",
      "Tester avec Test Email avant envoi.",
    ];
  }

  return [
    "Resend → Broadcasts → New → paste HTML (Custom HTML / Import mode).",
    "Keep {{{RESEND_UNSUBSCRIBE_URL}}} in the footer — Resend handles unsubscribe.",
    "Audience: Newsletter DailyOps segment.",
    "Send a Test Email before going live.",
  ];
}

export async function GET(request: Request) {
  if (!isNewsletterAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const lang = parseLang(url.searchParams.get("lang"));
  const format = url.searchParams.get("format");
  const slugs = url.searchParams.get("articles")?.split(",").map((s) => s.trim()).filter(Boolean);

  const { subject, html, edition } = buildSampleNewsletterEdition(lang, {
    articleSlugs: slugs,
  });

  if (format === "html") {
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({
    subject,
    html,
    edition,
    usage: usageNotes(lang),
    previewUrl: `${url.origin}/api/newsletter/admin/template?key=[secret]&lang=${lang}&format=html`,
  });
}

export async function POST(request: Request) {
  if (!isNewsletterAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format");
    const body = (await request.json()) as Partial<NewsletterEditionInput>;

    if (!body.lang || !body.editionLabel || !body.title || !body.introHtml || !body.articles?.length) {
      return NextResponse.json(
        {
          error:
            "Required: lang, editionLabel, title, introHtml, articles (non-empty). Optional: preheader, tipHtml, cta.",
        },
        { status: 400 },
      );
    }

    const edition: NewsletterEditionInput = {
      lang: body.lang,
      editionLabel: body.editionLabel,
      preheader: body.preheader ?? "",
      title: body.title,
      introHtml: body.introHtml,
      articles: body.articles,
      tipHtml: body.tipHtml,
      cta: body.cta,
    };

    const { subject, html } = buildNewsletterEditionFromInput(edition);

    if (format === "html") {
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return NextResponse.json({
      subject,
      html,
      edition,
      usage: usageNotes(edition.lang),
    });
  } catch (err) {
    console.error("Newsletter template error:", err);
    const message = err instanceof Error ? err.message : "Template generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}