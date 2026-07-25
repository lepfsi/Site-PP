"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader, { PAGE_TOP_OFFSET } from "@/components/PageHeader";
import { useLanguage } from "@/lib/LanguageContext";
import {
  PLATFORM_PRODUCTS,
  ROADMAP_PRODUCTS,
  SOFTWARE_PRODUCTS,
  type ProductEntry,
  type ProductStatus,
} from "@/lib/products";
import type { TranslationKeys } from "@/lib/translations";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  KeyRound,
  Mail,
  Shield,
  type LucideIcon,
} from "lucide-react";

function statusKey(status: ProductStatus): keyof TranslationKeys {
  switch (status) {
    case "live":
      return "products.status.live";
    case "early_access":
      return "products.status.early";
    case "prototype":
      return "products.status.prototype";
    case "planned":
      return "products.status.planned";
  }
}

function productDescKey(id: string): keyof TranslationKeys {
  return `products.${id}.desc` as keyof TranslationKeys;
}

function productTaglineKey(id: string): keyof TranslationKeys {
  return `products.${id}.tagline` as keyof TranslationKeys;
}

const SOFTWARE_ICONS: Record<string, LucideIcon> = {
  opsgate: Shield,
  opsvault: KeyRound,
};

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  hub: BookOpen,
  labs: GraduationCap,
  opsmail: Mail,
};

/** Soft status pill — brand tokens only */
function StatusPill({
  status,
  t,
}: {
  status: ProductStatus;
  t: (key: keyof TranslationKeys | string) => string;
}) {
  const tone =
    status === "live"
      ? "bg-turquoise/15 text-turquoise border-turquoise/25"
      : status === "early_access"
        ? "bg-turquoise/10 text-turquoise border-turquoise/20"
        : status === "prototype"
          ? "bg-bg-primary text-text-secondary border-border-main/70"
          : "bg-bg-primary/60 text-text-secondary/80 border-border-main/50";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${tone}`}
    >
      {t(statusKey(status))}
    </span>
  );
}

function SoftwareCard({
  product,
  index,
  t,
}: {
  product: ProductEntry;
  index: number;
  t: (key: keyof TranslationKeys | string) => string;
}) {
  const Icon = SOFTWARE_ICONS[product.id] ?? Shield;

  return (
    <motion.article
      id={product.id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="scroll-mt-28 group relative overflow-hidden rounded-2xl border border-border-main/70 bg-bg-elevated shadow-[var(--surface-shadow)]"
    >
      {/* Soft brand wash — top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-turquoise/[0.07] blur-3xl dark:bg-turquoise/[0.1]"
        aria-hidden
      />

      <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end md:gap-10 md:p-9">
        <div className="min-w-0">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-turquoise/25 bg-turquoise/10 text-turquoise">
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                  {product.name}
                </h3>
                <StatusPill status={product.status} t={t} />
              </div>
              <p className="text-sm font-semibold leading-snug text-turquoise sm:text-[15px]">
                {t(productTaglineKey(product.id))}
              </p>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-text-secondary sm:text-[15px] sm:leading-relaxed">
            {t(productDescKey(product.id))}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-stretch">
          <Link
            href={product.ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-turquoise px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-navy transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {t("products.cta.access")}
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-0.5 md:justify-center">
            {product.secondaryHref && (
              <Link
                href={product.secondaryHref}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-text-secondary transition-colors hover:text-turquoise"
              >
                {t("products.cta.read")}
                <ArrowUpRight size={12} />
              </Link>
            )}
            {product.github && (
              <a
                href={product.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-text-secondary transition-colors hover:text-turquoise"
              >
                GitHub
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PlatformCard({
  product,
  index,
  t,
}: {
  product: ProductEntry;
  index: number;
  t: (key: keyof TranslationKeys | string) => string;
}) {
  const Icon = PLATFORM_ICONS[product.id] ?? BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        href={product.ctaHref}
        className="group flex h-full flex-col rounded-2xl border border-border-main/60 bg-bg-elevated/80 p-5 transition-all hover:border-turquoise/35 hover:bg-bg-elevated hover:shadow-[var(--surface-shadow)] sm:p-6"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border-main/60 bg-bg-secondary text-text-secondary transition-colors group-hover:border-turquoise/30 group-hover:bg-turquoise/10 group-hover:text-turquoise">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-[15px] font-bold tracking-tight text-text-primary group-hover:text-turquoise">
            {product.name}
          </span>
          <StatusPill status={product.status} t={t} />
        </div>
        <p className="flex-grow text-[13px] leading-relaxed text-text-secondary">
          {t(productDescKey(product.id))}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.14em] text-turquoise opacity-80 transition-opacity group-hover:opacity-100">
          {t("products.cta.open")}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function ProductsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col bg-bg-primary">
      <Navbar />

      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        <PageHeader
          grid="noc"
          breadcrumbs={[
            { label: t("catpage.breadcrumb"), href: "/" },
            { label: t("nav.products") },
          ]}
          title={t("products.title")}
          subtitle={t("products.subtitle")}
          meta={
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-turquoise">
              {t("products.kicker")}
            </p>
          }
          showPrefix
        />

        {/* Software suite */}
        <section className="border-b border-border-main bg-bg-primary py-10 sm:py-14">
          <div className="container-custom max-w-4xl">
            <div className="mb-8 max-w-2xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-turquoise">
                {t("products.software_label")}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                {t("products.software_heading")}
              </h2>
              <div className="heading-accent mt-3" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                {t("products.software_intro")}
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:gap-6">
              {SOFTWARE_PRODUCTS.map((product, index) => (
                <SoftwareCard key={product.id} product={product} index={index} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge house */}
        <section
          id="platform"
          className="scroll-mt-28 border-b border-border-main bg-bg-secondary/50 section-band py-10 sm:py-14"
        >
          <div className="container-custom max-w-4xl">
            <div className="mb-8 max-w-2xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-turquoise">
                {t("products.platform_label")}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                {t("products.platform_heading")}
              </h2>
              <div className="heading-accent mt-3" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                {t("products.platform_intro")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {PLATFORM_PRODUCTS.map((product, index) => (
                <PlatformCard key={product.id} product={product} index={index} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section
          id="roadmap"
          className="scroll-mt-28 border-b border-border-main bg-bg-primary py-10 sm:py-14"
        >
          <div className="container-custom max-w-4xl">
            <div className="mb-8 max-w-2xl">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-turquoise">
                {t("products.roadmap_label")}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                {t("products.roadmap_heading")}
              </h2>
              <div className="heading-accent mt-3" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                {t("products.roadmap_intro")}
              </p>
            </div>

            <div className="relative space-y-0 rounded-2xl border border-border-main/70 bg-bg-elevated/60 p-2 sm:p-3">
              {ROADMAP_PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="relative flex gap-4 rounded-xl px-4 py-5 sm:gap-5 sm:px-5"
                >
                  <div className="flex flex-col items-center pt-1">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-turquoise/70 ring-4 ring-turquoise/15" />
                    {index < ROADMAP_PRODUCTS.length - 1 && (
                      <span className="mt-1 w-px flex-grow bg-border-main/80" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 pb-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-text-primary">{product.name}</span>
                      <StatusPill status={product.status} t={t} />
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-secondary sm:text-sm">
                      {t(productDescKey(product.id))}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="bg-bg-secondary/40 py-12 sm:py-16">
          <div className="container-custom max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-border-main/70 bg-bg-elevated px-6 py-10 text-center shadow-[var(--surface-shadow)] sm:px-10 sm:py-12"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-turquoise/40 to-transparent"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-turquoise/[0.08] blur-3xl"
                aria-hidden
              />
              <div className="relative">
                <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                  {t("products.closing_title")}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
                  {t("products.closing_desc")}
                </p>
                <Link
                  href="/about#contact"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl border border-border-main bg-bg-primary px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-text-primary transition-all hover:border-turquoise/40 hover:text-turquoise"
                >
                  {t("products.closing_cta")}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
