---
title: "Network Packet Loss — Field Diagnosis Runbook"
excerpt: "Layer-by-layer workflow to isolate packet loss: interface errors, QoS drops, ACLs, and path MTU issues."
---

## Context

"Packet loss" tickets rarely mean one root cause. This runbook walks **bottom-up** from NIC counters to path MTU — 80% of cases resolve before vendor TAC.

---

## Triage Questions

| Question | If yes → |
|----------|----------|
| Loss on one host only? | Check NIC/driver, local firewall |
| Loss to one destination? | ACL, PBR, asymmetric routing |
| Loss under load only? | QoS queue drops, buffer exhaustion |
| Loss after change? | Rollback window, diff configs |

---

## Step 1 — Interface Counters

```bash
# Linux
ip -s link show eth0
ethtool -S eth0 | egrep 'drop|err|fifo'

# Cisco
show interfaces <int> | include rate|drops|errors
```

Look for: `CRC`, `input errors`, `overruns`, `carrier transitions`.

---

## Step 2 — Active Probing

```bash
mtr -rwzbc 100 <target_ip>
ping -M do -s 1472 <target_ip>   # MTU probe
```

- Loss at first hop → local segment
- Loss mid-path → provider or peer issue
- MTU ping fails at size N → clamp MSS / fix PMTUD

---

## Step 3 — Capture Points

```text
tcpdump -i eth0 host <target> -w loss-case.pcap
```

Correlate with SIEM/NMS timestamps. Check for TCP retransmits and ICMP frag-needed.

---

## Decision Tree

```text
Errors on NIC? → Replace cable/SFP, driver update
QoS drops? → Resize queues or reprioritize
ACL hit counters? → Review policy order
Asymmetric routing? → Fix RPF or routing symmetry
```

---

## Validation Checklist

- [ ] Baseline loss < 0.1% on 100-packet mtr
- [ ] No rising error counters over 15 min
- [ ] MTU consistent end-to-end
- [ ] Change ticket updated with root cause

---

## Key Takeaways

- **Start local** — jumping to provider escalation without NIC data wastes hours
- Always capture before rebooting the host
- Document whether loss is random or burst — diagnosis paths differ