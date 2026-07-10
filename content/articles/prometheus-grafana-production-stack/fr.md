---
title: "Prometheus & Grafana — stack d'observabilité production"
excerpt: "Pipeline métriques minimum viable : architecture scrape, signaux RED/USE, alerting SLO et routage astreinte sans fatigue d'alertes."
---

## Contexte

L'observabilité n'est pas une galerie de dashboards. Les équipes production ont besoin de **signaux actionnables** : quoi est cassé, pour qui, et si le budget d'erreur fond. Ce guide définit une **stack minimum viable** Prometheus + Grafana — déployable sur bare metal, VMs ou Kubernetes.

---

## Garde-fous architecture

| Couche | Composant | Rôle |
|--------|-----------|------|
| Collecte | Prometheus / Agent | Pull métriques, évaluation règles |
| Stockage | TSDB Prometheus (ou Mimir/AMP) | Rétention courte + remote write si besoin |
| Visualisation | Grafana | Dashboards, vues SLO, home astreinte |
| Routage | Alertmanager | Grouper, inhiber, router PagerDuty/Slack |
| Logs (optionnel) | Loki / Fluent Bit | Corréler pics métriques et lignes de logs |

```text
exporters → Prometheus → Grafana (dashboards)
                ↓
           Alertmanager → astreinte
```

---

## Quoi scraper en premier

Prioriser les métriques **symptômes** avant les graphes « nice to have ».

### USE (infrastructure)

- **Utilization** — CPU, mémoire, disque, saturation réseau
- **Saturation** — run queue, disk await, drops NIC
- **Errors** — erreurs interface, RAID dégradé, kube NodeNotReady

### RED (services)

- **Rate** — requêtes par seconde
- **Errors** — ratio 5xx ou jobs en échec
- **Duration** — latence p95/p99

```yaml
# Exemple job scrape — node exporter
scrape_configs:
  - job_name: node
    static_configs:
      - targets: ['node-exporter:9100']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
```

---

## Bases SLO

Définir un SLO par parcours utilisateur critique — pas par microservice vanity.

| Terme | Signification |
|-------|---------------|
| SLI | Ce que vous mesurez (ex. requêtes API OK / total) |
| SLO | Cible sur fenêtre (ex. 99,9 % sur 30 jours) |
| Error budget | Événements « mauvais » tolérés avant gel des features |

**Alerter sur la consommation du budget**, pas sur chaque seuil :

```text
burn rapide  → page astreinte (budget épuisé en heures)
burn lent    → ticket équipe plateforme (tendance sur jours)
```

---

## Règles d'alerting (exemples)

```yaml
groups:
  - name: platform
    rules:
      - alert: NodeNotReady
        expr: kube_node_status_condition{condition="Ready",status="true"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Node {{ $labels.node }} not ready"

      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          / sum(rate(http_requests_total[5m])) > 0.05
        for: 10m
        labels:
          severity: warning
```

---

## Routage Alertmanager

```text
critical + env=production → PagerDuty
warning                   → Slack #platform-alerts
info                      → ticket uniquement (pas de page)
```

Règles anti-fatigue :

- [ ] `group_by: [alertname, cluster]` — une notif par incident
- [ ] `group_wait` / `group_interval` — regrouper les fires liés
- [ ] Inhibition : supprimer alertes disque si le node est down
- [ ] Runbook dans chaque annotation (`runbook_url`)

---

## Dashboards Grafana

Set minimum NOC/SRE :

1. **Santé plateforme** — nodes up, échecs scrape, lag TSDB
2. **RED service** — rate, errors, duration par API tier-1
3. **Vue SLO** — budget d'erreur restant par produit
4. **Home astreinte** — alertes ouvertes + top contributeurs burn

Éviter la sprawl : si personne n'ouvre un dashboard en 90 jours, l'archiver.

---

## Checklist de validation

- [ ] Chaque hôte prod a des métriques node (ou équivalent)
- [ ] Alertes `up == 0` en moins de 2 minutes
- [ ] Au moins un SLO par service face client
- [ ] Route Alertmanager testée (fire drill trimestriel)
- [ ] Dashboards < 3 s sur laptop astreinte

---

## Points clés

- **Métriques avant logs** pour pager — les logs servent l'investigation
- L'alerting piloté SLO réduit plus de bruit que le tuning de seuils arbitraires
- L'observabilité est une dette opérationnelle sans runbooks et ownership clairs