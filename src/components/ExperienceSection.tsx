"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const experiences = [
  {
    titleKey: "exp.1.title" as const,
    descKey: "exp.1.desc" as const,
    tagKeys: ["exp.1.tag1", "exp.1.tag2", "exp.1.tag3"] as const,
    emoji: "🔥",
    color: "from-red-500 to-red-600",
    readTime: "25 min",
    views: "8.2K",
  },
  {
    titleKey: "exp.2.title" as const,
    descKey: "exp.2.desc" as const,
    tagKeys: ["exp.2.tag1", "exp.2.tag2", "exp.2.tag3"] as const,
    emoji: "✅",
    color: "from-green-500 to-green-600",
    readTime: "30 min",
    views: "12.5K",
  },
  {
    titleKey: "exp.3.title" as const,
    descKey: "exp.3.desc" as const,
    tagKeys: ["exp.3.tag1", "exp.3.tag2", "exp.3.tag3"] as const,
    emoji: "⚡",
    color: "from-yellow-500 to-yellow-600",
    readTime: "22 min",
    views: "9.8K",
  },
];

export default function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-20 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-turquoise">// </span>{t("exp.title")}
          </h2>
          <p className="text-foreground/50 text-lg">{t("exp.subtitle")}</p>
        </div>

        <div className="max-w-5xl mx-auto mb-10 rounded-xl border border-bluedark bg-deepblue/80 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-bluedark bg-navy/50">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-1 text-xs font-mono text-foreground/40">{t("exp.terminal_title")}</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-1.5">
            <p className="text-pink-400/90"><span className="opacity-40 mr-2">{">"}</span>{t("exp.log1")}</p>
            <p className="text-turquoise/90"><span className="opacity-40 mr-2">{">"}</span>{t("exp.log2")}</p>
            <p className="text-turquoise/90"><span className="opacity-40 mr-2">{">"}</span>{t("exp.log3")}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.titleKey}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl border border-bluedark bg-deepblue p-6 md:p-8 hover:border-turquoise transition-all"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${exp.color} rounded-lg flex items-center justify-center text-3xl shadow-lg`}>
                    {exp.emoji}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {exp.tagKeys.map((tagKey) => (
                      <span key={tagKey} className="px-2 py-0.5 rounded-md bg-turquoise/10 text-turquoise text-[10px] font-bold uppercase tracking-wider">
                        {t(tagKey)}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t(exp.titleKey)}</h3>
                  <p className="text-foreground/50 text-sm mb-4 leading-relaxed">
                    {t(exp.descKey)}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/30">
                    <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {exp.readTime}</span>
                    <span className="flex items-center"><Eye className="mr-1 h-3 w-3" /> {exp.views} {t("exp.views")}</span>
                    <Link href="#" className="ml-auto inline-flex items-center text-turquoise hover:underline font-bold">
                      {t("exp.read_case")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}