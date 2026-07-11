import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { Language } from "./translations";

export const LABS_SESSION_COOKIE = "dailyops-labs-session";
const MAGIC_TTL_SEC = 15 * 60;
const SESSION_TTL_SEC = 30 * 24 * 60 * 60;

function getAuthSecret(): Uint8Array | null {
  const secret = process.env.LABS_AUTH_SECRET?.trim() || process.env.RESEND_API_KEY?.trim();
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function isLabsAuthConfigured(): boolean {
  return Boolean(getAuthSecret());
}

export function normalizeLabsEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function maskLabsEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.length <= 2 ? local[0] ?? "*" : `${local.slice(0, 2)}***`;
  return `${visible}@${domain}`;
}

export async function createMagicLinkToken(email: string): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  return new SignJWT({ purpose: "labs-magic", email: normalizeLabsEmail(email) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_TTL_SEC}s`)
    .sign(secret);
}

export async function verifyMagicLinkToken(token: string): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "labs-magic" || typeof payload.email !== "string") return null;
    return normalizeLabsEmail(payload.email);
  } catch {
    return null;
  }
}

export async function createSessionToken(email: string): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  return new SignJWT({ purpose: "labs-session", email: normalizeLabsEmail(email) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const secret = getAuthSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== "labs-session" || typeof payload.email !== "string") return null;
    return normalizeLabsEmail(payload.email);
  } catch {
    return null;
  }
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(LABS_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(email: string): Promise<boolean> {
  const token = await createSessionToken(email);
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(LABS_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL_SEC,
    path: "/",
  });

  return true;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(LABS_SESSION_COOKIE);
}

export function isValidLabsEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export type LabsAuthLang = Language;