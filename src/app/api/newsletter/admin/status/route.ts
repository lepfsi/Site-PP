import { NextResponse } from "next/server";
import { getEmailStatus, isEmailConfigured, NEWSLETTER_SEGMENT_ID } from "@/lib/email";
import {
  isAdminSecretConfigured,
  isNewsletterAdminAuthorized,
  NEWSLETTER_ADMIN_AUTH_HINT,
} from "@/lib/newsletter-admin";

export async function GET(request: Request) {
  const authorized = isNewsletterAdminAuthorized(request);
  const emailStatus = getEmailStatus();

  const payload = {
    adminSecretConfigured: isAdminSecretConfigured(),
    resendConfigured: isEmailConfigured(),
    segmentConfigured: Boolean(NEWSLETTER_SEGMENT_ID),
    newsletterSegmentId: emailStatus.newsletterSegmentId,
    previewUrl: `${new URL(request.url).origin}/api/newsletter/preview?lang=FR`,
    authHint: NEWSLETTER_ADMIN_AUTH_HINT,
    authorized,
  };

  return NextResponse.json({
    ...payload,
    ...(authorized
      ? {
          syncEndpoint: "POST /api/newsletter/admin/sync-resend",
          templateEndpoint: "GET /api/newsletter/admin/template?lang=FR",
        }
      : {
          howToAuth: [
            '$h=@{Authorization="Bearer TON_LABS_ADMIN_SECRET"}',
            'Invoke-RestMethod -Uri "https://www.dailyops.tech/api/newsletter/admin/sync-resend" -Method POST -Headers $h',
            "Vercel env var: LABS_ADMIN_SECRET (not LABS_SECRET).",
          ],
        }),
  });
}