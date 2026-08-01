"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Send, Mail, User, MessageSquare, FileText, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          lang,
          website: formData.get("website"),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("about.form_error"));

      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("about.form_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-border-main bg-bg-primary shadow-xl flex flex-col h-full">
      <div className="flex items-center space-x-3 mb-2">
        <Mail className="text-turquoise" size={20} />
        <h2 className="text-xl font-bold text-text-primary">{t("about.contact_title")}</h2>
      </div>
      <p className="text-text-secondary text-sm mb-8 font-medium">{t("about.contact_desc")}</p>

      {sent ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle className="text-green-500 mb-4" size={40} />
          <p className="text-text-primary font-bold">{t("about.form_sent")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          {error && (
            <p className="text-red-500 text-xs font-medium text-center">{error}</p>
          )}
          <div>
            <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
              <User size={12} className="mr-1.5" /> {t("about.form_name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
            />
          </div>
          <div>
            <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
              <Mail size={12} className="mr-1.5" /> {t("about.form_email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
            />
          </div>
          <div>
            <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
              <FileText size={12} className="mr-1.5" /> {t("about.form_subject")}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <label className="flex items-center text-[10px] font-black uppercase tracking-widest text-text-secondary mb-2">
              <MessageSquare size={12} className="mr-1.5" /> {t("about.form_message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full min-h-[160px] bg-bg-secondary border border-border-main rounded-xl px-4 py-3 text-sm text-text-primary focus:ring-1 focus:ring-turquoise outline-none transition-all resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-turquoise text-navy font-black uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send size={14} className="mr-2" />
            {loading ? t("about.form_sending") : t("about.form_send")}
          </button>
        </form>
      )}
    </div>
  );
}
