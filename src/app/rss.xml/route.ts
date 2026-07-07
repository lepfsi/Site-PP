import { rssResponse } from "@/lib/feed";

export const revalidate = 3600;

export async function GET() {
  return rssResponse();
}