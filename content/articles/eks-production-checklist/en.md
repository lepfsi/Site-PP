---
title: EKS Production Cluster — Pre-Go-Live Checklist
excerpt: Control plane hardening, node group sizing, IRSA, network policies, and observability gates before production traffic.
---

## Context

An EKS cluster without guardrails becomes a cost and security incident waiting to happen. Use this **pre-go-live checklist** before routing production traffic.

---

## Architecture Gates

| Area | Requirement |
|------|-------------|
| Control plane | Private endpoint + authorized networks |
| Nodes | Managed node groups, separate prod/staging |
| IAM | IRSA per workload, no long-lived keys |
| Network | CNI policies, VPC flow logs enabled |

---

## Control Plane

```bash
aws eks update-cluster-config \
  --name prod-eks \
  --resources-vpc-config endpointPublicAccess=false,endpointPrivateAccess=true
```

- Enable control plane logging: `api`, `audit`, `authenticator`
- Restrict `system:masters` to break-glass SSO role only

---

## Node Groups

```yaml
# Minimum production settings
amiType: AL2_x86_64
diskSize: 80
scalingConfig:
  minSize: 3
  maxSize: 12
  desiredSize: 3
labels:
  env: production
taints: []  # use taints only with documented scheduling policy
```

---

## IRSA Pattern

```text
ServiceAccount → OIDC provider → IAM role (least privilege)
No AWS_ACCESS_KEY_ID in pods. Ever.
```

---

## Observability Minimum

- [ ] Metrics: Prometheus or AMP + Grafana dashboards
- [ ] Logs: Fluent Bit → CloudWatch/OpenSearch
- [ ] Alerts: API server 5xx, node NotReady, pod crash loop
- [ ] Traces: optional but recommended for microservices

---

## Security Checklist

- [ ] `Pod Security` / admission policies enforced
- [ ] NetworkPolicy default-deny per namespace
- [ ] Secrets via External Secrets Operator or SSM
- [ ] Image scanning in CI (Trivy/ECR scan)

---

## Key Takeaways

- **Private API endpoint** is non-negotiable for production
- Start with 3 nodes across AZs — single-AZ clusters fail the wrong way
- IRSA setup once, correctly, beats rotating access keys monthly