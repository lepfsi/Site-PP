import { NextResponse } from "next/server";
import { setSessionCookie, verifyMagicLinkToken } from "@/lib/labs-auth";
import { getRemoteLabProgress, saveRemoteLabProgress } from "@/lib/labs-storage";
import { mergeLabProgressStores, type LabProgressStore } from "@/lib/lab-progress";
import { SITE } from "@/lib/site";

// POST kept for optional programmatic callback with local merge payload

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${SITE.url}/labs?auth_error=missing`);
  }

  const email = await verifyMagicLinkToken(token);
  if (!email) {
    return NextResponse.redirect(`${SITE.url}/labs?auth_error=expired`);
  }

  const sessionSet = await setSessionCookie(email);
  if (!sessionSet) {
    return NextResponse.redirect(`${SITE.url}/labs?auth_error=server`);
  }

  return NextResponse.redirect(`${SITE.url}/labs?synced=1`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token as string | undefined;
    const localStore = (body.localStore ?? {}) as LabProgressStore;

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const email = await verifyMagicLinkToken(token);
    if (!email) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const sessionSet = await setSessionCookie(email);
    if (!sessionSet) {
      return NextResponse.json({ error: "Could not create session" }, { status: 500 });
    }

    const remote = await getRemoteLabProgress(email);
    const merged = mergeLabProgressStores(localStore, remote);
    await saveRemoteLabProgress(email, merged);

    return NextResponse.json({ success: true, store: merged });
  } catch (err) {
    console.error("Labs auth callback POST error:", err);
    return NextResponse.json({ error: "Callback failed" }, { status: 500 });
  }
}