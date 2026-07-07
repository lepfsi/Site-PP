import { Globe, Shield, Server, Cloud, Zap, Bug, type LucideIcon } from "lucide-react";

export type CategorySlug =
  | "networking"
  | "cybersecurity"
  | "infrastructure"
  | "cloud"
  | "automation"
  | "troubleshooting";

export interface CategoryConfig {
  slug: CategorySlug;
  nameKey: `cat.${string}_name`;
  descKey: `cat.${string}_full`;
  overviewKey: `cat.${string}_overview`;
  shortDescKey: `cat.${string}_desc`;
  certKey: `cat.${string}`;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  tags: string[];
  count: number;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "networking",
    nameKey: "cat.networking_name",
    descKey: "cat.networking_full",
    overviewKey: "cat.networking_overview",
    shortDescKey: "cat.networking_desc",
    certKey: "cat.cert_net",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/50",
    tags: ["BGP", "OSPF", "VLAN", "VPN"],
    count: 124,
  },
  {
    slug: "cybersecurity",
    nameKey: "cat.cybersecurity_name",
    descKey: "cat.cybersecurity_full",
    overviewKey: "cat.cybersecurity_overview",
    shortDescKey: "cat.cybersecurity_desc",
    certKey: "cat.cert_cyber",
    icon: Shield,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500/50",
    tags: ["Zero Trust", "SIEM", "Pentest"],
    count: 98,
  },
  {
    slug: "infrastructure",
    nameKey: "cat.infrastructure_name",
    descKey: "cat.infrastructure_full",
    overviewKey: "cat.infrastructure_overview",
    shortDescKey: "cat.infrastructure_desc",
    certKey: "cat.cert_infra",
    icon: Server,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "group-hover:border-emerald-500/50",
    tags: ["HA", "Proxmox", "SAN"],
    count: 156,
  },
  {
    slug: "cloud",
    nameKey: "cat.cloud_name",
    descKey: "cat.cloud_full",
    overviewKey: "cat.cloud_overview",
    shortDescKey: "cat.cloud_desc",
    certKey: "cat.cert_cloud",
    icon: Cloud,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "group-hover:border-blue-400/50",
    tags: ["K8s", "Docker", "Terraform"],
    count: 132,
  },
  {
    slug: "automation",
    nameKey: "cat.automation_name",
    descKey: "cat.automation_full",
    overviewKey: "cat.automation_overview",
    shortDescKey: "cat.automation_desc",
    certKey: "cat.cert_auto",
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "group-hover:border-pink-500/50",
    tags: ["Ansible", "Python", "CI/CD"],
    count: 64,
  },
  {
    slug: "troubleshooting",
    nameKey: "cat.troubleshooting_name",
    descKey: "cat.troubleshooting_full",
    overviewKey: "cat.troubleshooting_overview",
    shortDescKey: "cat.troubleshooting_desc",
    certKey: "cat.cert_trouble",
    icon: Bug,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "group-hover:border-orange-500/50",
    tags: ["Methodology", "RCA", "Packet Analysis"],
    count: 87,
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}