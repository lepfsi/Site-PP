"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const components: Components = {
  h2: ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-black text-text-primary mt-10 mb-4 pt-6 border-t border-border-main first:mt-0 first:pt-0 first:border-t-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-text-primary mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-text-secondary text-base sm:text-lg leading-relaxed font-medium mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 mb-4 space-y-2 text-text-secondary font-medium">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 text-text-secondary font-medium">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-text-primary">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-turquoise/50 bg-turquoise/5 rounded-r-xl px-4 py-3 mb-4 text-sm text-text-secondary font-medium">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border-main my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-xl border border-border-main">
      <table className="w-full text-sm font-medium">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-bg-secondary text-text-primary">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-border-main">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-3 text-text-secondary">{children}</td>,
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={`${className} block font-mono text-[13px] leading-relaxed text-turquoise`}>{children}</code>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border-main font-mono text-[13px] text-turquoise">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-6 p-4 sm:p-5 rounded-xl bg-bg-secondary border border-border-main overflow-x-auto">{children}</pre>
  ),
};

interface ArticleMarkdownProps {
  content: string;
}

export default function ArticleMarkdown({ content }: ArticleMarkdownProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}