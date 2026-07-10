---
title: Assistant AI-Ops en production — architecture & garde-fous
excerpt: Routage par tiers, ancrage sur la base interne, escalade sécurisée et quand un LLM bat un runbook — patterns issus de l'assistant DailyOps.
---

## Contexte

Les assistants LLM en opérations échouent quand on les traite comme des boîtes magiques. L'AI-Ops production exige un **routage par tiers**, des **réponses ancrées** et un **chemin clair vers l'humain**. Cet article documente les patterns de l'assistant DailyOps — applicables aux copilotes NOC internes et aides runbook.

---

## Quand utiliser un LLM (et quand ne pas)

| Utiliser LLM | Préférer l'outil déterministe |
|--------------|-------------------------------|
| Expliquer un concept multi-sources | Exécuter un script de remédiation connu |
| Résumer un long runbook pour triage | Parser des alertes monitoring structurées |
| Rédiger une comm incident | Imposer la conformité config (Ansible, OPA) |
| Router des questions vagues opérateur | Lookup CVE avec flux vendor exact |

**Règle :** si une mauvaise réponse cause une panne ou un non-respect conformité, ne pas s'appuyer sur le LLM seul.

---

## Modèle de routage par tiers

Router par confiance et type de source avant d'appeler un modèle coûteux.

```text
Tier 1 — Connaissance site     → articles, catégories, FAQ plateforme
Tier 2 — Docs constructeur     → documentation officielle curatée
Tier 3 — LLM raisonnement      → synthèse si tiers 1–2 insuffisants
Tier 4 — Recherche web live     → CVE, versions, actualités (optionnel)
```

Bénéfices :

- Coût et latence réduits pour les questions fréquentes
- Réponses avec **sources** vérifiables par l'opérateur
- Le LLM gère l'ambiguïté seulement si les chemins moins chers échouent

---

## Ancrage sur la connaissance interne

Ne jamais laisser le modèle inventer l'état de l'infrastructure.

1. **Récupérer** — chercher articles, runbooks, extraits CMDB (RAG)
2. **Composer** — le LLM répond uniquement depuis les chunks récupérés
3. **Citer** — lier chaque affirmation à un slug article ou ID doc
4. **Refuser** — si retrieval vide, le dire et proposer l'escalade

```text
Question → embed/search index interne → top-k chunks → prompt LLM avec citations
```

Anti-patterns :

- Dumper tout le wiki dans le system prompt (périmé, coûteux, fuite)
- Laisser le modèle deviner hostnames, IP ou credentials

---

## Garde-fous

| Risque | Mitigation |
|--------|------------|
| Fuite de secrets | Strip env des prompts ; bloquer collage clés API |
| Commandes dangereuses | Mode lecture seule ; suggérer, ne pas exécuter |
| CVE hallucinées | Recherche tier 4 + lien NVD/vendor |
| Abus hors-sujet | System prompt limité ops/infra |
| Sur-confiance | Montrer le nombre de sources, pas de faux % |

Chemin d'escalade (obligatoire) :

- [ ] **Formulaire expert** — email transcript à l'équipe plateforme
- [ ] **Fallback contact** — visible si API ou modèle indisponible
- [ ] Rate limiting par IP/session sur widgets publics

---

## Prompt design pour personas ops

Un assistant ops efficace parle comme un **senior engineer**, pas un chatbot :

- Paragraphes courts, étapes en puces pour les procédures
- Une question de clarification si le contexte est ambigu
- Liens vers guides DailyOps plutôt que conseils internet génériques
- Assumer l'incertitude : « Je n'ai pas de source vérifiée pour ça »

Coupler avec **Automation** : le LLM suggère ; Ansible/Terraform exécute après validation humaine.

---

## Observabilité de l'assistant

Superviser l'assistant comme un service tier-1 :

| Métrique | Pourquoi |
|----------|----------|
| Débit & latence | Capacité, lenteur modèle |
| Distribution des tiers | Le routage fonctionne-t-il ? |
| Taux d'escalade | Lacunes de connaissance |
| Taux d'erreur (429, 5xx) | Quota, pannes upstream |
| Réponses sans source | Trous dans l'index RAG |

Logger prompts/réponses avec redaction PII — rétention alignée politique sécurité.

---

## Checklist de validation

- [ ] Requêtes tier 1 répondent sans LLM (style FAQ)
- [ ] Chaque réponse LLM inclut ≥1 lien source vérifiable
- [ ] Email d'escalade livre transcript + contact visiteur
- [ ] Message fallback si `OPENAI_API_KEY` absente ou quota épuisé
- [ ] Revue sécurité : pas de secrets dans les bundles client

---

## Points clés

- **L'IA complète Automation et Observabilité** — elle ne les remplace pas
- Le routage par tiers maîtrise coût, latence et risque d'hallucination
- Un assistant production a besoin d'escalade, citations et refus — pas seulement de fluidité