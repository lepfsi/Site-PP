# SEO & référencement — DailyOps.Tech

État du SEO technique + **i18n URL** (`/en` · `/fr`).  
Pour le détail des routes et `lp()`, voir **[I18N.md](./I18N.md)**.

## Déjà en place (code)

| Élément | Où |
|---------|-----|
| Locales **`/en/*` et `/fr/*`** sur toutes les pages publiques | `proxy.ts` + `i18n.ts` |
| Redirect 308 des URLs sans locale → `/en/...` | `proxy.ts` |
| `metadataBase` + titres / descriptions | `src/lib/seo.ts` |
| Canonical + **hreflang** (en, fr, x-default) | `pageMetadata` / `articleMetadata` |
| Open Graph + Twitter cards | `seo.ts` + images dynamiques |
| OG image site | `/opengraph-image` |
| OG image par article | `/articles/<slug>/opengraph-image` (sans locale, stable) |
| `robots.txt` | `src/app/robots.ts` |
| `sitemap.xml` | toutes les URLs × 2 locales |
| RSS | `/feed.xml`, `/rss.xml` |
| JSON-LD Organization + WebSite | root `layout.tsx` |
| JSON-LD Article + BreadcrumbList | pages article |
| JSON-LD Course + FAQPage | pages lab |
| FAQ frontmatter articles | `faq:` dans les `.md` |
| SSG articles | `generateStaticParams` |
| H1 unique par page (y compris home en SSR) | `Hero.tsx`, `PageHeader.tsx` |
| Hiérarchie headings propre | composants sections/footer |
| `favicon.ico` + `icon.svg` | `public/favicon.ico`, `src/app/icon.svg` |
| Page `/contact` + lien `mailto:` | `src/app/contact/`, footer |
| Verification GSC (meta tag) | `NEXT_PUBLIC_GSC_VERIFICATION` |
| Analytics Plausible (optionnel, sans cookies) | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |

**Canonical host :** `https://www.dailyops.tech` (`src/lib/site.ts`).

---

## URLs publiques (à retenir)

```
https://www.dailyops.tech/en
https://www.dailyops.tech/fr
https://www.dailyops.tech/en/articles
https://www.dailyops.tech/fr/articles
https://www.dailyops.tech/en/articles/<slug>
https://www.dailyops.tech/fr/articles/<slug>
https://www.dailyops.tech/en/labs
https://www.dailyops.tech/fr/labs/<slug>
… (category, experience, products, about, resources, privacy, legal)
```

Ancien lien `https://www.dailyops.tech/articles` → **308** → `/en/articles`.

---

## FAQ schema

### Labs
Steps `quiz` / `checklist` / `lab` → FAQPage (langue = locale de l’URL).

### Articles runbook
Frontmatter :

```yaml
faq:
  - q: "Question ?"
    a: "Réponse."
```

Voir [ADDING-ARTICLES.md](./ADDING-ARTICLES.md).

---

## Ce que **tu** dois faire (hors code)

1. **Google Search Console** — propriété `https://www.dailyops.tech`, soumettre le sitemap  
   - Si vérification par **meta tag** : mettre le token dans `NEXT_PUBLIC_GSC_VERIFICATION` (Vercel → Settings → Environment Variables) puis redeployer.  
   - Si vérification par **DNS** : TXT record chez le registrar (hors code).
2. **Redirect domaine** — apex ↔ www unique, aligné avec `SITE.url`  
3. **Contenu** — titres/excerpts EN **et** FR soignés  
4. **Tester OG** après deploy (LinkedIn / Facebook debugger)  
5. Resoumettre le sitemap après passage `/en` `/fr` (beaucoup d’URL changent)

---

## Checklist technique

- [ ] `/` redirige vers `/en`  
- [ ] `/fr/articles` et `/en/articles` 200  
- [ ] View-source article : hreflang + FAQ si frontmatter  
- [ ] View-source lab : FAQPage + Course  
- [ ] Aucun lien interne non préfixé dans le chrome principal  
- [ ] `SITE.url` = prod réelle  

---

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/proxy.ts` | Rewrite locale + redirect |
| `src/lib/i18n.ts` | Helpers locale |
| `src/lib/LanguageContext.tsx` | `lp()`, `setLang` |
| `src/lib/seo.ts` | Metadata + hreflang |
| `src/lib/jsonld.ts` | Structured data |
| `src/app/sitemap.ts` | Sitemap multi-locale |
| [I18N.md](./I18N.md) | Guide dev anti-erreur |
