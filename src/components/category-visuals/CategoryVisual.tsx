"use client";

import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Network, Shield, Server, Cloud, Activity, Workflow, Brain, Wrench } from "lucide-react";
import type { CategorySlug } from "@/lib/categories";

export type VisualVariant = "hero" | "card" | "article";

const VariantContext = createContext<VisualVariant>("hero");

const SHELL_HEIGHT: Record<VisualVariant, string> = {
  hero: "min-h-[180px] sm:min-h-[200px]",
  article: "min-h-[180px] sm:min-h-[220px]",
  card: "min-h-[112px] sm:min-h-[128px]",
};

/** Networking & cloud SVGs are taller — cap hero shell further */
const SLIM_HERO_SLUGS: CategorySlug[] = ["networking", "cloud"];

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

function VisualShell({ children, slug }: { children: React.ReactNode; slug: CategorySlug }) {
  const variant = useContext(VariantContext);
  const compact = variant === "card";
  const heightClass =
    variant === "hero" && SLIM_HERO_SLUGS.includes(slug)
      ? "min-h-[170px] sm:min-h-[185px]"
      : SHELL_HEIGHT[variant];

  return (
    <div className={`visual-shell relative w-full h-full flex items-center justify-center overflow-hidden ${heightClass}`}>
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div className="visual-shell-overlay absolute inset-0 pointer-events-none" />
      {!compact && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${ACCENTS[slug]}, transparent)` }}
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

function NetworkingVisual() {
  const accent = ACCENTS.networking;
  return (
    <VisualShell slug="networking">
      <svg className="w-[82%] h-[82%]" viewBox="0 0 100 100">
        <path d="M20 50 L40 50 L55 28 L75 28 L90 50" fill="none" stroke={accent} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.25" />
        <path d="M20 50 L40 50 L55 72 L75 72 L90 50" fill="none" stroke={accent} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.25" />
        <motion.path
          d="M20 50 L40 50 L55 28 L75 28 L90 50"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          strokeDasharray="180"
          initial={{ strokeDashoffset: 180 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          opacity="0.7"
        />
        <motion.path
          d="M20 50 L40 50 L55 72 L75 72 L90 50"
          fill="none"
          stroke="#2dd4bf"
          strokeWidth="0.8"
          strokeDasharray="180"
          initial={{ strokeDashoffset: 180 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: 0.8 }}
          opacity="0.5"
        />
        {[
          { cx: 20, cy: 50 },
          { cx: 40, cy: 50 },
          { cx: 55, cy: 28 },
          { cx: 75, cy: 28 },
          { cx: 55, cy: 72 },
          { cx: 75, cy: 72 },
          { cx: 90, cy: 50 },
        ].map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r="2" fill={i === 3 || i === 6 ? accent : "#64748b"} opacity={i === 3 || i === 6 ? 1 : 0.5} />
        ))}
        <motion.circle r="2.5" fill="#2dd4bf">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M20 50 L40 50 L55 28 L75 28 L90 50" />
        </motion.circle>
        <foreignObject x="33" y="42" width="14" height="14">
          <div className="w-full h-full flex items-center justify-center bg-[#111C44] rounded border border-blue-500/40">
            <Network size={8} className="text-blue-400" />
          </div>
        </foreignObject>
        <text x="8" y="46" fill={accent} fontSize="4" fontFamily="monospace" opacity="0.6">AS64496</text>
        <text x="82" y="46" fill="#2dd4bf" fontSize="4" fontFamily="monospace" opacity="0.6">BGP</text>
      </svg>
    </VisualShell>
  );
}

function CybersecurityVisual() {
  const accent = ACCENTS.cybersecurity;
  const compact = useCompact();
  return (
    <VisualShell slug="cybersecurity">
      <div className="relative w-[75%] aspect-square flex items-center justify-center">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{ borderColor: `${accent}40`, width: `${ring * 30}%`, height: `${ring * 30}%` }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2 + ring * 0.5, repeat: Infinity, delay: ring * 0.3 }}
          />
        ))}
        <motion.div
          className="absolute w-full h-0.5 origin-left"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)`, top: "50%", left: "50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 p-5 rounded-2xl bg-[#111C44]/80 border border-purple-500/30">
          <Shield size={36} className="text-purple-400" strokeWidth={1.5} />
        </div>
        {[
          { x: "15%", y: "25%", delay: 0 },
          { x: "78%", y: "30%", delay: 0.6 },
          { x: "70%", y: "72%", delay: 1.2 },
        ].map((t, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-red-500"
            style={{ left: t.x, top: t.y }}
            animate={{ x: [0, -20, -40], y: [0, 10, 20], opacity: [1, 0.6, 0], scale: [1, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: t.delay }}
          />
        ))}
        {!compact && (
          <motion.span
            className="absolute bottom-4 text-[8px] font-mono font-bold uppercase tracking-widest"
            style={{ color: accent }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            THREAT BLOCKED
          </motion.span>
        )}
      </div>
    </VisualShell>
  );
}

function InfrastructureVisual() {
  const accent = ACCENTS.infrastructure;
  const compact = useCompact();
  return (
    <VisualShell slug="infrastructure">
      <div className="flex items-end justify-center gap-3 sm:gap-4 h-[70%]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-14 sm:w-16 rounded-t-lg border border-emerald-500/30 bg-[#111C44] p-2 flex flex-col gap-1.5"
              style={{ height: `${80 + i * 8}px` }}
            >
              <div className="flex gap-1 justify-center">
                {[0, 1, 2].map((led) => (
                  <motion.div
                    key={led}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: led === 0 ? accent : led === 1 ? "#2dd4bf" : "#64748b" }}
                    animate={{ opacity: led === 2 ? [0.3, 1, 0.3] : 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + led * 0.1 }}
                  />
                ))}
              </div>
              <Server size={20} className="text-emerald-400/60 mx-auto mt-auto" />
            </div>
            <span className="text-[7px] font-mono text-emerald-500/50 mt-1">node-0{i + 1}</span>
          </motion.div>
        ))}
      </div>
      {!compact && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="h-px w-8 bg-emerald-500/40" />
          <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest">HA Quorum OK</span>
          <div className="h-px w-8 bg-emerald-500/40" />
        </motion.div>
      )}
    </VisualShell>
  );
}

function CloudVisual() {
  const accent = ACCENTS.cloud;
  const hexPositions = [
    { x: 50, y: 30 },
    { x: 35, y: 45 },
    { x: 65, y: 45 },
    { x: 20, y: 60 },
    { x: 50, y: 60 },
    { x: 80, y: 60 },
  ];
  return (
    <VisualShell slug="cloud">
      <svg className="w-[80%] h-[80%]" viewBox="0 0 100 100">
        <motion.circle cx="50" cy="18" r="6" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.5"
          animate={{ r: [5, 7, 5] }} transition={{ duration: 2, repeat: Infinity }}
        />
        <foreignObject x="44" y="10" width="12" height="12">
          <div className="w-full h-full flex items-center justify-center">
            <Cloud size={12} className="text-blue-400" />
          </div>
        </foreignObject>
        {hexPositions.map((h, i) => (
          <motion.g key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}>
            <polygon
              points={`${h.x},${h.y - 6} ${h.x + 5},${h.y - 3} ${h.x + 5},${h.y + 3} ${h.x},${h.y + 6} ${h.x - 5},${h.y + 3} ${h.x - 5},${h.y - 3}`}
              fill={`${accent}15`}
              stroke={accent}
              strokeWidth="0.5"
            />
            <line x1="50" y1="24" x2={h.x} y2={h.y - 4} stroke={accent} strokeWidth="0.3" opacity="0.3" />
          </motion.g>
        ))}
        <motion.circle r="1.5" fill="#2dd4bf" opacity="0.8">
          <animateMotion dur="4s" repeatCount="indefinite" path="M50 24 L35 41 L50 56 L65 41 L50 24" />
        </motion.circle>
        <text x="38" y="88" fill={accent} fontSize="4" fontFamily="monospace" opacity="0.5">K8s · 6 pods</text>
      </svg>
    </VisualShell>
  );
}

function ObservabilityVisual() {
  const accent = ACCENTS.observability;
  const compact = useCompact();
  return (
    <VisualShell slug="observability">
      <svg className="w-[88%] h-[72%]" viewBox="0 0 100 60" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.3" />
        <motion.path
          d="M0 50 L10 48 L20 45 L30 42 L40 38 L50 30 L60 35 L70 28 L80 22 L90 18 L100 15"
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.circle
          cx="50"
          cy="30"
          r="3"
          fill={accent}
          animate={{ opacity: [0.4, 1, 0.4], r: [2.5, 3.5, 2.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {[20, 40, 60, 80].map((x, i) => (
          <motion.rect
            key={x}
            x={x - 2}
            y={50 - (i + 1) * 6}
            width="4"
            height={(i + 1) * 6}
            fill={`${accent}30`}
            stroke={accent}
            strokeWidth="0.3"
            animate={{ opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
      {!compact && (
        <div className="absolute bottom-6 flex items-center gap-2">
          <Activity size={12} style={{ color: accent }} />
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest" style={{ color: accent }}>
            SLO · 99.9% · alerts armed
          </span>
        </div>
      )}
    </VisualShell>
  );
}

function AutomationVisual() {
  const accent = ACCENTS.automation;
  const compact = useCompact();
  const stages = ["LINT", "TEST", "STAGE", "PROD"];
  return (
    <VisualShell slug="automation">
      <div className="w-[85%] flex flex-col items-center gap-6">
        <div className="flex items-center w-full justify-between relative">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-pink-500/20 -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-[10%] h-px -translate-y-1/2"
            style={{ background: accent, width: "0%" }}
            animate={{ width: ["0%", "80%", "80%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {stages.map((stage, i) => (
            <motion.div
              key={stage}
              className="relative z-10 flex flex-col items-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center bg-[#111C44]"
                style={{ borderColor: `${accent}50` }}
              >
                <Workflow size={14} style={{ color: accent }} />
              </div>
              <span className="text-[7px] font-mono font-bold mt-1.5 uppercase tracking-wider" style={{ color: accent }}>
                {stage}
              </span>
            </motion.div>
          ))}
        </div>
        {!compact && (
          <motion.div
            className="text-[8px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded border"
            style={{ color: accent, borderColor: `${accent}40` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            pipeline running · idempotent
          </motion.div>
        )}
      </div>
    </VisualShell>
  );
}

function AIVisual() {
  const accent = ACCENTS.ai;
  const compact = useCompact();
  const nodes = [
    { cx: 50, cy: 28 },
    { cx: 28, cy: 48 },
    { cx: 72, cy: 48 },
    { cx: 38, cy: 68 },
    { cx: 62, cy: 68 },
  ];
  return (
    <VisualShell slug="ai">
      <svg className="w-[85%] h-[80%]" viewBox="0 0 100 80">
        {[
          [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2],
        ].map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke={accent}
            strokeWidth="0.5"
            opacity="0.35"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r={i === 0 ? 5 : 3.5}
            fill={i === 0 ? `${accent}40` : `${accent}20`}
            stroke={accent}
            strokeWidth="0.6"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
        <motion.circle
          cx="50"
          cy="28"
          r="12"
          fill="none"
          stroke={accent}
          strokeWidth="0.4"
          strokeDasharray="3 3"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50px 28px" }}
        />
      </svg>
      {!compact && (
        <div className="absolute bottom-6 flex items-center gap-2">
          <Brain size={12} style={{ color: accent }} />
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest" style={{ color: accent }}>
            LLM · runbook match
          </span>
        </div>
      )}
    </VisualShell>
  );
}

function TroubleshootingVisual() {
  const accent = ACCENTS.troubleshooting;
  const compact = useCompact();
  return (
    <VisualShell slug="troubleshooting">
      <svg className="w-[88%] h-[70%]" viewBox="0 0 100 60" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="100" y2="30" stroke="#334155" strokeWidth="0.3" strokeDasharray="2 2" />
        <motion.path
          d="M0 30 L8 30 L12 28 L18 30 L24 30 L30 29 L36 30 L42 30 L48 12 L54 48 L60 30 L66 30 L72 29 L78 30 L84 30 L90 30 L100 30"
          fill="none"
          stroke={accent}
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.rect
          x="44" y="8" width="12" height="44" fill={`${accent}15`}
          stroke={accent}
          strokeWidth="0.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.line
          x1="0" y1="0" x2="0" y2="60"
          stroke="#2dd4bf"
          strokeWidth="0.8"
          opacity="0.6"
          animate={{ x1: [0, 100], x2: [0, 100] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      {!compact && (
        <div className="absolute bottom-6 flex items-center gap-2">
          <Wrench size={12} className="text-orange-400" />
          <span className="text-[8px] font-mono font-bold text-orange-400 uppercase tracking-widest">RCA · packet anomaly</span>
        </div>
      )}
    </VisualShell>
  );
}

const VISUALS: Record<CategorySlug, () => React.JSX.Element> = {
  networking: NetworkingVisual,
  cybersecurity: CybersecurityVisual,
  infrastructure: InfrastructureVisual,
  cloud: CloudVisual,
  observability: ObservabilityVisual,
  automation: AutomationVisual,
  ai: AIVisual,
  troubleshooting: TroubleshootingVisual,
};

export default function CategoryVisual({
  slug,
  variant = "hero",
}: {
  slug: CategorySlug;
  variant?: VisualVariant;
}) {
  const Visual = VISUALS[slug] ?? VISUALS.networking;
  return (
    <VariantContext.Provider value={variant}>
      <Visual />
    </VariantContext.Provider>
  );
}