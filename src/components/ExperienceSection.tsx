"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Clock } from "lucide-react";
import Link from "next/link";

const experiences = [
  {
    title: "Panne réseau majeure : BGP Hijacking détecté en 15 minutes",
    description: "Comment nous avons identifié et résolu un incident de détournement BGP affectant 40% du trafic, grâce à une surveillance proactive.",
    tags: ["Incident", "Production", "Networking"],
    emoji: "🔥",
    color: "from-red-500 to-red-600",
    readTime: "25 min",
    views: "8.2K"
  },
  {
    title: "Migration datacenter vers AWS : 500 VMs en 72h sans downtime",
    description: "Retour sur une migration critique réussie : planning, outils utilisés (CloudEndure), validation, et gestion du rollback scenario.",
    tags: ["Migration", "Cloud", "Success Story"],
    emoji: "✅",
    color: "from-green-500 to-green-600",
    readTime: "30 min",
    views: "12.5K"
  },
  {
    title: "Optimisation Kubernetes : de 200ms à 15ms de latency",
    description: "Analyse et résolution de problèmes de performance sur un cluster K8s en production : network policies et CNI tuning.",
    tags: ["Performance", "Optimization", "K8s"],
    emoji: "⚡",
    color: "from-yellow-500 to-yellow-600",
    readTime: "22 min",
    views: "9.8K"
  }
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-turquoise">// </span>Retour d'Expérience Terrain
          </h2>
          <p className="text-foreground/50 text-lg">Situations réelles, solutions pratiques, leçons apprises</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
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
                    {exp.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-turquoise/10 text-turquoise text-[10px] font-bold uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{exp.title}</h3>
                  <p className="text-foreground/50 text-sm mb-4 leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/30">
                    <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {exp.readTime}</span>
                    <span className="flex items-center"><Eye className="mr-1 h-3 w-3" /> {exp.views} vues</span>
                    <Link href="#" className="ml-auto inline-flex items-center text-turquoise hover:underline font-bold">
                      Lire le cas <ArrowRight className="ml-2 h-4 w-4" />
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
