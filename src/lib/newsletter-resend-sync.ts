import { Resend } from "resend";
import { FROM_EMAIL, isEmailConfigured, NEWSLETTER_SEGMENT_ID } from "./email";
import { buildSampleNewsletterEdition } from "./newsletter-edition";
import type { Language } from "./translations";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(apiKey);
}

export async function createBrandedBroadcastDraft(lang: Language = "FR") {
  if (!isEmailConfigured()) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!NEWSLETTER_SEGMENT_ID) {
    throw new Error("RESEND_SEGMENT_ID is not configured on Vercel");
  }

  const { subject, html, edition } = buildSampleNewsletterEdition(lang);
  const resend = getResend();
  const dateLabel = edition.editionLabel.replace("OPS MAIL · ", "");

  const { data, error } = await resend.broadcasts.create({
    name: `Ops Mail — ${dateLabel}`,
    from: FROM_EMAIL,
    subject,
    html,
    previewText: edition.preheader,
    segmentId: NEWSLETTER_SEGMENT_ID,
    send: false,
  });

  if (error) throw new Error(error.message);
  if (!data?.id) throw new Error("Broadcast draft created but no id returned");

  return {
    broadcastId: data.id,
    subject,
    resendUrl: `https://resend.com/broadcasts/${data.id}`,
    message:
      lang === "FR"
        ? "Brouillon créé dans Resend avec le HTML brandé. Ouvrez le lien, vérifiez le rendu, puis envoyez."
        : "Draft created in Resend with branded HTML. Open the link, verify rendering, then send.",
  };
}