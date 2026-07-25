"use client";

import { Children, isValidElement, useMemo, useRef, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  calloutLabel,
  calloutVisual,
  type CalloutKind,
} from "@/lib/markdown-callouts";
import { splitArticleContent } from "@/lib/markdown-blocks";
import { peelFootnotes } from "@/lib/markdown-footnotes";
import { extractToc, slugifyHeading } from "@/lib/article-reading";
import { useLanguage } from "@/lib/LanguageContext";
import CodeBlock from "@/components/article/CodeBlock";
import ImageWithCaption from "@/components/article/ImageWithCaption";
import { useState } from "react";

function stripFrontmatterClient(raw: string): string {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/);
  if (match) return text.slice(match[0].length).replace(/^\n+/, "").trim();
  return text.trim();
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return "";
}

function CalloutBox({
  kind,
  lang,
  children,
}: {
  kind: CalloutKind;
  lang: "EN" | "FR";
  children: ReactNode;
}) {
  const visual = calloutVisual(kind);
  const label = calloutLabel(kind, lang);

  return (
    <aside
      className={`my-6 rounded-xl border ${visual.ring} border-l-4 ${visual.border} ${visual.bg} px-4 py-3.5 sm:px-5 sm:py-4 not-prose`}
      data-callout={kind}
      role="note"
    >
      <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${visual.labelColor}`}>
        {label}
      </p>
      <div className="text-sm sm:text-[15px] text-text-secondary font-normal leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

function TaskItem({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);

  const content = Children.map(children, (child) => {
    if (isValidElement(child) && (child.props as { type?: string }).type === "checkbox") {
      return null;
    }
    return child;
  });

  return (
    <li className="list-none leading-relaxed flex items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="mt-1.5 h-4 w-4 rounded border-border-main accent-turquoise shrink-0 cursor-pointer"
      />
      <span className={checked ? "line-through opacity-60" : ""}>{content}</span>
    </li>
  );
}

function buildComponents(
  lang: "EN" | "FR",
  labels: { copy: string; copied: string },
  nextHeadingId: (text: string) => string
): Components {
  return {
    h2: ({ children }) => {
      const text = extractText(children);
      const id = nextHeadingId(text);
      return (
        <h2
          id={id}
          className="scroll-mt-28 text-xl sm:text-2xl font-semibold text-text-primary mt-10 mb-4 pt-6 border-t border-border-main first:mt-0 first:pt-0 first:border-t-0"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = extractText(children);
      const id = nextHeadingId(text);
      return (
        <h3 id={id} className="scroll-mt-28 text-lg font-semibold text-text-primary mt-6 mb-3">
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-text-secondary font-normal mb-4 article-body-text">{children}</p>
    ),
    ul: ({ children, className }) => (
      <ul
        className={`mb-4 space-y-2 text-text-secondary font-normal ${className?.includes("contains-task-list") ? "list-none pl-0" : ""}`}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 text-text-secondary font-normal">
        {children}
      </ol>
    ),
    li: ({ children, className, ...props }) => {
      const hasCb = Children.toArray(children).some(
        (c) => isValidElement(c) && (c.props as { type?: string })?.type === "checkbox"
      );
      if (hasCb || className?.includes("task-list-item")) {
        return <TaskItem>{children}</TaskItem>;
      }
      return (
        <li className={`leading-relaxed article-body-text ${className || ""}`} {...props}>
          {children}
        </li>
      );
    },
    input: ({ type, ...props }) => {
      if (type === "checkbox") return null;
      return <input type={type} {...props} />;
    },
    strong: ({ children }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    a: ({ href, children }) => {
      const h = href || "#";
      // Footnote ref: [1](#fn-id)
      if (h.startsWith("#fn-")) {
        return (
          <a
            href={h}
            className="text-turquoise font-semibold no-underline align-super text-[0.7em] ml-0.5 hover:underline"
          >
            {children}
          </a>
        );
      }
      if (/^https?:\/\//i.test(h)) {
        return (
          <a
            href={h}
            target="_blank"
            rel="noopener noreferrer"
            className="text-turquoise underline decoration-turquoise/30 underline-offset-2 hover:decoration-turquoise"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={h}
          className="text-turquoise underline decoration-turquoise/30 underline-offset-2 hover:decoration-turquoise"
        >
          {children}
        </Link>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-turquoise/50 bg-turquoise/5 rounded-r-xl px-4 py-3 mb-4 text-sm text-text-secondary font-medium">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border-main my-8" />,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-border-main shadow-sm">
        <table className="w-full min-w-[280px] border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-bg-secondary/90 text-text-primary border-b border-border-main">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border-main/80 bg-bg-elevated/40">{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-turquoise/[0.04]">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-3 sm:px-4 py-2.5 text-left text-[11px] font-semibold tracking-wide text-text-primary">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 sm:px-4 py-2.5 text-text-secondary font-normal leading-snug align-top">
        {children}
      </td>
    ),
    img: ({ src, alt, title }) => {
      if (!src || typeof src !== "string") return null;
      return <ImageWithCaption src={src} alt={alt || ""} title={title} />;
    },
    code: ({ className, children }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return <code className={className}>{children}</code>;
      }
      return (
        <code className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border-main font-mono text-[13px] text-turquoise">
          {children}
        </code>
      );
    },
    pre: ({ children }) => {
      let language = "";
      let codeChildren: ReactNode = children;
      if (isValidElement(children)) {
        const props = children.props as { className?: string; children?: ReactNode };
        const m = props.className?.match(/language-([\w-]+)/);
        if (m) language = m[1];
        codeChildren = props.children;
      }
      return (
        <CodeBlock language={language} copyLabel={labels.copy} copiedLabel={labels.copied}>
          {codeChildren}
        </CodeBlock>
      );
    },
  };
}

interface ArticleMarkdownProps {
  content: string;
}

export default function ArticleMarkdown({ content }: ArticleMarkdownProps) {
  const { lang, t } = useLanguage();
  const withoutFm = stripFrontmatterClient(content);

  const { body, footnotes } = useMemo(() => peelFootnotes(withoutFm), [withoutFm]);
  const segments = useMemo(() => splitArticleContent(body), [body]);
  const toc = useMemo(() => extractToc(body), [body]);
  const cursorRef = useRef(0);
  cursorRef.current = 0;

  const nextHeadingId = (text: string) => {
    const item = toc[cursorRef.current];
    cursorRef.current += 1;
    if (item) return item.id;
    return slugifyHeading(text) || "section";
  };

  const labels = {
    copy: t("article.copy_code"),
    copied: t("article.copied"),
  };

  const components = buildComponents(lang, labels, nextHeadingId);

  return (
    <div className="prose-custom article-md">
      {segments.map((seg, i) => {
        if (seg.type === "callout") {
          return (
            <CalloutBox key={`c-${i}`} kind={seg.kind} lang={lang}>
              {seg.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                  {seg.content}
                </ReactMarkdown>
              ) : null}
            </CalloutBox>
          );
        }

        if (seg.type === "takeaways") {
          return (
            <aside
              key={`t-${i}`}
              className="my-8 rounded-xl border border-turquoise/30 bg-turquoise/[0.06] px-5 py-4 sm:px-6 sm:py-5 not-prose"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-turquoise mb-3">
                {t("article.takeaways")}
              </p>
              <ul className="space-y-2">
                {seg.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-sm sm:text-[15px] text-text-secondary leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-sm bg-turquoise shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          );
        }

        if (seg.type === "see-also") {
          return (
            <aside
              key={`s-${i}`}
              id="see-also-internal-links"
              className="my-8 scroll-mt-28 rounded-xl border border-border-main bg-bg-secondary/60 px-5 py-4 sm:px-6 not-prose"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-secondary/70 mb-3">
                {t("article.see_also")}
              </p>
              <ul className="space-y-3">
                {seg.items.map((item, j) => (
                  <li key={j}>
                    <Link href={item.href} className="text-sm font-semibold text-turquoise hover:underline">
                      {item.label}
                    </Link>
                    {item.reason ? (
                      <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">{item.reason}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </aside>
          );
        }

        if (seg.type === "cta") {
          return (
            <aside
              key={`cta-${i}`}
              className="my-10 rounded-2xl border border-border-main bg-text-primary text-bg-primary px-6 py-7 sm:px-8 not-prose"
            >
              {seg.cta.title ? <h3 className="text-lg font-bold mb-2">{seg.cta.title}</h3> : null}
              <p className="text-sm text-bg-primary/60 mb-5 leading-relaxed max-w-lg">{seg.cta.body}</p>
              <Link
                href={seg.cta.href}
                className="inline-flex px-5 py-2.5 rounded-xl bg-turquoise text-navy text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
              >
                {seg.cta.label || t("article.cta_default")}
              </Link>
            </aside>
          );
        }

        return (
          <ReactMarkdown key={`m-${i}`} remarkPlugins={[remarkGfm]} components={components}>
            {seg.content}
          </ReactMarkdown>
        );
      })}

      {footnotes.length > 0 ? (
        <section className="mt-12 pt-6 border-t border-border-main text-sm text-text-secondary not-prose">
          <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
            {lang === "FR" ? "Notes" : "Notes"}
          </h2>
          <ol className="space-y-2 list-decimal list-outside ml-5">
            {footnotes.map((fn) => (
              <li key={fn.id} id={`fn-${fn.id}`} className="scroll-mt-28 leading-relaxed">
                {fn.text}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
