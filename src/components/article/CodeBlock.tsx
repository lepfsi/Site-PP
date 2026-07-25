"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  children: ReactNode;
  copyLabel: string;
  copiedLabel: string;
}

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
    <div className="group relative mb-6 rounded-xl border border-border-main bg-bg-secondary overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-border-main/80 bg-bg-primary/30">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-secondary/60">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-text-secondary/70 hover:text-turquoise transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto m-0">
        <code className="block font-mono text-[13px] leading-relaxed text-turquoise">{children}</code>
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
