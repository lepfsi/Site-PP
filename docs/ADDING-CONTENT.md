# Ajouter d’autres types de contenu

## Ops Labs (parcours)

**Fichiers :** `src/lib/labs.ts`, clés i18n `labs.*` dans `translations.ts`, pages `src/app/labs/`.

1. Définir un path (`slug`, étapes, quiz éventuel).
2. Chaque étape peut lier un `articleSlug`.
3. Quiz : `src/lib/lab-quizzes.ts` (mots-clés de validation).
4. Progression : localStorage + optionnellement Redis (`labs-storage`, magic link).

Env Labs (Vercel) : `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `LABS_AUTH_SECRET`, `LABS_ADMIN_SECRET`.

---

## Field experience (retours terrain)

**Fichiers :** `src/lib/experiences.ts` + i18n `exp.*`.

1. Ajouter un objet dans `EXPERIENCES` (slug, category, titleKey, descKey, bodyKey ou markdown si étendu).
2. Remplir EN/FR dans `translations.ts`.
3. Page : `/experience/<slug>`.

---

## Catégories

**Fichier :** `src/lib/categories.ts` (+ i18n `cat.*`).

Ajouter une catégorie = nouveau `CategorySlug` + entrée `CATEGORIES` + **toutes** les clés de traduction + pages qui filtrent par catégorie.  
Impact large : ne le faire que si nécessaire.

---

## Produits (suite logicielle)

**Fichiers :** `src/lib/products.ts`, page `src/app/products/`, i18n `products.*`.

Pour un nouveau produit (ex. OpsAudit) :

1. Entrée dans `SOFTWARE_PRODUCTS` ou `ROADMAP_PRODUCTS`.
2. Clés `products.<id>.tagline` + `products.<id>.desc` (EN + FR).
3. Le chat lit aussi ce catalogue (voir CHAT-AND-AI.md).

---

## Newsletter

- Inscription : `POST /api/newsletter` → Resend Contacts + segment.
- Template brandé : `src/lib/email-templates.ts`, `newsletter-edition.ts`.
- Brouillon Resend : `POST /api/newsletter/admin/sync-resend` (auth admin).
- Preview : `/newsletter/preview`.

Env : `RESEND_API_KEY`, `RESEND_SEGMENT_ID`, `RESEND_FROM_EMAIL`, `LABS_ADMIN_SECRET`.

---

## Ressources (cheatsheets / scripts)

**Fichiers :** `src/app/resources/`, composants `ResourcesSection`, données souvent dans translations ou listes locales de la page.

---

## Traductions (règle d’or)

Toute chaîne UI :

1. Clé dans `TranslationKeys`
2. Valeur dans `EN`
3. Valeur dans `FR`

Oublier une des trois → TypeScript erreur ou clé brute affichée.

---

## Images / assets

Placer dans `public/` (ex. `public/og.png`).  
Référencer en `/fichier.png` (pas de chemin Windows).
