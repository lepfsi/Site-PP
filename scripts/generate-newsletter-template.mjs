const baseUrl = process.env.NEWSLETTER_TEMPLATE_URL ?? "https://www.dailyops.tech";
const secret = process.env.LABS_ADMIN_SECRET ?? process.env.NEWSLETTER_SETUP_SECRET;
const lang = process.argv.includes("--en") ? "EN" : "FR";
const slugs = process.argv.find((arg) => arg.startsWith("--articles="))?.split("=")[1];

if (!secret) {
  console.error("Missing LABS_ADMIN_SECRET or NEWSLETTER_SETUP_SECRET.");
  console.error('Example: $env:LABS_ADMIN_SECRET="..." ; node scripts/generate-newsletter-template.mjs');
  process.exit(1);
}

const params = new URLSearchParams({
  key: secret,
  lang,
});

if (slugs) params.set("articles", slugs);

const response = await fetch(`${baseUrl}/api/newsletter/admin/template?${params.toString()}`);

if (!response.ok) {
  console.error(`Request failed (${response.status}):`, await response.text());
  process.exit(1);
}

const data = await response.json();

console.log("");
console.log(`Subject: ${data.subject}`);
console.log("");
console.log("Usage:");
for (const line of data.usage) console.log(`  • ${line}`);
console.log("");
console.log("--- HTML (copy below into Resend Broadcast) ---");
console.log(data.html);