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

function progressKey(email: string): string {
  return `labs:progress:${normalizeLabsEmail(email)}`;
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