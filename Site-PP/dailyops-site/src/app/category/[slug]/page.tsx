import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Network, Shield, Server, Cloud, Wrench, ChevronRight, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

const categoriesInfo = {
  networking: { title: "Networking", description: "Infrastructures réseaux, routage et sécurité périmétrique.", icon: Network, color: "text-blue-500" },
  cybersecurity: { title: "Cybersecurity", description: "Protection des actifs, SOC et conformité.", icon: Shield, color: "text-red-500" },
  infrastructure: { title: "Infrastructure", description: "Gestion de serveurs et datacenters.", icon: Server, color: "text-orange-500" },
  cloud: { title: "Cloud & Virtualisation", description: "Hybrid Cloud, Containers et VMs.", icon: Cloud, color: "text-purple-500" },
  troubleshooting: { title: "Troubleshooting", description: "Résolution d'incidents et analyse de logs.", icon: Wrench, color: "text-green-500" },
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
    <main className="min-h-screen flex flex-col bg-navy">
      <Navbar />
      <div className="flex-grow">
        <header className="py-16 border-b border-bluedark bg-deepblue/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex mb-8 text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">
              <Link href="/" className="hover:text-turquoise transition-colors">Accueil</Link>
              <ChevronRight className="mx-2 h-3 w-3" />
              <span className="text-foreground/80">{category.title}</span>
            </nav>
            <div className="flex items-center space-x-6">
              <div className={`p-4 rounded-xl bg-deepblue border border-bluedark ${category.color}`}>
                <category.icon className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{category.title}</h1>
                <p className="mt-2 text-foreground/50 text-lg">{category.description}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {posts.map((post) => (
                  <article key={post.title} className="p-8 rounded-xl border border-bluedark bg-deepblue hover:border-turquoise/30 transition-all group">
                    <div className="flex items-center text-[10px] font-bold text-foreground/30 mb-3 uppercase tracking-widest">
                      <FileText className="mr-2 h-3 w-3" />
                      {post.date}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-turquoise transition-colors">
                      <Link href="#">{post.title}</Link>
                    </h2>
                    <p className="text-foreground/50 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Link href="#" className="inline-flex items-center text-sm font-bold text-turquoise group-hover:underline">
                      Lire la suite <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </article>
                ))}
              </div>
              
              <aside className="space-y-8">
                <div className="p-6 rounded-xl border border-bluedark bg-deepblue">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-6 border-b border-bluedark pb-2">Sous-catégories</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="text-foreground/60 hover:text-turquoise transition-colors cursor-pointer flex justify-between items-center group">
                      <span>Routing</span> 
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bluedark text-foreground/40 group-hover:bg-turquoise group-hover:text-navy transition-all">12</span>
                    </li>
                    <li className="text-foreground/60 hover:text-turquoise transition-colors cursor-pointer flex justify-between items-center group">
                      <span>Switching</span> 
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bluedark text-foreground/40 group-hover:bg-turquoise group-hover:text-navy transition-all">8</span>
                    </li>
                    <li className="text-foreground/60 hover:text-turquoise transition-colors cursor-pointer flex justify-between items-center group">
                      <span>VPN & Security</span> 
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bluedark text-foreground/40 group-hover:bg-turquoise group-hover:text-navy transition-all">15</span>
                    </li>
                    <li className="text-foreground/60 hover:text-turquoise transition-colors cursor-pointer flex justify-between items-center group">
                      <span>SD-WAN</span> 
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-bluedark text-foreground/40 group-hover:bg-turquoise group-hover:text-navy transition-all">4</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-8 rounded-xl border border-turquoise/20 bg-turquoise/5 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold text-turquoise mb-2">Besoin d'expertise ?</h3>
                    <p className="text-sm text-foreground/60 mb-6">Notre équipe intervient sur des problématiques complexes de design {category.title.toLowerCase()}.</p>
                    <button className="w-full py-3 bg-turquoise text-navy text-sm font-bold rounded-lg hover:scale-105 transition-all shadow-lg shadow-turquoise/20">Nous contacter</button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <category.icon className="h-24 w-24" />
                  </div>
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
