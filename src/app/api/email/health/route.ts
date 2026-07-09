import { NextResponse } from "next/server";
import { getEmailStatus, isEmailConfigured } from "@/lib/email";

export async function GET() {
  const status = getEmailStatus();

  const usingTestSender = status.from.includes("resend.dev");

  return NextResponse.json({
    ...status,
    usingTestSender,
    stagingHint: usingTestSender
      ? `Set RESEND_FROM_EMAIL to an address @${status.domain} (verified in Resend). Test mode only allows sending to your Resend account email.`
      : null,
  });
}