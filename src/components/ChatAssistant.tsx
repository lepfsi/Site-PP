"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  ArrowUpRight,
  Loader2,
  ExternalLink,
  CheckCircle2,
  GripHorizontal,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { ChatSource } from "@/lib/chat-sources";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  links?: { label: string; href: string }[];
  sources?: ChatSource[];
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
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    setMessages([]);
    setShowEscalate(false);
    setEscalateDone(false);
    setEscalateEmail("");
    setEscalateName("");
  }, [lang]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.welcome") }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showEscalate, loading]);

  const apiMessages = (msgs: ChatMessage[]) =>
    msgs.map((m) => ({ role: m.role, content: m.content }));

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
          messages: apiMessages(nextMessages),
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
          links: data.links?.length ? data.links : undefined,
          sources: data.sources?.length ? data.sources : undefined,
        },
      ]);

      if (data.escalate && !escalateDone) setShowEscalate(true);
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

  const closeEscalateForm = () => {
    if (escalateSending) return;
    setShowEscalate(false);
    setEscalateEmail("");
    setEscalateName("");
  };

  const submitEscalation = async () => {
    if (!escalateEmail.trim() || escalateSending || escalateDone) return;

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("chat.escalate_error"));

      setEscalateDone(true);
      closeEscalateForm();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.escalate_sent") },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : t("chat.escalate_error"),
        },
      ]);
    } finally {
      setEscalateSending(false);
    }
  };

  const openEscalateForm = () => {
    if (escalateDone) return;
    setShowEscalate(true);
  };

  return (
    <>
      <div
        ref={dragBoundsRef}
        className="fixed inset-0 z-[85] pointer-events-none"
        aria-hidden={!open}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragElastic={0.06}
              dragConstraints={dragBoundsRef}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="absolute bottom-20 right-4 pointer-events-auto w-[min(calc(100vw-2rem),380px)] h-[min(70vh,520px)] flex flex-col rounded-2xl chat-glass overflow-hidden"
              role="dialog"
              aria-label={t("chat.title")}
            >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex items-center justify-between px-3 py-2.5 border-b border-slate-400/15 bg-slate-500/5 cursor-grab active:cursor-grabbing select-none touch-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <GripHorizontal size={14} className="text-text-secondary/40 shrink-0" aria-hidden />
                <div className="w-8 h-8 rounded-xl bg-slate-500/10 border border-slate-400/20 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-text-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-text-primary truncate">{t("chat.title")}</p>
                  <p className="text-[9px] text-text-secondary/60 font-medium truncate">{t("chat.subtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-500/10 transition-colors shrink-0"
                aria-label={t("chat.close")}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto sidebar-scroll px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-slate-500/10 border border-slate-400/20"
                        : "bg-slate-500/10 border border-slate-400/15"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={12} className="text-text-secondary" />
                    ) : (
                      <Bot size={12} className="text-text-secondary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed font-medium ${
                      msg.role === "user"
                        ? "bg-slate-500/12 text-text-primary border border-slate-400/20"
                        : "bg-bg-secondary/50 text-text-secondary border border-slate-400/15"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.links && msg.links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-400/15">
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
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-text-secondary/60 text-xs">
                  <Loader2 size={14} className="animate-spin text-text-secondary" />
                  {t("chat.thinking")}
                </div>
              )}

              {showEscalate && !escalateDone && (
                <div className="p-3 rounded-xl border border-slate-400/20 bg-slate-500/5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
                      {t("chat.escalate_title")}
                    </p>
                    <button
                      type="button"
                      onClick={closeEscalateForm}
                      disabled={escalateSending}
                      className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-slate-500/10 transition-colors disabled:opacity-50"
                      aria-label={t("chat.escalate_close")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={escalateName}
                    onChange={(e) => setEscalateName(e.target.value)}
                    placeholder={t("chat.escalate_name")}
                    className="w-full bg-bg-primary/80 border border-slate-400/20 rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-slate-400/40"
                  />
                  <input
                    type="email"
                    value={escalateEmail}
                    onChange={(e) => setEscalateEmail(e.target.value)}
                    placeholder={t("chat.escalate_email")}
                    required
                    className="w-full bg-bg-primary/80 border border-slate-400/20 rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-slate-400/40"
                  />
                  <button
                    type="button"
                    onClick={submitEscalation}
                    disabled={escalateSending || !escalateEmail.trim()}
                    className="w-full py-2.5 bg-slate-600 text-white dark:bg-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg disabled:opacity-50 hover:bg-slate-500 dark:hover:bg-slate-400 transition-colors"
                  >
                    {escalateSending ? t("chat.escalate_sending") : t("chat.escalate_send")}
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-slate-400/15 bg-slate-500/5 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder={t("chat.placeholder")}
                  className="flex-1 bg-bg-primary/80 border border-slate-400/20 rounded-xl px-3 py-2.5 text-xs text-text-primary outline-none focus:ring-1 focus:ring-slate-400/40"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-slate-600 text-white dark:bg-slate-500 disabled:opacity-50 hover:bg-slate-500 dark:hover:bg-slate-400 hover:scale-105 active:scale-95 transition-all"
                  aria-label={t("chat.send")}
                >
                  <Send size={16} />
                </button>
              </div>
              {escalateDone ? (
                <p className="w-full flex items-center justify-center gap-1.5 text-[9px] font-bold text-text-secondary/70">
                  <CheckCircle2 size={12} />
                  {t("chat.escalate_already")}
                </p>
              ) : showEscalate ? (
                <button
                  type="button"
                  onClick={closeEscalateForm}
                  disabled={escalateSending}
                  className="w-full text-[9px] font-black uppercase tracking-widest text-text-secondary/60 hover:text-text-primary transition-colors disabled:opacity-50"
                >
                  {t("chat.escalate_cancel")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openEscalateForm}
                  className="w-full text-[9px] font-black uppercase tracking-widest text-text-secondary/60 hover:text-text-primary transition-colors"
                >
                  {t("chat.escalate_cta")}
                </button>
              )}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-[85] w-12 h-12 rounded-2xl chat-glass text-text-primary shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          aria-label={t("chat.open")}
        >
          <MessageCircle size={22} className="text-text-secondary" />
        </button>
      )}
    </>
  );
}