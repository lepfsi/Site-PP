"use client";

import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Server,
  Workflow,
  Lock,
  KeyRound,
  Layers,
  ShieldCheck,
  Container,
  Activity,
} from "lucide-react";
import CategoryVisual, { type VisualVariant } from "@/components/category-visuals/CategoryVisual";
import type { CategorySlug } from "@/lib/categories";
import type { Article } from "@/lib/articles";

export type { VisualVariant };

const VariantContext = createContext<VisualVariant>("hero");

const SHELL_HEIGHT: Record<VisualVariant, string> = {
  hero: "min-h-[220px] sm:min-h-[280px]",
  article: "min-h-[180px] sm:min-h-[220px]",
  card: "min-h-[112px] sm:min-h-[128px]",
};

const ACCENTS: Record<CategorySlug, string> = {
  networking: "#3b82f6",
  cybersecurity: "#a855f7",
  infrastructure: "#10b981",
  cloud: "#60a5fa",
  observability: "#06b6d4",
  automation: "#ec4899",
  ai: "#8b5cf6",
  troubleshooting: "#f97316",
};

type ArticleSlug = Article["slug"];

function VisualShell({ children, category }: { children: React.ReactNode; category: CategorySlug }) {
  const variant = useContext(VariantContext);
  const compact = variant === "card";
  const accent = ACCENTS[category];

  return (
    <div className={`visual-shell relative w-full h-full flex items-center justify-center overflow-hidden ${SHELL_HEIGHT[variant]}`}>
      <div className="absolute inset-0 tech-grid opacity-[0.18] dark:opacity-10 pointer-events-none" />
      <div className="visual-shell-overlay absolute inset-0 pointer-events-none" />
      {!compact && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      )}
      <div className={compact ? "scale-[0.85] w-full h-full flex items-center justify-center" : "w-full h-full flex items-center justify-center"}>
        {children}
      </div>
    </div>
  );
}

function useCompact() {
  return useContext(VariantContext) === "card";
}

function BgpCommunitiesVisual() {
  const accent = ACCENTS.networking;
  const compact = useCompact();
  const communities = ["65000:100", "65000:200", "65000:300"];
  return (
    <VisualShell category="networking">
      <svg className="w-[88%] h-[88%]" viewBox="0 0 100 100">
        <path d="M10 50 L35 50 L50 30 L70 30 L90 50" fill="none" stroke={accent} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.25" />
        <motion.path
          d="M10 50 L35 50 L50 30 L70 30 L90 50"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          strokeDasharray="160"
          animate={{ strokeDashoffset: [160, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          opacity="0.7"
        />
        {communities.map((tag, i) => (
          <motion.g key={tag} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}>
            <rect x={12 + i * 26} y={58} width="22" height="8" rx="2" fill={`${accent}20`} stroke={accent} strokeWidth="0.4" />
            <text x={14 + i * 26} y={64} fill={accent} fontSize="3.5" fontFamily="monospace">{tag}</text>
          </motion.g>
        ))}
        <motion.circle r="2" fill="#2dd4bf">
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M10 50 L35 50 L50 30 L70 30 L90 50" />
        </motion.circle>
        {!compact && <text x="8" y="88" fill={accent} fontSize="4" fontFamily="monospace" opacity="0.5">policy · communities</text>}
      </svg>
    </VisualShell>
  );
}

function ZeroTrustVisual() {
  const accent = ACCENTS.cybersecurity;
  const compact = useCompact();
  return (
    <VisualShell category="cybersecurity">
      <div className="relative w-[75%] aspect-square flex items-center justify-center">
        <motion.div
          className="absolute rounded-full border-2"
          style={{ borderColor: `${accent}30`, width: "85%", height: "85%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative z-10 p-5 rounded-2xl bg-[#111C44]/90 border"
          style={{ borderColor: `${accent}40` }}
          animate={{ boxShadow: [`0 0 0px ${accent}00`, `0 0 20px ${accent}40`, `0 0 0px ${accent}00`] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock size={32} className="text-purple-400" strokeWidth={1.5} />
        </motion.div>
        <motion.div
          className="absolute top-[18%] right-[12%] p-2 rounded-lg bg-[#111C44] border border-purple-500/30"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <KeyRound size={14} className="text-purple-300" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[10%] p-2 rounded-lg bg-[#111C44] border border-purple-500/30"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Shield size={14} className="text-purple-300" />
        </motion.div>
        {!compact && (
          <span className="absolute bottom-2 text-[7px] font-mono font-bold uppercase tracking-widest" style={{ color: accent }}>
            FreeIPA · Vault
          </span>
        )}
      </div>
    </VisualShell>
  );
}

function TerraformMulticloudVisual() {
  const accent = ACCENTS.cloud;
  const clouds = [
    { x: 18, y: 35, label: "AWS" },
    { x: 50, y: 22, label: "TF" },
    { x: 82, y: 35, label: "GCP" },
    { x: 34, y: 68, label: "AZ" },
    { x: 66, y: 68, label: "OCI" },
  ];
  return (
    <VisualShell category="cloud">
      <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
        {clouds.slice(1).map((c, i) => (
          <motion.line
            key={c.label}
            x1="50" y1="28" x2={c.x} y2={c.y}
            stroke={accent}
            strokeWidth="0.4"
            opacity="0.4"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        {clouds.map((c, i) => (
          <motion.g key={c.label} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}>
            <circle cx={c.x} cy={c.y} r={i === 1 ? 8 : 6} fill={`${accent}15`} stroke={accent} strokeWidth="0.5" />
            <text x={c.x - (c.label.length > 2 ? 4 : 2.5)} y={c.y + 1.5} fill={accent} fontSize="3.5" fontFamily="monospace">{c.label}</text>
          </motion.g>
        ))}
        <motion.circle r="1.5" fill="#2dd4bf">
          <animateMotion dur="3s" repeatCount="indefinite" path="M50 28 L18 35 L50 28 L82 35 L50 28 L34 68 L50 28 L66 68" />
        </motion.circle>
      </svg>
    </VisualShell>
  );
}

function OspfInitVisual() {
  const accent = ACCENTS.troubleshooting;
  const compact = useCompact();
  const states = ["DOWN", "INIT", "2WAY", "FULL"];
  return (
    <VisualShell category="troubleshooting">
      <div className="w-[85%] flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          {states.map((state, i) => (
            <motion.div key={state} className="flex flex-col items-center">
              <motion.div
                className="w-8 h-8 rounded-full border flex items-center justify-center text-[6px] font-mono font-bold"
                style={{
                  borderColor: state === "INIT" ? accent : "#334155",
                  backgroundColor: state === "INIT" ? `${accent}25` : "#111C44",
                  color: state === "INIT" ? accent : "#64748b",
                }}
                animate={state === "INIT" ? { scale: [1, 1.1, 1] } : undefined}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {state.slice(0, 3)}
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="w-full h-1 rounded-full overflow-hidden bg-slate-800"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: accent, width: "25%" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        {!compact && (
          <span className="text-[7px] font-mono font-bold uppercase tracking-widest" style={{ color: accent }}>
            stuck · INIT · neighbor down
          </span>
        )}
      </div>
    </VisualShell>
  );
}

function ProxmoxHaVisual() {
  const accent = ACCENTS.infrastructure;
  const compact = useCompact();
  return (
    <VisualShell category="infrastructure">
      <div className="flex items-end justify-center gap-4 h-[70%]">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="flex flex-col items-center">
            <motion.div
              className="w-14 rounded-t-lg border bg-[#111C44] p-2 flex flex-col gap-1"
              style={{ height: `${72 + i * 6}px`, borderColor: `${accent}40` }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            >
              <Server size={18} className="mx-auto text-emerald-400/70" />
              <motion.div
                className="h-1 rounded-full mt-auto"
                style={{ background: accent }}
                animate={{ scaleX: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            </motion.div>
            <span className="text-[6px] font-mono mt-1" style={{ color: `${accent}80` }}>pve-{i}</span>
          </motion.div>
        ))}
      </div>
      {!compact && (
        <motion.div className="absolute bottom-6 flex items-center gap-2" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <span className="text-[7px] font-mono font-bold uppercase tracking-widest" style={{ color: accent }}>corosync · quorum sync</span>
        </motion.div>
      )}
    </VisualShell>
  );
}

function WireguardVisual() {
  const accent = ACCENTS.networking;
  const compact = useCompact();
  return (
    <VisualShell category="networking">
      <svg className="w-[88%] h-[75%]" viewBox="0 0 100 70">
        <motion.path
          d="M15 35 Q50 10 85 35"
          fill="none"
          stroke={accent}
          strokeWidth="0.6"
          strokeDasharray="4 3"
          opacity="0.4"
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <rect x="8" y="28" width="14" height="14" rx="2" fill="#111C44" stroke={accent} strokeWidth="0.5" />
        <rect x="78" y="28" width="14" height="14" rx="2" fill="#111C44" stroke={accent} strokeWidth="0.5" />
        <foreignObject x="10" y="30" width="10" height="10">
          <ShieldCheck size={10} className="text-blue-400" />
        </foreignObject>
        <foreignObject x="80" y="30" width="10" height="10">
          <ShieldCheck size={10} className="text-blue-400" />
        </foreignObject>
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r="2"
            fill="#2dd4bf"
            animate={{ cx: [15, 50, 85], cy: [35, 18, 35], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
        {!compact && <text x="30" y="62" fill={accent} fontSize="4" fontFamily="monospace" opacity="0.5">wg0 · handshake OK</text>}
      </svg>
    </VisualShell>
  );
}

function K8sNetpolVisual() {
  const accent = ACCENTS.cloud;
  const namespaces = [
    { x: 25, y: 35, name: "app" },
    { x: 75, y: 35, name: "db" },
    { x: 50, y: 70, name: "mon" },
  ];
  return (
    <VisualShell category="cloud">
      <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
        {namespaces.map((ns, i) => (
          <motion.g key={ns.name}>
            <motion.rect
              x={ns.x - 14} y={ns.y - 12} width="28" height="24" rx="3"
              fill={`${accent}10`} stroke={accent} strokeWidth="0.5"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            />
            <text x={ns.x - 6} y={ns.y + 2} fill={accent} fontSize="4" fontFamily="monospace">{ns.name}</text>
          </motion.g>
        ))}
        <motion.line x1="39" y1="35" x2="61" y2="35" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.line x1="50" y1="47" x2="50" y2="58" stroke="#2dd4bf" strokeWidth="0.6"
          animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <foreignObject x="42" y="8" width="16" height="16">
          <Container size={14} className="text-blue-400" />
        </foreignObject>
      </svg>
    </VisualShell>
  );
}

function BgpRouteReflectionVisual() {
  const accent = ACCENTS.networking;
  const spokes = [
    { x: 20, y: 30 },
    { x: 80, y: 30 },
    { x: 20, y: 70 },
    { x: 80, y: 70 },
  ];
  return (
    <VisualShell category="networking">
      <svg className="w-[88%] h-[88%]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="10" fill={`${accent}25`} stroke={accent} strokeWidth="0.8" />
        <text x="42" y="53" fill={accent} fontSize="4" fontFamily="monospace">RR</text>
        {spokes.map((s, i) => (
          <motion.g key={i}>
            <line x1="50" y1="50" x2={s.x} y2={s.y} stroke={accent} strokeWidth="0.4" opacity="0.4" />
            <circle cx={s.x} cy={s.y} r="4" fill="#111C44" stroke={accent} strokeWidth="0.5" />
            <motion.circle r="1.5" fill="#2dd4bf">
              <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={`M${s.x} ${s.y} L50 50 L${spokes[(i + 1) % 4].x} ${spokes[(i + 1) % 4].y}`} />
            </motion.circle>
          </motion.g>
        ))}
      </svg>
    </VisualShell>
  );
}

function AnsibleCicdVisual() {
  const accent = ACCENTS.automation;
  const compact = useCompact();
  const stages = ["ansible", "lint", "test", "deploy"];
  return (
    <VisualShell category="automation">
      <div className="w-[88%] flex flex-col items-center gap-5">
        <div className="flex items-center w-full justify-between relative">
          <div className="absolute top-1/2 left-[8%] right-[8%] h-px bg-pink-500/20 -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-[8%] h-0.5 -translate-y-1/2 rounded-full"
            style={{ background: accent }}
            animate={{ width: ["0%", "84%", "84%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {stages.map((stage, i) => (
            <motion.div key={stage} className="relative z-10 flex flex-col items-center" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 5, repeat: Infinity, delay: i * 1 }}>
              <div className="w-8 h-8 rounded-lg border flex items-center justify-center bg-[#111C44]" style={{ borderColor: `${accent}50` }}>
                <Workflow size={12} style={{ color: accent }} />
              </div>
              <span className="text-[6px] font-mono font-bold mt-1 uppercase" style={{ color: accent }}>{stage}</span>
            </motion.div>
          ))}
        </div>
        {!compact && (
          <motion.span className="text-[7px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border" style={{ color: accent, borderColor: `${accent}40` }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
          >
            idempotent · CI/CD
          </motion.span>
        )}
      </div>
    </VisualShell>
  );
}

function VlanTrunkVisual() {
  const accent = ACCENTS.networking;
  const vlans = ["10", "20", "30"];
  return (
    <VisualShell category="networking">
      <svg className="w-[88%] h-[80%]" viewBox="0 0 100 80">
        <rect x="10" y="30" width="12" height="20" rx="1" fill="#111C44" stroke={accent} strokeWidth="0.5" />
        <rect x="78" y="30" width="12" height="20" rx="1" fill="#111C44" stroke={accent} strokeWidth="0.5" />
        <line x1="22" y1="40" x2="78" y2="40" stroke={accent} strokeWidth="0.8" opacity="0.3" />
        {vlans.map((vlan, i) => (
          <motion.g key={vlan} animate={{ x: [0, 50, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}>
            <rect x="30" y={32 + i * 8} width="40" height="6" rx="1" fill={`${accent}20`} stroke={accent} strokeWidth="0.4" />
            <text x="33" y={37 + i * 8} fill={accent} fontSize="3.5" fontFamily="monospace">802.1Q · VLAN {vlan}</text>
          </motion.g>
        ))}
        <foreignObject x="12" y="34" width="8" height="8">
          <Layers size={8} className="text-blue-400" />
        </foreignObject>
      </svg>
    </VisualShell>
  );
}

function SocIncidentVisual() {
  const accent = ACCENTS.cybersecurity;
  const compact = useCompact();
  const timeline = ["T+0", "T+5", "T+15", "T+30"];
  return (
    <VisualShell category="cybersecurity">
      <div className="w-[88%] flex flex-col gap-3">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-purple-500/20" />
          {timeline.map((t, i) => (
            <motion.div key={t} className="relative z-10 flex flex-col items-center"
              animate={{ scale: i === 3 ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-6 h-6 rounded-full border flex items-center justify-center bg-[#111C44] text-[5px] font-mono font-bold"
                style={{ borderColor: i === 3 ? accent : "#334155", color: i === 3 ? accent : "#64748b" }}
              >
                {t}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div className="h-2 rounded-full overflow-hidden bg-slate-800">
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${accent}, #ef4444)` }}
            animate={{ width: ["0%", "100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        {!compact && (
          <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-center" style={{ color: accent }}>
            SOC · 30min SLA
          </span>
        )}
      </div>
    </VisualShell>
  );
}

function LinuxHardeningVisual() {
  const accent = ACCENTS.infrastructure;
  const compact = useCompact();
  const checks = ["SSH", "FW", "AUD", "CIS"];
  return (
    <VisualShell category="infrastructure">
      <div className="w-[80%] flex flex-col gap-2">
        {checks.map((check, i) => (
          <motion.div key={check} className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, repeat: Infinity, repeatDelay: 3 }}
          >
            <motion.div
              className="w-4 h-4 rounded border flex items-center justify-center"
              style={{ borderColor: `${accent}50` }}
              animate={{ backgroundColor: [`${accent}00`, `${accent}30`, `${accent}00`] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            >
              <ShieldCheck size={10} style={{ color: accent }} />
            </motion.div>
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: accent }}
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, repeatDelay: 2 }}
              />
            </div>
            <span className="text-[6px] font-mono w-6" style={{ color: accent }}>{check}</span>
          </motion.div>
        ))}
        {!compact && <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-center mt-1" style={{ color: accent }}>CIS baseline scan</span>}
      </div>
    </VisualShell>
  );
}

function EksProductionVisual() {
  const accent = ACCENTS.cloud;
  const compact = useCompact();
  return (
    <VisualShell category="cloud">
      <svg className="w-[85%] h-[85%]" viewBox="0 0 100 100">
        <motion.rect x="25" y="15" width="50" height="22" rx="3" fill={`${accent}15`} stroke={accent} strokeWidth="0.6"
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
        />
        <text x="32" y="29" fill={accent} fontSize="4" fontFamily="monospace">control plane</text>
        <foreignObject x="66" y="18" width="12" height="12">
          <Lock size={10} className="text-blue-400" />
        </foreignObject>
        <rect x="15" y="55" width="22" height="18" rx="2" fill="#111C44" stroke={accent} strokeWidth="0.4" />
        <rect x="39" y="55" width="22" height="18" rx="2" fill="#111C44" stroke={accent} strokeWidth="0.4" />
        <rect x="63" y="55" width="22" height="18" rx="2" fill="#111C44" stroke={accent} strokeWidth="0.4" />
        <line x1="38" y1="37" x2="26" y2="55" stroke={accent} strokeWidth="0.3" opacity="0.4" />
        <line x1="50" y1="37" x2="50" y2="55" stroke={accent} strokeWidth="0.3" opacity="0.4" />
        <line x1="62" y1="37" x2="74" y2="55" stroke={accent} strokeWidth="0.3" opacity="0.4" />
        <motion.circle r="1.5" fill="#2dd4bf">
          <animateMotion dur="3s" repeatCount="indefinite" path="M50 37 L26 55 L50 37 L50 55 L50 37 L74 55" />
        </motion.circle>
        {!compact && <text x="28" y="88" fill={accent} fontSize="4" fontFamily="monospace" opacity="0.5">private · IRSA · Fargate</text>}
      </svg>
    </VisualShell>
  );
}

function PacketLossVisual() {
  const accent = ACCENTS.troubleshooting;
  const compact = useCompact();
  return (
    <VisualShell category="troubleshooting">
      <svg className="w-[90%] h-[70%]" viewBox="0 0 100 60" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="100" y2="30" stroke="#334155" strokeWidth="0.3" strokeDasharray="2 2" />
        <motion.path
          d="M0 30 L10 30 L15 28 L22 30 L30 30 L38 14 L46 46 L54 30 L62 30 L70 30 L78 30 L86 30 L94 30 L100 30"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect x="36" y="10" width="12" height="40" fill={`${accent}15`} stroke={accent} strokeWidth="0.5"
          animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}
        />
        <motion.line x1="0" y1="0" x2="0" y2="60" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.5"
          animate={{ x1: [0, 100], x2: [0, 100] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      {!compact && (
        <div className="absolute bottom-5 flex items-center gap-2">
          <Activity size={12} style={{ color: accent }} />
          <span className="text-[7px] font-mono font-bold uppercase tracking-widest" style={{ color: accent }}>mtr · loss spike</span>
        </div>
      )}
    </VisualShell>
  );
}

const ARTICLE_VISUALS: Record<ArticleSlug, () => React.JSX.Element> = {
  "bgp-communities-policy-routing": BgpCommunitiesVisual,
  "zero-trust-freeipa-vault": ZeroTrustVisual,
  "terraform-multicloud-patterns": TerraformMulticloudVisual,
  "ospf-neighbor-init-diagnosis": OspfInitVisual,
  "proxmox-ha-cluster-guide": ProxmoxHaVisual,
  "wireguard-enterprise-deployment": WireguardVisual,
  "kubernetes-network-policies": K8sNetpolVisual,
  "bgp-route-reflection-confederation": BgpRouteReflectionVisual,
  "ansible-cicd-pipeline": AnsibleCicdVisual,
  "vlan-trunking-runbook": VlanTrunkVisual,
  "soc-incident-response-playbook": SocIncidentVisual,
  "linux-hardening-baseline": LinuxHardeningVisual,
  "eks-production-checklist": EksProductionVisual,
  "packet-loss-diagnosis": PacketLossVisual,
};

export default function ArticleVisual({
  slug,
  category,
  variant = "hero",
}: {
  slug: string;
  category: CategorySlug;
  variant?: VisualVariant;
}) {
  const Visual = ARTICLE_VISUALS[slug as ArticleSlug];

  if (!Visual) {
    return <CategoryVisual slug={category} variant={variant} />;
  }

  return (
    <VariantContext.Provider value={variant}>
      <Visual />
    </VariantContext.Provider>
  );
}