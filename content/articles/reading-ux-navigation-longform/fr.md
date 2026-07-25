---
title: "Lecture long format: une navigation qui te garde orienté"
excerpt: "Article démo pour table des matières, ancres de section, barre de progression et contrôles de typo."
updated: "2026-07-25"
---

:::takeaways
- La TOC et la barre de progression réduisent la charge cognitive sur un long article.
- Les ancres de section rendent le partage Slack / ticket précis.
- Le mode Focus et la taille de texte s’adaptent au contexte (bureau, mobile, fatigue).
:::

## Pourquoi la navigation de lecture compte

Un article ops de 10 minutes n’est pas un fil Twitter. Sans repères, le lecteur abandonne au milieu ou relit trois fois la même section.

Ce texte est volontairement découpé en **plusieurs H2 / H3** pour activer la table des matières dans la sidebar, la barre de progression en haut de page, et les ancres cliquables sur les titres.

## Ce que tu vois déjà sur la page

### Barre de progression

La fine barre turquoise en haut suit le scroll dans le corps de l’article (`#article-body`). Elle répond à la question implicite: *où en suis-je ?*

### Table des matières

Dès qu’il y a au moins deux titres de section, la TOC liste les `##` et `###`. Sur desktop elle est collante dans la colonne de droite. Sur mobile, le bouton **Sur cette page** dans la barre d’outils l’ouvre.

### Ancres et copie de lien

Survole un titre: l’icône lien apparaît. Un clic copie l’URL avec le hash de section. Idéal pour coller dans un runbook partagé ou un ticket.

## Contrôles de confort

### Taille de texte (A− / A+)

Trois échelles: compacte, standard, large. Utile en fin de journée ou sur un laptop 13".

### Mode Focus

Le mode **Focus** masque la sidebar (catégorie, related, CTA contact) et centre le texte sur une largeur de lecture confortable (~42rem). Le corps reste scannable sans bruit latéral.

### Bouton haut de page

Après un certain scroll, une pastille flottante remonte en douceur. Sur mobile long format, c’est un détail qui change tout.

## Rythme typographique

Les paragraphes utilisent un interligne généreux (~1.75). Les H2 sont séparés par un filet léger pour marquer des “chapitres” sans casser le flux.

Le but n’est pas d’imiter un blog lifestyle: c’est de **réduire la friction** quand on lit un sujet dense entre deux incidents.

## Comment écrire pour en profiter

1. Découpe en sections utiles (`##`), pas en chapitres marketing.
2. Ajoute des `###` seulement quand une sous-étape le mérite.
3. Place un bloc `:::takeaways` en tête ou en pied pour les lecteurs pressés.
4. Évite dix callouts d’affilée: la TOC suffit souvent à structurer.

## Suite de la démo

Les deux articles suivants montrent d’autres familles de features: runbook (code + checklists) et graphe de savoir (liens + footnotes + CTA).

Utilise la TOC à droite pour sauter à **Contrôles de confort**, puis reviens ici avec le bouton haut de page.
