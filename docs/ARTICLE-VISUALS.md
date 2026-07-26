# Animations / illustrations d’articles

Guide pour ajouter (ou modifier) les **visuels animés** liés aux articles DailyOps — ceux qui apparaissent dans le **hero** (terminal « featured »), les **cartes** et les blocs « à la une ».

Ce ne sont **pas** des animations du texte du titre dans le corps de l’article markdown. C’est une **illustration animée** associée au `slug` de l’article.

---

## 1. Où ça s’affiche

| Emplacement | Composant | `variant` typique |
|-------------|-----------|-------------------|
| Hero home — mode « featured guide » (petit terminal) | `Hero.tsx` | `card` (compact, pour ne pas chevaucher le titre) |
| Section Featured Articles | `FeaturedArticles.tsx` | `article` |
| Carte article (liste / catégorie) | `ArticleCategoryCard.tsx` | `card` |
| Article mis en avant sur une page catégorie | `CategoryFeaturedArticle.tsx` | `article` |

Fichier central :

```
src/components/article-visuals/ArticleVisual.tsx
```

Fallback si **aucun** visuel n’est enregistré pour le slug :

```
src/components/category-visuals/CategoryVisual.tsx
```

→ illustration générique de la **catégorie** (`networking`, `cybersecurity`, …).

---

## 2. Principe

1. Chaque article a un **slug** (`vlan-trunking-runbook`, …) dans `src/lib/articles.ts`.
2. `ArticleVisual` regarde le map `ARTICLE_VISUALS[slug]`.
3. S’il existe un composant → on l’affiche.
4. Sinon → `CategoryVisual` pour la catégorie de l’article.

```
slug "vlan-trunking-runbook"
  → ARTICLE_VISUALS["vlan-trunking-runbook"] = VlanTrunkVisual
  → <VlanTrunkVisual /> dans VisualShell
```

---

## 3. Checklist — ajouter une animation pour un nouvel article

1. L’article existe déjà (slug + registre + markdown). Voir [ADDING-ARTICLES.md](./ADDING-ARTICLES.md).
2. Ouvrir `src/components/article-visuals/ArticleVisual.tsx`.
3. Créer une fonction `function MonSujetVisual() { ... }`.
4. L’enregistrer dans `ARTICLE_VISUALS` avec **exactement** le même slug.
5. `npm run dev` → vérifier :
   - carte article `/articles` ou `/category/...`
   - si `featured: true` → hero home (mode featured + mode terminal en alternance)
6. Commit + push.

Sans l’étape 4, l’article garde le visuel de **catégorie** par défaut (pas d’erreur build).

---

## 4. Structure d’un visuel (template)

```tsx
function MonSujetVisual() {
  const accent = ACCENTS.networking; // ou cybersecurity, infrastructure, …
  const compact = useCompact();       // true si variant === "card"

  return (
    <VisualShell category="networking">
      {/* SVG et/ou div + framer-motion */}
      <svg className={compact ? "w-[90%] h-[70%]" : "w-[88%] h-[80%]"} viewBox="0 0 100 80">
        {/* formes statiques */}
        <motion.g
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* élément animé */}
        </motion.g>
      </svg>

      {/* Label bas : seulement si pas compact (évite le bruit en carte / hero) */}
      {!compact && (
        <span className="absolute bottom-4 text-[7px] font-mono font-bold uppercase tracking-widest"
          style={{ color: accent }}>
          mon label · court
        </span>
      )}
    </VisualShell>
  );
}
```

Puis dans le map en bas du fichier :

```tsx
const ARTICLE_VISUALS: Record<ArticleSlug, () => React.JSX.Element> = {
  // ... existants
  "mon-sujet-court": MonSujetVisual,
};
```

Le type `ArticleSlug` vient de `Article["slug"]` : si TypeScript se plaint, le slug doit d’abord exister dans `ARTICLES` (`articles.ts`).

---

## 5. API interne utile

### `VisualShell`

Enveloppe standard : fond grille, hauteur selon variant, accent top line.

```tsx
<VisualShell category="networking">
  {children}
</VisualShell>
```

Hauteurs (`SHELL_HEIGHT`) :

| `variant` | Usage | Hauteur min (approx.) |
|-----------|--------|------------------------|
| `hero` | grands blocs | plus haut |
| `article` | featured section | moyen |
| `card` | cartes + hero terminal | plus bas / compact |

### `useCompact()`

```tsx
const compact = useCompact(); // true quand variant === "card"
```

Utiliser pour :

- réduire le SVG / cacher les labels bas ;
- alléger l’animation (moins d’éléments).

### `ACCENTS`

Couleurs par catégorie (déjà définies dans le fichier) :

`networking` · `cybersecurity` · `infrastructure` · `cloud` · `observability` · `automation` · `ai` · `troubleshooting`

Toujours dériver stroke/fill de `accent` pour rester cohérent avec le design system.

### Framer Motion

Déjà importé dans le fichier (`motion` de `framer-motion`). Patterns courants :

| Effet | Exemple |
|-------|---------|
| Boucle position | `animate={{ x: [0, 40, 0] }}` + `repeat: Infinity` |
| Pulsation | `animate={{ opacity: [0.4, 1, 0.4] }}` |
| Trace de path | `animate={{ pathLength: [0, 1] }}` |
| Délais échelonnés | `delay: i * 0.8` dans un `.map()` |

Garder des cycles **2–4 s**, pas trop rapides (lisibilité, perf).

---

## 6. Variantes et hero terminal (piège fréquent)

Sur le **hero**, le mode featured affiche :

1. zone haute = `ArticleVisual` en `variant="card"`
2. zone basse = **titre + CTA** (bandeau opaque)

Si l’animation occupe tout le bas du SVG, elle **chevauche le titre** (cas VLAN avant fix).

**Règles hero / card :**

- Contenu animé dans le **tiers supérieur / milieu** du viewBox.
- Pas de labels en bas en mode `compact` (ou très discrets).
- Amplitude d’animation limitée (`x` / `y` qui ne sortent pas du cadre).
- Tester en desktop le petit terminal home (alternance featured ↔ terminal).

Le layout hero est dans `src/components/Hero.tsx` (flex colonne : visuel `flex-1` + bandeau titre `shrink-0`).

---

## 7. Article « à la une » (featured)

Pour que le hero montre **ton** article + **ton** visuel :

1. Dans `src/lib/articles.ts`, un seul article avec `featured: true` (en pratique le premier trouvé par `getFeaturedArticle()`).
2. Le même slug doit avoir une entrée dans `ARTICLE_VISUALS`.

Exemple actuel : `vlan-trunking-runbook` + `VlanTrunkVisual`.

Sans visuel dédié, le hero affiche le `CategoryVisual` de la catégorie (moins spécifique).

---

## 8. Exemple réel : VLAN trunk

Référence dans le fichier : `VlanTrunkVisual`.

- Deux switches (rectangles) + trunk.
- Tags `802.1Q · VLAN 10/20/30` qui glissent (`motion.g` + `x: [0, 42, 0]`).
- ViewBox compact ; en `compact` pas de label bas.
- Enregistré :

```tsx
"vlan-trunking-runbook": VlanTrunkVisual,
```

S’en inspirer pour un runbook réseau / flux / étapes.

---

## 9. Bonnes pratiques design

| Faire | Éviter |
|-------|--------|
| SVG simple, 1 idée visuelle | 15 formes + texte illisible |
| Palette = `ACCENTS[category]` | Couleurs néon aléatoires |
| Respecter `compact` | Même densité en carte 120px et hero |
| Animation lente, lisible | Flash permanent agressif |
| Fallback catégorie OK temporairement | Oublier d’enregistrer le slug après coup |
| Tester hero si `featured` | Ne tester que la page article |

Le corps de l’article (markdown) n’a **pas** besoin de l’animation. Le visuel est purement **UI de liste / featured / hero**.

---

## 10. Debug rapide

| Symptôme | Cause probable |
|----------|----------------|
| Visuel générique catégorie | Slug absent de `ARTICLE_VISUALS` ou typo de slug |
| Chevauchement titre hero | Animation trop basse / pas en `variant="card"` / layout hero |
| Erreur TypeScript sur le map | Slug pas encore dans `ARTICLES` |
| Animation invisible | `accent` trop transparent, ou `compact` qui cache tout |
| Perf / jank | Trop de `motion.*` imbriqués, durées trop courtes |

---

## 11. Fichiers liés

| Fichier | Rôle |
|---------|------|
| `src/components/article-visuals/ArticleVisual.tsx` | Visuels par slug + map |
| `src/components/category-visuals/CategoryVisual.tsx` | Fallback par catégorie |
| `src/components/Hero.tsx` | Terminal featured / logs |
| `src/lib/articles.ts` | Slugs + `featured: true` |
| [ADDING-ARTICLES.md](./ADDING-ARTICLES.md) | Créer l’article lui-même |
| [CODE-MAP.md](./CODE-MAP.md) | Carte du repo |

---

## 12. Workflow résumé

```
1. Article créé (slug mon-sujet)
2. ArticleVisual.tsx → function MonSujetVisual()
3. ARTICLE_VISUALS["mon-sujet"] = MonSujetVisual
4. (optionnel) featured: true sur l’article pour le hero
5. Vérifier carte + hero
6. Commit
```
