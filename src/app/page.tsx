"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SiteStats from "@/components/SiteStats";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedArticles from "@/components/FeaturedArticles";
import ExperienceSection from "@/components/ExperienceSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <SiteStats />
        <CategoryGrid />
        <FeaturedArticles />
        <ExperienceSection />
        <NewsletterSection />
      </div>
      <Footer />
    </main>
  );
}
