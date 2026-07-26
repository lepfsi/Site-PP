# SEO & référencement — DailyOps.Tech

État du SEO technique du site et actions prioritaires (code + hors code).

## Déjà en place (code)

| Élément | Où |
|---------|-----|
| `metadataBase` + titres / descriptions | `src/lib/seo.ts`, layouts pages |
| Canonical URLs | `pageMetadata` / `articleMetadata` |
| Open Graph + Twitter cards | `seo.ts` + images dynamiques |
| OG image site | `/opengraph-image` → `src/app/opengraph-image.tsx` |
| OG image par article | `/articles/[slug]/opengraph-image` |
| `robots.txt` | `src/app/robots.ts` (disallow `/api/`) |
| `sitemap.xml` | `src/app/sitemap.ts` (static + articles + categories + labs + experience) |
| RSS | `/feed.xml`, `/rss.xml` |
| JSON-LD Organization + WebSite | root `layout.tsx` |
| JSON-LD Article + BreadcrumbList | `articles/[slug]/page.tsx` |
| `generateStaticParams` articles | SSG des articles |
| Compteurs catégories = vrais articles | `getCategoryArticleCount()` |

Canonical host : **`https://www.dailyops.tech`** (`src/lib/site.ts`).  
Doit correspondre au domaine principal Vercel (redirection apex → www ou l’inverse, **un seul** canonique).

---

## Ajouts récents (cette session)

1. Images sociales générées (1200×630) site + article  
2. Structured data Article / Breadcrumb / Organization / WebSite  
3. `publishedTime` / `section` sur les articles OG  
4. Metadata catégories  
5. Canonical products via `pageMetadata`  
6. Alignement URL sur **www**  
7. **hreflang + routes FR articles** (voir ci-dessous)  
8. **FAQPage + Course JSON-LD** sur les labs  

---

## hreflang & routes FR (articles)

| Langue | URL | Meta + JSON-LD | UI |
|--------|-----|----------------|-----|
| EN (défaut) | `/articles/<slug>` | EN | Lang libre (localStorage) |
| FR | `/fr/articles/<slug>` | FR | Forcée FR (`LanguageProvider forceLang`) |

- `alternates.languages` : `en`, `fr`, `x-default` → EN  
- Sitemap : les **deux** URLs par article  
- Navbar FR/EN sur une page article **navigue** entre les deux routes  

Fichiers : `src/app/fr/layout.tsx`, `src/app/fr/articles/[slug]/page.tsx`, `src/lib/seo.ts` (`articleHreflang`).

Les autres pages (home, labs, products) restent mono-URL + switch client pour l’instant.

---

## FAQ schema (labs / runbooks)

Sur chaque `/labs/<slug>` :

- **Course** : titre, description, provider DailyOps  
- **FAQPage** : questions = titres des steps `quiz` / `checklist` / `lab`, réponses = descriptions (EN)

Implémentation : `labFaqJsonLd` + `labCourseJsonLd` dans `src/lib/jsonld.ts`, injectés dans `src/app/labs/[slug]/page.tsx`.

Vérifier en view-source : `application/ld+json` avec `"@type":"FAQPage"`.

---

## Ce que **tu** dois faire (hors code / marketing)

Ces points impactent autant (ou plus) que le code :

### 1. Google Search Console + Bing Webmaster
- Propriété `https://www.dailyops.tech`
- Soumettre `https://www.dailyops.tech/sitemap.xml`
- Vérifier couverture d’indexation, pages exclues

### 2. Domaine unique
- Vercel : redirect 301 `dailyops.tech` → `www.dailyops.tech` (ou l’inverse, mais **un seul** + `SITE.url` aligné)
- Éviter le contenu dupliqué apex/www

### 3. Contenu (le vrai levier)
- Titres H1 uniques, intent clair (runbook, SLA, VLAN…)
- Excerpts / meta descriptions 140–160 car. (clés i18n EN utilisées en meta)
- Liens internes (`:::see-also`, next read, related)
- Articles longs structurés (H2, listes, tableaux) — déjà le cas

### 4. FR / EN
- **Articles** : URLs distinctes + hreflang (fait). Soigner titres/excerpts **EN et FR**.  
- **Reste du site** : encore switch client (même URL). Évolution possible : `/fr/labs/...` plus tard.

### 5. Partage social
Tester un article avec [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) et [Twitter Card Validator](https://cards-dev.twitter.com/validator) après deploy — forcer le re-scrape de l’OG image.

### 6. Performance / Core Web Vitals
- Déjà Next App Router + static articles
- Surveiller LCP (hero, images), CLS
- Éviter les gros JS inutiles sur pages article

### 7. Analytics (optionnel SEO)
- Plausible / GA4 / Umami pour requêtes → pages d’atterrissage
- Pas obligatoire pour le ranking, utile pour prioriser le contenu

---

## Checklist technique périodique

- [ ] `SITE.url` = domaine de prod réel  
- [ ] Sitemap accessible sans 404  
- [ ] Nouvel article → auto dans sitemap + RSS  
- [ ] OG image article se génère (`/articles/<slug>/opengraph-image`)  
- [ ] View-source article : JSON-LD `Article` + `BreadcrumbList`  
- [ ] Pas de `noindex` accidentel sur pages publiques  
- [ ] `/api/*` toujours en disallow  

---

## Idées d’évolution (backlog)

| Priorité | Idée |
|----------|------|
| Haute | GSC + sitemap soumis |
| Haute | Redirect domaine unique |
| Moyenne | Routes `/fr/` pour labs, products, home |
| Moyenne | FAQ frontmatter dans les articles runbook |
| Basse | `llms.txt` pour assistants IA |
| Basse | Sitemap index si > 50k URLs (loin d’être le cas) |

---

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/lib/seo.ts` | Metadata helpers |
| `src/lib/jsonld.ts` | Schémas structured data |
| `src/lib/site.ts` | Nom + URL canonique |
| `src/app/sitemap.ts` | Sitemap |
| `src/app/robots.ts` | Robots |
| `src/app/opengraph-image.tsx` | Image OG site |
| `src/app/articles/[slug]/opengraph-image.tsx` | Image OG article |
| `src/components/JsonLd.tsx` | Injection script |

---

## Note sur les meta EN

`articleMetadata` et le JSON-LD utilisent **`tEn`** (anglais). C’est volontaire pour un signal stable côté moteurs. Le corps FR/EN reste géré côté client.
