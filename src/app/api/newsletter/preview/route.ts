import { NextResponse } from "next/server";
import { buildSampleNewsletterEdition } from "@/lib/newsletter-edition";
import type { Language } from "@/lib/translations";

function parseLang(value: string | null): Language {
  return value === "EN" ? "EN" : "FR";
}

/** Public branded preview — no auth required */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const lang = parseLang(url.searchParams.get("lang"));
  const { html } = buildSampleNewsletterEdition(lang);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}