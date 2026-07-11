import { NextResponse } from "next/server";
import {
  isNewsletterAdminAuthorized,
  NEWSLETTER_ADMIN_AUTH_HINT,
} from "@/lib/newsletter-admin";
import { createBrandedBroadcastDraft } from "@/lib/newsletter-resend-sync";
import type { Language } from "@/lib/translations";

function parseLang(value: string | null): Language {
  return value === "EN" ? "EN" : "FR";
}

function unauthorized() {
  return NextResponse.json(
    {
      error: "Unauthorized",
      hint: NEWSLETTER_ADMIN_AUTH_HINT,
      statusCheck: "GET /api/newsletter/admin/status with Authorization: Bearer <LABS_ADMIN_SECRET>",
    },
    { status: 401 },
  );
}

/** Creates a Resend broadcast DRAFT with full branded HTML */
export async function POST(request: Request) {
  if (!isNewsletterAdminAuthorized(request)) return unauthorized();

  try {
    const url = new URL(request.url);
    const lang = parseLang(url.searchParams.get("lang"));
    const result = await createBrandedBroadcastDraft(lang);

    return NextResponse.json({
      ...result,
      nextSteps: [
        "Open resendUrl in your browser.",
        "Click Test Email to verify branding.",
        "Edit content if needed, then Send to segment Newsletter DailyOps.",
        "Do NOT paste raw JSON — the draft already contains rendered HTML.",
      ],
    });
  } catch (err) {
    console.error("Newsletter Resend sync error:", err);
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}