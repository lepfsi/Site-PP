const baseUrl = process.env.NEWSLETTER_TEMPLATE_URL ?? "https://www.dailyops.tech";
const secret = process.env.LABS_ADMIN_SECRET ?? process.env.NEWSLETTER_ADMIN_SECRET ?? process.env.NEWSLETTER_SETUP_SECRET;
const lang = process.argv.includes("--en") ? "EN" : "FR";
const slugs = process.argv.find((arg) => arg.startsWith("--articles="))?.split("=")[1];
const syncOnly = process.argv.includes("--sync");

if (!secret) {
  console.error("Missing LABS_ADMIN_SECRET (not LABS_SECRET).");
  console.error('$env:LABS_ADMIN_SECRET="..." ; npm run newsletter:template');
  process.exit(1);
}

const headers = { Authorization: `Bearer ${secret}` };

if (syncOnly) {
  const params = new URLSearchParams({ lang });
  const response = await fetch(`${baseUrl}/api/newsletter/admin/sync-resend?${params}`, {
    method: "POST",
    headers,
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`Sync failed (${response.status}):`, text);
    process.exit(1);
  }

  console.log(text);
  process.exit(0);
}

const params = new URLSearchParams({ lang });
if (slugs) params.set("articles", slugs);

const response = await fetch(`${baseUrl}/api/newsletter/admin/template?${params}`, { headers });

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
console.log("Tip: npm run newsletter:sync-resend — creates a branded draft directly in Resend");
console.log("");
console.log("--- HTML (copy below into Resend Broadcast) ---");
console.log(data.html);