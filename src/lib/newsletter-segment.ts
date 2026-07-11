import { Resend } from "resend";

export const NEWSLETTER_SEGMENT_NAME = "Newsletter DailyOps";

export type BackfillResult = {
  added: number;
  skipped: number;
  failed: number;
};

export type SetupNewsletterSegmentResult = {
  segmentId: string;
  segmentCreated: boolean;
  envAlreadySet: boolean;
  backfill: BackfillResult;
};

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(apiKey);
}

function isAlreadyInSegmentError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("already") || lower.includes("duplicate");
}

export async function ensureNewsletterSegment(): Promise<{
  segmentId: string;
  segmentCreated: boolean;
  envAlreadySet: boolean;
}> {
  const configuredId =
    process.env.RESEND_SEGMENT_ID?.trim() ??
    process.env.RESEND_AUDIENCE_ID?.trim() ??
    null;

  if (configuredId) {
    return {
      segmentId: configuredId,
      segmentCreated: false,
      envAlreadySet: true,
    };
  }

  const resend = getResend();
  const { data: segments, error: listError } = await resend.segments.list({ limit: 100 });

  if (listError) throw new Error(listError.message);

  const existing = segments?.data?.find(
    (segment) => segment.name?.toLowerCase() === NEWSLETTER_SEGMENT_NAME.toLowerCase(),
  );

  if (existing?.id) {
    return {
      segmentId: existing.id,
      segmentCreated: false,
      envAlreadySet: false,
    };
  }

  const { data: created, error: createError } = await resend.segments.create({
    name: NEWSLETTER_SEGMENT_NAME,
  });

  if (createError) throw new Error(createError.message);
  if (!created?.id) throw new Error("Segment created but no id returned");

  return {
    segmentId: created.id,
    segmentCreated: true,
    envAlreadySet: false,
  };
}

export async function backfillContactsToSegment(segmentId: string): Promise<BackfillResult> {
  const resend = getResend();
  const result: BackfillResult = { added: 0, skipped: 0, failed: 0 };

  let after: string | undefined;
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
        result.skipped += 1;
        continue;
      }

      const { error: addError } = await resend.contacts.segments.add({
        email: contact.email,
        segmentId,
      });

      if (addError) {
        if (isAlreadyInSegmentError(addError.message)) {
          result.skipped += 1;
        } else {
          result.failed += 1;
        }
        continue;
      }

      result.added += 1;
    }

    hasMore = data?.has_more ?? false;
    after = contacts.at(-1)?.id;

    if (!after) hasMore = false;
  }

  return result;
}

export async function setupNewsletterSegment(options?: {
  backfill?: boolean;
}): Promise<SetupNewsletterSegmentResult> {
  const { segmentId, segmentCreated, envAlreadySet } = await ensureNewsletterSegment();
  const backfill =
    options?.backfill === false
      ? { added: 0, skipped: 0, failed: 0 }
      : await backfillContactsToSegment(segmentId);

  return {
    segmentId,
    segmentCreated,
    envAlreadySet,
    backfill,
  };
}