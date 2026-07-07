"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Clears the fixed navbar (top-4 + h-11 + padding). */
export const PAGE_TOP_OFFSET = "pt-20";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  grid?: "noc" | "tech";
  compact?: boolean;
  showPrefix?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  meta,
  grid = "noc",
  compact = false,
  showPrefix = true,
  className,
  children,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative border-b border-border-main bg-bg-secondary/30 overflow-hidden",
        compact ? "py-4 sm:py-5" : "py-6 sm:py-8",
        className,
      )}
    >
      {grid === "noc" && (
        <div className="absolute inset-0 noc-grid opacity-20 pointer-events-none" aria-hidden />
      )}
      {grid === "tech" && (
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" aria-hidden />
      )}
      {grid === "noc" && compact && <div className="scanline" aria-hidden />}

      <div className="container-custom relative z-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center mb-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && <ChevronRight className="mx-2 h-3 w-3 shrink-0" />}
                {item.href ? (
                  <Link href={item.href} className="hover:text-turquoise transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-text-primary">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {children ?? (
          <>
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-black text-text-primary tracking-tight code-font"
              >
                {showPrefix && <span className="text-turquoise">//</span>} {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-3 text-text-secondary text-base sm:text-lg font-medium max-w-2xl leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}
            {meta && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="mt-4"
              >
                {meta}
              </motion.div>
            )}
          </>
        )}
      </div>
    </header>
  );
}