"use client";

import { Monitor, Shield, Server, Cloud, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Networking",
    description: "Routage, switching, VPN, et optimisation des flux réseau.",
    icon: Monitor,
    count: 24,
    color: "bg-blue-500/10 text-blue-500",
    href: "/category/networking"
  },
  {
    name: "Cybersecurity",
    description: "Hardening, SOC operations, et gestion des vulnérabilités.",
    icon: Shield,
    count: 18,
    color: "bg-red-500/10 text-red-500",
    href: "/category/cybersecurity"
  },
  {
    name: "Infrastructure",
    description: "Serveurs, stockage, et maintenance des datacenters.",
    icon: Server,
    count: 31,
    color: "bg-orange-500/10 text-orange-500",
    href: "/category/infrastructure"
  },
  {
    name: "Cloud & Virtualisation",
    description: "Docker, Kubernetes, AWS, Azure et environnements VM.",
    icon: Cloud,
    count: 27,
    color: "bg-purple-500/10 text-purple-500",
    href: "/category/cloud"
  },
  {
    name: "Troubleshooting",
    description: "Analyse de logs, débogage et résolution d'incidents.",
    icon: Activity,
    count: 15,
    color: "bg-green-500/10 text-green-500",
    href: "/category/troubleshooting"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Expertise Technique</h2>
            <p className="mt-2 text-foreground/60">Explorez nos domaines de spécialisation.</p>
          </div>
          <Link href="/categories" className="mt-4 md:mt-0 inline-flex items-center text-accent hover:underline">
            Toutes les catégories <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 hover:border-accent/50 transition-all"
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-6 ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
              <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                {category.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-mono text-foreground/40">{category.count} Articles</span>
                <Link href={category.href} className="text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Consulter →
                </Link>
              </div>
              
              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <category.icon className="h-16 w-16 -mr-4 -mt-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
