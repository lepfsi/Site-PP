"use client";

import Link from "next/link";
import { Github, Linkedin, Rss, Heart, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Logo from "./Logo";

// Custom X icon (formerly Twitter)
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16H20L8.267 4z" />
    <path d="M4 20l6.768-6.768m2.464-2.464L20 4" />
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-main pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Section (Left) */}
          <div className="md:col-span-4 lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Logo />
            </Link>
            
            <p className="text-text-secondary text-sm max-w-[260px] mb-8 leading-relaxed font-medium">
              Base de connaissances premium pour professionnels IT Infrastructure.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-5">
              <Link href="#" className="text-text-secondary hover:text-white transition-colors" title="LinkedIn">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors" title="GitHub">
                <Github size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors" title="X (Twitter)">
                <XIcon size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors" title="Facebook">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-text-secondary hover:text-white transition-colors" title="RSS Feed">
                <Rss size={20} />
              </Link>
            </div>
          </div>
          
          {/* Categories Column - ALL 6 CATEGORIES */}
          <div className="md:col-span-2 lg:col-span-2 md:ml-auto">
            <h4 className="text-base font-bold text-white mb-6">Catégories</h4>
            <ul className="space-y-4">
              <li><Link href="/category/networking" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Networking</Link></li>
              <li><Link href="/category/cybersecurity" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cybersecurity</Link></li>
              <li><Link href="/category/infrastructure" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Infrastructure</Link></li>
              <li><Link href="/category/cloud" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cloud & Virtualisation</Link></li>
              <li><Link href="/category/automation" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Automation & AI</Link></li>
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
              <li><Link href="/about" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">L'auteur</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Méthodologie</Link></li>
              <li><Link href="/about" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Mentions légales</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">RSS Feed</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium text-text-secondary/50 uppercase tracking-widest">
            © 2026 DailyOps.Tech — Tous droits réservés
          </p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-[11px] font-medium text-text-secondary/50 uppercase tracking-widest">
              <Heart size={14} className="text-red-500 mr-2 fill-red-500" /> Made with passion for IT pros
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2BD9C5] animate-pulse"></span>
              <span className="text-[11px] font-black text-[#2BD9C5] uppercase tracking-widest">Production Ready</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
