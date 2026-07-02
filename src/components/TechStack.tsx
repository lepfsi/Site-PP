"use client";

import { motion } from "framer-motion";

const technologies = [
  { name: "Cisco", category: "Network" },
  { name: "Juniper", category: "Network" },
  { name: "AWS", category: "Cloud" },
  { name: "Azure", category: "Cloud" },
  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Terraform", category: "IaC" },
  { name: "Ansible", category: "IaC" },
  { name: "Palo Alto", category: "Security" },
  { name: "Fortinet", category: "Security" },
  { name: "Linux", category: "OS" },
  { name: "Python", category: "Automation" },
];

export default function TechStack() {
  return (
    <section className="py-12 bg-card/20 overflow-hidden border-b border-[var(--border-color)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/30">Technologies & Écosystèmes</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex flex-col items-center group">
              <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{tech.name}</span>
              <span className="text-[10px] text-foreground/40">{tech.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
