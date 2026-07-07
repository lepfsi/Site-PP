---
title: Playbook réponse incident SOC — les 30 premières minutes
excerpt: Workflow de triage structuré pour alertes phishing, malware et mouvement latéral — de la détection au confinement.
---

## Contexte

La fatigue d'alertes tue le temps de réponse. Ce playbook définit les **30 premières minutes** après une alerte SOC P2/P1 — reproductible, auditable, agnostique outil.

---

## Matrice de sévérité

| Niveau | Critères | SLA |
|--------|----------|-----|
| P1 | Exfiltration active, compromission domain admin | Triage 15 min |
| P2 | Mouvement latéral, beaconing C2 | Triage 30 min |
| P3 | Malware hôte unique, tentative bloquée | Triage 4h |

---

## Phase 1 — Triage (0–10 min)

1. **Valider** l'alerte (faux positif : fenêtre patch, scanner, pentest)
2. **Cadrer** utilisateurs, hôtes, IPs, fenêtre temporelle
3. **Préserver** les preuves : URL requête SIEM, logs bruts, ticket snapshot disque
4. **Ouvrir** canal incident + rôles (IC, scribe, comms)

```text
Questions à trancher :
- Quel est le vecteur d'entrée ?
- Quels credentials sont impliqués ?
- Le C2 sortant est-il actif maintenant ?
```

---

## Phase 2 — Confinement (10–25 min)

| Action | Quand |
|--------|-------|
| Désactiver compte compromis | Vol de credentials confirmé |
| Isoler l'hôte (containment EDR) | Malware/C2 actif |
| Bloquer IOCs firewall/proxy | IPs/domaines malveillants connus |
| Révoquer sessions (IdP) | Abus de token/session |

> **Note Ops :** Confiner progressivement. Isoler un DC avant le cadrage fait plus de dégâts que l'incident.

---

## Phase 3 — Éradication & reprise (25–30 min+)

- Réinitialiser les credentials impactés
- Patcher le vecteur exploité
- Redéployer image golden si intégrité hôte inconnue
- Activer logging renforcé pendant 72h

---

## Checklist de validation

- [ ] Timeline documentée (UTC)
- [ ] IOCs partagés avec le flux threat intel
- [ ] Parties prenantes notifiées selon plan comms
- [ ] Ticket lié au change freeze si nécessaire
- [ ] Post-incident review planifiée

---

## Points clés

- **Vitesse sans documentation** = dette compliance
- Des actions de confinement pré-approuvées économisent les cycles d'approbation à 3h du matin
- Traiter les comptes de service comme des comptes privilégiés dans chaque playbook