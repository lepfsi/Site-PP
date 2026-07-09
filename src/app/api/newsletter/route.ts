import { NextResponse } from "next/server";
import { subscribeToNewsletter, isEmailConfigured, mapEmailError } from "@/lib/email";

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
    const { email, website, lang } = body;
    validLang = lang === "FR" ? "FR" : "EN";

    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await subscribeToNewsletter(email.trim().toLowerCase(), validLang);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    const raw = err instanceof Error ? err.message : "Failed to subscribe";
    return NextResponse.json(
      { error: mapEmailError(raw, validLang), code: raw },
      { status: 500 }
    );
  }
}