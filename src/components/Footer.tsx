"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Heart, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { CATEGORIES } from "@/lib/categories";
import Logo from "./Logo";

const XIcon = ({ size = 20 }: { size?: number }) => (
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

const FOOTER_RESOURCES = [
  { key: "footer.cheatsheets", href: "#" },
  { key: "footer.templates", href: "#" },
  { key: "footer.scripts", href: "#" },
  { key: "footer.training", href: "#" },
  { key: "footer.lab", href: "#" },
] as const;

const FOOTER_ABOUT = [
  { key: "footer.about_author", href: "/about" },
  { key: "footer.methodology", href: "/about" },
  { key: "footer.contact", href: "/about" },
  { key: "footer.legal", href: "#" },
  { key: "footer.rss", href: "#" },
] as const;

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-main pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-4 lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Logo />
            </Link>

            <p className="text-text-secondary text-sm max-w-[260px] mb-8 leading-relaxed font-medium">
              {t("footer.desc")}
            </p>

            <div className="flex space-x-5">
              {[
                { Icon: Linkedin, title: "LinkedIn" },
                { Icon: Github, title: "GitHub" },
                { Icon: XIcon, title: "X" },
                { Icon: Facebook, title: "Facebook" },
                { Icon: Rss, title: "RSS" },
              ].map(({ Icon, title }) => (
                <Link
                  key={title}
                  href="#"
                  className="text-text-secondary hover:text-turquoise transition-colors"
                  title={title}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2 md:ml-auto">
            <h4 className="text-base font-bold text-text-primary mb-6">{t("footer.categories")}</h4>
            <ul className="space-y-4">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors"
                  >
                    {t(cat.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3 md:ml-auto">
            <h4 className="text-base font-bold text-text-primary mb-6">{t("footer.resources")}</h4>
            <ul className="space-y-4">
              {FOOTER_RESOURCES.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-3 md:ml-auto">
            <h4 className="text-base font-bold text-text-primary mb-6">{t("footer.about")}</h4>
            <ul className="space-y-4">
              {FOOTER_ABOUT.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-widest">
            {t("footer.copyright")} {t("footer.rights")}
          </p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-[11px] font-medium text-text-secondary/60 uppercase tracking-widest">
              <Heart size={14} className="text-red-500 mr-2 fill-red-500" /> {t("footer.made")}
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-turquoise animate-pulse"></span>
              <span className="text-[11px] font-black text-turquoise uppercase tracking-widest">
                {t("footer.production_ready")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}