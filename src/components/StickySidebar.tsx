"use client";

import { cn } from "@/lib/utils";

/** Clears fixed navbar (top-4 + h-11) + small gap */
export const SIDEBAR_STICKY_TOP = "lg:top-24";

interface StickySidebarProps {
  children: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
}

/**
 * Sidebar layout for long-form pages:
 * - Scrolls with the page until the panel sticks under the navbar
 * - Upper blocks scroll inside the lateral column (manual scroll)
 * - CTA stays pinned at the bottom of the visible panel
 */
export default function StickySidebar({ children, cta, className }: StickySidebarProps) {
  return (
    <aside className={className}>
      <div
        className={cn(
          "lg:sticky lg:self-start lg:flex lg:flex-col",
          SIDEBAR_STICKY_TOP,
          "lg:max-h-[calc(100vh-7rem)]",
        )}
      >
        <div className="space-y-8 lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain sidebar-scroll pr-0.5">
          {children}
        </div>
        {cta && (
          <div className="flex-shrink-0 mt-6 pt-4 border-t border-border-main/40 lg:bg-bg-primary/80 lg:backdrop-blur-sm lg:rounded-b-2xl">
            {cta}
          </div>
        )}
      </div>
    </aside>
  );
}