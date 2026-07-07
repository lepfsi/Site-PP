"use client";

import Link from "next/link";
import { Menu, X, Moon, Sun, ChevronDown, Globe, Shield, Server, Cloud, Bug, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import CommandSearch from "./CommandSearch";
import Logo from "./Logo";

const CATEGORIES = [
  { id: "networking", color: "bg-blue-500", icon: Globe },
  { id: "cybersecurity", color: "bg-red-500", icon: Shield },
  { id: "infrastructure", color: "bg-orange-500", icon: Server },
  { id: "cloud", color: "bg-purple-500", icon: Cloud },
  { id: "automation", color: "bg-cyan-500", label: "Automation & AI", icon: Zap },
  { id: "troubleshooting", color: "bg-green-500", icon: Bug },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 w-[95%] max-w-7xl px-6 py-2 rounded-2xl border liquid-glass shadow-2xl ${
        scrolled ? "py-1.5" : "py-2.5"
      }`}
    >
      <div className="flex h-11 items-center justify-between relative">
        
        {/* LOGO */}
        <Link href="/" className="z-10 flex-shrink-0">
          <Logo />
        </Link>

        {/* CENTERED LINKS */}
        <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2 w-max">
          <Link href="/" className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-turquoise">{t("nav.home")}</Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsCatOpen(true)}
            onMouseLeave={() => setIsCatOpen(false)}
          >
            <button className="flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">
              {t("nav.categories")} <ChevronDown size={10} className={`ml-1 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isCatOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-bg-secondary/95 border border-white/10 shadow-2xl rounded-xl overflow-hidden p-2 backdrop-blur-xl z-[110]"
                >
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.id}
                      href={`/category/${cat.id}`}
                      className="flex items-center p-3 hover:bg-bg-primary rounded-lg group transition-all"
                    >
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-bg-primary mr-3 text-text-secondary group-hover:text-turquoise transition-colors`}>
                        <cat.icon size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-text-primary uppercase tracking-widest group-hover:text-turquoise transition-colors">
                          {cat.label || (cat.id.charAt(0).toUpperCase() + cat.id.slice(1))}
                        </div>
                        <div className="text-[8px] text-text-secondary/60 font-mono leading-none mt-1">
                          {t(`cat.${cat.id}_desc` as any)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="#articles" className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">{t("nav.articles")}</Link>
          <Link href="#experience" className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">{t("nav.expertise")}</Link>
          <Link href="/about" className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all">{t("nav.about")}</Link>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center space-x-3 z-10">
          <div className="hidden md:block">
            <CommandSearch />
          </div>

          <div className="hidden md:flex bg-bg-secondary/50 border border-border-main rounded-full p-0.5 shadow-sm overflow-hidden">
            <button onClick={() => setLang("FR")} className={`px-2.5 py-1 text-[8px] font-black rounded-full transition-all ${lang === "FR" ? "bg-text-primary text-bg-primary" : "text-text-secondary"}`}>FR</button>
            <button onClick={() => setLang("EN")} className={`px-2.5 py-1 text-[8px] font-black rounded-full transition-all ${lang === "EN" ? "bg-text-primary text-bg-primary" : "text-text-secondary"}`}>EN</button>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-full border border-border-main bg-bg-secondary/50 text-text-secondary hover:text-turquoise transition-all active:scale-90"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-xl text-text-primary bg-bg-secondary border border-border-main">
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pt-4 border-t border-border-main/20 space-y-1 overflow-hidden pb-4"
          >
            {["Home", "Categories", "Articles", "Expertise", "About"].map((item) => (
              <Link key={item} href="#" className="block px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] border-b border-border-main/10" onClick={() => setIsOpen(false)}>{item}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
