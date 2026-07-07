import { NextResponse } from "next/server";
import { subscribeToNewsletter, isEmailConfigured } from "@/lib/email";

export async function POST(request: Request) {
  try {
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email, website, lang } = body;

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

    await subscribeToNewsletter(
      email.trim().toLowerCase(),
      lang === "FR" ? "FR" : "EN"
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to subscribe" },
      { status: 500 }
    );
  }
}