"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Rss, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-main pt-12 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          
          {/* Logo and Social Section (Left) */}
          <div className="md:col-span-5 lg:col-span-6">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            
            <p className="text-text-secondary text-sm max-w-sm mb-6 font-medium leading-relaxed">
              Base de connaissances premium pour les professionnels de l'infrastructure IT — réseau, sécurité, cloud et opérations.
            </p>
            
            <div className="flex space-x-3">
              {[
                { Icon: Linkedin, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Rss, href: "#" }
              ].map((item, i) => (
                <Link 
                  key={i}
                  href={item.href} 
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border-main text-text-secondary hover:text-turquoise hover:border-turquoise transition-all bg-transparent shadow-sm"
                >
                  <item.Icon size={16} />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Categories Column - UPDATED TO 6 CATEGORIES */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><Link href="/category/networking" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Networking</Link></li>
              <li><Link href="/category/cybersecurity" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Cybersecurity</Link></li>
              <li><Link href="/category/infrastructure" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Infrastructure</Link></li>
              <li><Link href="/category/cloud" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Cloud & Virt.</Link></li>
              <li><Link href="/category/automation" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Automation & AI</Link></li>
              <li><Link href="/category/troubleshooting" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Troubleshooting</Link></li>
            </ul>
          </div>
          
          {/* Resources & Info Column - Combined for compactness */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Glossary</Link></li>
              <li><Link href="#" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Checklists</Link></li>
              <li><Link href="#" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Contact</Link></li>
              <li><Link href="#" className="text-xs font-bold text-text-secondary hover:text-turquoise transition-colors uppercase tracking-widest">Legal Notice</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black text-text-secondary/40 uppercase tracking-widest">
            © 2026 DailyOps.Tech — Tous droits réservés
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-[9px] font-black text-text-secondary/40 uppercase tracking-widest">
              <Heart size={12} className="text-red-500 mr-1.5 fill-red-500" /> Crafted for Ops
            </span>
            <span className="text-[9px] font-black text-turquoise uppercase tracking-widest bg-turquoise/10 px-2 py-1 rounded-lg border border-turquoise/20">V2.4.0-STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
