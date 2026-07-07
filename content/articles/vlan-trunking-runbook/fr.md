---
title: Runbook VLAN Trunking pour switches de production
excerpt: Standardiser la config 802.1Q, la native VLAN et les checks de validation sur parcs Cisco et Arista.
---

## Contexte

Des configs trunk incohérentes provoquent fuites VLAN, boucles STP et heures de debug. Ce runbook standardise le **trunking 802.1Q** sur les couches access/distribution.

---

## Règles de design

| Règle | Raison |
|-------|--------|
| Native VLAN dédiée (inutilisée ailleurs) | Évite les attaques double-tag |
| Trunk uniquement sur VLANs requis | Réduit la portée broadcast |
| `switchport nonegotiate` sur trunks statiques | Bloque le DTP indésirable |
| Nommage VLAN cohérent (`VLAN<ID>-<ROLE>`) | Lisibilité Ops |

---

## Template Cisco IOS-XE

```text
interface GigabitEthernet1/0/1
 description TRUNK_TO_DIST_01
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,30,100
 switchport nonegotiate
 spanning-tree portfast trunk
```

---

## Template Arista EOS

```text
interface Ethernet1
 description TRUNK_TO_DIST_01
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,30,100
```

---

## Validation

```text
show interfaces trunk
show vlan brief
show spanning-tree interface <trunk>
```

- [ ] Native VLAN identique des deux côtés
- [ ] Liste allowed VLAN symétrique
- [ ] Pas de `dynamic auto/desirable` en production
- [ ] STP edge trunk uniquement sur topologies connues

---

## Rollback

Revenir au dernier snippet archivé par interface. Valider avec `show archive config differences`.

---

## Points clés

- **Native VLAN mismatch** = problème sécurité et stabilité
- Documenter les VLANs autorisés dans le ticket de changement
- Tester en lab avec le même mode STP (RSTP/MST) qu'en production