# Article Reading UX — DailyOps

Documentation complète des features qui rendent un article **agréable à lire** et **utile sur le terrain**.  
Implémentation dans le dépôt Site-PP, articles de démo inclus.

## Sommaire

1. [Objectifs](#1-objectifs)
2. [Architecture (fichiers)](#2-architecture-fichiers)
3. [Features page (chrome)](#3-features-page-chrome)
4. [Features markdown (contenu)](#4-features-markdown-contenu)
5. [Syntaxe auteur](#5-syntaxe-auteur)
6. [Next read, related, footnotes, see-also (guide éditorial)](#6-next-read-related-footnotes-see-also-guide-éditorial)
7. [Articles de démo](#7-articles-de-démo)
8. [Guide d’implémentation détaillé](#8-guide-dimplémentation-détaillé)
9. [Backlog / non fait](#9-backlog--non-fait)
10. [Checklist qualité article](#10-checklist-qualité-article)

---

## 1. Objectifs

Un lecteur ops lit souvent:

- entre deux tickets,
- sur mobile ou laptop 13",
- pour **extraire une action** (commande, checklist, lien lab).

Les features ci-dessous ciblent quatre jobs:

| Job | Features |
|-----|----------|
| **Orientation** | TOC, progress bar, ancres, back-to-top |
| **Confort** | Largeur lecture, A±, mode Focus, rythme typo |
| **Action terrain** | Code + copy, checklists, tables, callouts |
| **Continuité** | Takeaways, see-also, footnotes, CTA, updated |

---

## 2. Architecture (fichiers)

| Fichier | Rôle |
|---------|------|
| `src/lib/article-reading.ts` | `slugifyHeading`, `extractToc`, `estimateReadMinutes` |
| `src/lib/markdown-callouts.ts` | Callouts GitHub `> [!warning]` |
| `src/lib/markdown-blocks.ts` | Blocs `:::takeaways`, `:::see-also`, `:::cta` + pipeline segments |
| `src/lib/markdown.ts` | Lecture fichiers, strip frontmatter, meta `updated` |
| `src/components/ArticleMarkdown.tsx` | Rendu markdown enrichi |
| `src/components/article/ReadingProgressBar.tsx` | Barre de progression |
| `src/components/article/ArticleToc.tsx` | Table des matières + highlight section active |
| `src/components/article/ArticleToolbar.tsx` | A±, Focus, TOC mobile |
| `src/components/article/BackToTop.tsx` | Bouton haut de page |
| `src/components/article/CodeBlock.tsx` | Bloc code + bouton Copy |
| `src/components/article/ImageWithCaption.tsx` | Figure + lightbox |
| `src/app/articles/[slug]/ArticlePageClient.tsx` | Assemblage page article |
| `src/app/globals.css` | Échelles de police + `@media print` |
| `docs/ARTICLE-READING-UX.md` | Ce document |

Flux de rendu:

```
.md file
  → getMarkdownBody / getMarkdownMeta (server)
  → ArticlePageClient (TOC, progress, toolbar, read time)
  → ArticleMarkdown
       → splitArticleContent (fences + callouts)
       → ReactMarkdown + remark-gfm
```

---

## 3. Features page (chrome)

Ces features s’appliquent à **tous** les articles markdown (pas besoin de syntaxe spéciale).

### 3.1 Barre de progression de lecture

| | |
|--|--|
| **Quoi** | Barre fixe 3px en haut, largeur = % de lecture du corps |
| **Pourquoi** | Réduit l’anxiété “encore combien ?” |
| **Où** | `ReadingProgressBar` → cible `#article-body` |
| **Implémentation** | `scroll` + `getBoundingClientRect` sur l’article; `role="progressbar"` |
| **Statut** | ✅ Fait |

### 3.2 Table des matières (TOC)

| | |
|--|--|
| **Quoi** | Liste des `##` / `###` avec lien `#id`, highlight de la section visible |
| **Pourquoi** | Saut direct, vision d’ensemble |
| **Où** | Sidebar desktop; bouton “Sur cette page” sur mobile |
| **Implémentation** | `extractToc()` parse le markdown; `IntersectionObserver` pour l’actif; IDs alignés avec les titres rendus |
| **Condition** | Affichée si ≥ 2 titres |
| **Statut** | ✅ Fait |

### 3.3 Ancres sur titres (sans bouton copy sur chaque titre)

| | |
|--|--|
| **Quoi** | `id` stable sur H2/H3 pour TOC et URL `#section` (pas d’icône copy sur chaque titre) |
| **Pourquoi** | Partage précis via TOC / URL manuelle, sans bruit visuel |
| **Où** | `ArticleMarkdown` h2/h3 + `extractToc` |
| **Implémentation** | Même `slugifyHeading` que la TOC; `scroll-mt-28` pour le sticky header |
| **Statut** | ✅ Fait (bouton copy retiré des titres) |

### 3.4 Largeur de lecture contrôlée

| | |
|--|--|
| **Quoi** | Corps `max-w-[42rem]` (≈ 65–75 car.) hors mode large grille |
| **Pourquoi** | Moins de fatigue oculaire |
| **Où** | `ArticlePageClient` colonne article |
| **Statut** | ✅ Fait |

### 3.5 Mode Focus (lecture)

| | |
|--|--|
| **Quoi** | Masque la sidebar, centre le texte |
| **Pourquoi** | Focus total, presentations, relecture |
| **Où** | Toolbar: libellé **Focus** / **Exit focus** (FR: Quitter focus) selon l’état |
| **Implémentation** | State `readingMode` → grid 1 col + `max-w-[42rem] mx-auto` |
| **i18n** | `article.reading_mode`, `article.exit_focus` |
| **Statut** | ✅ Fait |

### 3.6 Taille de texte (A− / A+)

| | |
|--|--|
| **Quoi** | 3 échelles: sm (défaut) / md / lg |
| **Pourquoi** | Lecture ops dense par défaut; agrandir si besoin |
| **Où** | Toolbar; classes `.article-font-*` dans `globals.css` |
| **Défaut** | `useState("sm")` dans `ArticlePageClient` (~14–15px) |
| **Statut** | ✅ Fait |

### 3.7 Bouton haut de page

| | |
|--|--|
| **Quoi** | Bouton flottant après ~480px de scroll, collé au bord droit de `#article-body` |
| **Pourquoi** | Retour rapide header |
| **Où** | `BackToTop` |
| **Footer** | Ne traverse **pas** le footer: `bottom` calculé depuis `#site-footer` pour rester au-dessus |
| **Statut** | ✅ Fait |

### 3.8 Temps de lecture recalculé

| | |
|--|--|
| **Quoi** | Estimation ~220 mots/min sur le corps markdown |
| **Pourquoi** | Plus honnête qu’une valeur fixe dans `articles.ts` |
| **Où** | `estimateReadMinutes` + header article |
| **Fallback** | `article.readTime` si pas de markdown |
| **Statut** | ✅ Fait |

### 3.9 Date de mise à jour

| | |
|--|--|
| **Quoi** | Affiche `updated` du frontmatter si présent |
| **Pourquoi** | Confiance sur le contenu ops (périssable) |
| **Syntaxe** | `updated: "2026-07-25"` dans le YAML |
| **Où** | `getMarkdownMeta` → badge “Mis à jour” |
| **Statut** | ✅ Fait |

### 3.10 Styles print

| | |
|--|--|
| **Quoi** | `@media print` masque nav/footer/chrome, fond clair |
| **Pourquoi** | Imprimer un runbook / PDF navigateur |
| **Où** | `globals.css` |
| **Statut** | ✅ Base faite (affiner si besoin) |

---

## 4. Features markdown (contenu)

### 4.1 Callouts GitHub-style

| | |
|--|--|
| **Syntaxe** | `> [!note\|tip\|important\|warning\|caution\|info]` |
| **Rendu** | Cadre + filet coloré + label texte (sans emoji) |
| **Fichiers** | `markdown-callouts.ts`, `ArticleMarkdown` |
| **Statut** | ✅ Fait |

### 4.2 Tables GFM

| | |
|--|--|
| **Syntaxe** | Tableau markdown standard avec ligne `\|---\|` |
| **Rendu** | Cadre arrondi, header, hover |
| **Dépendance** | `remark-gfm` |
| **Statut** | ✅ Fait |

### 4.3 Blocs de code + Copy + langage

| | |
|--|--|
| **Syntaxe** | ` ```bash ` … ` ``` ` |
| **Rendu** | Header langage + bouton Copier / Copié |
| **Fichier** | `CodeBlock.tsx` |
| **Statut** | ✅ Fait |

### 4.4 Checklists interactives

| | |
|--|--|
| **Syntaxe** | `- [ ]` / `- [x]` (GFM task lists) |
| **Rendu** | Checkbox contrôlée, état **local** (non persisté serveur) |
| **Usage** | Runbooks, “30 premiers jours”, audits |
| **Statut** | ✅ Fait |

### 4.5 Key takeaways

| | |
|--|--|
| **Syntaxe** | Voir [§5](#5-syntaxe-auteur) `:::takeaways` |
| **Rendu** | Encadré turquoise “À retenir” |
| **Statut** | ✅ Fait |

### 4.6 See also (liens internes)

| | |
|--|--|
| **Syntaxe** | `:::see-also` + lignes `- [Label](/path): raison` |
| **Rendu** | Bloc “Voir aussi” avec `id="see-also-internal-links"` (deep link) |
| **Aussi** | Liens markdown normaux `[texte](/articles/slug)` en turquoise |
| **Guide** | Voir [§6](#6-next-read-related-footnotes-see-also-guide-éditorial) |
| **Statut** | ✅ Fait |

### 4.7 CTA de fin d’article (markdown)

| | |
|--|--|
| **Syntaxe** | `:::cta` avec champs `title`, `body`, `href`, `label` |
| **Rendu** | Bandeau contrasté + bouton (lab, produit, contact…) |
| **Règle éditoriale** | **Un** CTA produit max en bas; le “next article” est automatique (voir §6) |
| **Statut** | ✅ Fait |

### 4.8 Images + légende + lightbox

| | |
|--|--|
| **Syntaxe** | `![alt](/path.svg "Légende affichée")` |
| **Rendu** | Figure, caption = `title` ou `alt`, clic → overlay `z-[200]` (au-dessus de la nav) |
| **Fichier** | `ImageWithCaption.tsx` |
| **Statut** | ✅ Fait |

### 4.9 Footnotes

| | |
|--|--|
| **Syntaxe** | `Texte[^1]` + `[^1]: note` en bas |
| **Rendu** | Exposants cliquables + section “Notes” en bas |
| **Implémentation** | `peelFootnotes` **avant** le split segments (sinon GFM casse quand callouts/fences séparent refs et defs) |
| **Guide** | Voir [§6](#6-next-read-related-footnotes-see-also-guide-éditorial) |
| **Statut** | ✅ Fait |

### 4.10 Continuer la lecture (next article, automatique)

| | |
|--|--|
| **Quoi** | Bandeau fin d’article “Continuer la lecture” + related en sidebar **au-dessus** de la TOC |
| **Où** | `ArticleContinue` + `ArticlePageClient` |
| **Guide** | Voir [§6](#6-next-read-related-footnotes-see-also-guide-éditorial) |
| **Statut** | ✅ Fait |

### 4.11 Frontmatter propre

| | |
|--|--|
| **Règle** | Guillemets si `:` dans title/excerpt |
| **Champs** | `title`, `excerpt`, `updated` (optionnel) |
| **Protection** | Strip frontmatter robuste serveur + client |
| **Statut** | ✅ Fait |

### 4.12 Rythme typographique

| | |
|--|--|
| **Quoi** | H2 avec border-top, interligne dense, listes custom (puces turquoise) |
| **Où** | `ArticleMarkdown` + `.prose-custom` |
| **Statut** | ✅ Fait |

---

## 5. Syntaxe auteur

### Frontmatter

```markdown
---
title: "Titre avec: deux-points entre guillemets"
excerpt: "Résumé court."
updated: "2026-07-25"
---
```

### Callouts

```markdown
> [!note]
> Contexte neutre.

> [!tip]
> Astuce terrain.

> [!important]
> À ne pas rater.

> [!warning]
> Risque d’outage / lockout.

> [!caution]
> Risque sécurité / irréversible.

> [!info]
> Alias de note.
```

### Takeaways

```markdown
:::takeaways
- Point 1
- Point 2
- Point 3
:::
```

### See also

```markdown
:::see-also
- [Titre affiché](/articles/slug): pourquoi cliquer
- [Autre](/labs/mon-lab): suite pratique
:::
```

Le bloc rendu a toujours `id="see-also-internal-links"` → URL  
`/articles/mon-slug#see-also-internal-links`.

Lien **inline** dans le récit (recommandé pour le flow):

```markdown
Tu peux aussi lier en ligne, comme vers [la redondance théorique](/articles/redondance-theorique-realite).
```

### CTA produit (markdown)

```markdown
:::cta
title: Titre du bandeau
body: Une phrase d’accroche.
href: /labs
label: Ouvrir Ops Labs
:::
```

### Checklist

```markdown
- [ ] Étape à faire
- [x] Étape déjà faite (état initial coché côté markdown; l’UI reste interactive)
```

### Code

````markdown
```bash
sshd -t && systemctl reload sshd
```
````

### Figure

```markdown
![Description accessible](/chemin/image.svg "Légende sous l’image")
```

Mettre les assets dans `public/`.

### Footnotes

```markdown
Phrase avec nuance[^1]. Une autre précision[^2].

[^1]: Détail en bas de page.
[^2]: Seconde note, une ligne par définition.
```

Règles:

- Définitions `[^id]:` de préférence **en fin de fichier** (après le corps).
- IDs stables: `1`, `2` ou `ha-note` (pas d’espaces).
- Ne pas mettre une définition **à l’intérieur** d’un `:::takeaways` / callout.
- Le pipeline peels les footnotes **avant** de découper callouts/fences.

### Table

```markdown
| Col A | Col B |
|-------|-------|
| x     | y     |
```

---

## 6. Next read, related, footnotes, see-also (guide éditorial)

### 6.1 Continuer la lecture (next article) — automatique

**Aucun markdown requis.** Le bandeau est injecté par `ArticlePageClient` + `ArticleContinue`.

#### Comment le “next” est choisi

Ordre dans le code (`ArticlePageClient`):

1. **Article suivant dans `ARTICLES`** (tableau dans `src/lib/articles.ts`).  
   La liste est **newest-first** (les plus récents en tête).  
   “Next” = index courant `+ 1` → l’article **plus ancien** juste en dessous dans la liste.
2. Sinon **premier related** de la même catégorie.
3. Sinon aucun bandeau.

```
ARTICLES = [
  slug-A (récent),   // index 0 → next = slug-B
  slug-B,
  slug-C,            // index 2 → next = slug-D ou related
  ...
]
```

#### Comment piloter le next read (éditorial)

| Objectif | Action |
|----------|--------|
| Enchaîner une **série** de 3 articles | Les placer **consécutifs** dans `ARTICLES` (du plus récent au plus ancien de la série) |
| Mettre l’article B juste après A | Insérer B **immédiatement après** A dans le tableau `ARTICLES` |
| Pas de next pour un one-shot | Impossible de désactiver par article aujourd’hui (backlog). Workaround: accepter le next auto ou le related |
| Next vers une autre catégorie | Impossible en auto: utiliser plutôt `:::see-also` ou `:::cta` |

Fichiers: `src/components/article/ArticleContinue.tsx`, logique dans `ArticlePageClient.tsx`.  
i18n: `article.continue_reading`, `article.read_next`.

#### Next read vs CTA markdown

| Type | Rôle | Exemple |
|------|------|---------|
| **Next read** (auto) | Rester dans le **contenu** articles | Article suivant de la série |
| **`:::cta`** | Sortie vers **produit / lab / contact** | Ops Labs, OpsGate |
| **Related sidebar** | Découverte latérale même catégorie | 3 slugs max |

Ne pas empiler 3 CTA fin d’article. Pattern recommandé: corps → see-also optionnel → **un** `:::cta` produit si utile → bandeau next read auto.

---

### 6.2 Related articles (sidebar)

**Automatique**, pas de frontmatter.

```ts
getArticlesByCategory(article.category)
  .filter((a) => a.slug !== article.slug)
  .slice(0, 3);
```

#### Comment “choisir” les related

| Levier | Effet |
|--------|-------|
| Champ `category` dans `articles.ts` | Seuls les articles **même catégorie** apparaissent |
| Ordre dans `ARTICLES` | `filter` conserve l’ordre du tableau → les plus **récents** de la catégorie sortent en premier |
| Nombre | Fixé à **3** (hardcodé) |

Pour pousser un article frère en related:

1. Même `category: "cybersecurity"` (etc.).
2. Le placer **haut** dans `ARTICLES` (récent) pour qu’il soit dans le top 3 de la catégorie.

Pour **ne pas** apparaître avec un autre: catégories différentes, ou accepter qu’il sorte du top 3 s’il y a plus de 3 articles plus récents dans la même cat.

Affichage: **au-dessus** de la TOC (priorité engagement).  
Pas de sélection manuelle par slug pour l’instant (backlog: `relatedSlugs?: string[]` dans `Article`).

---

### 6.3 Footnotes — quand et comment

**Usage:** nuance, exception, source légère **sans** casser le fil du paragraphe.

```markdown
La redondance n’est pas un nombre de nœuds[^1].

[^1]: Deux firewalls sur le même switch cœur restent un SPOF.
```

**Bon:**

- 1–3 notes par article long.
- Définitions en bas de fichier.
- Texte de note court (1–2 phrases).

**Mauvais:**

- Notes pour du contenu principal (mettre un `###` à la place).
- Dix footnotes marketing.
- Définition au milieu d’un bloc `:::`.

Rendu: exposant cliquable `1` → ancre `#fn-1` + liste “Notes” en bas.

---

### 6.4 See also — quand et comment

**Usage:** graphe de savoir **explicite** (tu choisis les cibles et le “pourquoi”).

```markdown
:::see-also
- [Triage SOC](/articles/soc-severity-triage-sla): matrice P1–P3 terrain
- [Lab SOC](/labs/soc-first-30-days): passer à la pratique
:::
```

| See-also | Related auto | Next read |
|----------|--------------|-----------|
| Choix **manuel** | Même **catégorie** only | Ordre **liste** ARTICLES |
| Raison affichée | Titre seul | Un seul article |
| Deep link `#see-also-internal-links` | Sidebar | Bandeau fin de page |

**Inline** (dans une phrase) pour le flow narratif:

```markdown
…comme pour [la redondance théorique](/articles/redondance-theorique-realite), quand le récit l’exige.
```

**See-also block** pour une pause “à lire ensuite” (3 liens max recommandé).

---

### 6.5 Schéma récap

```
┌─────────────────────────────────────────┐
│  Article body (markdown)                │
│  - footnotes peel → exposants           │
│  - :::see-also (manuel)                 │
│  - :::cta produit (optionnel, 1 max)    │
└─────────────────────────────────────────┘
│  ArticleContinue (next auto)            │
└─────────────────────────────────────────┘
Sidebar:
  1. Related (même cat, top 3)
  2. TOC
  3. Catégorie / contact
```

---

## 7. Articles de démo

Trois articles de démo combinent **3–4 features** chacun pour valider le rendu.

| Slug | URL | Features mises en avant |
|------|-----|-------------------------|
| `reading-ux-navigation-longform` | `/articles/reading-ux-navigation-longform` | TOC, progress, ancres, Focus, A±, takeaways, updated |
| `reading-ux-ssh-hardening-runbook` | `/articles/reading-ux-ssh-hardening-runbook` | Code+copy, checklists, tables, callouts |
| `reading-ux-knowledge-graph` | `/articles/reading-ux-knowledge-graph` | Takeaways, figure+lightbox, footnotes, see-also, CTA |

Fichiers:

```
content/articles/reading-ux-navigation-longform/{fr,en}.md
content/articles/reading-ux-ssh-hardening-runbook/{fr,en}.md
content/articles/reading-ux-knowledge-graph/{fr,en}.md
```

Registre: `articles.21` … `articles.23` dans `articles.ts` + `translations.ts`.

---

## 8. Guide d’implémentation détaillé

### 8.1 Ajouter une feature “chrome” (page)

1. Créer un composant dans `src/components/article/`.
2. L’importer dans `ArticlePageClient.tsx`.
3. Ajouter les clés i18n `article.*` (EN + FR + interface `TranslationKeys`).
4. Documenter ici (section 3).

### 8.2 Ajouter un bloc markdown custom

1. Étendre le parser dans `markdown-blocks.ts` (`:::mon-bloc`).
2. Ajouter un `ArticleSegment` et le rendu dans `ArticleMarkdown.tsx`.
3. Exemple auteur dans §5 + article démo.
4. Pas de dépendance remark plugin tant que le split regex suffit.

### 8.3 Ajouter un type de callout

1. Étendre `CalloutKind` + labels + `calloutVisual` dans `markdown-callouts.ts`.
2. Documenter le type dans `ADDING-ARTICLES.md`.

### 8.4 IDs de titres stables (TOC ↔ ancre)

`extractToc` parcourt les lignes markdown (hors fences code).  
Le rendu consomme les IDs **dans le même ordre** via un curseur.  
Si tu changes le parseur, garde l’ordre H2/H3 strictement aligné.

### 8.5 Tests manuels

```bash
npm run dev
```

- [ ] `/articles/reading-ux-navigation-longform` — TOC, progress, Focus / Exit focus, A± (défaut sm)  
- [ ] `/articles/reading-ux-ssh-hardening-runbook` — Copy code, cocher checklist, tables  
- [ ] `/articles/reading-ux-knowledge-graph` — takeaways, image, notes, see-also, CTA, next read  
- [ ] Back-to-top ne passe pas sur le footer  
- [ ] FR / EN switch  
- [ ] Mobile: TOC bouton, back-to-top  
- [ ] Print preview navigateur  

---

## 9. Backlog / non fait

Améliorations possibles (pas bloquantes):

| Feature | Idée d’implémentation |
|---------|----------------------|
| Persist checklists | `localStorage` clé `checklist:{slug}` |
| Persist font / Focus | `localStorage` |
| Related manuels | `relatedSlugs?: string[]` sur `Article` |
| Désactiver next read | `hideContinue?: boolean` sur `Article` |
| Numéros de ligne code | Prop sur `CodeBlock` |
| Syntax highlight | `shiki` ou `prism` (bundle cost) |
| TOC mobile drawer | Sheet full-height animé |
| PDF export pro | Endpoint print dédié / Puppeteer |
| Diagrammes MD | Mermaid (`remark-mermaid`) |
| Temps de lecture par section | Estimations dans TOC |

---

## 10. Checklist qualité article

Avant de publier un nouvel article markdown:

- [ ] Frontmatter entre guillemets si `:` dans title  
- [ ] Au moins 2–4 `##` utiles (pour TOC)  
- [ ] 1 bloc takeaways **ou** intro claire  
- [ ] Callouts ≤ 1 pour ~400–500 mots (pas de mur d’alertes)  
- [ ] Commandes dans des fences avec langage  
- [ ] Liens internes (inline et/ou `:::see-also`) vers lab / article frère  
- [ ] Un `:::cta` produit max en fin (ou aucun); next read reste auto  
- [ ] Footnotes: définitions en bas de fichier, 1–3 max  
- [ ] Placer l’article dans `ARTICLES` pour piloter next + related (catégorie + ordre)  
- [ ] `updated` si révision d’un runbook  
- [ ] FR + EN cohérents  
- [ ] Enregistré dans `articles.ts` + `translations.ts`  

Voir aussi [ADDING-ARTICLES.md](./ADDING-ARTICLES.md) pour le registre et le workflow git.

---

## Référence rapide “ne pas faire”

- Afficher le frontmatter dans le corps (toujours strip + guillemets YAML)  
- Injecter des marqueurs techniques visibles (`[do-callout:…]`)  
- Emojis dans les labels de callout  
- Trois CTA fin d’article  
- Animations paragraphe par paragraphe (fatigue / a11y)  
- Popups newsletter mid-read  
