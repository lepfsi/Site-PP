import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email";
import { isNewsletterAdminAuthorized } from "@/lib/newsletter-admin";
import { setupNewsletterSegment } from "@/lib/newsletter-segment";

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  if (!isNewsletterAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const skipBackfill = url.searchParams.get("backfill") === "false";

    const result = await setupNewsletterSegment({ backfill: !skipBackfill });

    return NextResponse.json({
      ...result,
      nextSteps: result.envAlreadySet
        ? [
            "RESEND_SEGMENT_ID is already set on this deployment.",
            "New subscribers are added to this segment automatically.",
          ]
        : [
            `Add RESEND_SEGMENT_ID=${result.segmentId} on Vercel (Production + Preview).`,
            "Redeploy, then verify GET /api/email/health shows newsletterSegmentId.",
            "Send newsletters from Resend → Broadcasts targeting this segment.",
          ],
    });
  } catch (err) {
    console.error("Newsletter segment setup error:", err);
    const message = err instanceof Error ? err.message : "Setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}