"use client";

import { FileCode, Laptop, Book, GraduationCap, Download, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const resources = [
  {
    title: "Cheatsheets",
    desc: "Commandes et syntaxes essentielles",
    linkText: "35 cheatsheets",
    icon: FileCode,
    href: "#",
    actionIcon: Download
  },
  {
    title: "Scripts",
    desc: "Automatisation et monitoring",
    linkText: "GitHub Repo",
    icon: Laptop,
    href: "#",
    actionIcon: ExternalLink
  },
  {
    title: "Templates",
    desc: "Documentation et runbooks",
    linkText: "20 templates",
    icon: Book,
    href: "#",
    actionIcon: Download
  },
  {
    title: "Formations",
    desc: "Guides et labs pratiques",
    linkText: "12 cours",
    icon: GraduationCap,
    href: "#",
    actionIcon: Play,
    highlight: true
  }
];

export default function ResourcesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-[#0a1120] relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            <span className="text-turquoise">//</span> Outils & Ressources
          </h2>
          <p className="text-text-secondary text-lg font-medium">Toolbox pour professionnels infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {resources.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative rounded-xl border p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                item.highlight 
                ? "bg-bg-secondary/10 border-turquoise shadow-[0_0_20px_rgba(43,217,197,0.1)]" 
                : "bg-bg-secondary/5 border-white/5 hover:border-turquoise/30"
              }`}
            >
              <item.icon className="h-10 w-10 text-turquoise mb-6 transition-transform duration-500 group-hover:scale-110" />
              
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-[11px] text-text-secondary font-medium mb-6 leading-relaxed px-2">
                {item.desc}
              </p>
              
              <Link 
                href={item.href} 
                className="text-turquoise hover:underline text-[11px] font-black uppercase tracking-widest flex items-center mt-auto"
              >
                {item.linkText} 
                <item.actionIcon size={12} className="ml-1.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
