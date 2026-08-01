/**
 * Privacy-first analytics (Plausible) — cookie-free, consistent with the
 * site's cookie notice ("No advertising or third-party tracking cookies").
 * No-op unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (build-time env).
 */
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";
  return <script defer data-domain={domain} src={src} />;
}
