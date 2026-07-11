import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/labs-auth";
import {
  getRemoteLabProgress,
  isLabsStorageConfigured,
  registerLabsUser,
  saveRemoteLabProgress,
} from "@/lib/labs-storage";
import {
  mergeLabProgressStores,
  type LabProgressStore,
} from "@/lib/lab-progress";

export async function GET() {
  if (!isLabsStorageConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const store = await getRemoteLabProgress(email);
  return NextResponse.json({ store });
}

export async function PUT(request: Request) {
  if (!isLabsStorageConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const incoming = (body.store ?? {}) as LabProgressStore;

    if (!incoming || typeof incoming !== "object") {
      return NextResponse.json({ error: "Invalid store" }, { status: 400 });
    }

    const remote = await getRemoteLabProgress(email);
    const merged = mergeLabProgressStores(remote, incoming);
    await saveRemoteLabProgress(email, merged);
    await registerLabsUser(email);

    return NextResponse.json({ success: true, store: merged });
  } catch (err) {
    console.error("Labs progress PUT error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}