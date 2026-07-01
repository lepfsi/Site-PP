import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
                <span className="text-midnight font-bold">DO</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                DailyOps<span className="text-accent">.Tech</span>
              </span>
            </Link>
            <p className="text-foreground/60 max-w-sm mb-6">
              Hub de connaissances éditorial dédié à l'infrastructure IT, aux réseaux et à la cybersécurité. 
              Conçu par des passionnés pour les professionnels de l'IT.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground/40 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/40 hover:text-accent transition-colors"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="text-foreground/40 hover:text-accent transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><Link href="#" className="hover:text-accent">Articles</Link></li>
              <li><Link href="#" className="hover:text-accent">Guides</Link></li>
              <li><Link href="#" className="hover:text-accent">Études de cas</Link></li>
              <li><Link href="#" className="hover:text-accent">À propos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">Newsletter Ops</h4>
            <p className="text-xs text-foreground/50 mb-4">Recevez une curation technique bi-mensuelle directement dans votre inbox.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="ops@example.com" 
                className="bg-card border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button className="bg-accent text-midnight text-sm font-bold py-2 rounded hover:bg-accent/90 transition-colors">
                S'abonner
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-foreground/40">
          <p>© 2026 DailyOps.Tech. Tous droits réservés. <span className="mx-2">|</span> Propulsé par Next.js & Vercel</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="#" className="hover:text-foreground">Mentions Légales</Link>
            <Link href="#" className="hover:text-foreground">Confidentialité</Link>
            <Link href="#" className="hover:text-foreground flex items-center">Status <ExternalLink className="ml-1 h-3 w-3" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
