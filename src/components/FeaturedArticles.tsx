"use client";

import { Clock, Calendar, ArrowRight, Network, ShieldCheck, Zap, Bug, Globe, Code2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  },
  {
    title: "Proxmox VE HA Cluster: Production Guide",
    excerpt: "Deploying a high-availability Proxmox cluster with Ceph and corosync quorum.",
    category: "INFRASTRUCTURE",
    readTime: "20 min",
    date: "2025-01-05",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "WireGuard VPN: From Theory to Enterprise Deployment",
    excerpt: "Technical comparison, advanced configuration, and integration into existing IT systems.",
    category: "NETWORKING",
    readTime: "14 min",
    date: "2025-01-03",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Kubernetes Network Policies: Securing Intra-Cluster Traffic",
    excerpt: "Network Policy patterns for effective micro-segmentation in K8s.",
    category: "CLOUD",
    readTime: "10 min",
    date: "2024-12-28",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  }
];

function TreeTopology() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#112240]">
      <div className="absolute inset-0 noc-grid opacity-10"></div>
      
      <svg className="w-[85%] h-[85%] text-turquoise/20" viewBox="0 0 100 100">
        {/* Background Dotted Lines */}
        <motion.line 
          x1="10" y1="30" x2="90" y2="40" 
          stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.line 
          x1="20" y1="80" x2="80" y2="10" 
          stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        {/* Tree Structure Lines */}
        <motion.path
          d="M 35 50 L 60 25 M 35 50 L 75 55 M 35 50 L 65 85"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />

        {/* Nodes */}
        <motion.circle 
          cx="60" cy="25" r="2.5" 
          className="fill-turquoise opacity-40 shadow-[0_0_10px_#2dd4bf]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle 
          cx="75" cy="55" r="3.5" 
          className="fill-turquoise shadow-[0_0_15px_#2dd4bf]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle 
          cx="65" cy="85" r="2" 
          className="fill-turquoise opacity-30 shadow-[0_0_8px_#2dd4bf]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />
        <motion.circle 
          cx="15" cy="40" r="1.5" 
          className="fill-turquoise opacity-20"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />

        {/* Central Icon Area */}
        <foreignObject x="25" y="40" width="20" height="20">
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-lg border border-turquoise/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <Network size={12} className="text-turquoise" />
          </div>
        </foreignObject>
        
        {/* Label underneath icon */}
        <text x="35" y="66" textAnchor="middle" className="text-[3.5px] font-mono fill-turquoise/50 uppercase tracking-[0.3em] font-bold">
          BGP • ROUTING • POLICY
        </text>
      </svg>
    </div>
  );
}

export default function FeaturedArticles() {
  const { t } = useLanguage();

  return (
    <section id="articles" className="py-20 bg-bg-primary relative overflow-hidden">
      {/* Subtle global cadrillé background */}
      <div className="absolute inset-0 noc-grid opacity-5 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black tracking-tight text-text-primary uppercase">Featured articles</h2>
          <Link href="#" className="flex items-center text-[10px] font-black uppercase tracking-widest text-turquoise hover:underline group">
            All articles <ArrowRight size={12} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* FEATURED CARD - Refined to match image dimensions and design */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-bg-secondary border border-border-main rounded-2xl overflow-hidden mb-10 group hover:border-turquoise/30 transition-all shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
            {/* Left: Graphic Area (Tree Topology) */}
            <div className="lg:col-span-5 h-56 lg:h-auto border-r border-border-main/50 relative">
              <TreeTopology />
            </div>
            
            {/* Right: Content Area */}
            <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-5">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest">NETWORKING</span>
                <span className="text-[9px] font-mono text-text-secondary/40 uppercase font-bold">15 min de lecture</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-text-primary mb-4 leading-tight group-hover:text-turquoise transition-colors tracking-tight">
                Mastering BGP Communities for Policy Routing
              </h3>
              
              <p className="text-text-secondary text-sm md:text-base mb-8 leading-relaxed font-medium opacity-80">
                Comprehensive guide on advanced BGP communities usage to control traffic flow, implement routing policies, and optimize peering with your upstreams.
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20">
                  <span className="text-turquoise font-black text-[10px]">D</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-text-primary uppercase tracking-widest leading-none">DailyOps</div>
                  <div className="text-[9px] font-mono text-text-secondary/40 mt-1">2025-01-15</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

