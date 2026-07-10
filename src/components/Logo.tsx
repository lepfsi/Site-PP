"use client";

import { cn } from "@/lib/utils";

export default function Logo({ className, iconOnly = false }: { className?: string, iconOnly?: boolean }) {
  return (
    <div className={cn("flex items-center group", className)}>
      {/* Hexagonal Icon Concept 01 */}
      <div className="relative flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-9 h-9 md:w-10 md:h-10 fill-none text-text-primary dark:text-white transition-transform duration-300 group-hover:scale-105"
        >
          <path 
            d="M50 5 L88.97 27.5 L88.97 72.5 L50 95 L11.03 72.5 L11.03 27.5 Z" 
            stroke="#2BD9C5" 
            strokeWidth="8"
            className="drop-shadow-[0_0_8px_rgba(43,217,197,0.3)]"
          />
          <text 
            x="50%" 
            y="52%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            fill="currentColor" 
            fontSize="32" 
            fontWeight="900"
            className="code-font"
          >
            {">_"}
          </text>
        </svg>
      </div>

      {!iconOnly && (
        <div className="ml-3 flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">DailyOps</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#2BD9C5]">.Tech</span>
          </div>
          {/* REBALANCED TAGLINE: Adjusted tracking to not exceed text width */}
          <div className="text-[6.5px] md:text-[7.5px] font-bold tracking-[0.2em] uppercase mt-1 flex items-center w-full justify-between">
            <span className="text-text-secondary">OPERATE</span>
            <span className="text-[#2BD9C5]">.</span>
            <span className="text-text-secondary">OPTIMIZE</span>
            <span className="text-[#2BD9C5]">.</span>
            <span className="text-text-secondary">SECURE</span>
            <span className="text-[#2BD9C5]">.</span>
          </div>
        </div>
      )}
    </div>
  );
}
