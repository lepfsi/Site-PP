import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedArticles from "@/components/FeaturedArticles";
import ExperienceSection from "@/components/ExperienceSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { FileCode, Laptop, Book, GraduationCap, Download, ExternalLink, Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-navy">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <CategoryGrid />
        <FeaturedArticles />
        <ExperienceSection />
        
        {/* Tools & Resources Section */}
        <section className="py-20 bg-navy">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-turquoise">// </span>Outils & Ressources
              </h2>
              <p className="text-foreground/50 text-lg">Toolbox pour professionnels infrastructure</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="group rounded-xl border border-bluedark bg-deepblue p-8 text-center hover:border-turquoise transition-all hover:-translate-y-1">
                <FileCode className="h-10 w-10 text-turquoise mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-foreground mb-2">Cheatsheets</h3>
                <p className="text-xs text-foreground/40 mb-4 text-center">Commandes et syntaxes essentielles</p>
                <Link href="#" className="text-turquoise hover:underline text-xs font-bold flex items-center justify-center">
                  35 cheatsheets <Download className="ml-1 h-3 w-3" />
                </Link>
              </div>
              
              <div className="group rounded-xl border border-bluedark bg-deepblue p-8 text-center hover:border-turquoise transition-all hover:-translate-y-1">
                <Laptop className="h-10 w-10 text-turquoise mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-foreground mb-2">Scripts</h3>
                <p className="text-xs text-foreground/40 mb-4 text-center">Automatisation et monitoring</p>
                <Link href="#" className="text-turquoise hover:underline text-xs font-bold flex items-center justify-center">
                  GitHub Repo <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
              
              <div className="group rounded-xl border border-bluedark bg-deepblue p-8 text-center hover:border-turquoise transition-all hover:-translate-y-1">
                <Book className="h-10 w-10 text-turquoise mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-foreground mb-2">Templates</h3>
                <p className="text-xs text-foreground/40 mb-4 text-center">Documentation et runbooks</p>
                <Link href="#" className="text-turquoise hover:underline text-xs font-bold flex items-center justify-center">
                  20 templates <Download className="ml-1 h-3 w-3" />
                </Link>
              </div>
              
              <div className="group rounded-xl border border-bluedark bg-deepblue p-8 text-center hover:border-turquoise transition-all hover:-translate-y-1">
                <GraduationCap className="h-10 w-10 text-turquoise mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-foreground mb-2">Formations</h3>
                <p className="text-xs text-foreground/40 mb-4 text-center">Guides et labs pratiques</p>
                <Link href="#" className="text-turquoise hover:underline text-xs font-bold flex items-center justify-center">
                  12 cours <Play className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </div>
      <Footer />
    </main>
  );
}
