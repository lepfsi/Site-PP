"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PAGE_TOP_OFFSET } from "@/components/PageHeader";
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
import { ArrowUpRight } from "lucide-react";

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

function SoftBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-text-secondary dark:bg-white/[0.06]">
      {children}
    </span>
  );
}

function SoftwareRow({
  product,
  t,
}: {
  product: ProductEntry;
  t: (key: keyof TranslationKeys | string) => string;
}) {
  return (
    <article
      id={product.id}
      className="group scroll-mt-28 border-b border-black/[0.06] py-10 last:border-b-0 dark:border-white/[0.06]"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="max-w-xl">
          <div className="mb-3 flex flex-wrap items-center gap-2.5">
            <h3 className="text-2xl font-semibold tracking-tight text-text-primary md:text-[1.65rem]">
              {product.name}
            </h3>
            <SoftBadge>{t(statusKey(product.status))}</SoftBadge>
          </div>
          <p className="mb-3 text-[15px] font-medium text-text-primary/90">
            {t(productTaglineKey(product.id))}
          </p>
          <p className="text-[15px] leading-relaxed text-text-secondary">
            {t(productDescKey(product.id))}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 md:items-end md:pt-1">
          <Link
            href={product.ctaHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90 dark:bg-turquoise dark:text-navy"
          >
            {t("products.cta.access")}
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            {product.secondaryHref && (
              <Link
                href={product.secondaryHref}
                className="text-text-secondary underline-offset-4 transition-colors hover:text-turquoise hover:underline"
              >
                {t("products.cta.read")}
              </Link>
            )}
            {product.github && (
              <a
                href={product.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary underline-offset-4 transition-colors hover:text-turquoise hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function PlatformLink({
  product,
  t,
}: {
  product: ProductEntry;
  t: (key: keyof TranslationKeys | string) => string;
}) {
  return (
    <Link
      href={product.ctaHref}
      className="group flex flex-col gap-1.5 rounded-2xl px-1 py-2 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03] sm:px-3"
    >
      <span className="text-[15px] font-semibold text-text-primary group-hover:text-turquoise">
        {product.name}
      </span>
      <span className="text-[13px] leading-snug text-text-secondary">
        {t(productDescKey(product.id))}
      </span>
    </Link>
  );
}

export default function ProductsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col bg-[#f4f6f9] dark:bg-bg-primary">
      <Navbar />

      <div className={`flex-grow ${PAGE_TOP_OFFSET}`}>
        {/* Soft hero — air, not a dashboard */}
        <section className="border-b border-black/[0.05] bg-[#fafbfc] dark:border-white/[0.06] dark:bg-bg-primary">
          <div className="container-custom mx-auto max-w-3xl px-6 pb-14 pt-10 text-center sm:pb-16 sm:pt-14">
            <p className="mb-4 text-[12px] font-medium tracking-wide text-turquoise-dark dark:text-turquoise">
              {t("products.kicker")}
            </p>
            <h1 className="text-[1.85rem] font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl sm:leading-[1.15]">
              {t("products.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary sm:text-base">
              {t("products.subtitle")}
            </p>
          </div>
        </section>

        {/* Software suite */}
        <section className="bg-white dark:bg-bg-secondary/40">
          <div className="container-custom mx-auto max-w-3xl px-6 py-12 sm:py-16">
            <div className="mb-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary/80">
                {t("products.software_label")}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                {t("products.software_intro")}
              </p>
            </div>

            <div className="mt-4">
              {SOFTWARE_PRODUCTS.map((product) => (
                <SoftwareRow key={product.id} product={product} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Knowledge house / platform */}
        <section
          id="platform"
          className="scroll-mt-28 border-t border-black/[0.05] bg-[#fafbfc] dark:border-white/[0.06] dark:bg-bg-primary"
        >
          <div className="container-custom mx-auto max-w-3xl px-6 py-12 sm:py-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary/80">
              {t("products.platform_label")}
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-text-secondary">
              {t("products.platform_intro")}
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-4">
              {PLATFORM_PRODUCTS.map((product) => (
                <PlatformLink key={product.id} product={product} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Soft roadmap */}
        <section
          id="roadmap"
          className="scroll-mt-28 border-t border-black/[0.05] bg-white dark:border-white/[0.06] dark:bg-bg-secondary/40"
        >
          <div className="container-custom mx-auto max-w-3xl px-6 py-12 sm:py-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text-secondary/80">
              {t("products.roadmap_label")}
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-text-secondary">
              {t("products.roadmap_intro")}
            </p>
            <ul className="mt-8 space-y-5">
              {ROADMAP_PRODUCTS.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <div className="flex items-center gap-2 sm:w-36 sm:shrink-0">
                    <span className="text-[15px] font-medium text-text-primary/70">
                      {product.name}
                    </span>
                    <SoftBadge>{t(statusKey(product.status))}</SoftBadge>
                  </div>
                  <p className="text-[14px] leading-relaxed text-text-secondary">
                    {t(productDescKey(product.id))}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA — quiet */}
        <section className="border-t border-black/[0.05] bg-[#fafbfc] dark:border-white/[0.06] dark:bg-bg-primary">
          <div className="container-custom mx-auto max-w-3xl px-6 py-14 text-center sm:py-16">
            <h2 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
              {t("products.closing_title")}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-text-secondary">
              {t("products.closing_desc")}
            </p>
            <Link
              href="/about#contact"
              className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-6 py-2.5 text-[13px] font-medium text-text-primary shadow-sm transition-colors hover:border-turquoise/40 hover:text-turquoise dark:border-white/10 dark:bg-bg-elevated"
            >
              {t("products.closing_cta")}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}