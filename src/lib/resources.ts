import type { LucideIcon } from "lucide-react";
import { FileCode, Laptop, Book, GraduationCap } from "lucide-react";

export interface ResourceSection {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  linkKey: string;
  articleSlugs: string[];
  categorySlug?: string;
}

export const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    id: "cheatsheets",
    icon: FileCode,
    titleKey: "res.1.title",
    descKey: "res.page.cheatsheets_desc",
    linkKey: "res.1.link",
    articleSlugs: ["packet-loss-diagnosis", "ospf-neighbor-init-diagnosis", "vlan-trunking-runbook"],
    categorySlug: "troubleshooting",
  },
  {
    id: "scripts",
    icon: Laptop,
    titleKey: "res.2.title",
    descKey: "res.page.scripts_desc",
    linkKey: "res.2.link",
    articleSlugs: ["ansible-cicd-pipeline", "terraform-multicloud-patterns"],
    categorySlug: "automation",
  },
  {
    id: "templates",
    icon: Book,
    titleKey: "res.3.title",
    descKey: "res.page.templates_desc",
    linkKey: "res.3.link",
    articleSlugs: ["soc-incident-response-playbook", "linux-hardening-baseline", "zero-trust-freeipa-vault"],
    categorySlug: "infrastructure",
  },
  {
    id: "training",
    icon: GraduationCap,
    titleKey: "res.4.title",
    descKey: "res.page.training_desc",
    linkKey: "res.4.link",
    articleSlugs: ["eks-production-checklist", "kubernetes-network-policies"],
    categorySlug: "cloud",
  },
];