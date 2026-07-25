"use client";

import { cn } from "@/lib/utils";

/** Sticky only from lg up — never trap scroll on mobile */
export const SIDEBAR_STICKY_TOP = "lg:top-24";

interface StickySidebarProps {
  children: React.ReactNode;
  className?: string;
}

export default function StickySidebar({ children, className }: StickySidebarProps) {
  return (
    <aside
      className={cn(
        // Mobile: normal flow, no nested scroll
        "w-full",
        // Desktop: sticky with its own scroll if content is tall
        "lg:sticky lg:self-start",
        SIDEBAR_STICKY_TOP,
        "lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-y-contain",
        "lg:sidebar-scroll lg:pr-0.5",
        className,
      )}
    >
      {children}
    </aside>
  );
}
