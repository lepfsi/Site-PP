import { NextResponse } from "next/server";
import { isEmailConfigured, sendChatEscalationEmail, mapEmailError } from "@/lib/email";

export async function POST(request: Request) {
  let validLang: "EN" | "FR" = "EN";

  try {
    if (!isEmailConfigured()) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { visitorEmail, visitorName, summary, transcript, lang, website } = body;
    validLang = lang === "FR" ? "FR" : "EN";

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!visitorEmail?.trim() || !summary?.trim()) {
      return NextResponse.json({ error: "Email and summary required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(visitorEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await sendChatEscalationEmail({
      visitorEmail: visitorEmail.trim(),
      visitorName: visitorName?.trim(),
      summary: summary.trim().slice(0, 2000),
      transcript: String(transcript ?? "").slice(0, 8000),
      lang: validLang,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chat escalate error:", err);
    const raw = err instanceof Error ? err.message : "Escalation failed";
    return NextResponse.json(
      { error: mapEmailError(raw, validLang), code: raw },
      { status: 500 },
    );
  }
}