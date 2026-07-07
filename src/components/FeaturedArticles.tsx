"use client";

import { Clock, Calendar, ArrowRight, Network, ShieldCheck, Zap, Bug, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const recentArticles = [
  {
    title: "Implementing Zero Trust with FreeIPA and HashiCorp Vault",
    excerpt: "Step-by-step architecture to deploy a Zero Trust model in a hybrid environment.",
    category: "CYBERSÉCURITÉ",
    readTime: "12 min",
    date: "2025-01-12",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Terraform Multi-Cloud: Advanced Deployment Patterns",
    excerpt: "Structuring Terraform modules for seamless deployment across AWS and Azure.",
    category: "CLOUD",
    readTime: "18 min",
    date: "2025-01-10",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    title: "OSPF Neighbor Stuck in INIT: Complete Diagnosis",
    excerpt: "Detailed runbook for resolving stuck OSPF adjacencies, with Wireshark captures.",
    category: "TROUBLESHOOT",
    readTime: "8 min",
    date: "2025-01-08",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

function RoutingTopology() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0a1628]">
      <div className="absolute inset-0 noc-grid opacity-5"></div>
      
      <svg className="w-[80%] h-[80%] text-turquoise/20" viewBox="0 0 100 100">
        {/* Network Nodes Positions */}
        {/* Source: (15, 50), Router: (40, 50), Path1: (65, 30), Path2: (65, 70), Dest: (90, 50) */}
        
        {/* Background Potential Paths (Inactive) */}
        <path d="M 40 50 L 65 70 L 90 50" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
        
        {/* Selected Optimal Path (Active) */}
        <motion.path
          d="M 15 50 L 40 50 L 65 30 L 90 50"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="1"
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="opacity-40"
        />

        {/* Data Packet (The decision maker) */}
        <motion.circle r="2" className="fill-turquoise shadow-[0_0_10px_#2dd4bf]">
          <animateMotion 
            dur="3s" 
            repeatCount="indefinite" 
            path="M 15 50 L 40 50 L 65 30 L 90 50" 
          />
        </motion.circle>

        {/* Node Points */}
        <circle cx="15" cy="50" r="2" className="fill-text-secondary/40" />
        
        {/* Router Node with Icon */}
        <foreignObject x="32" y="42" width="16" height="16">
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-md border border-turquoise/40 shadow-lg">
            <Network size={10} className="text-turquoise" />
          </div>
        </foreignObject>

        <circle cx="65" cy="30" r="2" className="fill-turquoise shadow-[0_0_8px_#2dd4bf]" />
        <circle cx="65" cy="70" r="2" className="fill-text-secondary/20" />
        <circle cx="90" cy="50" r="2.5" className="fill-turquoise shadow-[0_0_12px_#2dd4bf]" />
        
        <text x="40" y="68" textAnchor="middle" className="text-[3px] font-mono fill-turquoise opacity-40 uppercase tracking-[0.3em] font-bold">
          PATH SELECTION ACTIVE
        </text>
      </svg>
    </div>
  );
}

export default function FeaturedArticles() {
  const { t } = useLanguage();

  return (
    <section id="articles" className="py-20 bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 noc-grid opacity-5 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="flex justify-between items-end mb-10 max-w-5xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-text-primary uppercase">Featured articles</h2>
          <Link href="#" className="flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group">
            All articles <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* REDUCED WIDTH CARD - Added max-w-5xl */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto bg-bg-secondary border border-border-main rounded-2xl overflow-hidden mb-16 group hover:border-turquoise/30 transition-all shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
            {/* Left: Graphic Area - Path Selection Animation */}
            <div className="lg:col-span-5 h-56 lg:h-auto border-r border-border-main/50 relative">
              <RoutingTopology />
            </div>
            
            {/* Right: Content Area */}
            <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-5">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold uppercase tracking-widest">NETWORKING</span>
                <span className="text-[9px] font-mono text-text-secondary/40 uppercase font-bold">15 min read</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-4 leading-tight group-hover:text-turquoise transition-colors tracking-tight">
                Mastering BGP Communities for Policy Routing
              </h3>
              
              <p className="text-text-secondary text-sm md:text-base mb-8 leading-relaxed font-medium opacity-80">
                Comprehensive guide on advanced BGP communities usage to control traffic flow, implement routing policies, and optimize peering with your upstreams.
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20 font-black text-[10px] text-turquoise">
                  D
                </div>
                <div>
                  <div className="text-[11px] font-bold text-text-primary uppercase tracking-widest leading-none">DailyOps</div>
                  <div className="text-[9px] font-mono text-text-secondary/40 mt-1">2025-01-15</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Articles Grid - Also balanced in width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {recentArticles.map((article, index) => (
            <motion.article 
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-8 bg-bg-secondary/40 border border-border-main rounded-2xl flex flex-col hover:border-turquoise/30 transition-all group backdrop-blur-sm"
            >
              <div className="mb-5">
                <span className={`px-2 py-0.5 rounded ${article.bg} ${article.color} text-[9px] font-bold uppercase tracking-widest border border-white/5`}>
                  {article.category}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-text-primary mb-4 leading-tight group-hover:text-turquoise transition-colors">
                {article.title}
              </h4>
              
              <p className="text-text-secondary text-xs mb-8 flex-grow font-medium leading-relaxed opacity-70">
                {article.excerpt}
              </p>
              
              <div className="flex justify-between items-center pt-6 border-t border-border-main/50 text-[9px] font-mono text-text-secondary/40 font-bold uppercase tracking-widest">
                <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {article.readTime}</span>
                <span>{article.date}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}


