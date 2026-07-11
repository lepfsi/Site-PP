"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cloud, CloudOff, Loader2, LogOut, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useLabAccount } from "@/contexts/LabAccountContext";

export default function LabSyncPanel() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { configured, authenticated, email, syncState, requestMagicLink, logout, refreshSession } =
    useLabAccount();

  const [inputEmail, setInputEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState<"synced" | "auth_error" | null>(null);

  useEffect(() => {
    if (searchParams.get("synced") === "1") {
      setBanner("synced");
      void refreshSession();
    } else if (searchParams.get("auth_error")) {
      setBanner("auth_error");
    }
  }, [searchParams, refreshSession]);

  if (!configured) {
    return (
      <div className="mb-8 rounded-2xl border border-border-main bg-bg-secondary/80 px-5 py-4 flex items-start gap-3">
        <CloudOff size={18} className="text-text-secondary/60 shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary font-medium">{t("labs.sync.offline")}</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    const result = await requestMagicLink(inputEmail);
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? t("labs.sync.error"));
      return;
    }

    setSent(true);
    setInputEmail("");
    setTimeout(() => setSent(false), 12000);
  };

  return (
    <div className="mb-8">
      <AnimatePresence>
        {banner === "synced" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-green-500" />
            <p className="text-sm font-medium text-text-primary">{t("labs.sync.connected")}</p>
          </motion.div>
        )}
        {banner === "auth_error" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500"
          >
            {t("labs.sync.auth_error")}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-border-main bg-bg-secondary p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-turquoise/10 border border-turquoise/30 flex items-center justify-center shrink-0">
            <Cloud size={18} className="text-turquoise" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">{t("labs.sync.title")}</h2>
            <p className="text-sm text-text-secondary font-medium mt-1">{t("labs.sync.desc")}</p>
          </div>
        </div>

        {authenticated ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border-main/60">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mb-1">
                {t("labs.sync.signed_in")}
              </p>
              <p className="text-sm font-bold text-text-primary">{email}</p>
              <p className="text-[10px] font-mono text-turquoise mt-1 uppercase tracking-wider">
                {syncState === "syncing" && (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" />
                    {t("labs.sync.syncing")}
                  </span>
                )}
                {syncState === "synced" && t("labs.sync.synced")}
                {syncState === "error" && t("labs.sync.sync_error")}
                {syncState === "idle" && t("labs.sync.ready")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-main text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-red-500 hover:border-red-500/30 transition-colors"
            >
              <LogOut size={12} />
              {t("labs.sync.logout")}
            </button>
          </div>
        ) : sent ? (
          <div className="pt-4 border-t border-border-main/60 text-center py-4">
            <CheckCircle2 size={28} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm font-bold text-text-primary">{t("labs.sync.sent_title")}</p>
            <p className="text-sm text-text-secondary font-medium mt-2">{t("labs.sync.sent_desc")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 border-t border-border-main/60">
            {error && <p className="text-red-500 text-xs font-medium mb-3">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40" />
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder={t("labs.sync.email_placeholder")}
                  required
                  disabled={loading}
                  className="w-full bg-bg-primary border border-border-main rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:ring-2 focus:ring-turquoise/40 outline-none disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] bg-turquoise text-navy hover:bg-turquoise-dark transition-all disabled:opacity-60 shrink-0"
              >
                {loading ? t("labs.sync.sending") : t("labs.sync.send_link")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}