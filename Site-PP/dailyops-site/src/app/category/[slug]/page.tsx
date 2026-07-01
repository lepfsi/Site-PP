import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Monitor, Shield, Server, Cloud, Activity, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

const categoriesInfo = {
  networking: { title: "Networking", description: "Infrastructures réseaux, routage et sécurité périmétrique.", icon: Monitor, color: "text-blue-500" },
  cybersecurity: { title: "Cybersecurity", description: "Protection des actifs, SOC et conformité.", icon: Shield, color: "text-red-500" },
  infrastructure: { title: "Infrastructure", description: "Gestion de serveurs et datacenters.", icon: Server, color: "text-orange-500" },
  cloud: { title: "Cloud & Virtualisation", description: "Hybrid Cloud, Containers et VMs.", icon: Cloud, color: "text-purple-500" },
  troubleshooting: { title: "Troubleshooting", description: "Résolution d'incidents et analyse de logs.", icon: Activity, color: "text-green-500" },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoriesInfo[slug as keyof typeof categoriesInfo] || categoriesInfo.networking;

  const posts = [
    { title: "Configuration avancée de BGP sur Cisco IOS-XE", date: "2026-06-20", excerpt: "Maîtriser les communautés et les attributs de chemin..." },
    { title: "Mise en place d'un VPN Wireguard site-to-site", date: "2026-06-15", excerpt: "Performances et sécurité pour vos interconnexions..." },
    { title: "Optimisation du MTU sur les réseaux MPLS", date: "2026-06-10", excerpt: "Éviter la fragmentation et améliorer le throughput..." },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-background">
        <header className="py-16 border-b border-border bg-card/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex mb-8 text-xs font-medium text-foreground/40 uppercase tracking-widest">
              <Link href="/" className="hover:text-accent">Accueil</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-foreground/80">{category.title}</span>
            </nav>
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-card border border-border ${category.color}`}>
                <category.icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">{category.title}</h1>
                <p className="mt-2 text-foreground/60">{category.description}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                {posts.map((post) => (
                  <article key={post.title} className="p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-all">
                    <div className="flex items-center text-xs text-foreground/40 mb-3 uppercase tracking-wider">
                      <FileText className="mr-2 h-3 w-3" />
                      {post.date}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3 hover:text-accent transition-colors">
                      <Link href="#">{post.title}</Link>
                    </h2>
                    <p className="text-foreground/60 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link href="#" className="text-sm font-bold text-accent">
                      Lire la suite →
                    </Link>
                  </article>
                ))}
              </div>
              
              <aside className="space-y-8">
                <div className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4 border-b border-border pb-2">Sous-catégories</h3>
                  <ul className="space-y-3 text-sm text-foreground/60">
                    <li className="hover:text-accent cursor-pointer flex justify-between"><span>Routing</span> <span className="text-xs text-foreground/30">12</span></li>
                    <li className="hover:text-accent cursor-pointer flex justify-between"><span>Switching</span> <span className="text-xs text-foreground/30">8</span></li>
                    <li className="hover:text-accent cursor-pointer flex justify-between"><span>VPN & Security</span> <span className="text-xs text-foreground/30">15</span></li>
                    <li className="hover:text-accent cursor-pointer flex justify-between"><span>SD-WAN</span> <span className="text-xs text-foreground/30">4</span></li>
                  </ul>
                </div>
                
                <div className="p-6 rounded-xl border border-accent/20 bg-accent/5">
                  <h3 className="text-sm font-bold text-accent mb-2">Besoin d'expertise ?</h3>
                  <p className="text-xs text-foreground/70 mb-4">Notre équipe intervient sur des problématiques complexes de design {category.title.toLowerCase()}.</p>
                  <button className="w-full py-2 bg-accent text-midnight text-xs font-bold rounded">Nous contacter</button>
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
