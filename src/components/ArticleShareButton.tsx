"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Link2, Linkedin, Mail, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { SITE } from "@/lib/site";

const XIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16H20L8.267 4z" />
    <path d="M4 20l6.768-6.768m2.464-2.464L20 4" />
  </svg>
);

interface ArticleShareButtonProps {
  slug: string;
  title: string;
}

export default function ArticleShareButton({ slug, title }: ArticleShareButtonProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/articles/${slug}`
      : `${SITE.url}/articles/${slug}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback ignored */
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: articleUrl });
        setOpen(false);
        return;
      } catch {
        /* user cancelled or unsupported */
      }
    }
    setOpen((v) => !v);
  };

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareOptions = [
    {
      id: "copy",
      label: copied ? t("article.share_copied") : t("article.share_copy"),
      icon: copied ? Check : Link2,
      onClick: copyLink,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      id: "x",
      label: "X",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      id: "email",
      label: t("article.share_email"),
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <div className="relative ml-auto" ref={ref}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="flex items-center text-turquoise hover:underline"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Share2 size={12} className="mr-1.5" /> {t("article.share")}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-border-main bg-bg-secondary shadow-xl py-1.5">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            const className =
              "flex items-center w-full px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-text-secondary hover:text-turquoise hover:bg-bg-primary/60 transition-colors";

            if (option.href) {
              return (
                <a
                  key={option.id}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={14} className="mr-2.5 shrink-0" />
                  {option.label}
                </a>
              );
            }

            return (
              <button key={option.id} type="button" onClick={option.onClick} className={className}>
                <Icon size={14} className="mr-2.5 shrink-0" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}