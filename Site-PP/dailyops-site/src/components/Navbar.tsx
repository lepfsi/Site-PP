"use client";

import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-bluedark bg-navy/90 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-1">
              <span className="code-font text-2xl font-bold text-turquoise">DailyOps</span>
              <span className="code-font text-2xl font-bold text-foreground">.Tech</span>
              <span className="pulse-dot ml-2"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="#categories" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-turquoise transition-colors">Categories</Link>
            <Link href="#articles" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-turquoise transition-colors">Articles</Link>
            <Link href="#experience" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-turquoise transition-colors">Experience</Link>
            <Link href="#newsletter" className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-turquoise transition-colors">Newsletter</Link>
            
            <div className="ml-4 flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-bluedark transition-colors text-foreground/70"
              >
                {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-turquoise focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-navy border-b border-bluedark pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#categories" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-turquoise" onClick={() => setIsOpen(false)}>Categories</Link>
            <Link href="#articles" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-turquoise" onClick={() => setIsOpen(false)}>Articles</Link>
            <Link href="#experience" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-turquoise" onClick={() => setIsOpen(false)}>Experience</Link>
            <Link href="#newsletter" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-turquoise" onClick={() => setIsOpen(false)}>Newsletter</Link>
          </div>
          <div className="px-5 flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-bluedark transition-colors text-foreground/70"
            >
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
