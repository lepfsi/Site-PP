import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedArticles from "@/components/FeaturedArticles";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <TechStack />
        <CategoryGrid />
        
        {/* Expertise Section */}
        <section className="py-24 bg-midnight relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 grid-bg"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-8">Plus qu'un blog, un écosystème technique</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-lg border border-accent/20 bg-deepblue/50">
                <div className="text-accent text-3xl font-bold mb-2">150+</div>
                <div className="text-white/80 font-medium">Guides Techniques</div>
              </div>
              <div className="p-8 rounded-lg border border-accent/20 bg-deepblue/50">
                <div className="text-accent text-3xl font-bold mb-2">10k+</div>
                <div className="text-white/80 font-medium">Lecteurs Mensuels</div>
              </div>
              <div className="p-8 rounded-lg border border-accent/20 bg-deepblue/50">
                <div className="text-accent text-3xl font-bold mb-2">45+</div>
                <div className="text-white/80 font-medium">Cas d'usage Réels</div>
              </div>
            </div>
          </div>
        </section>

        <FeaturedArticles />
        
        {/* Brand Personal Section */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-card border border-border p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
              <div className="lg:max-w-xl">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Expertise Terrain & Accompagnement</h2>
                <p className="mt-4 text-lg text-foreground/60">
                  DailyOps est porté par une vision pragmatique de l'IT. Nous accompagnons les équipes dans leur transformation 
                  digitale par le biais de conseils stratégiques et d'un partage de connaissances sans filtre.
                </p>
                <div className="mt-8">
                  <Link href="#" className="inline-flex items-center text-accent font-bold hover:underline">
                    Découvrir notre approche →
                  </Link>
                </div>
              </div>
              <div className="mt-10 lg:mt-0 flex flex-col items-center">
                <div className="h-32 w-32 rounded-full border-2 border-accent p-1 mb-4">
                  <div className="h-full w-full rounded-full bg-deepblue flex items-center justify-center text-accent text-2xl font-bold">
                    DO
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-foreground">Équipe DailyOps</div>
                  <div className="text-sm text-foreground/50">Architectes Cloud & SecOps</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
