# Variables d’environnement & déploiement

## Fichier modèle

Voir `.env.example` à la racine du repo.  
En local : créer `.env.local` (gitignored).  
En prod : **Vercel → Settings → Environment Variables**.

## Groupes essentiels

### Email (Resend)

| Variable | Rôle |
|----------|------|
| `RESEND_API_KEY` | Envoi + contacts |
| `RESEND_FROM_EMAIL` | Expéditeur vérifié |
| `RESEND_DOMAIN` | Domaine (ex. news.dailyops.tech) |
| `RESEND_SEGMENT_ID` | Segment newsletter |
| `CONTACT_EMAIL` | Affiché public |
| `NOTIFY_EMAIL` | Boîte qui reçoit les notifs |

### Chat (Gemini en priorité)

| Variable | Rôle |
|----------|------|
| `GEMINI_API_KEY` | Clé Google AI Studio (recommandé) |
| `CHAT_PROVIDER` | `gemini` (optionnel si seule clé Gemini) |
| `CHAT_MODEL` | `gemini-2.5-flash` (défaut) |
| `GEMINI_MODEL` | Alias modèle Gemini |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Alias de `GEMINI_API_KEY` |
| `GEMINI_BASE_URL` | Défaut OpenAI-compat Google |
| `UNIKEY_API_KEY` / `OPENAI_API_KEY` / `XAI_API_KEY` | Fallbacks |
| `TAVILY_API_KEY` | Recherche web (CVE, docs) |

Clé : [aistudio.google.com/apikey](https://aistudio.google.com/apikey).  
Auto si `CHAT_PROVIDER` vide : **gemini → unikey → openai → xai**.

### Labs

| Variable | Rôle |
|----------|------|
| `UPSTASH_REDIS_REST_URL` | Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Redis |
| `LABS_AUTH_SECRET` | JWT magic link |
| `LABS_ADMIN_SECRET` | Admin stats + newsletter setup |

### SEO & analytics

| Variable | Rôle |
|----------|------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Active Plausible (privacy-first, sans cookies). Vide = désactivé |
| `NEXT_PUBLIC_PLAUSIBLE_SRC` | URL script Plausible (défaut officiel ; override self-hosted) |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Token Google Search Console → meta `google-site-verification` |

## Déploiement

1. Repo GitHub `lepfsi/Site-PP` branch `main`
2. Projet Vercel lié à ce repo
3. Domaine `dailyops.tech` / `www.dailyops.tech`
4. Push sur `main` → build Next.js → deploy

### Commandes locales

```bash
npm run build    # vérifie la compile
npm run lint
```

### Remote en avance (push rejected)

```bash
git pull --rebase origin main
# résoudre conflits si besoin
git push origin main
```

## Health checks prod

| URL | Attendu |
|-----|---------|
| `/api/chat/health?ping=1` | `provider: gemini`, `live.ok: true` |
| `/api/email/health` | `configured: true`, segment non null |
| `/products` | Page produits |
| `/newsletter/preview` | HTML brandé |

## Sécurité

- Jamais de clé dans le code client (`NEXT_PUBLIC_*` sauf URLs publiques).
- Secrets admin : header `Authorization: Bearer …` ou query protégée.
- Après fuite d’un secret (chat, screenshot) : **régénérer** sur le provider + Vercel.
