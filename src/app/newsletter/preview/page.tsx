import { buildSampleNewsletterEdition } from "@/lib/newsletter-edition";

export const metadata = {
  title: "Ops Mail — Aperçu",
  robots: { index: false, follow: false },
};

export default function NewsletterPreviewPage() {
  const { html } = buildSampleNewsletterEdition("FR");

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="bg-[#0A1128] px-4 py-3 text-center text-xs font-bold tracking-wide text-white">
        Aperçu Ops Mail (FR) — le rendu réel dans Resend est créé via{" "}
        <code className="text-[#22af9d]">POST /api/newsletter/admin/sync-resend</code>
      </div>
      <iframe
        title="Newsletter preview"
        srcDoc={html}
        className="h-[calc(100vh-44px)] w-full border-0 bg-[#f1f5f9]"
      />
    </div>
  );
}