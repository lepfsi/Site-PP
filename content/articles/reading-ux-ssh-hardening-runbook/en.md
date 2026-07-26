---
title: "SSH Hardening Runbook: Code, Checklists, Tables"
excerpt: "Demo article for copyable code blocks, interactive checklists, callouts, and operational tables."
updated: "2026-07-25"
faq:
  - q: "Should you disable password authentication before deploying keys?"
    a: "No. Deploy admin SSH keys and validate a second session first, then disable PasswordAuthentication to avoid lockout."
  - q: "What is a safe sshd reload procedure?"
    a: "Keep a root or out-of-band console session open, run sshd -t to validate config, then systemctl reload sshd."
  - q: "Is fail2ban enough for an internet-facing bastion?"
    a: "It is a layer, not a complete control. Prefer keys-only auth, restricted AllowUsers, and network filtering in addition to fail2ban."
---

## Goal

Harden SSH on a Linux bastion without locking yourself out. This runbook showcases DailyOps **ops reading kit**: copyable code, interactive checklist, callouts, and tables.

> [!warning]
> Never close port 22 until you have validated a second session (or cloud console access).

## Quick decision matrix

| Situation | Action | Priority |
|-----------|--------|----------|
| Internet-facing host | Keys only + fail2ban | P1 |
| Internal bastion | Keys only, MFA jump | P2 |
| Lab / ephemeral | Minimal documented hardening | P3 |

## Interactive checklist

Tick items as you go (browser-local state only, nothing is sent to the server):

- [ ] Inventory accounts with a shell
- [ ] SSH keys deployed for admins
- [ ] `PasswordAuthentication no` tested on a second session
- [ ] fail2ban or equivalent enabled
- [ ] Break-glass procedure documented

## Reference config

```bash
# /etc/ssh/sshd_config.d/99-hardening.conf
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers opsadmin jumpuser
```

After editing:

```bash
sshd -t && systemctl reload sshd
```

> [!tip]
> Keep a root/console session open during reload. The code block **Copy** button prevents typos in production.

## Control table

| Control | Where to check | OK when |
|---------|----------------|---------|
| Key auth | `sshd -T \| grep passwordauthentication` | `no` |
| Root login | `sshd -T \| grep permitrootlogin` | `no` or `prohibit-password` |
| Banner | `/etc/issue.net` | Legal notice present |

> [!important]
> “OK on one host” is not “OK on the estate”. Automate evidence (Ansible, CIS, audit script).

## Common traps

1. Disabling passwords before keys are deployed.
2. Forgetting service accounts with shells.
3. Applying a CIS template with no rollback window.

> [!caution]
> On a hypervisor or firewall, an SSH lockout may require on-site recovery. Always plan an out-of-band path.

## End of runbook

When the checklist is green, record date, operator, and config hash in the change ticket. The next article connects this kind of content to the rest of the DailyOps knowledge base (links, notes, CTA).
