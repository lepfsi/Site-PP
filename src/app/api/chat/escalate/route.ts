import { NextResponse } from "next/server";
import { isEmailConfigured, sendChatEscalationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
    }

    const body = await request.json();
    const { visitorEmail, visitorName, summary, transcript, lang, website } = body;

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
      lang: lang === "FR" ? "FR" : "EN",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Chat escalate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Escalation failed" },
      { status: 500 },
    );
  }
}