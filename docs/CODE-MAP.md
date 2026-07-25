# Carte du code Site-PP

```
Site-PP/
├── content/articles/<slug>/{fr,en}.md   # Corps articles markdown
├── docs/                                # Cette documentation
├── public/                              # Assets statiques
├── src/
│   ├── app/                             # Routes Next.js (App Router)
│   │   ├── page.tsx                     # Home
│   │   ├── articles/                    # Liste + [slug]
│   │   ├── category/[slug]/
│   │   ├── labs/                        # Parcours
│   │   ├── products/                    # Suite produits
│   │   ├── experience/
│   │   ├── about/
│   │   ├── resources/
│   │   ├── newsletter/preview/
│   │   └── api/                         # API routes (serveur)
│   │       ├── chat/                    # Assistant
│   │       ├── newsletter/
│   │       ├── contact/
│   │       ├── labs/
│   │       └── email/
│   ├── components/                      # UI React
│   │   ├── ChatAssistant.tsx
│   │   ├── Navbar.tsx, Footer.tsx, Hero.tsx, …
│   │   └── …
│   └── lib/                             # Logique métier (serveur / partagé)
│       ├── articles.ts                  # Registre articles
│       ├── categories.ts
│       ├── experiences.ts
│       ├── labs.ts, lab-quizzes.ts
│       ├── products.ts
│       ├── translations.ts              # i18n EN/FR
│       ├── markdown.ts                  # Lecture content/
│       ├── email.ts, email-templates.ts
│       ├── chat-*.ts                    # Chat (voir CHAT-AND-AI.md)
│       ├── site.ts, seo.ts
│       └── …
├── .env.example                         # Modèle des variables
└── package.json
```

## Où modifier quoi ?

| Tu veux… | Fichiers |
|----------|----------|
| Nouvel article | `content/articles/…`, `articles.ts`, `translations.ts` |
| Texte UI (bouton, hero) | `translations.ts` + éventuellement le composant |
| Page produits | `products.ts`, `app/products/page.tsx`, `translations` `products.*` |
| Nav / footer liens | `Navbar.tsx`, `Footer.tsx` |
| Comportement chat | `chat-assistant.ts`, `chat-llm.ts`, `chat-router.ts`, `chat-sources.ts` |
| Provider IA (UniKey…) | `chat-llm.ts` + env Vercel |
| Emails | `email.ts`, `email-templates.ts` |
| Labs | `labs.ts`, `lab-quizzes.ts`, `app/labs/**` |
| SEO / sitemap | `seo.ts`, `app/sitemap.ts` |
| Styles globaux | `app/globals.css` (tokens couleur light/dark) |

## Couleurs de marque (tokens CSS)

Définis dans `src/app/globals.css` :

- `--bg-primary`, `--bg-secondary`, `--bg-elevated`
- `--text-primary`, `--text-secondary`
- `--border-main`, `--accent` / turquoise `#2BD9C5`, navy `#0A1128`

**Toujours** utiliser les classes Tailwind du thème (`bg-bg-primary`, `text-turquoise`…) plutôt que des hex hardcodés, pour light **et** dark.

## API routes utiles

| Route | Rôle |
|-------|------|
| `POST /api/chat` | Messages assistant |
| `GET /api/chat/health?ping=1` | Config + ping LLM |
| `POST /api/newsletter` | Inscription |
| `GET /api/email/health` | Config Resend |
| `POST /api/contact` | Formulaire about |
| `GET /api/labs/admin/stats` | Stats Labs (secret) |

Toutes les routes sensibles : logique **uniquement serveur** (pas de clé dans le browser).
