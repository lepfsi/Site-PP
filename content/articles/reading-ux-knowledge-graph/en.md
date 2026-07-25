---
title: "Connecting Knowledge: Takeaways, Links, Notes, CTA"
excerpt: "Demo article for key takeaways, see-also links, footnotes, figures, and a clear end-of-article CTA."
updated: "2026-07-25"
---

:::takeaways
- An article does not live alone: it should point to lab, runbook, and product.
- Footnotes keep the body light without losing nuance.
- One end CTA beats three competing buttons.
:::

## The isolated knowledge problem

You publish a strong runbook. Six months later nobody finds it, and the related lab is unlinked. Content dies in silent lists.

This third demo article shows how to **connect** pieces: takeaways, see-also, footnotes, captioned figure, and a clear exit CTA.

## Figure with caption (click to enlarge)

![Conceptual diagram: article in the center linked to lab, runbook, and product](/globe.svg "Figure 1 — A DailyOps article as a node in the knowledge graph (lab, runbook, product).")

The caption renders under the image. Click opens an overlay for large-screen reading.

## Nuance via footnotes

Redundancy is not a node count[^1]. Likewise, a triage SLA is not a business SLA[^2]. Footnotes hold that nuance without bloating the main paragraph.

## See also (internal links)

The block below is addressable as `#see-also-internal-links` (shareable deep link into this section).

:::see-also
- [Long-form reading navigation](/articles/reading-ux-navigation-longform): TOC, progress, Focus mode
- [SSH hardening runbook](/articles/reading-ux-ssh-hardening-runbook): copyable code, checklists, tables
- [SOC triage and SLAs](/articles/soc-severity-triage-sla): field P1–P3 matrix
:::

You can also link inline, such as [theoretical redundancy](/articles/redondance-theorique-realite), when the narrative needs it.

## One CTA at the end of the path

Too many buttons at the end means no click. Pick **one** action: open a lab, subscribe, or contact.

:::cta
title: Continue with Ops Labs
body: Move from reading to practice with a guided path (SOC, network, infra).
href: /labs
label: Open Ops Labs
:::

## Demo series recap

| Article | Featured reading UX |
|---------|---------------------|
| Long-form navigation | TOC, progress, anchors, Focus, A±, takeaways |
| SSH runbook | Code + copy, checklists, tables, callouts |
| Knowledge graph (this one) | Takeaways, figure, footnotes, see-also, CTA |

For implementation detail (files, markdown syntax, backlog), see `docs/ARTICLE-READING-UX.md` in the repo.

[^1]: Two firewalls on the same core switch are still a single point of failure.
[^2]: A P1 “active exfiltration” and a contractual 99.9% uptime are measured differently.
