"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Heart, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { SOCIAL_LINKS, type SocialId } from "@/lib/site";
import Logo from "./Logo";

const XIcon = ({ size = 18 }: { size?: number }) => (
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
  { key: "footer.articles", href: "/articles" },
  { key: "footer.experience", href: "/experience" },
  { key: "footer.resources", href: "/resources" },
  { key: "footer.categories_all", href: "/#categories" },
] as const;

const FOOTER_ABOUT = [
  { key: "footer.about_author", href: "/about#author" },
  { key: "footer.methodology", href: "/about#methodology" },
  { key: "footer.contact", href: "/about#contact" },
  { key: "footer.newsletter", href: "/#newsletter" },
] as const;

const FOOTER_LEGAL = [
  { key: "footer.privacy", href: "/privacy" },
  { key: "footer.legal", href: "/legal" },
] as const;

function FooterColumn({ title, links, t }: { title: string; links: readonly { key: string; href: string }[]; t: (key: string) => string }) {
  return (
    <div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary/80 mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="text-xs font-medium text-text-secondary hover:text-turquoise transition-colors">
              {t(item.key)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-bg-secondary border-t-2 border-turquoise/15 shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.45)] pt-8 pb-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/35 to-transparent pointer-events-none" aria-hidden />
      <div className="container-custom">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10 items-start mb-6">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Logo iconOnly />
            </Link>
            <p className="text-text-secondary text-xs max-w-[200px] mb-4 leading-relaxed font-medium line-clamp-2">
              {t("footer.desc")}
            </p>
            <div className="flex gap-4">
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
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          <FooterColumn title={t("footer.explore")} links={FOOTER_EXPLORE} t={t} />
          <FooterColumn title={t("footer.about")} links={FOOTER_ABOUT} t={t} />
          <FooterColumn title={t("footer.information")} links={FOOTER_LEGAL} t={t} />
        </div>

        <div className="pt-4 border-t border-border-main/60 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] font-medium text-text-secondary/50 uppercase tracking-widest">
            {t("footer.copyright")} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center text-[10px] font-medium text-text-secondary/50 uppercase tracking-widest">
              <Heart size={12} className="text-red-500 mr-1.5 fill-red-500" /> {t("footer.made")}
            </span>
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