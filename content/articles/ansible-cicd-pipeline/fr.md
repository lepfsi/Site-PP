---
title: Pipeline CI/CD Ansible pour l'infrastructure de production
excerpt: Concevoir un pipeline Ansible avec lint, tests Molecule, déploiement staging et validation production — éprouvé sur 200+ hôtes.
---

## Contexte

Les exécutions Ansible manuelles ne passent pas l'échelle au-delà de quelques opérateurs. Un mauvais `--limit`, un secret vault obsolète, un rôle non testé — et vous expliquez une panne production en bridge P1.

Ce runbook documente un **pipeline CI/CD à portes de validation** déployé sur un parc de 200+ hôtes (appliances réseau Linux, VMs, bare metal). Objectif : chaque changement est linté, testé, déployé en staging et approuvé avant la production.

---

## Architecture

| Étape | Outil | Porte |
|-------|-------|-------|
| Lint | `ansible-lint`, `yamllint` | Blocage dès warning+ |
| Unit | Molecule (Docker/Podman) | 100% scénarios OK |
| Staging | AWX / Ansible Semaphore | Smoke tests verts |
| Production | Approbation manuelle + rolling | Groupe canary d'abord |

**Modèle de branches :** `feature/*` → MR → `main` → staging auto → tag release → production.

> **Note Ops :** Gardez l'inventaire et les credentials hors Git. Utilisez uniquement AWX, Vault ou les secret stores CI.

---

## Prérequis

- Ansible ≥ 2.15, Python ≥ 3.10
- Molecule + driver (`molecule-docker` ou `molecule-podman`)
- Runner CI avec socket Docker (ou DinD isolé)
- Inventaires séparés : `staging/`, `production/`
- Secrets Vault rotés trimestriellement

---

## Arborescence du dépôt

```
ansible/
├── inventories/
│   ├── staging/
│   └── production/
├── roles/
│   └── base_hardening/
├── playbooks/
│   └── site.yml
├── molecule/
│   └── default/
├── .ansible-lint
├── .yamllint
└── .gitlab-ci.yml
```

---

## Étape 1 — Lint & Syntaxe

```yaml
lint:
  stage: validate
  script:
    - ansible-lint --profile production
    - yamllint -c .yamllint .
    - ansible-playbook playbooks/site.yml --syntax-check
```

**Fail fast.** Une erreur de syntaxe coûte 30 secondes en CI — ou 30 minutes dans une fenêtre de changement.

---

## Étape 2 — Tests Molecule

```yaml
test:molecule:
  stage: test
  script:
    - cd roles/base_hardening && molecule test
  artifacts:
    when: on_failure
    paths: [roles/base_hardening/molecule/default/]
```

Scénarios minimum par rôle :

1. **Converge** — le rôle s'applique proprement
2. **Verify** — assertions sur fichiers, services, ports
3. **Idempotence** — second run : changes = 0

---

## Étape 3 — Déploiement Staging

```yaml
deploy:staging:
  stage: staging
  script:
    - ansible-playbook -i inventories/staging playbooks/site.yml
  environment:
    name: staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

Smoke tests post-déploiement (automatisés) :

- SSH port 22 depuis le bastion
- Service critique `active (running)`
- Dérive de config vs checksum attendu

---

## Étape 4 — Porte Production

```yaml
deploy:production:
  stage: production
  script:
    - ansible-playbook -i inventories/production playbooks/site.yml --limit canary
    - ./scripts/post_deploy_check.sh canary
    - ansible-playbook -i inventories/production playbooks/site.yml --limit production
  when: manual
  rules:
    - if: $CI_COMMIT_TAG
```

**Stratégie rolling :** `canary` (5%) → pause 15 min → parc complet. Abandon si taux d'erreur ou alertes en hausse.

---

## Checklist de validation

- [ ] `ansible-lint` profil `production` — zéro warning
- [ ] Idempotence Molecule validée
- [ ] Smoke tests staging verts depuis 24h
- [ ] Ticket de changement lié dans la MR
- [ ] Playbook de rollback testé en staging
- [ ] Astreinte notifiée avant la porte production

---

## Rollback

1. Revenir au tag / commit Git précédent
2. Exécuter la dernière version playbook stable depuis l'artifact CI
3. Limiter au groupe d'hôtes impacté en premier
4. Confirmer le retour à la baseline monitoring

```bash
ansible-playbook -i inventories/production playbooks/site.yml \
  --extra-vars "baseline_tag=v2.4.1" --limit impacted_group
```

---

## Points clés

- **Lint et tests ne sont pas optionnels** — ils coûtent moins qu'un incident
- **Ne jamais partager les credentials staging et production** dans le même scope CI
- **Canary + porte manuelle** bat les déploiements big-bang sur infra stateful
- **L'idempotence est votre contrat** avec les opérations — si Molecule échoue, ne pas livrer