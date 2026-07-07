"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Rss, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-main pt-16 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section (Left) */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="mb-6">
               <div className="flex items-baseline code-font select-none">
                 <span className="text-2xl font-bold tracking-tight text-turquoise">DailyOps</span>
                 <span className="text-2xl font-bold tracking-tight text-white ml-2">.Tech</span>
               </div>
            </div>
            
            <p className="text-text-secondary text-sm max-w-[260px] mb-8 leading-relaxed font-medium">
              Base de connaissances premium pour professionnels IT Infrastructure.
            </p>
            
            {/* Social Icons - Simple Monochrome Style as in Capture */}
            <div className="flex space-x-5">
              <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                <Rss size={20} />
              </Link>
            </div>
          </div>
          
          {/* Categories Column */}
          <div className="md:col-span-2 lg:col-span-2 md:ml-auto">
            <h4 className="text-base font-bold text-white mb-6">Catégories</h4>
            <ul className="space-y-4">
              <li><Link href="/category/networking" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Networking</Link></li>
              <li><Link href="/category/cybersecurity" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cybersecurity</Link></li>
              <li><Link href="/category/infrastructure" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Infrastructure</Link></li>
              <li><Link href="/category/cloud" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cloud & Virtualisation</Link></li>
              <li><Link href="/category/troubleshooting" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Troubleshooting</Link></li>
            </ul>
          </div>
          
          {/* Resources Column */}
          <div className="md:col-span-3 lg:col-span-3 md:ml-auto">
            <h4 className="text-base font-bold text-white mb-6">Ressources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cheatsheets</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Scripts & Tools</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Formations</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Lab Environment</Link></li>
            </ul>
          </div>

          {/* About Column */}
          <div className="md:col-span-3 lg:col-span-3 md:ml-auto">
            <h4 className="text-base font-bold text-white mb-6">À propos</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">L'auteur</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Méthodologie</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Mentions légales</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">RSS Feed</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-text-secondary/30 uppercase tracking-widest">
            © 2026 DailyOps.Tech — {t("footer.rights")}
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-[10px] font-black text-text-secondary/30 uppercase tracking-widest">
              <Heart size={12} className="text-red-500/40 mr-1.5" /> Built for the Ops Community
            </span>
            <div className="h-1 w-1 rounded-full bg-border-main opacity-20"></div>
            <span className="text-[10px] font-black text-turquoise/40 uppercase tracking-widest bg-turquoise/5 px-2 py-0.5 rounded border border-turquoise/10">V2.4.0-STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
