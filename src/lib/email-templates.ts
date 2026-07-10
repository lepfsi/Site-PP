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

const SOCIAL_SVGS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${BRAND.navy}" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${BRAND.navy}" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${BRAND.navy}" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="${BRAND.navy}" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
} as const;

function socialIconCell(label: string, href: string, svg: string): string {
  return `<td style="padding:0 6px;">
    <a href="${href}" title="${label}" aria-label="${label}" style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;background:#ffffff;border:1px solid ${BRAND.border};border-radius:8px;text-decoration:none;">
      ${svg}
    </a>
  </td>`;
}

function socialRow(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
    <tr>
      ${socialIconCell("LinkedIn", SITE.linkedin, SOCIAL_SVGS.linkedin)}
      ${socialIconCell("X", SITE.x, SOCIAL_SVGS.x)}
      ${socialIconCell("GitHub", SITE.github, SOCIAL_SVGS.github)}
      ${socialIconCell("Facebook", SITE.facebook, SOCIAL_SVGS.facebook)}
    </tr>
  </table>`;
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
                <a href="mailto:${SITE.contactEmail}" style="color:${BRAND.turquoise};text-decoration:none;">${contactLabel}</a>
                · <a href="${SITE.url}" style="color:${BRAND.turquoise};text-decoration:none;">dailyops.tech</a>
              </p>
              <div style="margin:0;text-align:center;">${socialRow()}</div>
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