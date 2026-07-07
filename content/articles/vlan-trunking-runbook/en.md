---
title: VLAN Trunking Runbook for Production Switches
excerpt: Standardize 802.1Q trunk configuration, native VLAN policy, and validation checks across Cisco and Arista estates.
---

## Context

Inconsistent trunk configs cause intermittent VLAN leaks, STP loops, and hours of bridge-domain debugging. This runbook standardizes **802.1Q trunking** on access/distribution layers.

---

## Design Rules

| Rule | Rationale |
|------|-----------|
| Dedicated native VLAN (unused elsewhere) | Prevents double-tagging exploits |
| Trunk only required VLANs | Reduces broadcast scope |
| `switchport nonegotiate` on static trunks | Blocks unwanted DTP |
| Consistent VLAN naming (`VLAN<ID>-<ROLE>`) | Ops readability |

---

## Cisco IOS-XE Template

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

## Arista EOS Template

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

- [ ] Native VLAN matches both ends
- [ ] Allowed VLAN list symmetric
- [ ] No `dynamic auto/desirable` on production trunks
- [ ] STP edge trunk only on known topologies

---

## Rollback

Revert to last archived config snippet per interface. Validate with `show archive config differences`.

---

## Key Takeaways

- **Native VLAN mismatch** is a security and stability issue, not cosmetic
- Document allowed VLANs in the change ticket before any trunk modification
- Test in lab with the same STP mode (RSTP/MST) as production