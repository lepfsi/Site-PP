---
title: Perte de paquets réseau — runbook de diagnostic terrain
excerpt: Workflow couche par couche pour isoler la perte : erreurs interface, drops QoS, ACLs et problèmes MTU.
---

## Contexte

Les tickets « perte de paquets » ont rarement une cause unique. Ce runbook parcourt **de bas en haut** des compteurs NIC au MTU — 80% des cas se résolvent avant l'escalade TAC.

---

## Questions de triage

| Question | Si oui → |
|----------|----------|
| Perte sur un seul hôte ? | Vérifier NIC/driver, firewall local |
| Perte vers une destination ? | ACL, PBR, routage asymétrique |
| Perte sous charge uniquement ? | Drops QoS, buffers saturés |
| Perte après changement ? | Fenêtre rollback, diff configs |

---

## Étape 1 — Compteurs interface

```bash
# Linux
ip -s link show eth0
ethtool -S eth0 | egrep 'drop|err|fifo'

# Cisco
show interfaces <int> | include rate|drops|errors
```

Surveiller : `CRC`, `input errors`, `overruns`, `carrier transitions`.

---

## Étape 2 — Tests actifs

```bash
mtr -rwzbc 100 <target_ip>
ping -M do -s 1472 <target_ip>   # sonde MTU
```

- Perte au premier saut → segment local
- Perte en milieu de chemin → fournisseur ou peer
- Ping MTU échoue à taille N → ajuster MSS / corriger PMTUD

---

## Étape 3 — Points de capture

```text
tcpdump -i eth0 host <target> -w loss-case.pcap
```

Corréler avec timestamps SIEM/NMS. Vérifier retransmissions TCP et ICMP frag-needed.

---

## Arbre de décision

```text
Erreurs sur NIC ? → Câble/SFP, mise à jour driver
Drops QoS ? → Redimensionner files ou reprioriser
Compteurs ACL ? → Revoir l'ordre des policies
Routage asymétrique ? → Corriger RPF ou symétrie
```

---

## Checklist de validation

- [ ] Perte baseline < 0,1% sur mtr 100 paquets
- [ ] Pas de compteurs d'erreur en hausse sur 15 min
- [ ] MTU cohérent bout en bout
- [ ] Ticket de changement mis à jour avec cause racine

---

## Points clés

- **Commencer local** — escalader le fournisseur sans données NIC fait perdre des heures
- Toujours capturer avant de rebooter l'hôte
- Documenter si la perte est aléatoire ou en rafales — les pistes diffèrent