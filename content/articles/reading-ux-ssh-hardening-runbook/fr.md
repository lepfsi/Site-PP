---
title: "Runbook durcissement SSH: code, checklists, tableaux"
excerpt: "Article démo pour blocs de code copiables, checklists interactives, callouts et tableaux ops."
updated: "2026-07-25"
faq:
  - q: "Faut-il désactiver les mots de passe avant de déployer les clés ?"
    a: "Non. Déploie d'abord les clés admin, valide une seconde session, puis désactive PasswordAuthentication pour éviter le lockout."
  - q: "Quelle procédure de reload sshd est sûre ?"
    a: "Garde une session root ou console hors bande, valide avec sshd -t, puis systemctl reload sshd."
  - q: "fail2ban suffit-il pour un bastion exposé Internet ?"
    a: "C'est une couche, pas un contrôle complet. Préfère clés only, AllowUsers restreint et filtrage réseau en plus de fail2ban."
---

## Objectif

Durcir l’accès SSH sur un bastion Linux sans casser l’accès de secours. Ce runbook démontre le **kit ops** de lecture DailyOps: code copiable, checklist interactive, callouts et tableaux.

> [!warning]
> Ne ferme jamais le port 22 tant que tu n’as pas validé une seconde session (ou un accès console cloud).

## Matrice de décision rapide

| Situation | Action | Priorité |
|-----------|--------|----------|
| Serveur exposé Internet | Clés only + fail2ban | P1 |
| Bastion interne | Clés only, MFA jump | P2 |
| Lab / éphémère | Durcissement minimal documenté | P3 |

## Checklist interactive

Coche au fil de l’eau (état local navigateur, rien n’est envoyé au serveur):

- [ ] Inventaire des comptes avec shell
- [ ] Clés SSH déployées pour les admins
- [ ] `PasswordAuthentication no` testé sur une 2e session
- [ ] fail2ban ou équivalent actif
- [ ] Procédure break-glass documentée

## Configuration de référence

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

Après édition:

```bash
sshd -t && systemctl reload sshd
```

> [!tip]
> Garde une session root/console ouverte pendant le reload. Le bouton **Copier** du bloc de code évite les fautes de frappe en prod.

## Tableau des contrôles

| Contrôle | Où vérifier | OK si |
|----------|-------------|-------|
| Auth par clé | `sshd -T \| grep passwordauthentication` | `no` |
| Root login | `sshd -T \| grep permitrootlogin` | `no` ou `prohibit-password` |
| Bannière | `/etc/issue.net` | Message légal présent |

> [!important]
> Un contrôle “OK sur un hôte” n’est pas un contrôle “OK sur le parc”. Automatise la preuve (Ansible, CIS, audit script).

## Pièges fréquents

1. Couper le mot de passe avant d’avoir déployé les clés.
2. Oublier les comptes de service avec shell.
3. Appliquer un template CIS sans fenêtre de rollback.

> [!caution]
> Sur un hyperviseur ou un pare-feu, un lockout SSH peut coûter une intervention site. Prévois toujours un chemin hors bande.

## Fin de runbook

Quand la checklist est verte, archive la date, l’opérateur, et le hash de la config dans le ticket de change. Le prochain article relie ce type de contenu au reste de la base DailyOps (liens, notes, CTA).
