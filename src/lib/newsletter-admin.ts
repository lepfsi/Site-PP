import { timingSafeEqual } from "crypto";

function safeEqual(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export function getConfiguredAdminSecrets(): string[] {
  const values = [
    process.env.LABS_ADMIN_SECRET,
    process.env.NEWSLETTER_ADMIN_SECRET,
    process.env.NEWSLETTER_SETUP_SECRET,
  ];

  return [...new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value)))];
}

export function isAdminSecretConfigured(): boolean {
  return getConfiguredAdminSecrets().length > 0;
}

function extractCredential(request: Request): string | null {
  const auth = request.headers.get("authorization")?.trim();
  if (auth) {
    const lower = auth.toLowerCase();
    if (lower.startsWith("bearer ")) return auth.slice(7).trim();
    return auth;
  }

  const headerKey = request.headers.get("x-admin-key")?.trim();
  if (headerKey) return headerKey;

  const url = new URL(request.url);
  const raw = url.searchParams.get("key");
  if (!raw) return null;

  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

export function isNewsletterAdminAuthorized(request: Request): boolean {
  const secrets = getConfiguredAdminSecrets();
  if (!secrets.length) return false;

  const provided = extractCredential(request);
  if (!provided) return false;

  return secrets.some((secret) => safeEqual(provided, secret));
}

export const NEWSLETTER_ADMIN_AUTH_HINT =
  "Use header Authorization: Bearer <secret> (recommended). Vercel env var is LABS_ADMIN_SECRET — not LABS_SECRET. URL ?key= breaks if the secret contains / or =.";