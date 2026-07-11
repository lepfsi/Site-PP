"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedArticles from "@/components/FeaturedArticles";
import ExperienceSection from "@/components/ExperienceSection";
import LabsSection from "@/components/LabsSection";
import ResourcesSection from "@/components/ResourcesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Navbar />
      <div className="flex-grow">
        <Hero />
        <CategoryGrid />
        <FeaturedArticles />
        <ExperienceSection />
        <LabsSection />
        <ResourcesSection />
        <NewsletterSection />
      </div>
      <Footer />
    </main>
  );
}
