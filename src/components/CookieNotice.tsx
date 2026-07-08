"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const CONSENT_KEY = "dailyops-cookie-notice";

export default function CookieNotice() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("cookies.banner_title")}
      className="fixed bottom-4 left-4 right-4 z-[90] mx-auto max-w-2xl rounded-2xl liquid-glass shadow-2xl p-4 sm:p-5"
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/35 to-transparent pointer-events-none rounded-t-2xl"
        aria-hidden
      />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-text-secondary text-xs sm:text-sm font-medium leading-relaxed flex-grow">
          {t("cookies.banner")}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/privacy#cookies"
            className="text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline whitespace-nowrap"
          >
            {t("cookies.more")}
          </Link>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2.5 bg-turquoise text-navy text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
          >
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}