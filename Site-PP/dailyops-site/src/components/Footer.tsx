"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Rss, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-deepblue border-t border-bluedark py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="code-font text-xl font-bold text-turquoise">DailyOps</span>
              <span className="code-font text-xl font-bold text-foreground">.Tech</span>
            </div>
            <p className="text-foreground/50 text-sm mb-4">
              Base de connaissances premium pour professionnels IT Infrastructure.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground/50 hover:text-turquoise transition"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/50 hover:text-turquoise transition"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/50 hover:text-turquoise transition"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/50 hover:text-turquoise transition"><Rss className="h-5 w-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="#" className="hover:text-turquoise transition">Networking</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Cybersecurity</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Infrastructure</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Cloud & Virtualisation</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Troubleshooting</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="#" className="hover:text-turquoise transition">Cheatsheets</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Templates</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Scripts & Tools</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Formations</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Lab Environment</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">À propos</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="#" className="hover:text-turquoise transition">L'auteur</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Méthodologie</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Contact</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">Mentions légales</Link></li>
              <li><Link href="#" className="hover:text-turquoise transition">RSS Feed</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-bluedark pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/40">
          <p className="mb-4 md:mb-0">
            © 2026 DailyOps.Tech - Tous droits réservés
          </p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Heart className="text-red-500 mr-2 h-4 w-4 fill-red-500" /> Made with passion for IT pros
            </span>
            <span className="pulse-dot"></span>
            <span className="text-turquoise font-semibold">Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
