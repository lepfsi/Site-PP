---
title: Prometheus & Grafana — Production Observability Stack
excerpt: Minimum viable metrics pipeline: scrape architecture, RED/USE signals, SLO alerting, and on-call routing without alert fatigue.
---

## Context

Observability is not a dashboard gallery. Production teams need **actionable signals**: what is broken, for whom, and whether you are burning error budget. This guide defines a **minimum viable stack** with Prometheus and Grafana — deployable on bare metal, VMs, or Kubernetes.

---

## Architecture Gates

| Layer | Component | Role |
|-------|-----------|------|
| Collection | Prometheus / Agent | Pull metrics, rule evaluation |
| Storage | Prometheus TSDB (or Mimir/AMP) | Short retention + remote write if needed |
| Visualization | Grafana | Dashboards, SLO views, on-call home |
| Routing | Alertmanager | Group, inhibit, route to PagerDuty/Slack |
| Logs (optional) | Loki / Fluent Bit | Correlate metrics spikes with log lines |

```text
exporters → Prometheus → Grafana (dashboards)
                ↓
           Alertmanager → on-call
```

---

## What to Scrape First

Prioritize **symptom-based** metrics before nice-to-have graphs.

### USE (infrastructure)

- **Utilization** — CPU, memory, disk, network saturation
- **Saturation** — run queue, disk await, NIC drops
- **Errors** — interface errors, RAID degraded, kube NodeNotReady

### RED (services)

- **Rate** — requests per second
- **Errors** — 5xx ratio or failed jobs
- **Duration** — p95/p99 latency

```yaml
# Example scrape job — node exporter
scrape_configs:
  - job_name: node
    static_configs:
      - targets: ['node-exporter:9100']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
```

---

## SLO Basics

Define one SLO per critical user journey — not per microservice vanity metric.

| Term | Meaning |
|------|---------|
| SLI | What you measure (e.g. successful API requests / total) |
| SLO | Target over window (e.g. 99.9% over 30 days) |
| Error budget | Allowed bad events before freeze on features |

**Alert on budget burn**, not on every threshold twitch:

```text
fast burn  → page on-call (budget exhausted in hours)
slow burn  → ticket for platform team (trend over days)
```

---

## Alerting Rules (Examples)

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

## Alertmanager Routing

```text
critical + env=production → PagerDuty
warning                   → Slack #platform-alerts
info                      → ticket only (no page)
```

Anti-fatigue rules:

- [ ] `group_by: [alertname, cluster]` — one notification per incident
- [ ] `group_wait` / `group_interval` — batch related fires
- [ ] Inhibition: suppress disk alerts when node is down
- [ ] Runbooks linked in every annotation (`runbook_url`)

---

## Grafana Dashboards

Minimum set for NOC/SRE:

1. **Platform health** — nodes up, scrape failures, TSDB lag
2. **Service RED** — rate, errors, duration per tier-1 API
3. **SLO overview** — error budget remaining per product
4. **On-call home** — open alerts + top burn contributors

Avoid dashboard sprawl: if nobody opened it in 90 days, archive it.

---

## Validation Checklist

- [ ] Every production host has node (or equivalent) metrics
- [ ] Scrape `up == 0` alerts fire within 2 minutes
- [ ] At least one SLO defined per customer-facing service
- [ ] Alertmanager test route verified (fire drill quarterly)
- [ ] Dashboards load in < 3s for on-call laptop

---

## Key Takeaways

- **Metrics before logs** for paging — logs support investigation, not primary wake-ups
- SLO-driven alerting reduces noise more than tuning arbitrary thresholds
- Observability is operational debt if runbooks and ownership are missing