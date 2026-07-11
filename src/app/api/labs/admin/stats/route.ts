import { NextResponse } from "next/server";
import { maskLabsEmail } from "@/lib/labs-auth";
import { getLabsUserCount, isLabsStorageConfigured, listLabsUsers } from "@/lib/labs-storage";

function isAuthorized(request: Request): boolean {
  const secret = process.env.LABS_ADMIN_SECRET?.trim();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  return url.searchParams.get("key") === secret;
}

export async function GET(request: Request) {
  if (!isLabsStorageConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [count, users] = await Promise.all([getLabsUserCount(), listLabsUsers()]);

  const sorted = users
    .sort((a, b) => b.record.lastSeenAt - a.record.lastSeenAt)
    .map(({ email, record }) => ({
      email: maskLabsEmail(email),
      firstSeenAt: new Date(record.firstSeenAt).toISOString(),
      lastSeenAt: new Date(record.lastSeenAt).toISOString(),
    }));

  return NextResponse.json({
    userCount: count,
    users: sorted,
  });
}