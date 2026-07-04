"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Rss, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-main pt-24 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="flex items-center group mb-6">
              <div className="bg-[#00bcd4] text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-[#00bcd4]/20 group-hover:scale-105 transition-transform duration-300">
                <span className="code-font text-lg font-bold tracking-tighter">{">_"}</span>
              </div>
              <div className="ml-3 flex items-baseline">
                <span className="text-xl font-bold tracking-tight text-text-primary">DailyOps</span>
                <span className="text-xl font-bold tracking-tight text-[#00bcd4]">.Tech</span>
              </div>
            </Link>

            <p className="text-text-secondary text-base max-w-sm mb-8 font-medium leading-relaxed">
              {t("footer.desc")}
            </p>

            <div className="flex space-x-3">
              {[
                { Icon: Linkedin, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Rss, href: "#" },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border-main text-text-secondary hover:text-[#00bcd4] hover:border-[#00bcd4] transition-all bg-transparent"
                >
                  <item.Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary mb-6">{t("footer.categories")}</h4>
            <ul className="space-y-4">
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("cat.networking_name")}</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("cat.cybersecurity_name")}</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("cat.infrastructure_name")}</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.cloud_short")}</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("cat.troubleshooting_name")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary mb-6">{t("footer.resources")}</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.glossary")}</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.checklists")}</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.field_feedback")}</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.about_author")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary mb-6">{t("footer.information")}</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.legal")}</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-[#00bcd4] transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-text-secondary/50 uppercase tracking-widest">
            © 2026 DailyOps.Tech — {t("footer.rights")}
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-[10px] font-black text-text-secondary/50 uppercase tracking-widest">
              <Heart size={14} className="text-red-500 mr-2 fill-red-500" /> {t("footer.made")}
            </span>
            <div className="h-1 w-1 rounded-full bg-border-main"></div>
            <span className="text-[10px] font-black text-[#00bcd4] uppercase tracking-widest bg-[#00bcd4]/10 px-3 py-1.5 rounded-xl border border-[#00bcd4]/20">V2.4.0-STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}