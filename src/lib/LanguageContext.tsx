"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "FR" | "EN";

interface TranslationKeys {
  "nav.home": string;
  "nav.categories": string;
  "nav.articles": string;
  "nav.expertise": string;
  "nav.about": string;
  "nav.newsletter": string;
  "hero.badge": string;
  "hero.tagline": string;
  "hero.title_part1": string;
  "hero.title_part2": string;
  "hero.title_part3": string;
  "hero.desc": string;
  "hero.cta_explore": string;
  "hero.cta_browse": string;
  "hero.cta_news": string;
  "hero.cta_premium": string;
  "hero.stat_engineers": string;
  "hero.stat_articles": string;
  "hero.stat_updated": string;
  "hero.monitor_live": string;
  "hero.monitor_network": string;
  "hero.monitor_security": string;
  "hero.monitor_live_badge": string;
  "hero.monitor_mesh": string;
  "hero.monitor_terminal": string;
  "hero.tag_infrastructure": string;
  "hero.tag_cybersecurity": string;
  "hero.tag_cloud": string;
  "hero.tag_networking": string;
  "hero.tag_troubleshooting": string;
  "cat.title": string;
  "cat.subtitle": string;
  "cat.networking_name": string;
  "cat.cybersecurity_name": string;
  "cat.infrastructure_name": string;
  "cat.cloud_name": string;
  "cat.troubleshooting_name": string;
  "cat.automation_name": string;
  "cat.networking_desc": string;
  "cat.cybersecurity_desc": string;
  "cat.infrastructure_desc": string;
  "cat.cloud_desc": string;
  "cat.troubleshooting_desc": string;
  "cat.automation_desc": string;
  "cat.networking_full": string;
  "cat.cybersecurity_full": string;
  "cat.infrastructure_full": string;
  "cat.cloud_full": string;
  "cat.troubleshooting_full": string;
  "cat.automation_full": string;
  "cat.articles": string;
  "cat.cert_net": string;
  "cat.cert_cyber": string;
  "cat.cert_infra": string;
  "cat.cert_cloud": string;
  "cat.cert_trouble": string;
  "cat.cert_auto": string;
  "articles.title": string;
  "articles.subtitle": string;
  "articles.view_all": string;
  "articles.1.title": string;
  "articles.1.excerpt": string;
  "articles.1.category": string;
  "articles.2.title": string;
  "articles.2.excerpt": string;
  "articles.2.category": string;
  "articles.3.title": string;
  "articles.3.excerpt": string;
  "articles.3.category": string;
  "exp.title": string;
  "exp.subtitle": string;
  "exp.read_case": string;
  "exp.views": string;
  "exp.1.title": string;
  "exp.1.desc": string;
  "exp.1.tag1": string;
  "exp.1.tag2": string;
  "exp.1.tag3": string;
  "exp.2.title": string;
  "exp.2.desc": string;
  "exp.2.tag1": string;
  "exp.2.tag2": string;
  "exp.2.tag3": string;
  "exp.3.title": string;
  "exp.3.desc": string;
  "exp.3.tag1": string;
  "exp.3.tag2": string;
  "exp.3.tag3": string;
  "news.title": string;
  "news.desc": string;
  "news.input": string;
  "news.btn": string;
  "news.subscribed": string;
  "news.feature1": string;
  "news.feature2": string;
  "news.feature3": string;
  "search.label": string;
  "search.placeholder": string;
  "search.quick_links": string;
  "search.link1": string;
  "search.link2": string;
  "search.link3": string;
  "footer.desc": string;
  "footer.categories": string;
  "footer.resources": string;
  "footer.information": string;
  "footer.glossary": string;
  "footer.checklists": string;
  "footer.field_feedback": string;
  "footer.about_author": string;
  "footer.legal": string;
  "footer.privacy": string;
  "footer.contact": string;
  "footer.cloud_short": string;
  "footer.rights": string;
  "footer.made": string;
}

const translations: Record<Language, TranslationKeys> = {
  EN: {
    "nav.home": "Home",
    "nav.categories": "Categories",
    "nav.articles": "Articles",
    "nav.expertise": "Expertise",
    "nav.about": "About",
    "nav.newsletter": "Ops Mail",
    "hero.badge": "v2.0 // PRODUCTION KNOWLEDGE HUB",
    "hero.tagline": "<DailyOps />",
    "hero.title_part1": "Operate.",
    "hero.title_part2": "Optimize.",
    "hero.title_part3": "Secure.",
    "hero.desc": "Learn from production-ready guides, troubleshooting playbooks and real-world experience across networking, cybersecurity and infrastructure.",
    "hero.cta_explore": "Explore Categories",
    "hero.cta_browse": "Browse Articles",
    "hero.cta_news": "Newsletter",
    "hero.cta_premium": "Premium Labs",
    "hero.stat_engineers": "12K+ Engineers",
    "hero.stat_articles": "450+ Articles",
    "hero.stat_updated": "24/7 Updated",
    "hero.monitor_live": "LIVE MONITORING",
    "hero.monitor_network": "Network Throughput",
    "hero.monitor_security": "Security Events",
    "hero.monitor_live_badge": "LIVE",
    "hero.monitor_mesh": "topology_viz.sh",
    "hero.monitor_terminal": "ops_logs_live.tail",
    "hero.tag_infrastructure": "IT Infrastructure",
    "hero.tag_cybersecurity": "Cybersecurity",
    "hero.tag_cloud": "Cloud Native",
    "hero.tag_networking": "Networking",
    "hero.tag_troubleshooting": "Troubleshooting",
    "cat.title": "Expertise Domains",
    "cat.subtitle": "Technical content verified and updated by experienced field engineers.",
    "cat.networking_name": "Networking",
    "cat.cybersecurity_name": "Cybersecurity",
    "cat.infrastructure_name": "Infrastructure",
    "cat.cloud_name": "Cloud & Virtualisation",
    "cat.troubleshooting_name": "Troubleshooting",
    "cat.automation_name": "Automation",
    "cat.networking_desc": "Protocols, routing, switching...",
    "cat.cybersecurity_desc": "SOC, detection, incident response...",
    "cat.infrastructure_desc": "Servers, storage, monitoring and...",
    "cat.cloud_desc": "AWS, Azure, VMware, containers...",
    "cat.troubleshooting_desc": "Methodologies, post-mortems and...",
    "cat.automation_desc": "Ansible, Terraform, AI-Ops...",
    "cat.networking_full": "BGP, OSPF, SD-WAN, advanced switching, network design and automation.",
    "cat.cybersecurity_full": "SOC operations, threat hunting, hardening, SIEM and incident response.",
    "cat.infrastructure_full": "Windows/Linux Server, storage, on-premise virtualization and clustering.",
    "cat.cloud_full": "AWS, Azure, GCP, Kubernetes, Docker and hybrid architectures.",
    "cat.troubleshooting_full": "Diagnostic methodologies, war stories and complex failure resolution.",
    "cat.automation_full": "Python, Go, Ansible, Terraform and CI/CD pipelines for infrastructure.",
    "cat.articles": "articles",
    "cat.cert_net": "CCIE/JNCIE",
    "cat.cert_cyber": "CISSP/GCIH",
    "cat.cert_infra": "RHCE/VCP",
    "cat.cert_cloud": "CKA/SAA",
    "cat.cert_trouble": "SRE/DevOps",
    "cat.cert_auto": "IaC/GitOps",
    "articles.title": "Recent Articles",
    "articles.subtitle": "Latest publications from the knowledge base.",
    "articles.view_all": "View all articles",
    "articles.1.title": "Implementing Zero Trust Network Access in 2024",
    "articles.1.excerpt": "Complete guide to migrating to a Zero Trust architecture: principles, tools, and field experience.",
    "articles.1.category": "Cybersecurity",
    "articles.2.title": "Kubernetes Network Policies: Best Practices",
    "articles.2.excerpt": "Secure your K8s workloads with effective network policies: practical examples and anti-patterns to avoid.",
    "articles.2.category": "Cloud",
    "articles.3.title": "BGP Route Reflection vs Confederation",
    "articles.3.excerpt": "In-depth comparison of both BGP scaling approaches in large enterprise networks.",
    "articles.3.category": "Networking",
    "exp.title": "Field Experience",
    "exp.subtitle": "Real situations, practical solutions, lessons learned.",
    "exp.read_case": "Read case study",
    "exp.views": "views",
    "exp.1.title": "Major network outage: BGP hijacking detected in 15 minutes",
    "exp.1.desc": "How we identified and resolved a BGP hijacking incident affecting 40% of traffic through proactive monitoring.",
    "exp.1.tag1": "Incident",
    "exp.1.tag2": "Production",
    "exp.1.tag3": "Networking",
    "exp.2.title": "Datacenter migration to AWS: 500 VMs in 72h with zero downtime",
    "exp.2.desc": "Critical migration success story: planning, tools used (CloudEndure), validation, and rollback management.",
    "exp.2.tag1": "Migration",
    "exp.2.tag2": "Cloud",
    "exp.2.tag3": "Success Story",
    "exp.3.title": "Kubernetes optimization: from 200ms to 15ms latency",
    "exp.3.desc": "Analysis and resolution of performance issues on a production K8s cluster: network policies and CNI tuning.",
    "exp.3.tag1": "Performance",
    "exp.3.tag2": "Optimization",
    "exp.3.tag3": "K8s",
    "news.title": "Production Ready News",
    "news.desc": "Weekly infrastructure essentials.",
    "news.input": "your.email@ops.tech",
    "news.btn": "Subscribe",
    "news.subscribed": "OK",
    "news.feature1": "CVE Alerts",
    "news.feature2": "Shell Scripts",
    "news.feature3": "RCA Deep-dive",
    "search.label": "Search",
    "search.placeholder": "Search a baseline, log, or incident...",
    "search.quick_links": "Quick Links",
    "search.link1": "BGP Troubleshooting",
    "search.link2": "Firewall Hygiene",
    "search.link3": "Kubernetes Network Policies",
    "footer.desc": "A premium knowledge base for IT infrastructure professionals — networking, security, cloud and operations.",
    "footer.categories": "Categories",
    "footer.resources": "Resources",
    "footer.information": "Information",
    "footer.glossary": "Technical glossary",
    "footer.checklists": "Operational checklists",
    "footer.field_feedback": "Field feedback",
    "footer.about_author": "About the author",
    "footer.legal": "Legal notice",
    "footer.privacy": "Privacy policy",
    "footer.contact": "Contact",
    "footer.cloud_short": "Cloud & Virt.",
    "footer.rights": "All rights reserved",
    "footer.made": "Designed with passion for Ops",
  },
  FR: {
    "nav.home": "Accueil",
    "nav.categories": "Catégories",
    "nav.articles": "Articles",
    "nav.expertise": "Expertise",
    "nav.about": "À propos",
    "nav.newsletter": "Ops Mail",
    "hero.badge": "V2.0 // PRODUCTION KNOWLEDGE HUB",
    "hero.tagline": "<DailyOps />",
    "hero.title_part1": "Operate.",
    "hero.title_part2": "Optimize.",
    "hero.title_part3": "Secure.",
    "hero.desc": "Apprenez grâce à des guides prêts pour la production, des playbooks de dépannage et des retours d'expérience réels en réseau, cybersécurité et infrastructure.",
    "hero.cta_explore": "Explorer les Catégories",
    "hero.cta_browse": "Parcourir les Articles",
    "hero.cta_news": "Newsletter",
    "hero.cta_premium": "Labs Premium",
    "hero.stat_engineers": "12K+ Ingénieurs",
    "hero.stat_articles": "450+ Articles",
    "hero.stat_updated": "Mis à jour 24/7",
    "hero.monitor_live": "SURVEILLANCE LIVE",
    "hero.monitor_network": "Débit réseau",
    "hero.monitor_security": "Événements sécurité",
    "hero.monitor_live_badge": "LIVE",
    "hero.monitor_mesh": "topology_viz.sh",
    "hero.monitor_terminal": "ops_logs_live.tail",
    "hero.tag_infrastructure": "Infrastructure IT",
    "hero.tag_cybersecurity": "Cybersécurité",
    "hero.tag_cloud": "Cloud Native",
    "hero.tag_networking": "Réseau",
    "hero.tag_troubleshooting": "Troubleshooting",
    "cat.title": "Domaines d'expertise",
    "cat.subtitle": "Contenu technique vérifié et maintenu à jour par des ingénieurs expérimentés sur le terrain.",
    "cat.networking_name": "Networking",
    "cat.cybersecurity_name": "Cybersecurity",
    "cat.infrastructure_name": "Infrastructure",
    "cat.cloud_name": "Cloud & Virtualisation",
    "cat.troubleshooting_name": "Troubleshooting",
    "cat.automation_name": "Automation",
    "cat.networking_desc": "Protocoles, routage, switching...",
    "cat.cybersecurity_desc": "SOC, détection, réponse incident...",
    "cat.infrastructure_desc": "Serveurs, stockage, monitoring...",
    "cat.cloud_desc": "AWS, Azure, VMware, conteneurs...",
    "cat.troubleshooting_desc": "Méthodologies, post-mortems...",
    "cat.automation_desc": "Ansible, Terraform, AI-Ops...",
    "cat.networking_full": "BGP, OSPF, SD-WAN, switching avancé, design réseau et automatisation.",
    "cat.cybersecurity_full": "SOC operations, threat hunting, hardening, SIEM et réponse aux incidents.",
    "cat.infrastructure_full": "Windows/Linux Server, stockage, virtualisation on-premise et clustering.",
    "cat.cloud_full": "AWS, Azure, GCP, Kubernetes, Docker et architectures hybrides.",
    "cat.troubleshooting_full": "Méthodologies de diagnostic, war stories et résolution de pannes complexes.",
    "cat.automation_full": "Python, Go, Ansible, Terraform et CI/CD pipelines pour l'infrastructure.",
    "cat.articles": "articles",
    "cat.cert_net": "CCIE/JNCIE",
    "cat.cert_cyber": "CISSP/GCIH",
    "cat.cert_infra": "RHCE/VCP",
    "cat.cert_cloud": "CKA/SAA",
    "cat.cert_trouble": "SRE/DevOps",
    "cat.cert_auto": "IaC/GitOps",
    "articles.title": "Articles Récents",
    "articles.subtitle": "Les dernières publications de la base de connaissances.",
    "articles.view_all": "Voir tous les articles",
    "articles.1.title": "Implémenter Zero Trust Network Access en 2024",
    "articles.1.excerpt": "Guide complet pour migrer vers une architecture Zero Trust : principes, outils et retour d'expérience terrain.",
    "articles.1.category": "Cybersécurité",
    "articles.2.title": "Kubernetes Network Policies : Best Practices",
    "articles.2.excerpt": "Sécuriser vos workloads K8s avec des network policies efficaces : exemples pratiques et anti-patterns à éviter.",
    "articles.2.category": "Cloud",
    "articles.3.title": "BGP Route Reflection vs Confederation",
    "articles.3.excerpt": "Comparaison approfondie des deux approches de scaling BGP dans les grands réseaux d'entreprise.",
    "articles.3.category": "Réseau",
    "exp.title": "Retour d'Expérience Terrain",
    "exp.subtitle": "Situations réelles, solutions pratiques, leçons apprises.",
    "exp.read_case": "Lire le cas",
    "exp.views": "vues",
    "exp.1.title": "Panne réseau majeure : BGP Hijacking détecté en 15 minutes",
    "exp.1.desc": "Comment nous avons identifié et résolu un incident de détournement BGP affectant 40% du trafic, grâce à une surveillance proactive.",
    "exp.1.tag1": "Incident",
    "exp.1.tag2": "Production",
    "exp.1.tag3": "Réseau",
    "exp.2.title": "Migration datacenter vers AWS : 500 VMs en 72h sans downtime",
    "exp.2.desc": "Retour sur une migration critique réussie : planning, outils utilisés (CloudEndure), validation et gestion du rollback.",
    "exp.2.tag1": "Migration",
    "exp.2.tag2": "Cloud",
    "exp.2.tag3": "Success Story",
    "exp.3.title": "Optimisation Kubernetes : de 200ms à 15ms de latence",
    "exp.3.desc": "Analyse et résolution de problèmes de performance sur un cluster K8s en production : network policies et tuning CNI.",
    "exp.3.tag1": "Performance",
    "exp.3.tag2": "Optimisation",
    "exp.3.tag3": "K8s",
    "news.title": "Production Ready News",
    "news.desc": "L'essentiel de l'infrastructure hebdomadaire.",
    "news.input": "votre.email@ops.tech",
    "news.btn": "S'abonner",
    "news.subscribed": "OK",
    "news.feature1": "Alertes CVE",
    "news.feature2": "Scripts Shell",
    "news.feature3": "RCA Deep-dive",
    "search.label": "Rechercher",
    "search.placeholder": "Rechercher une baseline, un log, un incident...",
    "search.quick_links": "Liens rapides",
    "search.link1": "Dépannage BGP",
    "search.link2": "Hygiène Firewall",
    "search.link3": "Kubernetes Network Policies",
    "footer.desc": "Base de connaissances premium pour les professionnels de l'infrastructure IT — réseau, sécurité, cloud et opérations.",
    "footer.categories": "Catégories",
    "footer.resources": "Ressources",
    "footer.information": "Informations",
    "footer.glossary": "Glossaire technique",
    "footer.checklists": "Checklists opérationnelles",
    "footer.field_feedback": "Retours terrain",
    "footer.about_author": "À propos de l'auteur",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Politique de confidentialité",
    "footer.contact": "Contact",
    "footer.cloud_short": "Cloud & Virt.",
    "footer.rights": "Tous droits réservés",
    "footer.made": "Conçu avec passion pour les Ops",
  },
};

const STORAGE_KEY = "dailyops-lang";

const LanguageContext = createContext<{
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof TranslationKeys | string) => string;
} | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("EN");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "EN" || stored === "FR") {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "FR" ? "fr" : "en";
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t = (key: keyof TranslationKeys | string) =>
    translations[lang][key as keyof TranslationKeys] ?? String(key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export type { TranslationKeys };