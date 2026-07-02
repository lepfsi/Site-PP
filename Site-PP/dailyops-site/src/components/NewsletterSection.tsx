"use client";

import { Mail, Users, Newspaper, Bell, Gift, SendHorizontal, Lock } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✅ Merci pour votre inscription!\n\nVous recevrez votre première newsletter à l'adresse:\n${email}`);
    setEmail("");
  };

  return (
    <section id="newsletter" className="py-20 bg-deepblue">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-2xl border-2 border-turquoise bg-navy p-8 md:p-12 shadow-2xl shadow-turquoise/10">
            <div className="mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-turquoise to-turquoise-dark rounded-full mb-6">
                <Mail className="h-8 w-8 text-navy" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Newsletter Hebdomadaire
              </h2>
              <p className="text-foreground/50 text-lg mb-2">
                Recevez chaque semaine les meilleurs articles, news tech, et astuces infrastructure
              </p>
              <p className="text-turquoise font-semibold flex items-center justify-center">
                <Users className="mr-2 h-5 w-5" /> +5,000 professionnels IT déjà abonnés
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-deepblue border-2 border-bluedark rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-turquoise transition-all" 
                  placeholder="votre.email@entreprise.com"
                  required
                />
                <button type="submit" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-turquoise to-turquoise-dark text-navy font-bold hover:scale-105 transition-all shadow-lg shadow-turquoise/20 whitespace-nowrap">
                  <SendHorizontal className="mr-2 h-5 w-5" /> S'abonner
                </button>
              </div>
              <p className="text-xs text-foreground/30 mt-4 flex items-center justify-center">
                <Lock className="mr-2 h-3 w-3" /> Vos données sont sécurisées. Désabonnement en 1 clic.
              </p>
            </form>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-bluedark">
              <div className="text-center">
                <Newspaper className="h-6 w-6 text-turquoise mx-auto mb-2" />
                <h4 className="font-bold text-foreground text-sm mb-2">Articles Premium</h4>
                <p className="text-xs text-foreground/40">Contenu exclusif chaque semaine</p>
              </div>
              <div className="text-center">
                <Bell className="h-6 w-6 text-turquoise mx-auto mb-2" />
                <h4 className="font-bold text-foreground text-sm mb-2">Alertes Tech</h4>
                <p className="text-xs text-foreground/40">CVE, updates, breaking news</p>
              </div>
              <div className="text-center">
                <Gift className="h-6 w-6 text-turquoise mx-auto mb-2" />
                <h4 className="font-bold text-foreground text-sm mb-2">Ressources</h4>
                <p className="text-xs text-foreground/40">Cheatsheets, templates, tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
