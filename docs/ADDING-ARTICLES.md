# Ajouter un article — step by step

Un article apparaît sur le site seulement s’il est **enregistré** dans le code **et** (pour le format markdown) a des fichiers dans `content/`.

## Checklist rapide

1. Choisir un **slug** URL (minuscules, tirets) : `mon-sujet-court`
2. Choisir une **catégorie** (`networking`, `cybersecurity`, `infrastructure`, `cloud`, `observability`, `automation`, `ai`, `troubleshooting`)
3. Créer `content/articles/<slug>/fr.md` et `en.md`
4. Ajouter l’entrée en **haut** de `ARTICLES` dans `src/lib/articles.ts`
5. Ajouter les clés i18n EN + FR dans `src/lib/translations.ts`
6. Commit + push → vérifier `/articles/<slug>` et `/category/<catégorie>`

---

## 1. Fichiers markdown

```
content/articles/mon-sujet-court/
  fr.md
  en.md
```

Exemple `fr.md` :

```markdown
---
title: Titre de l'article en français
excerpt: Résumé court (1–2 phrases) pour listes et chat.
---

## Introduction

Corps de l'article en markdown…

## Section

- listes
- **gras**

> Citations / notes terrain
```

### Callouts (pris en charge)

`react-markdown` **ne gère pas nativement** la syntaxe GitHub `> [!NOTE]`.  
DailyOps prétraite ces alertes dans `src/lib/markdown-callouts.ts`.

**Format recommandé (GitHub alerts)** :

```markdown
> [!warning]
> Une redondance jamais testée n'est pas de la redondance.

> [!tip]
> Teste la bascule **avant** d'en avoir besoin.

> [!important]
> La redondance, c'est aussi des process et des compétences.

> [!note]
> Note terrain : documente la procédure de bascule manuelle.
```

Types : `NOTE` · `TIP` · `IMPORTANT` · `WARNING` · `CAUTION` · `INFO`

Rendu : label texte (sans emoji), fond transparent, filet coloré à gauche.

**Frontmatter** : mets les titres entre guillemets s’ils contiennent `:` (sinon le YAML casse et le frontmatter peut s’afficher en brut).

```markdown
---
title: "SOC triage and SLAs: ranking alerts"
excerpt: "Court résumé."
---
```

### Tables Markdown

Les tables GFM nécessitent le plugin **`remark-gfm`** (activé dans `ArticleMarkdown.tsx`).

```markdown
| Niveau | Critères | SLA |
|--------|----------|-----|
| P1 | Exfiltration active | 15 min |
| P2 | Mouvement latéral | 30 min |
```

Sans `remark-gfm`, le navigateur affiche le brut (`| Level | ... |-------|`), ce qui n'est **pas** voulu.

---

## 2. Registre `src/lib/articles.ts`

Ajouter **en tête** du tableau `ARTICLES` pour qu’il soit « récent » :

```ts
{
  slug: "mon-sujet-court",
  category: "cybersecurity", // CategorySlug
  titleKey: "articles.20.title",
  excerptKey: "articles.20.excerpt",
  categoryLabelKey: "articles.20.category",
  readTime: "12 min",
  date: "2026-07-20", // ISO YYYY-MM-DD
  color: "text-purple-500",
  bg: "bg-purple-500/10",
  format: "markdown", // obligatoire pour lire content/articles/...
},
```

### Format `markdown` vs `i18n`

| `format` | Corps de l’article |
|----------|-------------------|
| `"markdown"` | Fichiers `content/articles/<slug>/{fr,en}.md` |
| (absent) / i18n | Clé `bodyKey` dans `translations.ts` (anciens articles) |

Les **nouveaux** articles : toujours `format: "markdown"`.

### Couleurs usuelles par domaine

| Domaine | `color` / `bg` (ex.) |
|---------|----------------------|
| cybersecurity | `text-purple-500` / `bg-purple-500/10` |
| networking | `text-blue-500` / `bg-blue-500/10` |
| infrastructure | `text-emerald-500` / `bg-emerald-500/10` |
| cloud | `text-blue-400` / `bg-blue-400/10` |
| observability | `text-cyan-500` / `bg-cyan-500/10` |
| automation | `text-pink-500` / `bg-pink-500/10` |
| ai | `text-violet-500` / `bg-violet-500/10` |
| troubleshooting | `text-orange-500` / `bg-orange-500/10` |

---

## 3. Traductions `src/lib/translations.ts`

### A. Interface `TranslationKeys` (en haut du fichier)

```ts
"articles.20.title": string;
"articles.20.excerpt": string;
"articles.20.category": string;
```

### B. Bloc `EN: { ... }`

```ts
"articles.20.title": "English title",
"articles.20.excerpt": "Short English excerpt.",
"articles.20.category": "Cybersecurity",
```

### C. Bloc `FR: { ... }`

```ts
"articles.20.title": "Titre français",
"articles.20.excerpt": "Court extrait français.",
"articles.20.category": "Cybersécurité",
```

Le **titre/extrait du frontmatter** markdown peut différer légèrement ; pour le site, les **clés i18n** font foi dans listes et meta. Garde-les alignés.

Numérotation : regarde le plus haut `articles.N` déjà présent et incrémente (`17`, `18`, `19`… → `20`).

---

## 4. Vérifier en local

```bash
npm run dev
```

- http://localhost:3000/articles/mon-sujet-court  
- http://localhost:3000/category/cybersecurity  
- http://localhost:3000/articles (liste)

Le sitemap (`src/app/sitemap.ts`) reprend automatiquement `getAllArticles()`.

---

## Reading UX (TOC, callouts, takeaways, next read…)

Voir la doc complète: **[ARTICLE-READING-UX.md](./ARTICLE-READING-UX.md)**  
(surtout §6: **next read**, **related**, **footnotes**, **see-also**).

Blocs utiles en résumé:

```markdown
:::takeaways
- Point clé
:::

> [!warning]
> Message.

:::see-also
- [Autre article](/articles/slug): pourquoi
:::

:::cta
title: Titre
body: Phrase
href: /labs
label: Bouton
:::

Nuance en note[^1].

[^1]: Détail en bas de fichier.
```

- **Next read**: automatique (ordre dans `ARTICLES` + même logique related en fallback).  
- **Related sidebar**: top 3 de la **même `category`**, ordre = ordre dans `ARTICLES`.

---

## 5. Push & prod

```bash
git add content/articles/mon-sujet-court src/lib/articles.ts src/lib/translations.ts
git commit -m "feat(articles): add mon-sujet-court"
git pull --rebase origin main
git push origin main
```

Si `git push` est rejeté : le remote a des commits (ex. articles ajoutés ailleurs). Toujours `pull --rebase` avant de re-push.

---

## Lier un article à Ops Labs

Dans `src/lib/labs.ts`, une étape peut pointer vers un slug d’article.  
Voir [ADDING-CONTENT.md](./ADDING-CONTENT.md#ops-labs).

---

## Lier un article à un produit

Dans `src/lib/products.ts`, champ `articleSlug` (ex. OpsGate → `genai-dlp-sensitive-data-leaks`).

---

## Erreurs fréquentes

| Symptôme | Cause |
|----------|--------|
| 404 sur `/articles/slug` | Entrée absente de `articles.ts` ou mauvais slug |
| Page vide / pas de corps | Manque `fr.md`/`en.md` ou `format: "markdown"` oublié |
| Titre = clé brute `articles.20.title` | Clé manquante dans `translations` EN ou FR |
| Pas dans « récents » | Date trop ancienne ou entrée en bas de `ARTICLES` |
