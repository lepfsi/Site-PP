"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, ArrowUpRight, Loader2, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { ChatSource, SourceTier } from "@/lib/chat-sources";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  links?: { label: string; href: string }[];
  sources?: ChatSource[];
  primaryTier?: SourceTier;
  queryTypeLabel?: string;
}

export default function ChatAssistant() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalateEmail, setEscalateEmail] = useState("");
  const [escalateName, setEscalateName] = useState("");
  const [escalateSending, setEscalateSending] = useState(false);
  const [escalateDone, setEscalateDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setShowEscalate(false);
    setEscalateDone(false);
  }, [lang]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.welcome") }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showEscalate, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setShowEscalate(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          lang,
          website: "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          links: data.links,
          sources: data.sources,
          primaryTier: data.primaryTier,
          queryTypeLabel: data.queryTypeLabel,
        },
      ]);

      if (data.escalate) setShowEscalate(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.error"),
          links: [{ label: t("chat.contact_link"), href: "/about#contact" }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitEscalation = async () => {
    if (!escalateEmail.trim() || escalateSending) return;

    setEscalateSending(true);
    const transcript = messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    try {
      const res = await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorEmail: escalateEmail,
          visitorName: escalateName,
          summary: messages.filter((m) => m.role === "user").at(-1)?.content ?? "Expert assistance",
          transcript,
          lang,
          website: "",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setEscalateDone(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.escalate_sent") },
      ]);
      setShowEscalate(false);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.escalate_error") },
      ]);
    } finally {
      setEscalateSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-20 right-4 z-[85] w-[min(100vw-2rem,380px)] h-[min(70vh,520px)] flex flex-col rounded-2xl liquid-glass shadow-2xl border border-border-main overflow-hidden"
            role="dialog"
            aria-label={t("chat.title")}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-main/60 bg-bg-secondary/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-turquoise/10 border border-turquoise/30 flex items-center justify-center">
                  <Bot size={16} className="text-turquoise" />
                </div>
                <div>
                  <p className="text-xs font-black text-text-primary">{t("chat.title")}</p>
                  <p className="text-[9px] text-text-secondary/60 font-medium">{t("chat.subtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-primary/60 transition-colors"
                aria-label={t("chat.close")}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto sidebar-scroll px-4 py-3 space-y-3 bg-bg-primary/40">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-bg-secondary border border-border-main"
                        : "bg-turquoise/10 border border-turquoise/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={12} className="text-text-secondary" />
                    ) : (
                      <Bot size={12} className="text-turquoise" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed font-medium ${
                      msg.role === "user"
                        ? "bg-turquoise/15 text-text-primary border border-turquoise/20"
                        : "bg-bg-secondary text-text-secondary border border-border-main"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === "assistant" && (msg.queryTypeLabel || msg.primaryTier) && (
                      <p className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-text-secondary/50">
                        {msg.queryTypeLabel}
                        {msg.queryTypeLabel && msg.primaryTier && " · "}
                        {msg.primaryTier && t(`chat.tier.${msg.primaryTier}` as "chat.tier.dailyops")}
                      </p>
                    )}
                    {msg.links && msg.links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border-main/50">
                        {msg.links.map((link) =>
                          link.href.startsWith("http") ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[9px] font-black uppercase tracking-wider text-turquoise hover:underline"
                            >
                              {link.label} <ExternalLink size={10} className="ml-0.5" />
                            </a>
                          ) : (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="inline-flex items-center text-[9px] font-black uppercase tracking-wider text-turquoise hover:underline"
                              onClick={() => setOpen(false)}
                            >
                              {link.label} <ArrowUpRight size={10} className="ml-0.5" />
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border-main/50 space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-text-secondary/50">
                          {t("chat.sources_label")}
                        </p>
                        {msg.sources.map((source) =>
                          source.url.startsWith("/") ? (
                            <Link
                              key={source.url}
                              href={source.url}
                              className="block text-[9px] font-medium text-text-secondary hover:text-turquoise transition-colors truncate"
                              onClick={() => setOpen(false)}
                            >
                              <span className="text-text-secondary/40">{t(`chat.tier.${source.tier}` as "chat.tier.dailyops")} · </span>
                              {source.label}
                            </Link>
                          ) : (
                            <a
                              key={source.url}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-[9px] font-medium text-text-secondary hover:text-turquoise transition-colors truncate"
                            >
                              <span className="text-text-secondary/40">{t(`chat.tier.${source.tier}` as "chat.tier.dailyops")} · </span>
                              {source.label}
                            </a>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-text-secondary/60 text-xs">
                  <Loader2 size={14} className="animate-spin text-turquoise" />
                  {t("chat.thinking")}
                </div>
              )}

              {showEscalate && !escalateDone && (
                <div className="p-3 rounded-xl border border-turquoise/30 bg-turquoise/5 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-turquoise">
                    {t("chat.escalate_title")}
                  </p>
                  <input
                    type="text"
                    value={escalateName}
                    onChange={(e) => setEscalateName(e.target.value)}
                    placeholder={t("chat.escalate_name")}
                    className="w-full bg-bg-primary border border-border-main rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-turquoise"
                  />
                  <input
                    type="email"
                    value={escalateEmail}
                    onChange={(e) => setEscalateEmail(e.target.value)}
                    placeholder={t("chat.escalate_email")}
                    required
                    className="w-full bg-bg-primary border border-border-main rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-turquoise"
                  />
                  <button
                    type="button"
                    onClick={submitEscalation}
                    disabled={escalateSending || !escalateEmail.trim()}
                    className="w-full py-2.5 bg-turquoise text-navy text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-50"
                  >
                    {escalateSending ? t("chat.escalate_sending") : t("chat.escalate_send")}
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-border-main/60 bg-bg-secondary/50 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder={t("chat.placeholder")}
                  className="flex-1 bg-bg-primary border border-border-main rounded-xl px-3 py-2.5 text-xs text-text-primary outline-none focus:ring-1 focus:ring-turquoise"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-turquoise text-navy disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                  aria-label={t("chat.send")}
                >
                  <Send size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowEscalate(true)}
                className="w-full text-[9px] font-black uppercase tracking-widest text-text-secondary/60 hover:text-turquoise transition-colors"
              >
                {t("chat.escalate_cta")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-[85] w-12 h-12 rounded-2xl bg-turquoise text-navy shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-turquoise/50"
          aria-label={t("chat.open")}
        >
          <MessageCircle size={22} />
        </button>
      )}
    </>
  );
}