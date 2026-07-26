"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage, type Language } from "@/lib/LanguageContext";
import { navigateHomePath } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CommandSearch from "./CommandSearch";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /** Prefer locale routes for articles + labs (hreflang SEO); otherwise client lang only. */
  const switchLang = (next: Language) => {
    const frArticle = pathname.match(/^\/fr\/articles\/([^/?#]+)/);
    const enArticle = pathname.match(/^\/articles\/([^/?#]+)/);
    const frLab = pathname.match(/^\/fr\/labs\/([^/?#]+)/);
    const enLab = pathname.match(/^\/labs\/([^/?#]+)/);
    const onFrLabsIndex = pathname === "/fr/labs" || pathname === "/fr/labs/";
    const onEnLabsIndex = pathname === "/labs" || pathname === "/labs/";
    const onFrArticlesIndex = pathname === "/fr/articles" || pathname === "/fr/articles/";
    const onEnArticlesIndex = pathname === "/articles" || pathname === "/articles/";

    if (next === "FR") {
      if (enArticle && !pathname.startsWith("/fr/")) {
        router.push(`/fr/articles/${enArticle[1]}`);
        return;
      }
      if (enLab && !pathname.startsWith("/fr/")) {
        router.push(`/fr/labs/${enLab[1]}`);
        return;
      }
      if (onEnLabsIndex) {
        router.push("/fr/labs");
        return;
      }
      if (onEnArticlesIndex) {
        router.push("/fr/articles");
        return;
      }
    }
    if (next === "EN") {
      if (frArticle) {
        router.push(`/articles/${frArticle[1]}`);
        return;
      }
      if (frLab) {
        router.push(`/labs/${frLab[1]}`);
        return;
      }
      if (onFrLabsIndex) {
        router.push("/labs");
        return;
      }
      if (onFrArticlesIndex) {
        router.push("/articles");
        return;
      }
    }
    setLang(next);
  };

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    navigateHomePath(pathname, event);
    setIsOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 w-[95%] max-w-7xl px-5 sm:px-6 py-2 rounded-2xl border liquid-glass ${
        scrolled ? "py-1.5 shadow-lg" : "py-2 shadow-md"
      }`}
    >
      <div className="flex h-11 items-center justify-between relative">
        
        {/* LOGO - Always points to top of home */}
        <Link href="/" onClick={handleHomeClick} className="z-10 flex-shrink-0">
          <Logo />
        </Link>

        {/* CENTERED LINKS */}
        <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2 w-max">
          <Link href="/" onClick={handleHomeClick} className="px-3.5 py-2 text-[11px] font-semibold tracking-wide text-turquoise">{t("nav.home")}</Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsCatOpen(true)}
            onMouseLeave={() => setIsCatOpen(false)}
          >
            <button className="flex items-center px-3.5 py-2 text-[11px] font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors">
              {t("nav.categories")} <ChevronDown size={12} className={`ml-1 opacity-70 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isCatOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-bg-secondary/95 border border-border-main shadow-2xl rounded-xl overflow-hidden p-2 backdrop-blur-xl z-[110]"
                >
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="flex items-center p-3 hover:bg-bg-primary rounded-lg group transition-all"
                    >
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-bg-primary mr-3 text-text-secondary group-hover:text-turquoise transition-colors`}>
                        <cat.icon size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-text-primary uppercase tracking-widest group-hover:text-turquoise transition-colors">
                          {t(cat.nameKey)}
                        </div>
                        <div className="text-[8px] text-text-secondary/60 font-mono leading-none mt-1">
                          {t(cat.shortDescKey)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corrected paths to point to home page sections from anywhere */}
          <Link href="/articles" className="px-3.5 py-2 text-[11px] font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors">{t("nav.articles")}</Link>
          <Link href="/labs" className="px-3.5 py-2 text-[11px] font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors">{t("nav.labs")}</Link>
          <Link href="/products" className="px-3.5 py-2 text-[11px] font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors">{t("nav.products")}</Link>
          <Link href="/about" className="px-3.5 py-2 text-[11px] font-semibold tracking-wide text-text-secondary hover:text-text-primary transition-colors">{t("nav.about")}</Link>
        </div>

        {/* RIGHT ACTIONS — lang always visible on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 z-10">
          <div className="hidden md:block">
            <CommandSearch />
          </div>

          <div className="flex bg-bg-secondary/60 border border-border-main rounded-full p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => switchLang("FR")}
              className={`min-w-[2rem] px-2 py-1 text-[10px] font-semibold rounded-full transition-colors ${
                lang === "FR" ? "bg-text-primary text-bg-primary" : "text-text-secondary"
              }`}
              aria-label="Français"
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => switchLang("EN")}
              className={`min-w-[2rem] px-2 py-1 text-[10px] font-semibold rounded-full transition-colors ${
                lang === "EN" ? "bg-text-primary text-bg-primary" : "text-text-secondary"
              }`}
              aria-label="English"
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-full border border-border-main bg-bg-secondary/50 text-text-secondary hover:text-turquoise transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-text-primary bg-bg-secondary border border-border-main"
            aria-label="Menu"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU — compact, no lang (already in bar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-3 max-h-[min(70vh,28rem)] overflow-y-auto overscroll-contain border-t border-border-main/20 pt-3 pb-2"
          >
            <Link href="/" className="block px-3 py-2 text-[13px] font-semibold rounded-lg hover:bg-bg-secondary" onClick={handleHomeClick}>{t("nav.home")}</Link>
            <Link href="/articles" className="block px-3 py-2 text-[13px] font-semibold rounded-lg hover:bg-bg-secondary" onClick={() => setIsOpen(false)}>{t("nav.articles")}</Link>
            <Link href="/labs" className="block px-3 py-2 text-[13px] font-semibold rounded-lg hover:bg-bg-secondary" onClick={() => setIsOpen(false)}>{t("nav.labs")}</Link>
            <Link href="/products" className="block px-3 py-2 text-[13px] font-semibold rounded-lg hover:bg-bg-secondary" onClick={() => setIsOpen(false)}>{t("nav.products")}</Link>
            <Link href="/experience" className="block px-3 py-2 text-[13px] font-semibold rounded-lg hover:bg-bg-secondary" onClick={() => setIsOpen(false)}>{t("exp.title")}</Link>
            <Link href="/about" className="block px-3 py-2 text-[13px] font-semibold rounded-lg hover:bg-bg-secondary" onClick={() => setIsOpen(false)}>{t("nav.about")}</Link>

            <div className="mt-2 px-3 pt-2 border-t border-border-main/15">
              <p className="text-[11px] font-semibold text-text-secondary/60 mb-1.5">{t("nav.categories")}</p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-bg-secondary hover:text-turquoise"
                    onClick={() => setIsOpen(false)}
                  >
                    <cat.icon size={13} className="opacity-70 shrink-0" />
                    <span className="truncate">{t(cat.nameKey)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
