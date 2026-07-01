"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, User, Tag } from "lucide-react";
import { motion } from "framer-motion";

const articles = [
  {
    title: "Optimisation des performances BGP en environnement multi-homed",
    excerpt: "Comment affiner vos politiques de routage pour réduire la latence et améliorer la résilience de votre transit IP.",
    date: "24 Juin 2026",
    author: "Julien R.",
    category: "Networking",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Sécuriser Kubernetes : Au-delà du RBAC standard",
    excerpt: "Guide avancé sur l'implémentation de Network Policies et la gestion des secrets via HashiCorp Vault.",
    date: "18 Juin 2026",
    author: "Marc D.",
    category: "Cybersecurity",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Migration Cloud : Stratégies Move & Improve pour Legacy Apps",
    excerpt: "Analyse des patterns de migration et retours d'expérience sur le passage d'infra on-prem vers AWS/Azure.",
    date: "12 Juin 2026",
    author: "Sarah L.",
    category: "Infrastructure",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  }
];

export default function FeaturedArticles() {
  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Retours d'Expérience Terrain</h2>
          <p className="mt-2 text-foreground/60">Contenu éditorial technique et cas d'usage réels.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.article 
              key={article.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-lg mb-6 group">
                <div className="absolute inset-0 bg-accent/20 mix-blend-multiply group-hover:opacity-0 transition-opacity"></div>
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded bg-accent px-2 py-1 text-xs font-bold text-midnight uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-foreground/50 mb-4">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {article.readTime}
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {article.author}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors">
                <Link href="#">{article.title}</Link>
              </h3>
              
              <p className="text-foreground/70 text-sm mb-6 flex-grow">
                {article.excerpt}
              </p>

              <Link href="#" className="inline-flex items-center text-sm font-semibold text-accent hover:translate-x-1 transition-transform">
                Lire l'article <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
