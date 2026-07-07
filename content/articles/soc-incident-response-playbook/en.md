---
title: SOC Incident Response Playbook — First 30 Minutes
excerpt: Structured triage workflow for phishing, malware, and lateral movement alerts — from detection to containment.
---

## Context

Alert fatigue kills response time. This playbook defines the **first 30 minutes** after a P2/P1 SOC alert — repeatable, auditable, tool-agnostic.

---

## Severity Matrix

| Level | Criteria | SLA |
|-------|----------|-----|
| P1 | Active exfiltration, domain admin compromise | 15 min triage |
| P2 | Lateral movement, C2 beaconing | 30 min triage |
| P3 | Single host malware, blocked attempt | 4h triage |

---

## Phase 1 — Triage (0–10 min)

1. **Validate** alert (false positive check: patch window, scanner, pentest)
2. **Scope** affected users, hosts, IPs, time window
3. **Preserve** evidence: SIEM query URL, raw logs, disk snapshot ticket
4. **Open** incident channel + assign roles (IC, scribe, comms)

```text
Questions to answer:
- What is the entry vector?
- What credentials are involved?
- Is outbound C2 active right now?
```

---

## Phase 2 — Containment (10–25 min)

| Action | When |
|--------|------|
| Disable compromised account | Credential theft confirmed |
| Isolate host (EDR network containment) | Active malware/C2 |
| Block IOCs at firewall/proxy | Known bad IPs/domains |
| Revoke sessions (IdP) | Token/session abuse |

> **Ops note:** Contain incrementally. Full network isolation of a DC before scoping causes more damage than the incident.

---

## Phase 3 — Eradication & Recovery (25–30 min+)

- Reset credentials for impacted accounts
- Patch exploited vector
- Redeploy golden image if host integrity unknown
- Enable enhanced logging for 72h

---

## Validation Checklist

- [ ] Timeline documented (UTC)
- [ ] IOCs shared with threat intel feed
- [ ] Stakeholders notified per comms plan
- [ ] Ticket linked to change freeze if needed
- [ ] Post-incident review scheduled

---

## Key Takeaways

- **Speed without documentation** creates compliance debt
- Pre-approved containment actions save approval cycles at 3 AM
- Treat service accounts like privileged users in every playbook