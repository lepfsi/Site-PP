"use client";

import { cn } from "@/lib/utils";

/** Clears fixed navbar (top-4 + h-11) + small gap */
export const SIDEBAR_STICKY_TOP = "lg:top-24";

interface StickySidebarProps {
  children: React.ReactNode;
  className?: string;
}

export default function StickySidebar({ children, className }: StickySidebarProps) {
  return (
    <aside
      className={cn(
        "lg:sticky lg:self-start",
        SIDEBAR_STICKY_TOP,
        "max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-y-contain",
        "sidebar-scroll pr-0.5",
        className,
      )}
    >
      {children}
    </aside>
  );
}