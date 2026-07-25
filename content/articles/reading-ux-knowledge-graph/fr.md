---
title: "Relier le savoir: takeaways, liens, notes, CTA"
excerpt: "Article démo pour points clés, liens voir aussi, footnotes, figures et CTA de fin d'article."
updated: "2026-07-25"
---

:::takeaways
- Un article n’existe pas seul: il doit pointer vers le lab, le runbook, le produit.
- Les footnotes gardent le corps léger sans perdre la nuance.
- Un CTA unique en fin d’article bat trois boutons concurrentiels.
:::

## Le problème du savoir isolé

Tu publies un excellent runbook. Six mois plus tard, personne ne le retrouve, et le lab associé n’est plus lié. Le contenu meurt dans le silence des listes.

Ce troisième article démo montre comment **relier** les morceaux: takeaways, voir aussi, notes de bas de page, figure légendée, et un CTA de sortie clair.

## Figure avec légende (clic pour agrandir)

![Schéma conceptuel: article au centre, relié à lab, runbook et produit](/globe.svg "Figure 1 — Un article DailyOps comme nœud du graphe de savoir (lab, runbook, produit).")

La légende s’affiche sous l’image. Un clic ouvre un overlay pour lire les détails sur grand écran.

## Nuances en footnotes

La redondance n’est pas un nombre de nœuds[^1]. De même, un SLA de triage n’est pas un SLA métier[^2]. Les notes de bas de page permettent d’ajouter ces nuances sans alourdir le paragraphe principal.

## Voir aussi (liens internes)

Le bloc ci-dessous est adressable via `#see-also-internal-links` (lien profond partageable vers cette section).

:::see-also
- [Lecture long format: navigation](/articles/reading-ux-navigation-longform): TOC, progression, mode Focus
- [Runbook SSH](/articles/reading-ux-ssh-hardening-runbook): code copiable, checklists, tableaux
- [Triage SOC et SLA](/articles/soc-severity-triage-sla): matrice P1–P3 terrain
:::

Tu peux aussi lier en ligne, comme vers [la redondance théorique](/articles/redondance-theorique-realite), quand le fil du texte le demande.

## Un seul CTA en fin de parcours

Trop de boutons à la fin = aucun clic. Choisis **une** action: lire le lab, s’abonner, ou contacter.

:::cta
title: Continuer sur Ops Labs
body: Passe de la lecture à la pratique avec un parcours guidé (SOC, réseau, infra).
href: /labs
label: Ouvrir Ops Labs
:::

## Récap de la série démo

| Article | Features mises en avant |
|---------|-------------------------|
| Navigation long format | TOC, progress, ancres, Focus, A±, takeaways |
| Runbook SSH | Code + copy, checklists, tables, callouts |
| Graphe de savoir (celui-ci) | Takeaways, figure, footnotes, see-also, CTA |

Pour le détail d’implémentation (fichiers, syntaxe markdown, backlog), vois la doc `docs/ARTICLE-READING-UX.md` dans le dépôt.

[^1]: Deux firewalls sur le même switch cœur restent un single point of failure.
[^2]: Un P1 “exfiltration active” et un engagement contractuel 99,9 % ne se mesurent pas de la même façon.
