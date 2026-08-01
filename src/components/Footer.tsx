"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Coffee, Facebook, Mail } from "lucide-react";
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
  { key: "footer.contact", href: "/contact" },
] as const;

const FOOTER_LEGAL = [
  { key: "footer.privacy", href: "/privacy" },
  { key: "footer.legal", href: "/legal" },
  { key: "footer.methodology", href: "/about#methodology" },
] as const;

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 pl-2.5 border-l-2 border-turquoise/50 text-[12px] font-semibold tracking-wide text-text-primary">
        {title}
      </p>
      <ul className="space-y-1.5">{children}</ul>
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
  const { t, lp } = useLanguage();

  return (
    <footer id="site-footer" className="relative surface-header border-t border-border-main/70 pt-8 pb-5">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 items-start mb-6">
          <FooterColumn title={t("footer.explore")}>
            {FOOTER_EXPLORE.map((item) => (
              <FooterLink key={item.key} href={lp(item.href)}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.resources")}>
            {FOOTER_RESOURCES.map((item) => (
              <FooterLink key={item.key} href={lp(item.href)}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.about")}>
            {FOOTER_COMPANY.map((item) => (
              <FooterLink key={item.key} href={lp(item.href)}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.information")}>
            {FOOTER_LEGAL.map((item) => (
              <FooterLink key={item.key} href={lp(item.href)}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        {/* Compact bottom bar */}
        <div className="border-t border-border-main/50 pt-3.5">
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex items-center gap-3">
              <Link href={lp("/")} className="shrink-0">
                <Logo iconOnly />
              </Link>
              <div className="flex gap-2.5">
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
                      <Icon size={15} />
                    </Link>
                  );
                })}
              </div>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-text-secondary hover:text-turquoise transition-colors"
                title={t("footer.contact_email")}
              >
                <Mail size={15} />
              </a>
              <Link
                href={SITE.kofi}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-elevated px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:border-turquoise/40 hover:text-turquoise transition-colors"
                title={t("footer.buy_me_coffee")}
              >
                <Coffee size={12} className="text-turquoise shrink-0" />
                {t("footer.buy_me_coffee")}
              </Link>
            </div>

            <p className="text-center text-[11px] font-medium text-text-secondary/65 leading-none">
              {t("footer.copyright")} {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
