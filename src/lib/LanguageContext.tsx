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
  "hero.title_main": string;
  "hero.title_sub": string;
  "hero.sub_operate": string;
  "hero.sub_optimize": string;
  "hero.sub_secure": string;
  "hero.desc": string;
  "hero.cta_explore": string;
  "hero.cta_browse": string;
  "hero.cta_news": string;
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
  "hero.term.1.cmd": string;
  "hero.term.1.log": string;
  "hero.term.2.cmd": string;
  "hero.term.2.log": string;
  "hero.term.3.cmd": string;
  "hero.term.3.log": string;
  "hero.term.4.cmd": string;
  "hero.term.4.log": string;
  "hero.term.5.cmd": string;
  "hero.term.5.log": string;
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
  "articles.featured_title": string;
  "articles.featured_subtitle": string;
  "articles.featured.title": string;
  "articles.featured.excerpt": string;
  "articles.featured.category": string;
  "articles.featured.body": string;
  "articles.1.title": string;
  "articles.1.excerpt": string;
  "articles.1.category": string;
  "articles.1.body": string;
  "articles.2.title": string;
  "articles.2.excerpt": string;
  "articles.2.category": string;
  "articles.2.body": string;
  "articles.3.title": string;
  "articles.3.excerpt": string;
  "articles.3.category": string;
  "articles.3.body": string;
  "articles.4.title": string;
  "articles.4.excerpt": string;
  "articles.4.category": string;
  "articles.4.body": string;
  "articles.5.title": string;
  "articles.5.excerpt": string;
  "articles.5.category": string;
  "articles.5.body": string;
  "articles.6.title": string;
  "articles.6.excerpt": string;
  "articles.6.category": string;
  "articles.6.body": string;
  "articles.7.title": string;
  "articles.7.excerpt": string;
  "articles.7.category": string;
  "articles.7.body": string;
  "articles.read_time": string;
  "articles.author": string;
  "article.back": string;
  "article.published": string;
  "article.related": string;
  "article.share": string;
  "catpage.breadcrumb": string;
  "catpage.stable": string;
  "catpage.read_node": string;
  "catpage.index_nodes": string;
  "catpage.need_expertise": string;
  "catpage.expertise_desc": string;
  "catpage.contact_noc": string;
  "catpage.verified": string;
  "res.title": string;
  "res.subtitle": string;
  "res.1.title": string;
  "res.1.desc": string;
  "res.1.link": string;
  "res.2.title": string;
  "res.2.desc": string;
  "res.2.link": string;
  "res.3.title": string;
  "res.3.desc": string;
  "res.3.link": string;
  "res.4.title": string;
  "res.4.desc": string;
  "res.4.link": string;
  "exp.title": string;
  "exp.subtitle": string;
  "exp.read_case": string;
  "exp.views": string;
  "exp.badge_incident": string;
  "exp.badge_optimization": string;
  "exp.badge_security": string;
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
  "exp.4.title": string;
  "exp.4.desc": string;
  "exp.4.footer": string;
  "exp.5.title": string;
  "exp.5.desc": string;
  "exp.5.footer": string;
  "exp.6.title": string;
  "exp.6.desc": string;
  "exp.6.footer": string;
  "news.title": string;
  "news.desc": string;
  "news.input": string;
  "news.btn": string;
  "news.subscribed": string;
  "news.feature1": string;
  "news.feature2": string;
  "news.feature3": string;
  "news.subscribers": string;
  "news.privacy": string;
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
  "footer.about": string;
  "footer.methodology": string;
  "footer.rss": string;
  "footer.cheatsheets": string;
  "footer.templates": string;
  "footer.scripts": string;
  "footer.training": string;
  "footer.lab": string;
  "footer.copyright": string;
  "footer.production_ready": string;
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
    "hero.title_main": "Real-World IT Operations",
    "hero.title_sub": "Operate. Optimize. Secure.",
    "hero.sub_operate": "Operate.",
    "hero.sub_optimize": "Optimize.",
    "hero.sub_secure": "Secure.",
    "hero.desc": "Learn from production-ready guides, troubleshooting playbooks and real-world experience across networking, cybersecurity and infrastructure.",
    "hero.cta_explore": "Explore Categories",
    "hero.cta_browse": "Browse Articles",
    "hero.cta_news": "Newsletter",
    "hero.stat_engineers": "7K+ Active Ops",
    "hero.stat_articles": "340+ Technical Nodes",
    "hero.stat_updated": "Verified Baselines",
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
    "hero.term.1.cmd": "$ terraform apply",
    "hero.term.1.log": "plan: 4 to add, 0 change",
    "hero.term.2.cmd": "$ nmap -sV target.io",
    "hero.term.2.log": "port 443/tcp open (https)",
    "hero.term.3.cmd": "$ kubectl get pods",
    "hero.term.3.log": "api-v2-7x9z Running 1/1",
    "hero.term.4.cmd": "$ show ip bgp summ",
    "hero.term.4.log": "neighbor 1.1.1.1 Establ.",
    "hero.term.5.cmd": "$ tcpdump -i eth0",
    "hero.term.5.log": "12:04:15.82 IP: ICMP echo",
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
    "articles.featured_title": "Featured Articles",
    "articles.featured_subtitle": "Latest technical insights from our knowledge base",
    "articles.featured.title": "Mastering BGP Communities for Policy Routing",
    "articles.featured.excerpt": "Comprehensive guide on advanced BGP communities usage to control traffic flow, implement routing policies, and optimize peering with your upstreams.",
    "articles.featured.category": "Networking",
    "articles.featured.body": "BGP communities are one of the most powerful tools for traffic engineering in production networks. This guide covers well-known communities, custom tagging strategies, and how to implement policy routing without destabilizing your upstream relationships.\n\nWe walk through real configurations on Cisco and Juniper platforms, explain when to use additive vs non-additive communities, and share field-tested patterns for multi-homed environments.\n\nFinally, we cover monitoring and validation: how to verify that your communities are being honored by peers, and what to do when they're silently dropped.",
    "articles.1.title": "Implementing Zero Trust with FreeIPA and HashiCorp Vault",
    "articles.1.excerpt": "Complete guide to migrating to a Zero Trust architecture: principles, tools, and field experience.",
    "articles.1.category": "Cybersecurity",
    "articles.1.body": "Zero Trust is not a product — it's an operational model. This article documents our migration from perimeter-based security to identity-centric access using FreeIPA for centralized authentication and HashiCorp Vault for secrets management.\n\nWe cover the phased rollout: inventory of service accounts, certificate rotation, network segmentation boundaries, and the SIEM rules that validate every access attempt.\n\nKey takeaway: start with your most exposed services, not your most critical ones. Early wins build organizational trust in the model.",
    "articles.2.title": "Kubernetes Network Policies: Securing Intra-Cluster Traffic",
    "articles.2.excerpt": "Network Policy patterns for effective micro-segmentation in K8s.",
    "articles.2.category": "Cloud",
    "articles.2.body": "Network policies are often misconfigured or ignored entirely. This guide provides production-ready examples for namespace isolation, egress control, and DNS-aware policies.\n\nWe document common anti-patterns: overly permissive default-deny rules, policies that break health checks, and CNI-specific gotchas with Calico and Cilium.\n\nIncludes a validation checklist and tcpdump-based troubleshooting workflow for when policies don't behave as expected.",
    "articles.3.title": "BGP Route Reflection vs Confederation",
    "articles.3.excerpt": "In-depth comparison of both BGP scaling approaches in large enterprise networks.",
    "articles.3.category": "Networking",
    "articles.3.body": "When your iBGP mesh grows beyond a handful of routers, you need a scaling strategy. Route reflectors and confederations are the two primary options — but they solve different problems.\n\nThis article compares topology complexity, convergence behavior, troubleshooting difficulty, and vendor interoperability for both approaches.\n\nWe include decision matrices based on network size, team expertise, and multi-vendor requirements from real enterprise deployments.",
    "articles.4.title": "Terraform Multi-Cloud: Advanced Deployment Patterns",
    "articles.4.excerpt": "Structuring Terraform modules for seamless deployment across AWS and Azure.",
    "articles.4.category": "Cloud",
    "articles.4.body": "Multi-cloud Terraform requires discipline in module design. This guide covers provider abstraction layers, state management across accounts, and drift detection strategies.\n\nWe share our module hierarchy: root modules for environment composition, child modules for reusable infrastructure patterns, and data modules for cross-cloud networking.\n\nIncludes CI/CD integration patterns with Atlantis and policy-as-code validation using OPA.",
    "articles.5.title": "OSPF Neighbor Stuck in INIT: Complete Diagnosis",
    "articles.5.excerpt": "Detailed runbook for resolving stuck OSPF adjacencies, with Wireshark captures.",
    "articles.5.category": "Troubleshooting",
    "articles.5.body": "An OSPF neighbor stuck in INIT state is one of the most common production issues — and one of the most misdiagnosed. This runbook walks through the complete diagnostic chain.\n\nWe cover MTU mismatches, ACL filtering, authentication key mismatches, and broadcast network type errors with packet captures for each scenario.\n\nIncludes a decision tree and the exact show commands to run on Cisco, Juniper, and Arista platforms.",
    "articles.6.title": "Proxmox VE HA Cluster: Production Guide",
    "articles.6.excerpt": "Deploying a high-availability Proxmox cluster with Ceph and corosync quorum.",
    "articles.6.category": "Infrastructure",
    "articles.6.body": "Running Proxmox in production requires more than a single node. This guide walks through building a 3-node HA cluster with shared Ceph storage and proper corosync quorum configuration.\n\nWe cover network design (separate cluster, storage and migration networks), fencing configuration, and the sysctl/kernel tunings that prevent split-brain scenarios.\n\nIncludes a pre-flight checklist, rolling upgrade procedure, and lessons learned from a live migration of 120 VMs without downtime.",
    "articles.7.title": "WireGuard VPN: From Theory to Enterprise Deployment",
    "articles.7.excerpt": "Technical comparison, advanced configuration, and integration into existing IT systems.",
    "articles.7.category": "Networking",
    "articles.7.body": "WireGuard has replaced IPsec and OpenVPN in many production environments — but enterprise deployment requires careful planning. This article compares WireGuard against legacy VPN solutions on performance, key management, and auditability.\n\nWe cover hub-and-spoke vs full-mesh topologies, integration with FreeIPA/LDAP for key distribution, and iptables/nftables rules for split-tunnel vs full-tunnel policies.\n\nIncludes configuration templates for Linux gateways, Windows clients, and monitoring via Prometheus exporters.",
    "articles.read_time": "read",
    "articles.author": "DailyOps",
    "article.back": "Back to articles",
    "article.published": "Published",
    "article.related": "Related articles",
    "article.share": "Share",
    "catpage.breadcrumb": "Nodes",
    "catpage.stable": "STABLE",
    "catpage.read_node": "Read Node",
    "catpage.index_nodes": "Index Nodes",
    "catpage.need_expertise": "Need Expertise?",
    "catpage.expertise_desc": "Architecture design, complex troubleshooting and production audit.",
    "catpage.contact_noc": "Contact NOC",
    "catpage.verified": "Verified Baselines",
    "res.title": "Tools & Resources",
    "res.subtitle": "Toolbox for infrastructure professionals",
    "res.1.title": "Cheatsheets",
    "res.1.desc": "Essential commands and syntax references",
    "res.1.link": "35 cheatsheets",
    "res.2.title": "Scripts",
    "res.2.desc": "Automation and monitoring utilities",
    "res.2.link": "GitHub Repo",
    "res.3.title": "Templates",
    "res.3.desc": "Documentation and runbook templates",
    "res.3.link": "20 templates",
    "res.4.title": "Training",
    "res.4.desc": "Practical guides and hands-on labs",
    "res.4.link": "12 courses",
    "exp.title": "Field experience feedback",
    "exp.subtitle": "From the field, validated in production. No empty theory — content forged in NOCs and SOCs.",
    "exp.read_case": "Read case study",
    "exp.views": "views",
    "exp.badge_incident": "INCIDENT RESOLVED",
    "exp.badge_optimization": "OPTIMIZATION",
    "exp.badge_security": "SECURITY",
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
    "exp.4.title": "BGP Route Leak at a Provider",
    "exp.4.desc": "A route leak absorbed 40% of our outbound traffic. Diagnosis via RPKI and AS-PATH filter implementation in 45 minutes.",
    "exp.4.footer": "45 min MTTR | P1",
    "exp.5.title": "Live Proxmox -> Ceph Migration",
    "exp.5.desc": "NFS to Ceph storage migration on a production Proxmox cluster, zero downtime. Lessons learned.",
    "exp.5.footer": "3 weeks | 0 downtime",
    "exp.6.title": "Detecting Lateral Movement via SIEM",
    "exp.6.desc": "How a custom SIEM rule detected lateral movement following a successful phishing attack on a service account.",
    "exp.6.footer": "Detection < 5min | Containment",
    "news.title": "Weekly Newsletter",
    "news.desc": "Get the best articles, tech news, and infrastructure tips every week.",
    "news.input": "your.email@ops.tech",
    "news.btn": "Subscribe",
    "news.subscribed": "OK",
    "news.feature1": "Premium",
    "news.feature2": "Alerts",
    "news.feature3": "Resources",
    "news.subscribers": "+5,000 IT professionals already subscribed",
    "news.privacy": "Your data is secure. Unsubscribe in 1 click.",
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
    "footer.made": "Made with passion for IT pros",
    "footer.about": "About",
    "footer.methodology": "Methodology",
    "footer.rss": "RSS Feed",
    "footer.cheatsheets": "Cheatsheets",
    "footer.templates": "Templates",
    "footer.scripts": "Scripts & Tools",
    "footer.training": "Training",
    "footer.lab": "Lab Environment",
    "footer.copyright": "© 2026 DailyOps.Tech —",
    "footer.production_ready": "Production Ready",
  },
  FR: {
    "nav.home": "Accueil",
    "nav.categories": "Catégories",
    "nav.articles": "Articles",
    "nav.expertise": "Expertise",
    "nav.about": "À propos",
    "nav.newsletter": "Ops Mail",
    "hero.badge": "V2.0 // PRODUCTION KNOWLEDGE HUB",
    "hero.title_main": "Real-World IT Operations",
    "hero.title_sub": "Operate. Optimize. Secure.",
    "hero.sub_operate": "Operate.",
    "hero.sub_optimize": "Optimize.",
    "hero.sub_secure": "Secure.",
    "hero.desc": "Apprenez grâce à des guides prêts pour la production, des playbooks de dépannage et des retours d'expérience réels en réseau, cybersécurité et infrastructure.",
    "hero.cta_explore": "Explorer les Catégories",
    "hero.cta_browse": "Parcourir les Articles",
    "hero.cta_news": "Newsletter",
    "hero.stat_engineers": "7K+ Ops Actifs",
    "hero.stat_articles": "340+ Noeuds Techniques",
    "hero.stat_updated": "Baselines Vérifiées",
    "hero.monitor_live": "SURVEILLANCE LIVE",
    "hero.monitor_network": "Débit réseau",
    "hero.monitor_security": "Événements sécurité",
    "hero.monitor_live_badge": "LIVE",
    "hero.monitor_mesh": "topology_viz.sh",
    "hero.monitor_terminal": "ops_logs_live.tail",
    "hero.tag_infrastructure": "Infrastructure IT",
    "hero.tag_cybersecurity": "Cybersécurité",
    "hero.tag_cloud": "Cloud Native",
    "hero.tag_networking": "Networking",
    "hero.tag_troubleshooting": "Troubleshooting",
    "hero.term.1.cmd": "$ terraform apply",
    "hero.term.1.log": "plan: 4 to add, 0 change",
    "hero.term.2.cmd": "$ nmap -sV target.io",
    "hero.term.2.log": "port 443/tcp open (https)",
    "hero.term.3.cmd": "$ kubectl get pods",
    "hero.term.3.log": "api-v2-7x9z Running 1/1",
    "hero.term.4.cmd": "$ show ip bgp summ",
    "hero.term.4.log": "neighbor 1.1.1.1 Establ.",
    "hero.term.5.cmd": "$ tcpdump -i eth0",
    "hero.term.5.log": "12:04:15.82 IP: ICMP echo",
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
    "articles.featured_title": "Articles à la une",
    "articles.featured_subtitle": "Les dernières analyses techniques de notre base de connaissances",
    "articles.featured.title": "Maîtriser les BGP Communities pour le Policy Routing",
    "articles.featured.excerpt": "Guide complet sur l'utilisation avancée des BGP communities pour contrôler les flux, implémenter des politiques de routage et optimiser le peering avec vos upstreams.",
    "articles.featured.category": "Networking",
    "articles.featured.body": "Les BGP communities sont l'un des outils les plus puissants du traffic engineering en production. Ce guide couvre les communities well-known, les stratégies de tagging personnalisées et l'implémentation du policy routing sans déstabiliser vos relations avec les peers.\n\nNous détaillons des configurations réelles sur Cisco et Juniper, expliquons quand utiliser des communities additives vs non-additives, et partageons des patterns éprouvés pour les environnements multi-homed.\n\nEnfin, nous couvrons le monitoring et la validation : comment vérifier que vos communities sont honorées par les peers, et quoi faire quand elles sont silencieusement ignorées.",
    "articles.1.title": "Implémenter Zero Trust avec FreeIPA et HashiCorp Vault",
    "articles.1.excerpt": "Guide complet pour migrer vers une architecture Zero Trust : principes, outils et retour d'expérience terrain.",
    "articles.1.category": "Cybersécurité",
    "articles.1.body": "Zero Trust n'est pas un produit — c'est un modèle opérationnel. Cet article documente notre migration d'une sécurité périmétrique vers un accès centré sur l'identité avec FreeIPA pour l'authentification et HashiCorp Vault pour la gestion des secrets.\n\nNous couvrons le déploiement par phases : inventaire des comptes de service, rotation des certificats, segmentation réseau et règles SIEM validant chaque tentative d'accès.\n\nPoint clé : commencez par vos services les plus exposés, pas les plus critiques. Les premières victoires construisent la confiance organisationnelle dans le modèle.",
    "articles.2.title": "Kubernetes Network Policies : sécuriser le trafic intra-cluster",
    "articles.2.excerpt": "Patterns de Network Policy pour une micro-segmentation efficace en K8s.",
    "articles.2.category": "Cloud",
    "articles.2.body": "Les network policies sont souvent mal configurées ou ignorées. Ce guide fournit des exemples prêts pour la production : isolation de namespace, contrôle egress et policies compatibles DNS.\n\nNous documentons les anti-patterns courants : règles default-deny trop permissives, policies qui cassent les health checks, et pièges spécifiques aux CNI Calico et Cilium.\n\nInclut une checklist de validation et un workflow de troubleshooting basé sur tcpdump.",
    "articles.3.title": "BGP Route Reflection vs Confederation",
    "articles.3.excerpt": "Comparaison approfondie des deux approches de scaling BGP dans les grands réseaux d'entreprise.",
    "articles.3.category": "Networking",
    "articles.3.body": "Quand votre mesh iBGP dépasse quelques routeurs, il faut une stratégie de scaling. Les route reflectors et les confederations sont les deux options principales — mais elles résolvent des problèmes différents.\n\nCet article compare la complexité topologique, le comportement de convergence, la difficulté de troubleshooting et l'interopérabilité multi-vendor.\n\nInclut des matrices de décision basées sur la taille du réseau, l'expertise de l'équipe et les exigences multi-vendor.",
    "articles.4.title": "Terraform Multi-Cloud : Patterns de déploiement avancés",
    "articles.4.excerpt": "Structurer vos modules Terraform pour un déploiement fluide sur AWS et Azure.",
    "articles.4.category": "Cloud",
    "articles.4.body": "Le Terraform multi-cloud exige une discipline dans le design des modules. Ce guide couvre les couches d'abstraction provider, la gestion du state multi-comptes et les stratégies de détection de drift.\n\nNous partageons notre hiérarchie : modules racine pour la composition d'environnements, modules enfants pour les patterns réutilisables, et modules data pour le networking cross-cloud.\n\nInclut l'intégration CI/CD avec Atlantis et la validation policy-as-code via OPA.",
    "articles.5.title": "OSPF Neighbor bloqué en INIT : diagnostic complet",
    "articles.5.excerpt": "Runbook détaillé pour résoudre les adjacences OSPF bloquées, avec captures Wireshark.",
    "articles.5.category": "Troubleshooting",
    "articles.5.body": "Un voisin OSPF bloqué en état INIT est l'un des problèmes les plus courants en production — et l'un des plus mal diagnostiqués. Ce runbook parcourt la chaîne de diagnostic complète.\n\nNous couvrons les mismatches MTU, le filtrage ACL, les erreurs de clés d'authentification et les types de réseau broadcast avec captures pour chaque scénario.\n\nInclut un arbre de décision et les commandes show exactes sur Cisco, Juniper et Arista.",
    "articles.6.title": "Cluster HA Proxmox VE : guide de production",
    "articles.6.excerpt": "Déployer un cluster Proxmox haute disponibilité avec Ceph et quorum corosync.",
    "articles.6.category": "Infrastructure",
    "articles.6.body": "Faire tourner Proxmox en production exige plus qu'un nœud unique. Ce guide détaille la construction d'un cluster HA 3 nœuds avec stockage Ceph partagé et configuration corosync adaptée.\n\nNous couvrons le design réseau (réseaux cluster, stockage et migration séparés), la configuration du fencing et les tunings sysctl/kernel pour éviter les split-brain.\n\nInclut une checklist pré-vol, une procédure de mise à jour rolling et les leçons d'une migration live de 120 VMs sans interruption.",
    "articles.7.title": "WireGuard VPN : de la théorie au déploiement entreprise",
    "articles.7.excerpt": "Comparaison technique, configuration avancée et intégration dans un SI existant.",
    "articles.7.category": "Networking",
    "articles.7.body": "WireGuard a remplacé IPsec et OpenVPN dans de nombreux environnements de production — mais le déploiement entreprise demande une planification rigoureuse. Cet article compare WireGuard aux VPN legacy sur la performance, la gestion des clés et l'auditabilité.\n\nNous couvrons les topologies hub-and-spoke vs full-mesh, l'intégration FreeIPA/LDAP pour la distribution des clés, et les règles iptables/nftables pour split-tunnel vs full-tunnel.\n\nInclut des templates de configuration pour gateways Linux, clients Windows et monitoring via exporters Prometheus.",
    "articles.read_time": "de lecture",
    "articles.author": "DailyOps",
    "article.back": "Retour aux articles",
    "article.published": "Publié le",
    "article.related": "Articles connexes",
    "article.share": "Partager",
    "catpage.breadcrumb": "Nodes",
    "catpage.stable": "STABLE",
    "catpage.read_node": "Lire le node",
    "catpage.index_nodes": "Index Nodes",
    "catpage.need_expertise": "Besoin d'expertise ?",
    "catpage.expertise_desc": "Design d'architecture, troubleshooting complexe et audit de production.",
    "catpage.contact_noc": "Contacter le NOC",
    "catpage.verified": "Baselines Vérifiées",
    "res.title": "Outils & Ressources",
    "res.subtitle": "Toolbox pour professionnels infrastructure",
    "res.1.title": "Cheatsheets",
    "res.1.desc": "Commandes et syntaxes essentielles",
    "res.1.link": "35 cheatsheets",
    "res.2.title": "Scripts",
    "res.2.desc": "Automatisation et monitoring",
    "res.2.link": "GitHub Repo",
    "res.3.title": "Templates",
    "res.3.desc": "Documentation et runbooks",
    "res.3.link": "20 templates",
    "res.4.title": "Formations",
    "res.4.desc": "Guides et labs pratiques",
    "res.4.link": "12 cours",
    "exp.title": "Retours d'expérience terrain",
    "exp.subtitle": "Du terrain, validé en production. Pas de théorie vide — contenu forgé dans les NOC et SOC.",
    "exp.read_case": "Lire le cas",
    "exp.views": "vues",
    "exp.badge_incident": "INCIDENT RÉSOLU",
    "exp.badge_optimization": "OPTIMISATION",
    "exp.badge_security": "SÉCURITÉ",
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
    "exp.4.title": "Fuite de route BGP chez un fournisseur",
    "exp.4.desc": "Une fuite de route a absorbé 40% de notre trafic sortant. Diagnostic via RPKI et filtrage AS-PATH en 45 minutes.",
    "exp.4.footer": "45 min MTTR | P1",
    "exp.5.title": "Migration Live Proxmox -> Ceph",
    "exp.5.desc": "Migration du stockage NFS vers Ceph sur un cluster Proxmox de production, zéro interruption. Leçons apprises.",
    "exp.5.footer": "3 semaines | 0 downtime",
    "exp.6.title": "Détection de mouvement latéral via SIEM",
    "exp.6.desc": "Comment une règle SIEM personnalisée a détecté un mouvement latéral suite à un phishing réussi sur un compte de service.",
    "exp.6.footer": "Détection < 5min | Confinement",
    "news.title": "Newsletter Hebdomadaire",
    "news.desc": "Recevez chaque semaine les meilleurs articles, news tech, et astuces infrastructure.",
    "news.input": "votre.email@ops.tech",
    "news.btn": "S'abonner",
    "news.subscribed": "OK",
    "news.feature1": "Premium",
    "news.feature2": "Alertes",
    "news.feature3": "Ressources",
    "news.subscribers": "+5 000 professionnels IT déjà abonnés",
    "news.privacy": "Vos données sont sécurisées. Désabonnement en 1 clic.",
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
    "footer.about": "À propos",
    "footer.methodology": "Méthodologie",
    "footer.rss": "Flux RSS",
    "footer.cheatsheets": "Cheatsheets",
    "footer.templates": "Templates",
    "footer.scripts": "Scripts & Outils",
    "footer.training": "Formations",
    "footer.lab": "Environnement Lab",
    "footer.copyright": "© 2026 DailyOps.Tech —",
    "footer.production_ready": "Production Ready",
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