---
title: "Triage SOC et SLA: classer les alertes sans noyer l'équipe"
excerpt: "Matrice P1-P3, critères de sévérité et callouts opérationnels pour un premier triage SOC réaliste."
---

## Pourquoi le triage est un métier

Sans critères clairs, tout devient « urgent ». L'analyste junior ouvre chaque ticket au même rythme, l'équipe sature, et les vrais incidents se noient dans le bruit.

Ce guide propose une **matrice simple** et des garde-fous terrain. Il n'impose pas un outil SIEM précis : l'idée est la discipline opérationnelle.

## Matrice de sévérité (exemple)

| Niveau | Critères | SLA triage |
|--------|----------|------------|
| P1 | Exfiltration active, compromission domain admin, ransomware en cours | 15 min |
| P2 | Mouvement latéral, beacon C2, compte privilégié suspect | 30 min |
| P3 | Malware mono-poste bloqué, tentative déjà stoppée, phishing non cliqué | 4 h |

> [!note]
> Adapte les délais à ta capacité réelle. Un SLA impossible à tenir est pire qu'un SLA honnête.

## Premier réflexe (5 minutes)

1. Confirmer que l'alerte n'est pas un faux positif évident (lab, scan planifié, compte de service connu).
2. Isoler le contexte : hôte, utilisateur, source/destination, heure.
3. Classer P1 / P2 / P3 avec la matrice ci-dessus.
4. Documenter la décision en une phrase dans le ticket.

> [!warning]
> Ne commence pas le deep dive forensics avant d'avoir classé la sévérité. Sinon tu perds le fil du SLA.

## Escalade

| Situation | Action |
|-----------|--------|
| P1 confirmé | Escaler immédiatement (lead SOC / incident commander) |
| P2 avec doute | Contenir le hôte si possible, puis escalade sous 30 min |
| P3 clair | Traitement en file standard, pas de page |

> [!tip]
> Un bon ticket d'escalade contient : quoi, où, depuis quand, impact suspecté, actions déjà prises. Pas un dump de logs bruts.

## Pièges fréquents

- Tout classer en P1 « pour être sûr »
- Attendre une confirmation à 100 % avant de contenir
- Oublier les comptes de service dans le scope
- Ne pas clôturer les P3 : la dette de tickets tue le moral

> [!important]
> La contenance précoce (isolation hôte, blocage IP, désactivation compte) n'est pas une punition. C'est un levier de temps pour analyser calmement.

## Lien avec DailyOps

Ce parcours s'aligne sur le lab **SOC: les 30 premiers jours** et le playbook incident. Utilise-le comme checklist pendant les shifts, pas comme théorie de slide deck.

> [!caution]
> Les SLA ci-dessus sont des **exemples**. Valide-les avec ton RSSI / lead SOC avant de les promettre en contrat.
