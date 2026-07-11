import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildLabsMagicLinkEmail } from "@/lib/email-templates";
import { FROM_EMAIL, isEmailConfigured } from "@/lib/email";
import {
  createMagicLinkToken,
  isLabsAuthConfigured,
  isValidLabsEmail,
  normalizeLabsEmail,
  type LabsAuthLang,
} from "@/lib/labs-auth";
import { isLabsStorageConfigured } from "@/lib/labs-storage";
import { SITE } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  let lang: LabsAuthLang = "EN";

  try {
    if (!isLabsAuthConfigured() || !isLabsStorageConfigured() || !isEmailConfigured() || !resend) {
      return NextResponse.json(
        { error: "Labs sync is not configured on the server." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, website } = body;
    lang = body.lang === "FR" ? "FR" : "EN";

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!email?.trim() || !isValidLabsEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const normalized = normalizeLabsEmail(email);
    const token = await createMagicLinkToken(normalized);
    if (!token) {
      return NextResponse.json({ error: "Could not create sign-in link" }, { status: 500 });
    }

    const magicUrl = `${SITE.url}/api/labs/auth/callback?token=${encodeURIComponent(token)}`;
    const mail = buildLabsMagicLinkEmail(lang, normalized, magicUrl);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: normalized,
      subject: mail.subject,
      html: mail.html,
    });

    if (error) {
      console.error("Labs magic link error:", error);
      return NextResponse.json({ error: "Failed to send sign-in email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Labs auth request error:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}