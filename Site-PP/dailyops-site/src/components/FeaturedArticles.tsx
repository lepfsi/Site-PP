"use client";

import { Clock, Calendar, Lock, Box, Network, Wrench, Code, Server, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const articles = [
  {
    title: "Implémenter Zero Trust Network Access en 2024",
    excerpt: "Guide complet pour migrer vers une architecture Zero Trust : principes, outils, et retour d'expérience terrain.",
    date: "15 Jan 2024",
    category: "Cybersecurity",
    readTime: "12 min",
    icon: Lock,
  },
  {
    title: "Kubernetes Network Policies : Best Practices",
    excerpt: "Sécuriser vos workloads K8s avec des network policies efficaces : exemples pratiques et anti-patterns à éviter.",
    date: "12 Jan 2024",
    category: "Cloud",
    readTime: "15 min",
    icon: Box,
  },
  {
    title: "BGP Route Reflection vs Confederation",
    excerpt: "Comparaison approfondie des deux approches de scaling BGP dans les grands réseaux d'entreprise.",
    date: "10 Jan 2024",
    category: "Networking",
    readTime: "18 min",
    icon: Network,
  }
];

export default function FeaturedArticles() {
  return (
    <section id="articles" className="py-20 bg-deepblue">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-turquoise">// </span>Articles Récents
          </h2>
          <p className="text-foreground/50 text-lg">Les dernières publications de la base de connaissances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <motion.div 
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-xl border border-bluedark bg-deepblue p-6 group hover:border-turquoise transition-all"
            >
              <div className="w-full h-48 bg-bluedark/30 rounded-lg mb-4 flex items-center justify-center text-turquoise opacity-70 group-hover:opacity-100 transition-opacity">
                <article.icon className="h-16 w-16" />
              </div>

              <div className="mb-3">
                <span className="px-2 py-1 rounded-md bg-turquoise/10 text-turquoise text-[10px] font-bold uppercase tracking-wider">
                  {article.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-turquoise transition-colors cursor-pointer">
                {article.title}
              </h3>
              
              <p className="text-foreground/50 text-sm mb-6 flex-grow leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex justify-between items-center text-xs text-foreground/30 border-t border-bluedark pt-4">
                <span className="flex items-center"><Clock className="mr-2 h-3 w-3" /> {article.readTime}</span>
                <span className="flex items-center"><Calendar className="mr-2 h-3 w-3" /> {article.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="#" className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-turquoise to-turquoise-dark text-navy font-bold hover:scale-105 transition-all shadow-lg shadow-turquoise/20">
            Voir tous les articles
          </Link>
        </div>
      </div>
    </section>
  );
}
