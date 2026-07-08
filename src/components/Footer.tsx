"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Heart, Coffee } from "lucide-react";
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
  kofi: Coffee,
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
  { key: "footer.about_author", href: "/about#author" },
  { key: "footer.methodology", href: "/about#methodology" },
  { key: "footer.contact", href: "/about#contact" },
  { key: "footer.newsletter", href: "/#newsletter" },
] as const;

const FOOTER_INFORMATION = [
  { key: "footer.privacy", href: "/privacy" },
  { key: "footer.legal", href: "/legal" },
] as const;

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-black uppercase tracking-[0.18em] text-text-primary mb-3">{title}</h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
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

export default function Footer() {
  const { t } = useLanguage();

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
            {FOOTER_RESOURCES.map((item) => (
              <FooterLink key={item.key} href={item.href}>
                {t(item.key)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("footer.about")}>
            {FOOTER_ABOUT.map((item) => (
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

        <div className="mt-6 pt-4 border-t border-border-main/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <Logo iconOnly />
            </Link>
            <div className="flex gap-3">
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
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <p className="text-[10px] font-medium text-text-secondary/50 uppercase tracking-widest">
              {t("footer.copyright")} {t("footer.rights")}
            </p>
            <span className="hidden sm:block text-border-main">|</span>
            <Link
              href={SITE.kofi}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[10px] font-medium text-text-secondary/50 uppercase tracking-widest hover:text-turquoise transition-colors"
              title="Ko-fi"
            >
              <Heart size={11} className="text-red-500 mr-1.5 fill-red-500" /> {t("footer.made")}
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-turquoise animate-pulse" />
              <span className="text-[10px] font-black text-turquoise uppercase tracking-widest">
                {t("footer.production_ready")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}