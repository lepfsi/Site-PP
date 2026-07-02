"use client";

import { useState } from "react";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("FR");

  return (
    <div className="flex bg-turquoise/10 border border-bluedark rounded-lg p-0.5">
      <button 
        onClick={() => setLang("FR")}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === "FR" ? "bg-turquoise text-navy" : "text-foreground/50 hover:text-turquoise"}`}
      >
        FR
      </button>
      <button 
        onClick={() => setLang("EN")}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === "EN" ? "bg-turquoise text-navy" : "text-foreground/50 hover:text-turquoise"}`}
      >
        EN
      </button>
    </div>
  );
}
