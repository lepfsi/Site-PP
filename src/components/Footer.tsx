"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Heart, Coffee, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { CATEGORIES } from "@/lib/categories";
import { SITE, SOCIAL_LINKS, type SocialId } from "@/lib/site";
import Logo from "./Logo";

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16H20L8.267 4z" />
    <path d="M4 20l6.768-6.768m2.464-2.464L20 4" />
  </svg>
);

const SOCIAL_ICONS: Record<SocialId, React.ComponentType<{ size?: number }>> = {
  linkedin: Linkedin,
  github: Github,
  x: XIcon,
  facebook: Facebook,
  rss: Rss,
};

const FOOTER_RESOURCES = [
  { key: "footer.cheatsheets", href: "/resources#cheatsheets" },
  { key: "footer.templates", href: "/resources#templates" },
  { key: "footer.scripts", href: "/resources#scripts" },
  { key: "footer.training", href: "/resources#training" },
] as const;

const FOOTER_ABOUT = [
  { key: "footer.articles", href: "/articles" },
  { key: "footer.experience", href: "/experience" },
  { key: "footer.about_dailyops", href: "/about#dailyops" },
  { key: "footer.about_author", href: "/about#author" },
  { key: "footer.methodology", href: "/about#methodology" },
  { key: "footer.contact", href: "/about#contact" },
] as const;

const FOOTER_INFORMATION = [
  { key: "footer.privacy", href: "/privacy" },
  { key: "footer.legal", href: "/legal" },
  { key: "footer.newsletter", href: "/#newsletter" },
] as const;

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-text-primary mb-3">{title}</h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function sortFooterLinksByLength<T extends { key: string }>(
  items: readonly T[],
  label: (key: string) => string,
): T[] {
  return [...items].sort((a, b) => label(b.key).length - label(a.key).length);
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-xs font-medium text-text-secondary hover:text-turquoise transition-colors leading-snug">
        {children}
      </Link>
    </li>
  );
}

function SupportButton() {
  const { t } = useLanguage();

  return (
    <Link
      href={SITE.kofi}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border-main bg-bg-primary hover:border-turquoise/40 hover:bg-turquoise/5 transition-all group shadow-sm"
      title={t("footer.buy_me_coffee")}
    >
      <Heart size={14} className="text-red-500 fill-red-500 shrink-0 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-text-primary">
        {t("footer.support_us")}
      </span>
      <span className="hidden sm:block w-px h-3.5 bg-border-main" aria-hidden />
      <Coffee size={14} className="text-turquoise shrink-0" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary group-hover:text-turquoise transition-colors">
        {t("footer.buy_me_coffee")}
      </span>
    </Link>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const resourcesLinks = sortFooterLinksByLength(FOOTER_RESOURCES, t);
  const aboutLinks = sortFooterLinksByLength(FOOTER_ABOUT, t);

  return (
    <footer className="relative bg-bg-secondary border-t-2 border-turquoise/15 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.45)] pt-8 pb-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/35 to-transparent pointer-events-none" aria-hidden />
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 items-start">
          <FooterColumn title={t("footer.categories")}>
            {CATEGORIES.map((cat) => (
              <FooterLink key={cat.slug} href={`/category/${cat.slug}`}>
                {t(cat.nameKey)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.resources")}>
            {resourcesLinks.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.about")}>
            {aboutLinks.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.information")}>
            {FOOTER_INFORMATION.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="mt-6 pt-4 border-t border-border-main/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-start gap-x-2.5 lg:gap-x-3 gap-y-2 min-w-0 lg:flex-1 lg:pr-3">
              <Link href="/" className="shrink-0">
                <Logo iconOnly />
              </Link>
              <div className="flex gap-2.5 shrink-0">
                {SOCIAL_LINKS.map(({ id, href, label, external }) => {
                  const Icon = SOCIAL_ICONS[id];
                  return (
                    <Link
                      key={id}
                      href={href}
                      className="text-text-secondary hover:text-turquoise transition-colors"
                      title={label}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <Icon size={16} />
                    </Link>
                  );
                })}
              </div>
              <span className="hidden lg:inline text-border-main/70 shrink-0" aria-hidden>|</span>
              <p className="text-[9px] lg:text-[10px] font-medium text-text-secondary/50 uppercase tracking-wide leading-none whitespace-nowrap shrink-0">
                {t("footer.copyright")} {t("footer.rights")}
              </p>
              <span className="hidden lg:inline text-border-main/70 shrink-0" aria-hidden>|</span>
              <span className="inline-flex items-center text-[9px] lg:text-[10px] font-medium text-text-secondary/50 uppercase tracking-wide leading-none whitespace-nowrap shrink-0">
                <Heart size={11} className="text-red-500 mr-1.5 fill-red-500 shrink-0" /> {t("footer.made")}
              </span>
              <span className="hidden lg:inline text-border-main/70 shrink-0" aria-hidden>|</span>
              <span className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-black text-turquoise uppercase tracking-wide leading-none whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-turquoise animate-pulse shrink-0" />
                {t("footer.production_ready")}
              </span>
            </div>

            <SupportButton />
          </div>
        </div>
      </div>
    </footer>
  );
}