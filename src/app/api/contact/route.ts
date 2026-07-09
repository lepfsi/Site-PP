import { NextResponse } from "next/server";
import { sendContactEmail, isEmailConfigured, mapEmailError } from "@/lib/email";

export async function POST(request: Request) {
  let validLang: "EN" | "FR" = "EN";

  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website, lang } = body;
    validLang = lang === "FR" ? "FR" : "EN";

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    const raw = err instanceof Error ? err.message : "Failed to send message";
    return NextResponse.json(
      { error: mapEmailError(raw, validLang), code: raw },
      { status: 500 }
    );
  }
}