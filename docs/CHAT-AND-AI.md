# Chat assistant & providers IA

## Architecture

```
Navigateur (ChatAssistant.tsx)
    → POST /api/chat
        → chat-assistant.ts      # orchestration
            → chat-router.ts     # type de question
            → chat-sources.ts    # articles + Tavily/Serper
            → chat-context.ts    # identité DailyOps + produits
            → chat-llm.ts        # appel Gemini / UniKey / OpenAI / xAI
            → chat-quality.ts    # filtre réponses pourries
```

## Provider actuel (priorité)

**Gemini (Google)** — via endpoint OpenAI-compatible.

```env
GEMINI_API_KEY=AIza...
CHAT_PROVIDER=gemini
CHAT_MODEL=gemini-2.5-flash
```

- Clé : https://aistudio.google.com/apikey  
- Docs OpenAI compat : https://ai.google.dev/gemini-api/docs/openai  
- Base par défaut : `https://generativelanguage.googleapis.com/v1beta/openai`

### Changer de modèle / provider

1. Mettre les variables sur **Vercel** (jamais dans le repo).
2. Optionnel : adapter les defaults dans `src/lib/chat-llm.ts` (`getLLMConfig`).
3. Redeploy.
4. Tester : `GET /api/chat/health?ping=1`  
   → `llm.provider` doit être `"gemini"`.

### Providers supportés

| Provider | Env clé | Auto-sélection |
|----------|---------|----------------|
| **gemini** | `GEMINI_API_KEY` (ou `GOOGLE_GENERATIVE_AI_API_KEY`) | **Oui (prioritaire)** |
| unikey | `UNIKEY_API_KEY` | Si pas Gemini |
| openai | `OPENAI_API_KEY` | Si pas Gemini/UniKey |
| xai | `XAI_API_KEY` | Ensuite |
| kimi/logfare | `LOGFARE_API_KEY` | **Non** (explicit `CHAT_PROVIDER=kimi` only) |

Fallback multi-provider : si le primaire échoue ou est rejeté par `chat-quality`, on tente UniKey → OpenAI → xAI s’ils sont configurés (`listAvailableLLMConfigs`).

## Ajouter un « agent » / un autre LLM

1. Ouvre `src/lib/chat-llm.ts`.
2. Étends `ChatProviderId` (`"monprovider"`).
3. Dans `getLLMConfig()` : lire `MONPROVIDER_API_KEY`, base URL, modèle.
4. Dans `modelFallbacks()` : modèles de secours.
5. Documente dans `.env.example`.
6. Health : `src/app/api/chat/health/route.ts` (hints d’erreur).

Le format attendu est **OpenAI Chat Completions** :

`POST {baseUrl}/chat/completions`  
Header `Authorization: Bearer …`  
Body `{ model, messages, max_tokens, temperature }`.

## Persona & connaissance

- System prompt : `buildPersonaPrompt` dans `chat-assistant.ts`.
- Connaissance site : `buildChatSiteContext` / `buildCompactKnowledge` dans `chat-context.ts`  
  → inclut articles, labs, **produits** (OpsGate, OpsVault…), pages.
- Routing : `chat-router.ts` (CVE, vendor, about brand, contact…).
- Sources externes : Tavily (`TAVILY_API_KEY`) ou Serper.

### Faire connaître un nouveau produit au chat

1. L’ajouter dans `src/lib/products.ts` + traductions `products.*`.
2. Le bloc produits est injecté dans la connaissance chat automatiquement.
3. Optionnel : patterns dans `chat-router.ts` (`about_brand` / produits).

## Qualité & sécurité

`chat-quality.ts` rejette :

- spam / boucles
- dump CJK sur UI FR/EN
- insultes / garbling

Message utilisateur : erreur propre + lien contact (pas le dump brut).

## Latence (pourquoi c’est lent)

Chaîne typique d’un message :

1. Routing (ms)
2. Match articles locaux (ms)
3. **Recherche web** Tavily (0,5–3 s) si CVE / vendor / « récent »
4. **Appel LLM** Gemini (ou fallback UniKey/OpenAI)
5. Filtre qualité

### Leviers déjà / à garder

- Pas de cascade de modèles UniKey inutiles
- Historique court
- `max_tokens` raisonnable
- Timeout recherche web
- Vendor + web en parallèle

### Si encore trop lent

- Réduire `maxTokens` dans `generateReplyText`
- Désactiver temporairement Tavily pour tests
- Choisir un modèle UniKey plus petit (ex. `gpt-5.4-mini` si dispo)

## Messages d’erreur UI

| Texte | Origine |
|-------|---------|
| Welcome fixe | `translations` `chat.welcome` (pas le LLM) |
| « invalid reply » | Filtre qualité |
| « couldn't process » / « n'ai pas pu traiter » | Exception réseau / API (`chat.error`) |

## Tester le chat en local

```bash
# .env.local
GEMINI_API_KEY=AIza...
CHAT_PROVIDER=gemini
CHAT_MODEL=gemini-2.5-flash
# TAVILY_API_KEY=...   # optionnel

npm run dev
```

Ouvre le widget chat, envoie « Bonjour », « OpsGate », « CVE Fortinet récente ».
