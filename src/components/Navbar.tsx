"use client";

import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: "nav.categories", href: "#categories" },
    { name: "nav.articles", href: "#articles" },
    { name: "nav.experience", href: "#experience" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? "bg-bg-primary/70 backdrop-blur-xl border-b border-border-main py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center group">
              {/* Logo Icon based on Image */}
              <div className="relative">
                <div className="bg-[#00bcd4] text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#00bcd4]/20 group-hover:scale-105 transition-transform duration-300">
                  <span className="code-font text-xl font-bold tracking-tighter">{">_"}</span>
                </div>
                {/* Active Indicator */}
                <div className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-bg-primary"></span>
                </div>
              </div>
              
              {/* Logo Text based on Image */}
              <div className="ml-3 flex items-baseline">
                <span className="text-2xl font-bold tracking-tight text-text-primary">DailyOps</span>
                <span className="text-2xl font-bold tracking-tight text-[#00bcd4]">.Tech</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-all rounded-full hover:bg-turquoise/5"
                >
                  {t(item.name as any)}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-bg-secondary border border-border-main rounded-full p-0.5 shadow-sm">
              <button 
                onClick={() => setLang("FR")}
                className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all ${lang === "FR" ? "bg-text-primary text-bg-primary" : "text-text-secondary hover:text-turquoise"}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLang("EN")}
                className={`px-3 py-1.5 text-[10px] font-black rounded-full transition-all ${lang === "EN" ? "bg-text-primary text-bg-primary" : "text-text-secondary hover:text-turquoise"}`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-full border border-border-main bg-bg-secondary text-text-secondary hover:text-[#00bcd4] transition-all shadow-sm active:scale-90"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-text-primary bg-bg-secondary border border-border-main"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-bg-primary border-b border-border-main px-4 py-8 shadow-2xl z-50"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="px-4 py-4 text-sm font-black uppercase tracking-[0.2em] border-b border-border-main/30"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.name as any)}
                </Link>
              ))}
              <div className="flex justify-between items-center pt-6">
                <div className="flex bg-bg-secondary border border-border-main rounded-full p-1">
                  <button onClick={() => setLang("FR")} className={`px-5 py-2 text-xs font-black rounded-full ${lang === "FR" ? "bg-text-primary text-bg-primary" : "text-text-secondary"}`}>FR</button>
                  <button onClick={() => setLang("EN")} className={`px-5 py-2 text-xs font-black rounded-full ${lang === "EN" ? "bg-text-primary text-bg-primary" : "text-text-secondary"}`}>EN</button>
                </div>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-4 rounded-full border border-border-main bg-bg-secondary"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
