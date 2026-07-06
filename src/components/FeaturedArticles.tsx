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

function AnimatedTopology() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg className="w-4/5 h-4/5 text-turquoise/20" viewBox="0 0 100 100">
        <motion.path
          d="M 50 20 L 20 50 L 50 80 L 80 50 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.path
          d="M 50 20 L 50 80 M 20 50 L 80 50"
          stroke="currentColor"
          strokeWidth="0.5"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        
        {/* Animated Nodes */}
        <motion.circle cx="50" cy="20" r="1.5" className="fill-turquoise" animate={{ r: [1.5, 2.5, 1.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="20" cy="50" r="1.5" className="fill-turquoise" animate={{ r: [1.5, 2.5, 1.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
        <motion.circle cx="50" cy="80" r="1.5" className="fill-turquoise" animate={{ r: [1.5, 2.5, 1.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
        <motion.circle cx="80" cy="50" r="1.5" className="fill-turquoise" animate={{ r: [1.5, 2.5, 1.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />
        
        {/* Central Icon */}
        <foreignObject x="42" y="42" width="16" height="16">
          <div className="w-full h-full flex items-center justify-center bg-bg-secondary rounded-md border border-turquoise/30 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
            <Network size={10} className="text-turquoise" />
          </div>
        </foreignObject>
        
        <text x="50" y="65" textAnchor="middle" className="text-[4px] font-mono fill-turquoise opacity-40 uppercase tracking-widest">
          BGP • ROUTING • POLICY
        </text>
      </svg>
    </div>
  );
}

export default function FeaturedArticles() {
  const { t } = useLanguage();

  return (
    <section id="articles" className="py-24 bg-bg-primary">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-text-primary mb-2">Featured articles</h2>
          </div>
          <Link href="#" className="flex items-center text-xs font-black uppercase tracking-widest text-turquoise hover:underline group">
            All articles <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Article Card (Image 2 style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-bg-secondary/40 border border-border-main rounded-[2rem] overflow-hidden mb-12 group hover:border-turquoise/30 transition-colors"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Animated Graphics */}
            <div className="h-64 lg:h-auto bg-navy/20 border-r border-border-main/50 relative">
              <div className="absolute inset-0 noc-grid opacity-10"></div>
              <AnimatedTopology />
            </div>
            
            {/* Right: Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest">NETWORKING</span>
                <span className="text-[10px] font-mono text-text-secondary/40">15 min de lecture</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-text-primary mb-6 leading-tight group-hover:text-turquoise transition-colors">
                Mastering BGP Communities for Policy Routing
              </h3>
              
              <p className="text-text-secondary text-base md:text-lg mb-10 leading-relaxed font-medium">
                Comprehensive guide on advanced BGP communities usage to control traffic flow, implement routing policies, and optimize peering with your upstreams.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-turquoise/10 flex items-center justify-center border border-turquoise/20">
                  <span className="text-turquoise font-black text-sm">D</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-text-primary">DailyOps</div>
                  <div className="text-[10px] font-mono text-text-secondary/40">2025-01-15</div>
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
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-bg-secondary/40 border border-border-main rounded-2xl flex flex-col hover:border-turquoise/30 transition-all group"
            >
              <div className="mb-6">
                <span className={`px-2 py-0.5 rounded ${article.bg} ${article.color} text-[9px] font-bold uppercase tracking-widest`}>
                  {article.category}
                </span>
              </div>
              
              <h4 className="text-xl font-bold text-text-primary mb-4 leading-tight group-hover:text-turquoise transition-colors">
                {article.title}
              </h4>
              
              <p className="text-text-secondary text-sm mb-8 flex-grow font-medium leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex justify-between items-center pt-6 border-t border-border-main/50 text-[10px] font-mono text-text-secondary/40">
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
