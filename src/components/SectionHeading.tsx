"use client";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  children,
  subtitle,
  centered = true,
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered ? "text-center" : "text-left", className)}>
      <h2
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-2 text-3xl md:text-4xl font-black tracking-tight text-text-primary code-font",
          centered && "justify-center",
          titleClassName,
        )}
      >
        <span className="heading-prefix" aria-hidden>
          //
        </span>
        <span>{children}</span>
      </h2>
      <div className={cn("heading-accent", centered && "mx-auto")} aria-hidden />
      {subtitle && (
        <div className={cn("mt-4", centered && "flex flex-col items-center")}>
          {subtitle}
        </div>
      )}
    </div>
  );
}