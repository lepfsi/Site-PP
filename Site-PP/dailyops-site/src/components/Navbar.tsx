"use client";

import Link from "next/link";
import { Search, Monitor, Shield, Server, Cloud, Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

const navigation = [
  { name: "Networking", href: "/category/networking", icon: Monitor },
  { name: "Cybersecurity", href: "/category/cybersecurity", icon: Shield },
  { name: "Infrastructure", href: "/category/infrastructure", icon: Server },
  { name: "Cloud & VM", href: "/category/cloud", icon: Cloud },
  { name: "Troubleshooting", href: "/category/troubleshooting", icon: Activity },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
                <span className="text-midnight font-bold">DO</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                DailyOps<span className="text-accent">.Tech</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

import CommandSearch from "./CommandSearch";

// ... inside the Navbar container where Search was
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <CommandSearch />
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span>NOC Active</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-accent focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-card hover:text-accent"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="p-4 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Settings</span>
              <LanguageSwitcher />
            </div>
            <CommandSearch />
          </div>
        </div>
      )}
    </nav>
  );
}
