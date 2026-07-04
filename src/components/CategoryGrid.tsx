"use client";

import { Network, Shield, Server, Cloud, Wrench, GitBranch, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const categories = [
  {
    id: "networking",
    nameKey: "cat.networking_name" as const,
    descKey: "cat.networking_full" as const,
    icon: Network,
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
    icon: Wrench,
    tags: ["Wireshark", "tcpdump", "Debug", "Tools"],
    count: 45,
    href: "/category/troubleshooting",
  },
  {
    id: "devops",
    nameKey: "cat.automation_name" as const,
    descKey: "cat.automation_full" as const,
    icon: GitBranch,
    tags: ["Ansible", "Terraform", "GitOps", "Python"],
    count: 39,
    href: "/category/devops",
  },
];

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-20 bg-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-turquoise">// </span>{t("cat.title")}
          </h2>
          <p className="text-foreground/50 text-lg">{t("cat.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl border border-bluedark bg-deepblue p-8 hover:border-turquoise transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-turquoise/10"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-turquoise to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="w-12 h-12 bg-turquoise/10 rounded-xl flex items-center justify-center text-turquoise text-2xl mb-6">
                <category.icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{t(category.nameKey)}</h3>
              <p className="text-foreground/50 text-sm mb-4 leading-relaxed">
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