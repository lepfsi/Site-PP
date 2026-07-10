import { NextResponse } from "next/server";
import { getEmailStatus, isEmailConfigured } from "@/lib/email";

export async function GET() {
  const status = getEmailStatus();

  const usingTestSender = status.from.includes("resend.dev");

  const hints: string[] = [];

  if (usingTestSender) {
    hints.push(
      `Set RESEND_FROM_EMAIL to an address @${status.domain} (verified in Resend).`,
    );
  }

  if (status.notifyUsesPublicContact) {
    hints.push(
      "Set NOTIFY_EMAIL to a mailbox you read (e.g. your Gmail) so contact/chat notifications arrive.",
    );
  }

  if (!status.newsletterSegmentId) {
    hints.push(
      "Subscribers are saved in Resend → Contacts. Add RESEND_SEGMENT_ID to group them for broadcasts.",
    );
  }

  return NextResponse.json({
    ...status,
    usingTestSender,
    stagingHint: hints.length ? hints.join(" ") : null,
  });
}