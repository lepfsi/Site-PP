"use client";

import Link from "next/link";
import { FileText, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ContactExpertCtaProps {
  icon?: LucideIcon;
}

export default function ContactExpertCta({ icon: Icon = FileText }: ContactExpertCtaProps) {
  const { t } = useLanguage();

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-text-primary text-bg-primary relative overflow-hidden group shadow-2xl">
      <div className="relative z-10">
        <h3 className="text-lg font-bold mb-3">{t("catpage.need_expertise")}</h3>
        <p className="text-sm text-bg-primary/50 mb-6 leading-relaxed">
          {t("catpage.expertise_desc")}
        </p>
        <Link href="/about#contact">
          <button
            type="button"
            className="w-full py-3 bg-turquoise text-navy text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
          >
            {t("catpage.contact_expert")}
          </button>
        </Link>
      </div>
      <Icon className="absolute -right-6 -bottom-6 h-32 w-32 text-bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
    </div>
  );
}