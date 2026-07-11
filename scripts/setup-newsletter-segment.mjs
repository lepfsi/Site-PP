import { Resend } from "resend";

const SEGMENT_NAME = "Newsletter DailyOps";

function requireApiKey() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY. Example:");
    console.error('  $env:RESEND_API_KEY="re_..." ; node scripts/setup-newsletter-segment.mjs');
    process.exit(1);
  }
  return apiKey;
}

function isAlreadyInSegmentError(message) {
  const lower = message.toLowerCase();
  return lower.includes("already") || lower.includes("duplicate");
}

async function ensureSegment(resend) {
  const configuredId =
    process.env.RESEND_SEGMENT_ID?.trim() ??
    process.env.RESEND_AUDIENCE_ID?.trim() ??
    null;

  if (configuredId) {
    return { segmentId: configuredId, created: false, fromEnv: true };
  }

  const { data: segments, error: listError } = await resend.segments.list({ limit: 100 });
  if (listError) throw new Error(listError.message);

  const existing = segments?.data?.find(
    (segment) => segment.name?.toLowerCase() === SEGMENT_NAME.toLowerCase(),
  );

  if (existing?.id) {
    return { segmentId: existing.id, created: false, fromEnv: false };
  }

  const { data: created, error: createError } = await resend.segments.create({
    name: SEGMENT_NAME,
  });

  if (createError) throw new Error(createError.message);
  if (!created?.id) throw new Error("Segment created but no id returned");

  return { segmentId: created.id, created: true, fromEnv: false };
}

async function backfill(resend, segmentId) {
  const stats = { added: 0, skipped: 0, failed: 0 };
  let after;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await resend.contacts.list({
      limit: 100,
      ...(after ? { after } : {}),
    });

    if (error) throw new Error(error.message);

    const contacts = data?.data ?? [];

    for (const contact of contacts) {
      if (contact.unsubscribed) {
        stats.skipped += 1;
        continue;
      }

      const { error: addError } = await resend.contacts.segments.add({
        email: contact.email,
        segmentId,
      });

      if (addError) {
        if (isAlreadyInSegmentError(addError.message)) stats.skipped += 1;
        else stats.failed += 1;
        continue;
      }

      stats.added += 1;
    }

    hasMore = data?.has_more ?? false;
    after = contacts.at(-1)?.id;
    if (!after) hasMore = false;
  }

  return stats;
}

const resend = new Resend(requireApiKey());
const skipBackfill = process.argv.includes("--no-backfill");

const { segmentId, created, fromEnv } = await ensureSegment(resend);
const backfillStats = skipBackfill
  ? { added: 0, skipped: 0, failed: 0 }
  : await backfill(resend, segmentId);

console.log("");
console.log("Newsletter segment ready");
console.log(`  name:      ${SEGMENT_NAME}`);
console.log(`  id:        ${segmentId}`);
console.log(`  created:   ${created ? "yes" : "no"}`);
console.log(`  from env:  ${fromEnv ? "yes" : "no"}`);
console.log(`  backfill:  +${backfillStats.added} added, ${backfillStats.skipped} skipped, ${backfillStats.failed} failed`);
console.log("");

if (!fromEnv) {
  console.log("Next: add on Vercel (Production + Preview), then redeploy:");
  console.log(`  RESEND_SEGMENT_ID=${segmentId}`);
}