"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Heart, Coffee, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
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

const FOOTER_EXPLORE = [
  { key: "footer.categories_all", href: "/#categories" },
  { key: "footer.articles", href: "/articles" },
  { key: "footer.experience", href: "/experience" },
  { key: "footer.labs", href: "/labs" },
] as const;

const FOOTER_RESOURCES = [
  { key: "footer.cheatsheets", href: "/resources#cheatsheets" },
  { key: "footer.templates", href: "/resources#templates" },
  { key: "footer.scripts", href: "/resources#scripts" },
  { key: "footer.newsletter", href: "/#newsletter" },
] as const;

const FOOTER_COMPANY = [
  { key: "footer.products", href: "/products" },
  { key: "footer.about_dailyops", href: "/about#dailyops" },
  { key: "footer.about_author", href: "/about#author" },
  { key: "footer.contact", href: "/about#contact" },
] as const;

const FOOTER_LEGAL = [
  { key: "footer.privacy", href: "/privacy" },
  { key: "footer.legal", href: "/legal" },
  { key: "footer.methodology", href: "/about#methodology" },
] as const;

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[12px] font-semibold tracking-wide text-text-primary mb-3">
        {title}
      </h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-xs font-medium text-text-secondary hover:text-turquoise transition-colors leading-snug"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative surface-header border-t border-border-main/70 pt-10 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 items-start mb-10">
          <FooterColumn title={t("footer.explore")}>
            {FOOTER_EXPLORE.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.resources")}>
            {FOOTER_RESOURCES.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.about")}>
            {FOOTER_COMPANY.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.information")}>
            {FOOTER_LEGAL.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <div className="pt-6 border-t border-border-main/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 min-w-0">
              <Link href="/" className="shrink-0 w-fit">
                <Logo iconOnly />
              </Link>
              <div className="flex gap-3 shrink-0">
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
              <p className="text-[12px] font-medium text-text-secondary/70 leading-snug">
                {t("footer.copyright")} {t("footer.rights")}
              </p>
            </div>

            <Link
              href={SITE.kofi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border-main bg-bg-elevated hover:border-turquoise/40 hover:text-turquoise transition-colors text-[12px] font-medium text-text-secondary w-fit"
              title={t("footer.buy_me_coffee")}
            >
              <Coffee size={14} className="text-turquoise shrink-0" />
              {t("footer.buy_me_coffee")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
