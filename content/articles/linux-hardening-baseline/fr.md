---
title: "Baseline durcissement Linux — checklist production"
excerpt: "Étapes de durcissement alignées CIS pour serveurs RHEL/Debian : SSH, firewall, audit et contrôles automatisés."
---

## Contexte

Chaque nouvel hôte Linux doit rejoindre le parc avec la même **baseline sécurité**. Cette checklist couvre RHEL 8+/Debian 12 — adaptable à Ubuntu LTS.

---

## Périmètre baseline

| Couche | Contrôles |
|--------|-----------|
| Accès | SSH clé uniquement, logging sudo |
| Réseau | Firewall hôte, ports minimaux |
| Intégrité | AIDE/Tripwire, logs immuables |
| Audit | Règles auditd sur chemins privesc |

---

## Durcissement SSH

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

## Firewall (exemple nftables)

```bash
nft add table inet filter
nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input iif lo accept
nft add rule inet filter input tcp dport 22 accept
```

---

## auditd — Élévation de privilèges

```text
-w /etc/sudoers -p wa -k sudoers_change
-w /usr/bin/sudo -p x -k priv_esc
-a always,exit -F arch=b64 -S execve -k exec_log
```

---

## Conformité automatisée

```bash
# Exemple OpenSCAP (RHEL)
oscap xccdf eval --profile cis_server_l2 \
  --results results.xml --report report.html \
  /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml
```

---

## Checklist de validation

- [ ] Auth SSH par mot de passe désactivée
- [ ] Packages minimaux installés (`dnf update` / `apt upgrade`)
- [ ] Sync temps active (chrony/systemd-timesyncd)
- [ ] auditd activé avec règles chargées
- [ ] Score CIS/OpenSCAP ≥ 80% ou exceptions documentées

---

## Points clés

- **Baseline avant workload** — durcir en prod après coup est coûteux
- Automatiser avec Ansible ; la dérive manuelle arrive en semaines
- Documenter chaque exception avec owner risque et date de revue