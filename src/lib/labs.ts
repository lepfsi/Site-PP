import type { LucideIcon } from "lucide-react";
import { Network, Shield, Cloud } from "lucide-react";
import type { CategorySlug } from "./categories";

export type LabStepType = "read" | "checklist" | "lab" | "quiz";

export interface LabStep {
  id: string;
  type: LabStepType;
  titleKey: string;
  descKey: string;
  articleSlug?: string;
}

export interface LabPath {
  slug: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  levelKey: string;
  durationKey: string;
  category: CategorySlug;
  featured?: boolean;
  color: string;
  bg: string;
  steps: LabStep[];
}

export const LAB_PATHS: LabPath[] = [
  {
    slug: "soc-first-30-days",
    icon: Shield,
    titleKey: "labs.soc.title",
    descKey: "labs.soc.desc",
    levelKey: "labs.level.beginner",
    durationKey: "labs.soc.duration",
    category: "cybersecurity",
    featured: true,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    steps: [
      {
        id: "s1",
        type: "read",
        titleKey: "labs.soc.s1.title",
        descKey: "labs.soc.s1.desc",
        articleSlug: "soc-incident-response-playbook",
      },
      {
        id: "s2",
        type: "read",
        titleKey: "labs.soc.s2.title",
        descKey: "labs.soc.s2.desc",
        articleSlug: "linux-hardening-baseline",
      },
      {
        id: "s3",
        type: "checklist",
        titleKey: "labs.soc.s3.title",
        descKey: "labs.soc.s3.desc",
      },
      {
        id: "s4",
        type: "lab",
        titleKey: "labs.soc.s4.title",
        descKey: "labs.soc.s4.desc",
      },
      {
        id: "s5",
        type: "read",
        titleKey: "labs.soc.s5.title",
        descKey: "labs.soc.s5.desc",
        articleSlug: "genai-dlp-sensitive-data-leaks",
      },
      {
        id: "s6",
        type: "quiz",
        titleKey: "labs.soc.s6.title",
        descKey: "labs.soc.s6.desc",
      },
    ],
  },
  {
    slug: "noc-network-foundations",
    icon: Network,
    titleKey: "labs.noc.title",
    descKey: "labs.noc.desc",
    levelKey: "labs.level.beginner",
    durationKey: "labs.noc.duration",
    category: "networking",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    steps: [
      {
        id: "s1",
        type: "read",
        titleKey: "labs.noc.s1.title",
        descKey: "labs.noc.s1.desc",
        articleSlug: "vlan-trunking-runbook",
      },
      {
        id: "s2",
        type: "read",
        titleKey: "labs.noc.s2.title",
        descKey: "labs.noc.s2.desc",
        articleSlug: "ospf-neighbor-init-diagnosis",
      },
      {
        id: "s3",
        type: "lab",
        titleKey: "labs.noc.s3.title",
        descKey: "labs.noc.s3.desc",
      },
      {
        id: "s4",
        type: "read",
        titleKey: "labs.noc.s4.title",
        descKey: "labs.noc.s4.desc",
        articleSlug: "bgp-communities-policy-routing",
      },
      {
        id: "s5",
        type: "read",
        titleKey: "labs.noc.s5.title",
        descKey: "labs.noc.s5.desc",
        articleSlug: "packet-loss-diagnosis",
      },
      {
        id: "s6",
        type: "quiz",
        titleKey: "labs.noc.s6.title",
        descKey: "labs.noc.s6.desc",
      },
    ],
  },
  {
    slug: "cloud-ops-production",
    icon: Cloud,
    titleKey: "labs.cloud.title",
    descKey: "labs.cloud.desc",
    levelKey: "labs.level.intermediate",
    durationKey: "labs.cloud.duration",
    category: "cloud",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    steps: [
      {
        id: "s1",
        type: "read",
        titleKey: "labs.cloud.s1.title",
        descKey: "labs.cloud.s1.desc",
        articleSlug: "eks-production-checklist",
      },
      {
        id: "s2",
        type: "read",
        titleKey: "labs.cloud.s2.title",
        descKey: "labs.cloud.s2.desc",
        articleSlug: "kubernetes-network-policies",
      },
      {
        id: "s3",
        type: "lab",
        titleKey: "labs.cloud.s3.title",
        descKey: "labs.cloud.s3.desc",
      },
      {
        id: "s4",
        type: "read",
        titleKey: "labs.cloud.s4.title",
        descKey: "labs.cloud.s4.desc",
        articleSlug: "prometheus-grafana-production-stack",
      },
      {
        id: "s5",
        type: "read",
        titleKey: "labs.cloud.s5.title",
        descKey: "labs.cloud.s5.desc",
        articleSlug: "terraform-multicloud-patterns",
      },
      {
        id: "s6",
        type: "quiz",
        titleKey: "labs.cloud.s6.title",
        descKey: "labs.cloud.s6.desc",
      },
    ],
  },
];

export function getAllLabPaths(): LabPath[] {
  return LAB_PATHS;
}

export function getLabPathBySlug(slug: string): LabPath | undefined {
  return LAB_PATHS.find((p) => p.slug === slug);
}

export function getFeaturedLabPath(): LabPath | undefined {
  return LAB_PATHS.find((p) => p.featured);
}