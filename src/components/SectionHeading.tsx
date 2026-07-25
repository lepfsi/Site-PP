"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  /** Softer default for product-style pages; site home still gets accent bar */
  showAccent?: boolean;
}

export default function SectionHeading({
  children,
  subtitle,
  centered = true,
  className,
  titleClassName,
  showAccent = true,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered ? "text-center" : "text-left", className)}>
      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-[2rem] font-semibold tracking-tight text-text-primary leading-tight",
          centered && "text-center",
          titleClassName,
        )}
      >
        {children}
      </h2>
      {showAccent && (
        <div className={cn("heading-accent", centered && "mx-auto")} aria-hidden />
      )}
      {subtitle && (
        <div className={cn("mt-4", centered && "flex flex-col items-center")}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
