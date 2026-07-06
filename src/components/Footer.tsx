"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Rss, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Logo from "./Logo";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-bg-primary border-t border-border-main pt-24 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          
          {/* Logo and Social Section (Left) */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <Logo />
            </Link>
            
            <p className="text-text-secondary text-base max-w-sm mb-8 font-medium leading-relaxed">
              A premium knowledge base for IT infrastructure professionals — networking, security, cloud and operations.
            </p>
            
            {/* Social Icons Aligned - Circular Style from Image */}
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
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-border-main text-text-secondary hover:text-turquoise hover:border-turquoise transition-all bg-transparent shadow-sm"
                >
                  <item.Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Categories Column */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary mb-6">Categories</h4>
            <ul className="space-y-4">
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Networking</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cybersecurity</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Infrastructure</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Cloud & Virt.</Link></li>
              <li><Link href="#categories" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Troubleshooting</Link></li>
            </ul>
          </div>
          
          {/* Resources Column */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Technical glossary</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Operational checklists</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Field feedback</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">About the author</Link></li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-sm font-bold text-text-primary mb-6">Information</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Legal notice</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Privacy policy</Link></li>
              <li><Link href="#" className="text-sm font-medium text-text-secondary hover:text-turquoise transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border-main flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-text-secondary/50 uppercase tracking-widest">
            © 2026 DailyOps.Tech — {t("footer.rights")}
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-[10px] font-black text-text-secondary/50 uppercase tracking-widest">
              <Heart size={14} className="text-red-500 mr-2 fill-red-500" /> {t("footer.made")}
            </span>
            <div className="h-1 w-1 rounded-full bg-border-main"></div>
            <span className="text-[10px] font-black text-turquoise uppercase tracking-widest bg-turquoise/10 px-3 py-1.5 rounded-xl border border-turquoise/20">V2.4.0-STABLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
