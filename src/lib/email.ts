import { Resend } from "resend";
import { buildNewsletterWelcomeEmail } from "./email-templates";
import type { Language } from "./translations";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/** Verified Resend sending domain (subdomain) */
export const RESEND_DOMAIN = process.env.RESEND_DOMAIN ?? "news.dailyops.tech";

export const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@dailyops.tech";

/** Inbox that receives contact, chat, and newsletter admin notifications */
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? CONTACT_EMAIL;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? `DailyOps <noreply@${RESEND_DOMAIN}>`;

/** Resend Segment (or legacy Audience) for newsletter subscribers */
export const NEWSLETTER_SEGMENT_ID =
  process.env.RESEND_SEGMENT_ID ?? process.env.RESEND_AUDIENCE_ID ?? null;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getEmailStatus() {
  return {
    configured: isEmailConfigured(),
    from: FROM_EMAIL,
    domain: RESEND_DOMAIN,
    contactEmail: CONTACT_EMAIL,
    notifyEmail: NOTIFY_EMAIL,
    newsletterSegmentId: NEWSLETTER_SEGMENT_ID,
    audienceId: process.env.RESEND_AUDIENCE_ID ?? null,
    segmentId: process.env.RESEND_SEGMENT_ID ?? null,
    contactsStoredIn: "resend",
    usingDefaultFrom: !process.env.RESEND_FROM_EMAIL,
    notifyUsesPublicContact: NOTIFY_EMAIL === CONTACT_EMAIL,
  };
}

export function mapEmailError(message: string, lang: Language = "EN"): string {
  const lower = message.toLowerCase();

  if (lower.includes("only send testing emails") || lower.includes("verify a domain")) {
    return lang === "FR"
      ? `Configurez RESEND_FROM_EMAIL avec une adresse @${RESEND_DOMAIN} (domaine vérifié dans Resend).`
      : `Set RESEND_FROM_EMAIL to an address @${RESEND_DOMAIN} (domain verified in Resend).`;
  }

  if (lower.includes("resend_api_key") || lower.includes("not configured")) {
    return lang === "FR"
      ? "Service email non configuré (RESEND_API_KEY manquante sur Vercel)."
      : "Email service not configured (RESEND_API_KEY missing on Vercel).";
  }

  if (lower.includes("invalid") && lower.includes("from")) {
    return lang === "FR"
      ? `Adresse d'expédition invalide — utilisez une adresse @${RESEND_DOMAIN}.`
      : `Invalid sender — use an address @${RESEND_DOMAIN}.`;
  }

  return lang === "FR"
    ? "Échec de l'envoi. Réessayez ou écrivez à contact@dailyops.tech."
    : "Delivery failed. Try again or email contact@dailyops.tech.";
}

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!resend) throw new Error("RESEND_API_KEY is not configured");

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { name, email, subject, message } = data;

  await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `[DailyOps Contact] ${subject}`,
    html: `
      <h2>Nouveau message contact</h2>
      <p><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    `,
  });
}

export type NewsletterSubscribeResult =
  | { status: "created" }
  | { status: "already_subscribed" }
  | { status: "resubscribed" };

function isContactNotFoundError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("not found") ||
    lower.includes("does not exist") ||
    lower.includes("could not be found") ||
    lower.includes("404")
  );
}

async function sendNewsletterWelcomeFlow(email: string, lang: "EN" | "FR", adminSubject: string) {
  await sendEmail({
    to: NOTIFY_EMAIL,
    subject: adminSubject,
    html: `<p>Abonné newsletter :</p><p><strong>${escapeHtml(email)}</strong></p>`,
  });

  const welcome = buildNewsletterWelcomeEmail(lang, email);

  await sendEmail({
    to: email,
    subject: welcome.subject,
    html: welcome.html,
  });
}

export async function subscribeToNewsletter(
  email: string,
  lang: "EN" | "FR" = "EN"
): Promise<NewsletterSubscribeResult> {
  if (!resend) throw new Error("RESEND_API_KEY is not configured");

  const { data: existing, error: getError } = await resend.contacts.get({ email });

  if (getError && !isContactNotFoundError(getError.message)) {
    throw new Error(getError.message);
  }

  if (existing?.email && !existing.unsubscribed) {
    return { status: "already_subscribed" };
  }

  if (existing?.email && existing.unsubscribed) {
    const { error: updateError } = await resend.contacts.update({
      email,
      unsubscribed: false,
    });

    if (updateError) throw new Error(updateError.message);

    await sendNewsletterWelcomeFlow(
      email,
      lang,
      "[DailyOps Newsletter] Réabonnement"
    );

    return { status: "resubscribed" };
  }

  const { error: contactError } = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(NEWSLETTER_SEGMENT_ID ? { segments: [{ id: NEWSLETTER_SEGMENT_ID }] } : {}),
  });

  if (contactError && !contactError.message.toLowerCase().includes("already")) {
    throw new Error(contactError.message);
  }

  await sendNewsletterWelcomeFlow(
    email,
    lang,
    "[DailyOps Newsletter] Nouvel abonné"
  );

  return { status: "created" };
}

export async function sendChatEscalationEmail(data: {
  visitorEmail: string;
  visitorName?: string;
  summary: string;
  transcript: string;
  lang: string;
}) {
  const { visitorEmail, visitorName, summary, transcript, lang } = data;

  await sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: visitorEmail,
    subject: `[DailyOps Chat] Demande d'assistance expert`,
    html: `
      <h2>Escalade chat — assistance expert</h2>
      <p><strong>Langue :</strong> ${escapeHtml(lang)}</p>
      <p><strong>De :</strong> ${escapeHtml(visitorName || "Visiteur")} &lt;${escapeHtml(visitorEmail)}&gt;</p>
      <p><strong>Message du visiteur :</strong></p>
      <p style="white-space: pre-wrap;background:#fff;padding:12px;border-left:4px solid #22af9d;border-radius:4px;">${escapeHtml(summary)}</p>
      <hr />
      <p><strong>Transcript :</strong></p>
      <pre style="white-space: pre-wrap;font-size:12px;background:#f1f5f9;padding:12px;border-radius:8px;">${escapeHtml(transcript)}</pre>
    `,
  });
}