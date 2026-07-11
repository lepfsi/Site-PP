import { Redis } from "@upstash/redis";
import type { LabProgressStore } from "./lab-progress";
import { normalizeLabsEmail } from "./labs-auth";

let redis: Redis | null = null;

export function isLabsStorageConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

function getRedis(): Redis | null {
  if (!isLabsStorageConfigured()) return null;
  if (!redis) {
    redis = Redis.fromEnv();
  }
  return redis;
}

const USERS_INDEX_KEY = "labs:users";

export interface LabsUserRecord {
  firstSeenAt: number;
  lastSeenAt: number;
}

function progressKey(email: string): string {
  return `labs:progress:${normalizeLabsEmail(email)}`;
}

export async function registerLabsUser(email: string): Promise<void> {
  const client = getRedis();
  if (!client) return;

  const key = normalizeLabsEmail(email);
  const now = Date.now();
  const existing = await client.hget<LabsUserRecord>(USERS_INDEX_KEY, key);

  const record: LabsUserRecord = {
    firstSeenAt: existing?.firstSeenAt ?? now,
    lastSeenAt: now,
  };

  await client.hset(USERS_INDEX_KEY, { [key]: record });
}

export async function getLabsUserCount(): Promise<number> {
  const client = getRedis();
  if (!client) return 0;
  return client.hlen(USERS_INDEX_KEY);
}

export async function listLabsUsers(): Promise<{ email: string; record: LabsUserRecord }[]> {
  const client = getRedis();
  if (!client) return [];

  const all = await client.hgetall<Record<string, LabsUserRecord>>(USERS_INDEX_KEY);
  if (!all) return [];

  return Object.entries(all).map(([email, record]) => ({
    email,
    record: record ?? { firstSeenAt: 0, lastSeenAt: 0 },
  }));
}

export async function getRemoteLabProgress(email: string): Promise<LabProgressStore> {
  const client = getRedis();
  if (!client) return {};

  const data = await client.get<LabProgressStore>(progressKey(email));
  if (!data || typeof data !== "object") return {};
  return data;
}

export async function saveRemoteLabProgress(email: string, store: LabProgressStore): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.set(progressKey(email), store);
}

export function getLabsSyncStatus() {
  return {
    authConfigured: Boolean(process.env.LABS_AUTH_SECRET?.trim() || process.env.RESEND_API_KEY?.trim()),
    storageConfigured: isLabsStorageConfigured(),
  };
}