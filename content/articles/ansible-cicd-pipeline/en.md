---
title: Ansible CI/CD Pipeline for Production Infrastructure
excerpt: Design a gated Ansible pipeline with lint, Molecule tests, staging deploy, and production approval — field-tested on 200+ hosts.
---

## Context

Manual Ansible runs don't scale past a handful of operators. One wrong `--limit`, one stale vault secret, one untested role — and you're explaining a production outage in a P1 bridge.

This runbook documents a **gated CI/CD pipeline** we deployed for a 200+ host estate (Linux network appliances, VMs, bare metal). Goal: every change is linted, tested, staged, and approved before it touches production.

---

## Architecture

| Stage | Tool | Gate |
|-------|------|------|
| Lint | `ansible-lint`, `yamllint` | Block on warning+ |
| Unit | Molecule (Docker/Podman) | 100% scenario pass |
| Staging | AWX / Ansible Semaphore | Smoke tests green |
| Production | Manual approval + rolling | Canary group first |

**Branch model:** `feature/*` → MR → `main` → auto staging → tagged release → production.

> **Ops note:** Keep inventory and credentials out of Git. Use AWX credentials, Vault, or CI secret stores only.

---

## Prerequisites

- Ansible ≥ 2.15, Python ≥ 3.10
- Molecule + driver (`molecule-docker` or `molecule-podman`)
- CI runner with Docker socket (or isolated DinD)
- Separate inventories: `staging/`, `production/`
- Vault secrets rotated quarterly

---

## Repository Layout

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

## Stage 1 — Lint & Syntax

```yaml
lint:
  stage: validate
  script:
    - ansible-lint --profile production
    - yamllint -c .yamllint .
    - ansible-playbook playbooks/site.yml --syntax-check
```

**Fail fast.** A syntax error costs 30 seconds in CI — or 30 minutes in a change window.

---

## Stage 2 — Molecule Tests

```yaml
test:molecule:
  stage: test
  script:
    - cd roles/base_hardening && molecule test
  artifacts:
    when: on_failure
    paths: [roles/base_hardening/molecule/default/]
```

Minimum scenarios per role:

1. **Converge** — role applies cleanly
2. **Verify** — assertions on config files, services, ports
3. **Idempotence** — second run changes = 0

---

## Stage 3 — Staging Deploy

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

Post-deploy smoke checks (automated):

- SSH on port 22 from bastion
- Critical service `active (running)`
- Config drift vs expected checksum

---

## Stage 4 — Production Gate

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

**Rolling strategy:** `canary` (5%) → pause 15 min → full fleet. Abort if error rate or alert count spikes.

---

## Validation Checklist

- [ ] `ansible-lint` profile `production` — zero warnings
- [ ] Molecule idempotence passed
- [ ] Staging smoke tests green for 24h
- [ ] Change ticket linked in MR
- [ ] Rollback playbook tested in staging
- [ ] On-call notified before production gate

---

## Rollback

1. Revert Git tag / merge commit
2. Run last known-good playbook version from CI artifact
3. Limit to affected host group first
4. Confirm monitoring baseline restored

```bash
ansible-playbook -i inventories/production playbooks/site.yml \
  --extra-vars "baseline_tag=v2.4.1" --limit impacted_group
```

---

## Key Takeaways

- **Lint and test are not optional** — they're cheaper than incident response
- **Never share staging and production credentials** in the same CI variable scope
- **Canary + manual gate** beats big-bang deploys on stateful infrastructure
- **Idempotence is your contract** with operations — if Molecule fails it, don't ship it