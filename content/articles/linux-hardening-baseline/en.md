---
title: "Linux Server Hardening Baseline — Production Checklist"
excerpt: "CIS-aligned hardening steps for RHEL/Debian servers: SSH, firewall, auditing, and automated compliance checks."
---

## Context

Every new Linux host should ship with the same **security baseline** before joining the fleet. This checklist covers RHEL 8+/Debian 12 — adaptable to Ubuntu LTS.

---

## Baseline Scope

| Layer | Controls |
|-------|----------|
| Access | SSH key-only, sudo logging |
| Network | Host firewall, minimal open ports |
| Integrity | AIDE/Tripwire, immutable logs |
| Audit | auditd rules for privesc paths |

---

## SSH Hardening

```text
# /etc/ssh/sshd_config.d/99-hardening.conf
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
AllowUsers ops_admin deploy_svc
```

```bash
sshd -t && systemctl reload sshd
```

---

## Firewall (nftables example)

```bash
nft add table inet filter
nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input iif lo accept
nft add rule inet filter input tcp dport 22 accept
```

---

## auditd — Privilege Escalation

```text
-w /etc/sudoers -p wa -k sudoers_change
-w /usr/bin/sudo -p x -k priv_esc
-a always,exit -F arch=b64 -S execve -k exec_log
```

---

## Automated Compliance

```bash
# OpenSCAP example (RHEL)
oscap xccdf eval --profile cis_server_l2 \
  --results results.xml --report report.html \
  /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml
```

---

## Validation Checklist

- [ ] SSH password auth disabled
- [ ] Only required packages installed (`dnf update` / `apt upgrade`)
- [ ] Time sync active (chrony/systemd-timesyncd)
- [ ] auditd enabled and rules loaded
- [ ] CIS/OpenSCAP score ≥ 80% or documented exceptions

---

## Key Takeaways

- **Baseline before workload** — retrofitting hardening on prod boxes is painful
- Automate with Ansible; manual drift appears within weeks
- Document every exception with risk owner and review date