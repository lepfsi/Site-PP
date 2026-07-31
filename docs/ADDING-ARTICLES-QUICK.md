# Ajouter un article — guide rapide

Guide minimal : **quels fichiers créer**, **quels fichiers modifier**.  
Pour le markdown avancé (callouts, TOC, blocs `:::takeaways`, etc.) → [ADDING-ARTICLES.md](./ADDING-ARTICLES.md) et [ARTICLE-READING-UX.md](./ARTICLE-READING-UX.md).

---

## Avant de commencer

Choisis :

| Élément | Règle | Exemple |
|--------|--------|---------|
| **Slug** | minuscules, tirets, = nom du dossier | `mon-nouvel-article` |
| **Catégorie** | une des valeurs ci-dessous | `cybersecurity` |
| **Numéro i18n** | plus grand `articles.N` déjà utilisé + 1 | si le dernier est `24` → utiliser `25` |

Catégories possibles : `networking` · `cybersecurity` · `infrastructure` · `cloud` · `observability` · `automation` · `ai` · `troubleshooting`

---

## Fichiers à **créer** (2)

```
content/articles/<slug>/fr.md
content/articles/<slug>/en.md
```

Exemple pour le slug `mon-nouvel-article` :

```
content/articles/mon-nouvel-article/fr.md
content/articles/mon-nouvel-article/en.md
```

Modèle minimal pour **chaque** fichier (le corps commence après le second `---`) :

```markdown
---
title: "Titre de l'article"
excerpt: "Résumé court pour listes et SEO."
updated: "2026-07-30"
---

## Introduction

Texte en markdown…
```

- Dossier **exactement** = slug (pas de majuscules : `mon-slug`, pas `Mon-Slug`).
- Si le titre contient `:`, mets-le entre guillemets dans le frontmatter.

---

## Fichiers à **modifier** (2)

### 1. `src/lib/articles.ts`

- Ouvrir le tableau `ARTICLES`.
- Ajouter un objet **en haut du tableau** (article « récent »).

```ts
{
  slug: "mon-nouvel-article",           // = nom du dossier content/
  category: "cybersecurity",            // CategorySlug
  titleKey: "articles.25.title",        // remplace 25 par ton numéro
  excerptKey: "articles.25.excerpt",
  categoryLabelKey: "articles.25.category",
  readTime: "10 min",
  date: "2026-07-30",                   // YYYY-MM-DD
  color: "text-purple-500",             // voir tableau couleurs ci-dessous
  bg: "bg-purple-500/10",
  format: "markdown",                   // obligatoire pour lire content/articles/
},
```

| Catégorie | `color` | `bg` |
|-----------|---------|------|
| cybersecurity | `text-purple-500` | `bg-purple-500/10` |
| networking | `text-blue-500` | `bg-blue-500/10` |
| infrastructure | `text-emerald-500` | `bg-emerald-500/10` |
| cloud | `text-blue-400` | `bg-blue-400/10` |
| observability | `text-cyan-500` | `bg-cyan-500/10` |
| automation | `text-pink-500` | `bg-pink-500/10` |
| ai | `text-violet-500` | `bg-violet-500/10` |
| troubleshooting | `text-orange-500` | `bg-orange-500/10` |

### 2. `src/lib/translations.ts`

Même numéro `N` que dans `articles.ts` (ex. `25`). **Trois endroits** dans le fichier :

| Zone | Où | Quoi ajouter |
|------|-----|----------------|
| A | interface `TranslationKeys` (haut du fichier) | `"articles.25.title": string;` + `excerpt` + `category` |
| B | objet `EN: { ... }` | les 3 clés avec textes anglais |
| C | objet `FR: { ... }` | les 3 clés avec textes français |

Exemple (remplace `25` et les textes) :

```ts
// A — TranslationKeys
"articles.25.title": string;
"articles.25.excerpt": string;
"articles.25.category": string;

// B — EN
"articles.25.title": "English title",
"articles.25.excerpt": "Short English excerpt.",
"articles.25.category": "Cybersecurity",

// C — FR
"articles.25.title": "Titre français",
"articles.25.excerpt": "Court extrait français.",
"articles.25.category": "Cybersécurité",
```

Ces textes servent aux **listes**, **meta** et **fil d’Ariane**. Garde-les alignés avec le frontmatter des `.md`.

---

## Fichiers **non** obligatoires

| Besoin | Fichier |
|--------|---------|
| Illustration hero / carte | voir [ARTICLE-VISUALS.md](./ARTICLE-VISUALS.md) |
| Lier depuis un lab | `src/lib/labs.ts` |
| Lier depuis un produit | `src/lib/products.ts` (`articleSlug`) |

Le **sitemap** (`src/app/sitemap.ts`) et la page article (`src/app/articles/[slug]/`) utilisent déjà `getAllArticles()` — rien à toucher pour un article standard.

---

## Vérifier en local

```bash
npm run dev
npm run build
```

| URL | Attendu |
|-----|---------|
| `/articles/<slug>` | article avec corps markdown |
| `/category/<catégorie>` | article listé |
| `/articles` | article dans la liste |

Si le build échoue sur `TranslationKeys` → clés `articles.N.*` manquantes dans **EN** ou **FR**.  
Si titre affiché = `articles.25.title` → idem.  
Si 404 → slug différent entre `articles.ts` et le dossier `content/articles/`.  
Si page sans corps → `format: "markdown"` oublié, ou `en.md` / `fr.md` absent ou mauvais chemin.

---

## Commit (fichiers typiques)

```bash
git add content/articles/<slug> src/lib/articles.ts src/lib/translations.ts
git commit -m "feat(articles): add <slug>"
```

---

## Checklist copier-coller

```
[ ] Slug en minuscules choisi
[ ] content/articles/<slug>/fr.md créé
[ ] content/articles/<slug>/en.md créé
[ ] src/lib/articles.ts — entrée en tête de ARTICLES + format: "markdown"
[ ] src/lib/translations.ts — TranslationKeys (3 clés)
[ ] src/lib/translations.ts — bloc EN (3 clés)
[ ] src/lib/translations.ts — bloc FR (3 clés)
[ ] npm run build OK
[ ] /articles/<slug> OK en FR et EN
```
