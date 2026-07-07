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
          "text-3xl md:text-4xl font-black tracking-tight text-text-primary code-font",
          titleClassName,
        )}
      >
        <span className="text-turquoise">//</span> {children}
      </h2>
      {subtitle && (
        <div className={cn("mt-3", centered && "flex flex-col items-center")}>
          {subtitle}
        </div>
      )}
    </div>
  );
}