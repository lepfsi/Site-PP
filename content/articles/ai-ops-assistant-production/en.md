---
title: AI-Ops Assistant in Production — Architecture & Guardrails
excerpt: Tiered routing, internal knowledge grounding, safe escalation, and when an LLM beats a runbook — patterns from the DailyOps assistant.
---

## Context

LLM assistants in operations fail when treated as magic search boxes. Production AI-Ops needs **tiered routing**, **grounded answers**, and a **clear path to humans**. This article documents patterns used by the DailyOps site assistant — applicable to internal NOC copilots and runbook helpers.

---

## When to Use an LLM (and When Not To)

| Use LLM | Prefer deterministic tooling |
|---------|------------------------------|
| Explaining a concept across sources | Executing a known remediation script |
| Summarizing a long runbook for triage | Parsing structured monitoring alerts |
| Drafting incident comms | Enforcing config compliance (Ansible, OPA) |
| Routing vague operator questions | CVE version lookups with exact vendor feeds |

**Rule:** if the wrong answer causes outage or compliance breach, do not rely on the LLM alone.

---

## Tiered Routing Model

Route queries by confidence and source type before calling an expensive model.

```text
Tier 1 — Site knowledge    → articles, categories, platform FAQ
Tier 2 — Vendor docs       → curated official documentation
Tier 3 — Reasoning LLM     → synthesis when tiers 1–2 insufficient
Tier 4 — Live web search   → CVEs, versions, breaking news (optional)
```

Benefits:

- Lower cost and latency for common questions
- Answers cite **sources** the operator can verify
- LLM handles ambiguity only when cheaper paths fail

---

## Grounding on Internal Knowledge

Never let the model invent infrastructure state.

1. **Retrieve** — search articles, runbooks, CMDB snippets (RAG)
2. **Compose** — LLM answers only from retrieved chunks
3. **Cite** — link every claim to a source slug or doc ID
4. **Refuse** — if retrieval is empty, say so and offer escalation

```text
User question → embed/search internal index → top-k chunks → LLM prompt with citations
```

Anti-patterns:

- Dumping entire wiki into the system prompt (stale, expensive, leaky)
- Letting the model guess hostnames, IPs, or credentials

---

## Guardrails

| Risk | Mitigation |
|------|------------|
| Secret leakage | Strip env vars from prompts; block paste of API keys |
| Harmful commands | Read-only mode; suggest commands, don't auto-run |
| Hallucinated CVEs | Tier 4 search + link to NVD/vendor advisory |
| Off-topic abuse | Scope system prompt to ops/infra domains |
| Over-trust | Show confidence via sources count, not fake percentages |

Escalation path (required):

- [ ] **Expert form** — email transcript to on-call / platform team
- [ ] **Contact fallback** — visible when API or model unavailable
- [ ] Rate limiting per IP/session on public widgets

---

## Prompt Design for Ops Personas

Effective ops assistants sound like **senior engineers**, not chatbots:

- Short paragraphs, bullet steps for procedures
- Ask one clarifying question when context is ambiguous
- Prefer links to DailyOps guides over generic internet advice
- Admit uncertainty: « I don't have a verified source for that »

Pair with **Automation**: LLM suggests; Ansible/Terraform executes after human approval.

---

## Observability of the Assistant

Monitor the assistant like any tier-1 service:

| Metric | Why |
|--------|-----|
| Request rate & latency | Capacity, model slowness |
| Tier distribution | Is routing working? |
| Escalation rate | Knowledge gaps |
| Error rate (429, 5xx) | Quota, upstream failures |
| Zero-source answers | RAG index gaps |

Log prompts/responses with PII redaction — retention aligned with security policy.

---

## Validation Checklist

- [ ] Tier 1 answers return without LLM for FAQ-style queries
- [ ] Every LLM answer includes ≥1 verifiable source link
- [ ] Escalation email delivers transcript + visitor contact
- [ ] Fallback message when `OPENAI_API_KEY` missing or quota exceeded
- [ ] Security review: no secrets in client-side bundles

---

## Key Takeaways

- **AI complements Automation and Observability** — it does not replace them
- Tiered routing keeps cost, latency, and hallucination risk under control
- Production assistants need escalation, citations, and refusal — not just fluency