"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("FR");

  return (
    <button 
      onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
      className="flex items-center space-x-1 px-2 py-1 rounded border border-border bg-card text-xs font-bold hover:border-accent transition-colors"
    >
      <Globe className="h-3 w-3" />
      <span>{lang}</span>
    </button>
  );
}
