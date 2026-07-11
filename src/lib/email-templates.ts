import type { Language } from "./translations";
import { SITE } from "./site";

const BRAND = {
  navy: "#0A1128",
  turquoise: "#22af9d",
  lightBg: "#f1f5f9",
  muted: "#64748b",
  border: "#e2e8f0",
} as const;

function unsubscribeUrl(email: string): string {
  return `${SITE.url}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: SITE.linkedin },
  { label: "X", href: SITE.x },
  { label: "GitHub", href: SITE.github },
  { label: "Facebook", href: SITE.facebook },
] as const;

function socialRow(): string {
  return SOCIAL_LINKS.map(
    (link) =>
      `<a href="${link.href}" style="color:${BRAND.turquoise};text-decoration:none;font-size:12px;font-weight:700;margin:0 10px;">${link.label}</a>`,
  ).join("");
}

interface BrandedEmailOptions {
  lang: Language;
  preheader?: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  subscriberEmail?: string;
}

export function buildBrandedEmail({
  lang,
  preheader,
  title,
  bodyHtml,
  cta,
  subscriberEmail,
}: BrandedEmailOptions): string {
  const tagline = lang === "FR" ? "OPERATE · OPTIMIZE · SECURE" : "OPERATE · OPTIMIZE · SECURE";
  const signature = lang === "FR" ? "— L'équipe DailyOps" : "— The DailyOps team";
  const visitLabel = lang === "FR" ? "Visiter le site" : "Visit the site";
  const unsubLabel = lang === "FR" ? "Se désabonner" : "Unsubscribe";
  const contactLabel = lang === "FR" ? "Nous contacter" : "Contact us";
  const contactMailto = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(lang === "FR" ? "Newsletter DailyOps" : "DailyOps Newsletter")}`;

  const ctaBlock = cta
    ? `<p style="margin:28px 0 0;">
        <a href="${cta.href}" style="display:inline-block;background:${BRAND.navy};color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.04em;">${cta.label}</a>
       </p>`
    : `<p style="margin:28px 0 0;">
        <a href="${SITE.url}" style="display:inline-block;background:${BRAND.navy};color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.04em;">${visitLabel}</a>
       </p>`;

  const unsubBlock = subscriberEmail
    ? `<p style="margin:16px 0 0;font-size:11px;color:${BRAND.muted};">
        <a href="${unsubscribeUrl(subscriberEmail)}" style="color:${BRAND.muted};text-decoration:underline;">${unsubLabel}</a>
       </p>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang === "FR" ? "fr" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.lightBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.lightBg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.navy};padding:24px 28px;">
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                DailyOps<span style="color:${BRAND.turquoise};">.Tech</span>
              </p>
              <p style="margin:6px 0 0;font-size:9px;font-weight:700;color:rgba(255,255,255,0.55);letter-spacing:0.22em;text-transform:uppercase;">${tagline}</p>
              <div style="margin-top:14px;height:3px;width:48px;background:linear-gradient(90deg,${BRAND.turquoise},transparent);border-radius:2px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <h1 style="margin:0 0 16px;font-size:20px;font-weight:800;color:${BRAND.navy};line-height:1.3;">${title}</h1>
              <div style="font-size:15px;line-height:1.65;color:#334155;">${bodyHtml}</div>
              ${ctaBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;border-top:1px solid ${BRAND.border};background:#f8fafc;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:${BRAND.navy};">${signature}</p>
              <p style="margin:0 0 16px;font-size:12px;color:${BRAND.muted};">
                <a href="${contactMailto}" style="color:${BRAND.turquoise};text-decoration:none;font-weight:600;">${contactLabel}</a>
                (<a href="${contactMailto}" style="color:${BRAND.muted};text-decoration:none;">${SITE.contactEmail}</a>)
                · <a href="${SITE.url}" style="color:${BRAND.turquoise};text-decoration:none;">dailyops.tech</a>
              </p>
              <p style="margin:0;text-align:center;line-height:2;">${socialRow()}</p>
              ${unsubBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildNewsletterWelcomeEmail(lang: Language, email: string): { subject: string; html: string } {
  const articlesUrl = `${SITE.url}/articles`;
  const resourcesUrl = `${SITE.url}/resources`;

  if (lang === "FR") {
    return {
      subject: "Bienvenue — newsletter DailyOps.Tech",
      html: buildBrandedEmail({
        lang,
        subscriberEmail: email,
        preheader: "Playbooks ops, alertes CVE et retours terrain — sans spam.",
        title: "Bienvenue à bord",
        bodyHtml: `
          <p>Merci pour votre inscription à la newsletter <strong>DailyOps.Tech</strong>.</p>
          <p>Vous recevrez des playbooks production-ready, des alertes CVE et des retours terrain sur l'infra, l'observabilité et la sécurité — <strong>sans spam</strong>.</p>
          <p>En attendant, parcourez nos <a href="${articlesUrl}" style="color:${BRAND.turquoise};font-weight:600;">articles techniques</a> (playbooks, runbooks, guides) ou la page <a href="${resourcesUrl}" style="color:${BRAND.turquoise};font-weight:600;">Outils &amp; Ressources</a> (cheatsheets, scripts, modèles).</p>
        `,
        cta: { label: "Voir les articles", href: articlesUrl },
      }),
    };
  }

  return {
    subject: "Welcome to DailyOps.Tech newsletter",
    html: buildBrandedEmail({
      lang,
      subscriberEmail: email,
      preheader: "Ops playbooks, CVE alerts, and field-tested insights.",
      title: "Welcome aboard",
      bodyHtml: `
        <p>Thanks for subscribing to the <strong>DailyOps.Tech</strong> newsletter.</p>
        <p>You'll get production-ready playbooks, CVE alerts, and field-tested insights on infra, observability, and security — <strong>no spam</strong>.</p>
        <p>In the meantime, browse our <a href="${articlesUrl}" style="color:${BRAND.turquoise};font-weight:600;">technical articles</a> (playbooks, runbooks, guides) or the <a href="${resourcesUrl}" style="color:${BRAND.turquoise};font-weight:600;">Tools &amp; Resources</a> hub (cheatsheets, scripts, templates).</p>
      `,
      cta: { label: "Browse articles", href: articlesUrl },
    }),
  };
}

export function buildLabsMagicLinkEmail(
  lang: Language,
  email: string,
  magicUrl: string
): { subject: string; html: string } {
  if (lang === "FR") {
    return {
      subject: "Connexion Ops Labs — DailyOps.Tech",
      html: buildBrandedEmail({
        lang,
        preheader: "Synchronisez votre progression sur tous vos appareils.",
        title: "Connexion Ops Labs",
        bodyHtml: `
          <p>Utilisez le lien ci-dessous pour connecter votre compte <strong>${email}</strong> et synchroniser la progression de vos parcours Ops Labs.</p>
          <p style="font-size:13px;color:${BRAND.muted};">Ce lien expire dans <strong>15 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        `,
        cta: { label: "Connecter mon compte", href: magicUrl },
      }),
    };
  }

  return {
    subject: "Ops Labs sign-in — DailyOps.Tech",
    html: buildBrandedEmail({
      lang,
      preheader: "Sync your learning path progress across devices.",
      title: "Ops Labs sign-in",
      bodyHtml: `
        <p>Use the link below to connect <strong>${email}</strong> and sync your Ops Labs learning path progress.</p>
        <p style="font-size:13px;color:${BRAND.muted};">This link expires in <strong>15 minutes</strong>. If you didn't request this, you can ignore this email.</p>
      `,
      cta: { label: "Connect my account", href: magicUrl },
    }),
  };
}