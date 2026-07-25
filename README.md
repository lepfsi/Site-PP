# DailyOps.Tech — Site-PP

Site public de la maison **DailyOps** : base de connaissances ops, Ops Labs, newsletter, page produits (OpsGate, OpsVault…), assistant IA.

- **Prod :** https://www.dailyops.tech  
- **Repo :** https://github.com/lepfsi/Site-PP  

## Documentation (à lire avant de modifier)

Toute la doc opérationnelle est dans **[`docs/`](./docs/README.md)** :

| Guide | Sujet |
|-------|--------|
| [docs/ADDING-ARTICLES.md](./docs/ADDING-ARTICLES.md) | Ajouter un article step-by-step |
| [docs/ADDING-CONTENT.md](./docs/ADDING-CONTENT.md) | Labs, experience, produits, newsletter |
| [docs/CODE-MAP.md](./docs/CODE-MAP.md) | Structure du code |
| [docs/CHAT-AND-AI.md](./docs/CHAT-AND-AI.md) | Chatbot & UniKey |
| [docs/ENV-AND-DEPLOY.md](./docs/ENV-AND-DEPLOY.md) | Env Vercel & deploy |

## Stack

- Next.js (App Router) + TypeScript + Tailwind  
- Contenu articles : `content/articles/<slug>/{fr,en}.md`  
- Emails : Resend  
- Labs progress : Upstash Redis  
- Chat : UniKey (`gpt-5.6-sol` par défaut)

## Dev local

```bash
npm install
cp .env.example .env.local   # puis remplir les clés
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Deploy

Push sur `main` → Vercel.  
Voir [docs/ENV-AND-DEPLOY.md](./docs/ENV-AND-DEPLOY.md).

## Produits liés

- [OpsGate](https://github.com/lepfsi/ops-gate) — DLP GenAI  
- [OpsVault](https://github.com/lepfsi/ops-vault) — coffre secrets  
- Page site : `/products`
