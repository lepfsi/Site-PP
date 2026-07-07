"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Network, Shield, Server, Cloud, Wrench, ChevronRight, FileText, ArrowRight, Zap, Globe, Bug } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

const categoriesInfo = {
  networking: { icon: Globe, color: "text-blue-500" },
  cybersecurity: { icon: Shield, color: "text-purple-500" },
  infrastructure: { icon: Server, color: "text-emerald-500" },
  cloud: { icon: Cloud, color: "text-blue-400" },
  automation: { icon: Zap, color: "text-pink-500" },
  troubleshooting: { icon: Bug, color: "text-orange-500" },
};

export default function CategoryPage() {
  const params = useParams();
  const { lang } = useLanguage();
  const slug = params.slug as string;
  const category = categoriesInfo[slug as keyof typeof categoriesInfo] || categoriesInfo.networking;

  const title = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow">
        <header className="py-24 border-b border-border-main bg-bg-secondary/30 relative overflow-hidden">
          <div className="scanline"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <nav className="flex mb-12 text-[10px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">
              <Link href="/" className="hover:text-turquoise transition-colors">Nodes</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-text-primary">{title}</span>
            </nav>
            <div className="flex items-center space-x-8">
              <div className={`p-6 rounded-2xl bg-bg-secondary border border-border-main shadow-xl ${category.color}`}>
                <category.icon size={48} />
              </div>
              <div>
                <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter code-font">{title}</h1>
                <p className="mt-4 text-text-secondary text-xl font-medium max-w-2xl">
                  {lang === "FR" 
                    ? `Base de connaissances technique dédiée au ${title}. Guides, checklists et baselines de production.`
                    : `Technical knowledge base dedicated to ${title}. Guides, checklists and production baselines.`}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <article key={i} className="p-8 rounded-2xl border border-border-main bg-bg-secondary hover:border-turquoise transition-all group">
                    <div className="flex items-center text-[10px] font-black text-text-secondary/30 mb-4 uppercase tracking-[0.2em]">
                      <FileText className="mr-2 h-3 w-3" />
                      JUN 2026 // STABLE
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-4 group-hover:text-turquoise transition-colors">
                      {lang === "FR" ? "Baseline de configuration Production" : "Production Configuration Baseline"} #{i}
                    </h2>
                    <p className="text-text-secondary mb-8 leading-relaxed font-medium">
                      {lang === "FR" 
                        ? "Détails techniques sur l'implémentation des standards de sécurité et de performance en environnement critique."
                        : "Technical details on implementing security and performance standards in critical environments."}
                    </p>
                    <Link href="#" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-turquoise group-hover:underline">
                      Read Node <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </article>
                ))}
              </div>
              
              <aside className="space-y-8">
                <div className="p-8 rounded-2xl border border-border-main bg-bg-secondary shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/50 mb-8 border-b border-border-main pb-4">Index Nodes</h3>
                  <ul className="space-y-6">
                    {["Routing", "Switching", "Security", "SD-WAN"].map(item => (
                      <li key={item} className="flex justify-between items-center group cursor-pointer">
                        <span className="text-sm font-bold text-text-primary group-hover:text-turquoise transition-colors">{item}</span>
                        <span className="text-[10px] font-black bg-bg-primary px-2 py-1 rounded border border-border-main text-text-secondary/50 group-hover:border-turquoise group-hover:text-turquoise transition-all">0{item.length}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-8 rounded-2xl bg-text-primary text-bg-primary relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4">{lang === "FR" ? "Besoin d'expertise ?" : "Need Expertise?"}</h3>
                    <p className="text-sm text-bg-primary/50 mb-8 leading-relaxed">
                      {lang === "FR" 
                        ? "Design d'architecture, troubleshooting complexe et audit de production."
                        : "Architecture design, complex troubleshooting and production audit."}
                    </p>
                    {/* FIXED LINK TO ABOUT PAGE */}
                    <Link href="/about">
                      <button className="w-full py-4 bg-turquoise text-navy text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-colors">
                        Contact NOC
                      </button>
                    </Link>
                  </div>
                  <category.icon className="absolute -right-8 -bottom-8 h-40 w-40 text-bg-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
