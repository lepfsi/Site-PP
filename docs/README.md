# DailyOps.Tech (Site-PP) — Documentation

Guide pour faire évoluer le site sans casser la prod. Tout le code vit dans ce dépôt GitHub : [lepfsi/Site-PP](https://github.com/lepfsi/Site-PP).

## Sommaire

| Doc | Contenu |
|-----|---------|
| [ADDING-ARTICLES.md](./ADDING-ARTICLES.md) | Ajouter un article (markdown + registre + i18n) |
| [ADDING-CONTENT.md](./ADDING-CONTENT.md) | Labs, expérience, ressources, catégories, produits |
| [CODE-MAP.md](./CODE-MAP.md) | Carte des dossiers et responsabilités |
| [CHAT-AND-AI.md](./CHAT-AND-AI.md) | Chatbot, UniKey, providers, qualité, recherche web |
| [ENV-AND-DEPLOY.md](./ENV-AND-DEPLOY.md) | Variables Vercel, deploy, health checks |

## Stack en une phrase

**Next.js 16 (App Router) + TypeScript + Tailwind**, contenu markdown dans `content/`, emails Resend, Labs Redis/Upstash, chat UniKey (OpenAI-compatible).

## Workflow de base

```bash
cd Site-PP
npm install
npm run dev          # http://localhost:3000
# ... edits ...
git add -A
git commit -m "feat: ..."
git pull --rebase origin main
git push origin main   # → deploy Vercel auto si le projet est lié
```

## Avant de toucher la prod

1. Lire [CODE-MAP.md](./CODE-MAP.md) pour savoir **quel fichier** modifier.
2. Ne **jamais** committer de clés API (`.env.local` hors git).
3. Après un push, vérifier :
   - site : https://www.dailyops.tech
   - chat : https://www.dailyops.tech/api/chat/health?ping=1
   - email : https://www.dailyops.tech/api/email/health

## Produits liés (autres repos)

| Produit | Repo | Rôle |
|---------|------|------|
| OpsGate | [lepfsi/ops-gate](https://github.com/lepfsi/ops-gate) | DLP / AI security (extension) |
| OpsVault | [lepfsi/ops-vault](https://github.com/lepfsi/ops-vault) | Coffre secrets zero-knowledge |
| Site | **ce repo** | Hub savoir + Labs + chat + products page |
