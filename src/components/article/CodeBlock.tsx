"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  children: ReactNode;
  copyLabel: string;
  copiedLabel: string;
}

/**
 * Terminal-style code block: always dark (light + dark site themes).
 * Copy feedback uses emerald on dark chrome — never washes out the code body.
 */
export default function CodeBlock({ language, children, copyLabel, copiedLabel }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text =
      typeof children === "string"
        ? children
        : extractText(children);
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="group relative mb-6 rounded-xl overflow-hidden border border-slate-700/80 bg-[#0b1220] shadow-sm dark:border-slate-600/50 dark:shadow-[0_0_0_1px_rgba(15,23,42,0.8)]">
      <div className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2 border-b border-slate-700/70 bg-[#080e18]">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 shrink-0 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            copied
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-slate-800/80"
          }`}
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto m-0 bg-[#0b1220]">
        <code className="block font-mono text-[12.5px] sm:text-[13px] leading-relaxed text-turquoise selection:bg-turquoise/25 selection:text-white">
          {children}
        </code>
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in (node as object)) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return "";
}
