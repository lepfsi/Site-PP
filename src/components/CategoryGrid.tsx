"use client";

import { Shield, Server, Cloud, Bug, Globe, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const categories = [
  {
    id: "networking",
    nameKey: "cat.networking_name" as const,
    descKey: "cat.networking_full" as const,
    certKey: "cat.cert_net" as const,
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
    count: 124,
    href: "/category/networking",
  },
  {
    id: "cybersecurity",
    nameKey: "cat.cybersecurity_name" as const,
    descKey: "cat.cybersecurity_full" as const,
    certKey: "cat.cert_cyber" as const,
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
    count: 98,
    href: "/category/cybersecurity",
  },
  {
    id: "infrastructure",
    nameKey: "cat.infrastructure_name" as const,
    descKey: "cat.infrastructure_full" as const,
    certKey: "cat.cert_infra" as const,
    icon: Server,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
    count: 156,
    href: "/category/infrastructure",
  },
  {
    id: "cloud",
    nameKey: "cat.cloud_name" as const,
    descKey: "cat.cloud_full" as const,
    certKey: "cat.cert_cloud" as const,
    icon: Cloud,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-400/50",
    count: 132,
    href: "/category/cloud",
  },
  {
    id: "troubleshooting",
    nameKey: "cat.troubleshooting_name" as const,
    descKey: "cat.troubleshooting_full" as const,
    certKey: "cat.cert_trouble" as const,
    icon: Bug,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "group-hover:border-orange-500/50",
    count: 87,
    href: "/category/troubleshooting",
  },
  {
    id: "automation",
    nameKey: "cat.automation_name" as const,
    descKey: "cat.automation_full" as const,
    certKey: "cat.cert_auto" as const,
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "group-hover:border-pink-500/50",
    count: 64,
    href: "/category/devops",
  },
];

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-24 bg-bg-primary relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 noc-grid opacity-20 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-6"
          >
            {t("cat.title")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl mx-auto font-medium"
          >
            {t("cat.subtitle")}
          </motion.p>
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
                className={`group flex flex-col h-full p-8 bg-bg-secondary/50 border border-border-main rounded-2xl transition-all duration-300 ${category.border} backdrop-blur-sm hover:shadow-2xl hover:shadow-black/20`}
              >
                <div className={`w-12 h-12 rounded-xl ${category.bg} ${category.color} flex items-center justify-center mb-8 transition-transform duration-500 group-hover:rotate-12`}>
                  <category.icon size={24} />
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-turquoise transition-colors">
                  {t(category.nameKey)}
                </h3>
                
                <p className="text-text-secondary text-sm leading-relaxed mb-10 flex-grow font-medium">
                  {t(category.descKey)}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-border-main/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/40">
                      {category.count} {t("cat.articles")}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${category.color} mt-1`}>
                      • {t(category.certKey)}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-main flex items-center justify-center text-text-secondary group-hover:text-turquoise group-hover:border-turquoise transition-all">
                    <ArrowRight size={14} />
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
