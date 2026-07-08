"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Mail, Clock, Shield } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { SITE } from "@/lib/site";

const AUTHOR_IMAGE = "/images/author.jpg";
const AUTHOR_FALLBACK = "/images/author.svg";

export default function ContactAuthorPanel() {
  const { t } = useLanguage();
  const [imgSrc, setImgSrc] = useState(AUTHOR_FALLBACK);

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setImgSrc(AUTHOR_IMAGE);
    probe.src = AUTHOR_IMAGE;
  }, []);

  return (
    <div className="relative h-full min-h-[320px] lg:min-h-0 rounded-2xl border border-border-main overflow-hidden bg-bg-primary shadow-lg flex flex-col">
      <div className="relative flex-grow min-h-[280px] lg:min-h-[360px]">
        <Image
          src={imgSrc}
          alt={t("about.author_name")}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 40vw"
          priority={false}
          onError={() => {
            if (imgSrc !== AUTHOR_FALLBACK) setImgSrc(AUTHOR_FALLBACK);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/95 via-[#0a1628]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 noc-grid opacity-15 pointer-events-none" aria-hidden />
      </div>

      <div className="relative p-5 sm:p-6 border-t border-border-main/60 bg-bg-secondary/90 backdrop-blur-sm">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-turquoise mb-2">
          {t("about.contact_panel_label")}
        </p>
        <h3 className="text-lg font-black text-text-primary tracking-tight">{t("about.author_name")}</h3>
        <p className="text-turquoise text-[10px] font-bold uppercase tracking-widest mt-1">{t("about.author_role")}</p>
        <p className="text-text-secondary text-sm leading-relaxed font-medium mt-3">
          {t("about.contact_panel_desc")}
        </p>
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border-main/50">
          <span className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-text-secondary/70">
            <Mail size={11} className="mr-1.5 text-turquoise" />
            {SITE.contactEmail}
          </span>
          <span className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-text-secondary/70">
            <Clock size={11} className="mr-1.5 text-turquoise" />
            {t("about.contact_response")}
          </span>
          <span className="inline-flex items-center text-[9px] font-black uppercase tracking-widest text-text-secondary/70">
            <Shield size={11} className="mr-1.5 text-turquoise" />
            {t("about.contact_secure")}
          </span>
        </div>
      </div>
    </div>
  );
}