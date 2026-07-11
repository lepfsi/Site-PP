import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  getSessionEmail,
  maskLabsEmail,
  isLabsAuthConfigured,
} from "@/lib/labs-auth";
import { isLabsStorageConfigured } from "@/lib/labs-storage";

export async function GET() {
  const configured = isLabsAuthConfigured() && isLabsStorageConfigured();
  const email = await getSessionEmail();

  return NextResponse.json({
    configured,
    authenticated: Boolean(email),
    email: email ? maskLabsEmail(email) : null,
  });
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}