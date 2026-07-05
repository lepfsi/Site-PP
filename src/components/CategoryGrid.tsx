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
    tags: ["Cisco", "BGP", "OSPF", "SD-WAN"],
    count: 42,
    href: "/category/networking",
  },
  {
    id: "cybersecurity",
    nameKey: "cat.cybersecurity_name" as const,
    descKey: "cat.cybersecurity_full" as const,
    icon: Shield,
    tags: ["Firewall", "Zero Trust", "SOC", "SIEM"],
    count: 38,
    href: "/category/cybersecurity",
  },
  {
    id: "infrastructure",
    nameKey: "cat.infrastructure_name" as const,
    descKey: "cat.infrastructure_full" as const,
    icon: Server,
    tags: ["Datacenter", "HA", "Storage", "DR"],
    count: 51,
    href: "/category/infrastructure",
  },
  {
    id: "cloud",
    nameKey: "cat.cloud_name" as const,
    descKey: "cat.cloud_full" as const,
    icon: Cloud,
    tags: ["AWS", "K8s", "Docker", "VMware"],
    count: 67,
    href: "/category/cloud",
  },
  {
    id: "troubleshooting",
    nameKey: "cat.troubleshooting_name" as const,
    descKey: "cat.troubleshooting_full" as const,
    icon: Bug,
    tags: ["Wireshark", "tcpdump", "Debug", "Tools"],
    count: 45,
    href: "/category/troubleshooting",
  },
  {
    id: "devops",
    nameKey: "cat.automation_name" as const,
    descKey: "cat.automation_full" as const,
    icon: Zap,
    tags: ["Ansible", "Terraform", "GitOps", "Python"],
    count: 39,
    href: "/category/devops",
  },
];

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-20 bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-turquoise">// </span>{t("cat.title")}
            </h2>
            <p className="text-text-secondary text-lg font-medium">{t("cat.subtitle")}</p>
          </div>
          
          <TypewriterTerminal />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl border border-border-main bg-bg-secondary p-8 hover:border-turquoise transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-turquoise/10"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-turquoise to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="w-12 h-12 bg-turquoise/10 rounded-xl flex items-center justify-center text-turquoise text-2xl mb-6">
                <category.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-3">{t(category.nameKey)}</h3>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {t(category.descKey)}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {category.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md bg-turquoise/10 text-turquoise text-[10px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              <Link href={category.href} className="inline-flex items-center text-turquoise hover:underline font-semibold text-sm">
                {category.count} {t("cat.articles")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

