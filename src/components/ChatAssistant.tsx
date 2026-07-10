"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  X,
  Send,
  User,
  Bot,
  ArrowUpRight,
  Loader2,
  ExternalLink,
  CheckCircle2,
  GripHorizontal,
  Minimize2,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import type { ChatSource } from "@/lib/chat-sources";

const NUDGE_STORAGE_KEY = "dailyops-chat-nudge-dismissed-at";
const NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const NUDGE_DELAY_MIN_MS = 8_000;
const NUDGE_DELAY_JITTER_MS = 4_000;

const NUDGE_KEYS = ["chat.nudge_1", "chat.nudge_2", "chat.nudge_3"] as const;

function isNudgeDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(NUDGE_STORAGE_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) return false;
  return Date.now() - dismissedAt < NUDGE_COOLDOWN_MS;
}

function RobotAvatar({ active }: { active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-7 h-7">
      <motion.span
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-2 rounded-full bg-slate-400/70"
        animate={active ? { opacity: [0.35, 1, 0.35], scaleY: [0.85, 1.1, 0.85] } : { opacity: 0.5 }}
        transition={{ duration: active ? 1.2 : 0, repeat: active ? Infinity : 0, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.span
        className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-500/20 border border-slate-400/30"
        animate={active ? { scale: [1, 1.15, 1] } : undefined}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        animate={active ? { rotate: [0, -4, 4, 0] } : undefined}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Bot size={26} strokeWidth={1.75} className="text-text-primary" />
      </motion.div>
      <motion.span
        className="absolute bottom-0.5 left-1.5 w-1 h-1 rounded-full bg-turquoise/80"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        aria-hidden
      />
      <motion.span
        className="absolute bottom-0.5 right-1.5 w-1 h-1 rounded-full bg-turquoise/80"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        aria-hidden
      />
    </div>
  );
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  links?: { label: string; href: string }[];
  sources?: ChatSource[];
}

export default function ChatAssistant() {
  const { t, lang } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalateEmail, setEscalateEmail] = useState("");
  const [escalateName, setEscalateName] = useState("");
  const [escalateMessage, setEscalateMessage] = useState("");
  const [escalateSending, setEscalateSending] = useState(false);
  const [escalateDone, setEscalateDone] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeMessageKey] = useState(
    () => NUDGE_KEYS[Math.floor(Math.random() * NUDGE_KEYS.length)],
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const dismissNudge = () => {
    setShowNudge(false);
    localStorage.setItem(NUDGE_STORAGE_KEY, String(Date.now()));
  };

  const openChat = () => {
    setShowNudge(false);
    setOpen(true);
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
    setShowEscalate(false);
    setEscalateDone(false);
    setEscalateEmail("");
    setEscalateName("");
    setEscalateMessage("");
  };

  const hideChat = () => {
    setOpen(false);
  };

  const closeChat = () => {
    resetChat();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setShowNudge(false);
      return;
    }
    if (typeof window === "undefined") return;
    if (isNudgeDismissed()) return;

    const delay = NUDGE_DELAY_MIN_MS + Math.random() * NUDGE_DELAY_JITTER_MS;
    const showTimer = window.setTimeout(() => {
      if (!isNudgeDismissed()) setShowNudge(true);
    }, delay);

    return () => window.clearTimeout(showTimer);
  }, [open, pathname]);

  useEffect(() => {
    setMessages([]);
    setShowEscalate(false);
    setEscalateDone(false);
    setEscalateEmail("");
    setEscalateName("");
    setEscalateMessage("");
  }, [lang]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: t("chat.welcome") }]);
    }
  }, [open, messages.length, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showEscalate, loading]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

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

      if (data.escalate && !escalateDone) {
        setEscalateMessage(text);
        setShowEscalate(true);
      }
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
    setEscalateMessage("");
  };

  const submitEscalation = async () => {
    if (!escalateEmail.trim() || !escalateMessage.trim() || escalateSending || escalateDone) return;

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
          summary: escalateMessage.trim(),
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
    const lastUser = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";
    setEscalateMessage(lastUser);
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
            <>
            <motion.button
              type="button"
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 pointer-events-auto cursor-default bg-transparent"
              onClick={hideChat}
              aria-label={t("chat.hide")}
            />
            <motion.div
              key="chat-panel"
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
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={hideChat}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-500/10 transition-colors"
                  aria-label={t("chat.hide")}
                  title={t("chat.hide")}
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-500/10 transition-colors"
                  aria-label={t("chat.close")}
                  title={t("chat.close")}
                >
                  <X size={16} />
                </button>
              </div>
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
                              onClick={hideChat}
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
                  <textarea
                    value={escalateMessage}
                    onChange={(e) => setEscalateMessage(e.target.value)}
                    placeholder={t("chat.escalate_message")}
                    required
                    rows={3}
                    className="w-full bg-bg-primary/80 border border-slate-400/20 rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:ring-1 focus:ring-slate-400/40 resize-none"
                  />
                  <button
                    type="button"
                    onClick={submitEscalation}
                    disabled={escalateSending || !escalateEmail.trim() || !escalateMessage.trim()}
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
            </>
          )}
        </AnimatePresence>
      </div>

      {!open && (
        <div className="fixed bottom-20 right-4 z-[92] flex flex-col items-end gap-2">
          <AnimatePresence>
            {showNudge && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.94 }}
                transition={{ type: "spring", damping: 22, stiffness: 340 }}
                className="relative max-w-[min(100vw-6rem,240px)] rounded-2xl chat-glass px-3.5 py-3 shadow-lg border border-slate-400/20"
                role="status"
                aria-live="polite"
              >
                <div
                  className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-slate-500/10 border-r border-b border-slate-400/20 dark:bg-slate-800/80"
                  aria-hidden
                />
                <p className="text-[11px] font-medium text-text-primary leading-snug pr-5">
                  {t(nudgeMessageKey)}
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={openChat}
                    className="text-[9px] font-black uppercase tracking-widest text-turquoise hover:underline"
                  >
                    {t("chat.open")}
                  </button>
                  <button
                    type="button"
                    onClick={dismissNudge}
                    className="text-[9px] font-bold uppercase tracking-wider text-text-secondary/50 hover:text-text-secondary"
                  >
                    {t("chat.nudge_dismiss")}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={dismissNudge}
                  className="absolute top-2 right-2 p-0.5 rounded-md text-text-secondary/40 hover:text-text-secondary"
                  aria-label={t("chat.nudge_dismiss")}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={openChat}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className={`relative w-14 h-14 rounded-2xl chat-glass shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ${
              showNudge ? "ring-2 ring-slate-400/25 ring-offset-2 ring-offset-transparent" : ""
            }`}
            aria-label={t("chat.open")}
          >
            {showNudge && (
              <span className="absolute inset-0 rounded-2xl bg-slate-400/10 animate-pulse pointer-events-none" aria-hidden />
            )}
            <RobotAvatar active={showNudge} />
          </motion.button>
        </div>
      )}
    </>
  );
}