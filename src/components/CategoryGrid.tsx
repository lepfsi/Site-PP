"use client";

import { Shield, Server, Cloud, Bug, Globe, Zap, ArrowRight, Code2, Activity, GitBranch } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";

const TYPING_TAGS = [
  { text: "Infrastructure IT", icon: Code2, cmd: "$ terraform apply", log: "plan: 4 to add, 0 change" },
  { text: "Cybersécurité", icon: Shield, cmd: "$ nmap -sV target.io", log: "port 443/tcp open (https)" },
  { text: "Cloud Native", icon: Cloud, cmd: "$ kubectl get pods", log: "api-v2-7x9z Running 1/1" },
  { text: "Networking", icon: Globe, cmd: "$ show ip bgp summ", log: "neighbor 1.1.1.1 Establ." },
  { text: "Troubleshooting", icon: Bug, cmd: "$ tcpdump -i eth0", log: "12:04:15.82 IP: ICMP echo" }
];

function TypewriterTerminal() {
  const [tagIndex, setTagIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = TYPING_TAGS[tagIndex].text;
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setTagIndex((prev) => (prev + 1) % TYPING_TAGS.length);
      } else {
        const nextChar = isDeleting 
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1);
        setCurrentText(nextChar);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, tagIndex]);

  const activeTag = TYPING_TAGS[tagIndex];
  const TagIcon = activeTag.icon;

  return (
    <div className="flex items-center space-x-4">
      <motion.div 
        key={tagIndex}
        className="flex items-center space-x-2 px-3 py-1.5 bg-bg-secondary border border-border-main rounded-lg shadow-sm"
      >
        <TagIcon size={14} className="text-turquoise" />
        <div className="flex items-center text-turquoise font-mono text-[11px] font-bold tracking-widest uppercase">
          <span>{currentText}</span>
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 h-3.5 bg-turquoise ml-1" />
        </div>
      </motion.div>

      <div className="hidden sm:flex flex-col w-48 bg-navy/90 border border-green-500/30 rounded-lg p-2 font-mono text-[8px] shadow-lg shadow-green-500/5 min-h-[40px]">
        <div className="flex space-x-1 mb-1 opacity-50">
          <div className="w-1 h-1 rounded-full bg-[#ff5f57]/60"></div>
          <div className="w-1 h-1 rounded-full bg-[#febc2e]/60"></div>
          <div className="w-1 h-1 rounded-full bg-[#28c840]/60"></div>
        </div>
        <div className="text-green-500/80 leading-tight">
          <div className="truncate">{activeTag.cmd}</div>
          <div className="flex items-center">
            <span className="animate-pulse">_</span>
            <span className="ml-1 truncate text-green-400 opacity-70">{activeTag.log}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const categories = [
  {
    id: "networking",
    nameKey: "cat.networking_name" as const,
    descKey: "cat.networking_full" as const,
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
    tags: ["BGP", "OSPF", "VLAN", "VPN"],
    count: 124,
    href: "/category/networking",
  },
  {
    id: "cybersecurity",
    nameKey: "cat.cybersecurity_name" as const,
    descKey: "cat.cybersecurity_full" as const,
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
    tags: ["Zero Trust", "SIEM", "Pentest"],
    count: 98,
    href: "/category/cybersecurity",
  },
  {
    id: "infrastructure",
    nameKey: "cat.infrastructure_name" as const,
    descKey: "cat.infrastructure_full" as const,
    icon: Server,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
    tags: ["HA", "Proxmox", "SAN"],
    count: 156,
    href: "/category/infrastructure",
  },
  {
    id: "cloud",
    nameKey: "cat.cloud_name" as const,
    descKey: "cat.cloud_full" as const,
    icon: Cloud,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-400/50",
    tags: ["K8s", "Docker", "Terraform"],
    count: 132,
    href: "/category/cloud",
  },
  {
    id: "automation",
    nameKey: "cat.automation_name" as const,
    descKey: "cat.automation_full" as const,
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "group-hover:border-pink-500/50",
    tags: ["Ansible", "Python", "CI/CD"],
    count: 64,
    href: "/category/devops",
  },
  {
    id: "troubleshooting",
    nameKey: "cat.troubleshooting_name" as const,
    descKey: "cat.troubleshooting_full" as const,
    icon: Bug,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "group-hover:border-orange-500/50",
    tags: ["Methodology", "RCA", "Packet Analysis"],
    count: 87,
    href: "/category/troubleshooting",
  },
];

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-24 bg-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 noc-grid opacity-20 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-turquoise">// </span>{t("cat.title")}
            </h2>
            <p className="text-text-secondary text-lg font-medium">{t("cat.subtitle")}</p>
          </div>
          
          <TypewriterTerminal />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link 
                href={category.href}
                className={`group flex flex-col h-full p-8 bg-bg-primary/40 border border-border-main rounded-2xl transition-all duration-300 ${category.border} backdrop-blur-sm hover:shadow-2xl hover:shadow-black/20`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 rounded-xl ${category.bg} ${category.color} flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}>
                    <category.icon size={24} />
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary/40 uppercase tracking-widest pt-2">
                    {category.count} {t("cat.articles")}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-turquoise transition-colors">
                  {t(category.nameKey)}
                </h3>
                
                <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-grow font-medium">
                  {t(category.descKey)}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-6 border-t border-border-main/50">
                  {category.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className={`px-3 py-1 rounded-md bg-bg-secondary border border-border-main text-[10px] font-bold uppercase tracking-wider ${category.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                    >
                      {tag}
                    </span>
                  ))}
                  <div className="ml-auto w-7 h-7 rounded-full bg-bg-primary border border-border-main flex items-center justify-center text-text-secondary group-hover:text-turquoise group-hover:border-turquoise transition-all">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
