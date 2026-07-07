"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock, AlertTriangle, Settings, Shield, Zap, Flame, CheckCircle2, Monitor } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const newExperiences = [
  {
    titleKey: "exp.4.title" as const,
    descKey: "exp.4.desc" as const,
    footerKey: "exp.4.footer" as const,
    badgeKey: "exp.badge_incident" as const,
    icon: AlertTriangle,
    color: "border-blue-500",
    iconColor: "text-blue-500",
  },
  {
    titleKey: "exp.5.title" as const,
    descKey: "exp.5.desc" as const,
    footerKey: "exp.5.footer" as const,
    badgeKey: "exp.badge_optimization" as const,
    icon: Settings,
    color: "border-orange-500",
    iconColor: "text-orange-500",
  },
  {
    titleKey: "exp.6.title" as const,
    descKey: "exp.6.desc" as const,
    footerKey: "exp.6.footer" as const,
    badgeKey: "exp.badge_security" as const,
    icon: Shield,
    color: "border-red-500",
    iconColor: "text-red-500",
  },
];

const oldExperiences = [
  {
    titleKey: "exp.1.title" as const,
    descKey: "exp.1.desc" as const,
    emoji: "🔥",
    icon: Flame,
    color: "border-red-500",
    readTime: "25 min",
    views: "8.2K",
  },
  {
    titleKey: "exp.2.title" as const,
    descKey: "exp.2.desc" as const,
    emoji: "✅",
    icon: CheckCircle2,
    color: "border-green-500",
    readTime: "30 min",
    views: "12.5K",
  },
  {
    titleKey: "exp.3.title" as const,
    descKey: "exp.3.desc" as const,
    emoji: "⚡",
    icon: Zap,
    color: "border-yellow-500",
    readTime: "22 min",
    views: "9.8K",
  },
];

export default function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-24 bg-bg-primary relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-6"
          >
            {t("exp.title")}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-3xl mx-auto font-medium"
          >
            {t("exp.subtitle")}
          </motion.p>
        </div>

        {/* Row 1: New Modern Cards from Capture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {newExperiences.map((exp, index) => (
            <motion.div
              key={exp.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group flex flex-col p-8 bg-[#0f172a] border-l-4 ${exp.color} rounded-r-2xl shadow-xl transition-all hover:translate-x-1`}
            >
              <div className="flex items-center space-x-2 mb-6">
                <exp.icon size={16} className={exp.iconColor} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${exp.iconColor}`}>
                  {t(exp.badgeKey)}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-turquoise transition-colors">
                {t(exp.titleKey)}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-grow font-medium">
                {t(exp.descKey)}
              </p>
              
              <div className="flex items-center space-x-4 pt-6 border-t border-white/5 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">
                <div className="flex items-center">
                  <Clock size={12} className="mr-1.5" />
                  {t(exp.footerKey)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Row 2: Original Cards Mixed In */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {oldExperiences.map((exp, index) => (
            <motion.div
              key={exp.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 3) * 0.1 }}
              viewport={{ once: true }}
              className={`group flex flex-col p-8 bg-bg-secondary/40 border-l-4 ${exp.color} rounded-r-2xl shadow-lg transition-all hover:translate-x-1 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl">{exp.emoji}</span>
                <span className="text-[10px] font-mono text-text-secondary/30 uppercase font-black tracking-widest">Case Log #0{index + 1}</span>
              </div>
              
              <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-turquoise transition-colors">
                {t(exp.titleKey)}
              </h3>
              
              <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-grow font-medium">
                {t(exp.descKey)}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-border-main/50">
                <div className="flex items-center space-x-4 text-[10px] font-mono text-text-secondary/40 font-bold uppercase tracking-widest">
                  <span className="flex items-center"><Clock size={12} className="mr-1.5" /> {exp.readTime}</span>
                  <span className="flex items-center"><Eye size={12} className="mr-1.5" /> {exp.views}</span>
                </div>
                <Link href="#" className="text-turquoise hover:text-turquoise-dark transition-colors">
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
