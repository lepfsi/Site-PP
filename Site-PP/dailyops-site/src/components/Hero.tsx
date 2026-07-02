"use client";

import { motion } from "framer-motion";
import { Rocket, Mail, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-gradient grid-pattern relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00d4ff" opacity="0.3"/>
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00d4ff" strokeWidth="1" opacity="0.2"/>
              <line x1="50" y1="50" x2="50" y2="100" stroke="#00d4ff" strokeWidth="1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)"/>
        </svg>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-6 px-4 py-2 bg-deepblue border border-bluedark rounded-full">
              <span className="text-turquoise font-semibold code-font text-sm">v2.0 // Production Ready</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Infrastructure Knowledge,</span><br />
              <span className="text-turquoise">Daily Operations Excellence</span>
            </h1>
            
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Base de connaissances premium pour les professionnels IT Infrastructure. 
              Networking, Cybersecurity, Cloud, et Troubleshooting au quotidien.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href="#categories" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-turquoise to-turquoise-dark text-navy font-bold hover:scale-105 transition-all shadow-lg shadow-turquoise/20">
                <Rocket className="mr-2 h-5 w-5" /> Explorer les catégories
              </a>
              <a href="#newsletter" className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-turquoise text-turquoise font-bold hover:bg-turquoise hover:text-navy transition-all">
                <Mail className="mr-2 h-5 w-5" /> Newsletter hebdo
              </a>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input 
                type="text" 
                className="w-full bg-deepblue border-2 border-bluedark rounded-xl px-12 py-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-turquoise transition-all"
                placeholder="Rechercher : Cisco, Kubernetes, Firewall, VPN..."
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-turquoise h-6 w-6" />
            </div>
          </motion.div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-turquoise-dark">350+</div>
            <div className="text-foreground/50 font-semibold text-sm uppercase tracking-wider">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-turquoise-dark">50K+</div>
            <div className="text-foreground/50 font-semibold text-sm uppercase tracking-wider">Lecteurs/mois</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-turquoise-dark">12</div>
            <div className="text-foreground/50 font-semibold text-sm uppercase tracking-wider">Catégories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-turquoise to-turquoise-dark">24/7</div>
            <div className="text-foreground/50 font-semibold text-sm uppercase tracking-wider">Updated</div>
          </div>
        </div>
      </div>
    </section>
  );
}
