---
title: "SOC triage and SLAs: ranking alerts without drowning the team"
excerpt: "A practical P1-P3 matrix, severity criteria, and operational callouts for realistic first-line SOC triage."
faq:
  - q: "What is a realistic P1 triage SLA?"
    a: "For active exfiltration, domain admin compromise, or ransomware in progress, aim for about 15 minutes to first triage and escalation, adapted to real team capacity."
  - q: "Should everything be classified as P1 to be safe?"
    a: "No. Over-classifying creates alert fatigue, burns the on-call team, and hides true incidents. Use clear P1–P3 criteria and document the decision in one line."
  - q: "When should you contain before full forensics?"
    a: "As soon as severity is set and impact is plausible. Early containment buys time; deep forensics before classification often blows the SLA clock."
---

## Why triage is a craft

Without clear criteria, everything becomes “urgent”. Junior analysts open every ticket at the same pace, the queue piles up, and real incidents disappear in noise.

This guide offers a **simple matrix** and field guardrails. It does not lock you to a specific SIEM: the point is operational discipline.

## Severity matrix (example)

| Level | Criteria | Triage SLA |
|-------|----------|------------|
| P1 | Active exfiltration, domain admin compromise, ransomware in progress | 15 min |
| P2 | Lateral movement, C2 beaconing, suspicious privileged account | 30 min |
| P3 | Single-host malware already blocked, stopped attempt, phishing not clicked | 4 h |

> [!note]
> Fit SLAs to real capacity. An impossible SLA is worse than an honest one.

## First five minutes

1. Rule out obvious false positives (lab traffic, planned scans, known service accounts).
2. Capture context: host, user, source/destination, timestamp.
3. Assign P1 / P2 / P3 with the matrix above.
4. Write a one-line decision in the ticket.

> [!warning]
> Do not start a deep forensic dive before severity is set. You will miss the SLA clock.

## Escalation

| Situation | Action |
|-----------|--------|
| Confirmed P1 | Escalate immediately (SOC lead / incident commander) |
| P2 with doubt | Contain the host if possible, then escalate within 30 min |
| Clear P3 | Standard queue, no page |

> [!tip]
> A good escalation ticket includes: what, where, since when, suspected impact, actions already taken. Not a raw log dump.

## Common traps

- Classifying everything as P1 “to be safe”
- Waiting for 100% certainty before containing
- Ignoring service accounts in scope
- Never closing P3s: ticket debt kills morale

> [!important]
> Early containment (host isolation, IP block, account disable) is not punishment. It buys time to analyse calmly.

## Link to DailyOps

This aligns with the **SOC: First 30 Days** lab and the incident playbook. Use it as a shift checklist, not slide-deck theory.

> [!caution]
> The SLAs above are **examples**. Validate them with your CISO / SOC lead before promising them contractually.
