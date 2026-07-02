"use client";

import { useState, useEffect } from "react";
import { Search, Terminal, Command } from "lucide-react";

export default function CommandSearch() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative group transition-all duration-300 ${isFocused ? 'w-full md:w-96' : 'w-full md:w-64'}`}>
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isFocused ? 'text-accent' : 'text-foreground/40'}`}>
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="block w-full pl-10 pr-12 py-2 border border-[var(--border-color)] bg-card/50 backdrop-blur-sm rounded-lg text-sm placeholder-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
        placeholder="Rechercher une doc, un article..."
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-[var(--border-color)] rounded text-[10px] font-sans font-medium text-foreground/40 bg-background">
          <Command className="h-2 w-2 mr-1" /> K
        </kbd>
      </div>
    </div>
  );
}
