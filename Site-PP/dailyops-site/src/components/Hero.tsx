"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Zap, Globe } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40 grid-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-inset ring-accent/20">
                Knowledge Hub v2.0
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                L'excellence opérationnelle pour le <span className="text-accent">Hub IT</span>.
              </h1>
              <p className="mt-6 text-lg text-foreground/70">
                Base de connaissances spécialisée en infrastructure, réseaux et cybersécurité. 
                Retours d'expérience terrain, guides techniques et veille technologique pour les Ops modernes.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                <button className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-midnight shadow-sm hover:bg-accent/90 transition-all">
                  Explorer le Hub
                </button>
                <button className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-base font-semibold text-foreground shadow-sm hover:bg-background transition-all">
                  Derniers Articles
                </button>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 lg:mt-0 lg:col-span-6 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-accent to-deepblue opacity-25 blur-xl"></div>
              <div className="relative rounded-lg border border-border bg-card p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs font-mono text-foreground/40">system_monitor.sh</span>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent">Infrastructure Status</span>
                    <span className="text-green-400">ONLINE</span>
                  </div>
                  <div className="h-2 w-full bg-midnight rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-midnight/50 p-3 rounded border border-border/50">
                      <div className="text-[10px] text-foreground/50">Uptime</div>
                      <div className="text-accent">99.998%</div>
                    </div>
                    <div className="bg-midnight/50 p-3 rounded border border-border/50">
                      <div className="text-[10px] text-foreground/50">Active Nodes</div>
                      <div className="text-accent">14</div>
                    </div>
                  </div>
                  <div className="text-foreground/60 leading-relaxed">
                    <span className="text-accent">$</span> tail -f /var/log/syslog<br/>
                    [12:04:22] <span className="text-green-400">SUCCESS:</span> VPN connection established<br/>
                    [12:05:01] <span className="text-blue-400">INFO:</span> Scaling cluster node-04<br/>
                    [12:05:15] <span className="text-accent">SCAN:</span> Threat detection module active
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
