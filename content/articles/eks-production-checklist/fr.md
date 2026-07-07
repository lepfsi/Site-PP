---
title: Cluster EKS production — checklist pré-mise en prod
excerpt: Durcissement control plane, sizing node groups, IRSA, network policies et observabilité avant trafic production.
---

## Contexte

Un cluster EKS sans garde-fous devient un incident coût/sécurité en attente. Cette **checklist pré-go-live** s'applique avant tout trafic production.

---

## Portes architecture

| Domaine | Exigence |
|---------|----------|
| Control plane | Endpoint privé + réseaux autorisés |
| Nodes | Managed node groups, prod/staging séparés |
| IAM | IRSA par workload, pas de clés longue durée |
| Réseau | Policies CNI, VPC flow logs activés |

---

## Control plane

```bash
aws eks update-cluster-config \
  --name prod-eks \
  --resources-vpc-config endpointPublicAccess=false,endpointPrivateAccess=true
```

- Activer les logs control plane : `api`, `audit`, `authenticator`
- Restreindre `system:masters` au rôle SSO break-glass uniquement

---

## Node groups

```yaml
# Minimum production
amiType: AL2_x86_64
diskSize: 80
scalingConfig:
  minSize: 3
  maxSize: 12
  desiredSize: 3
labels:
  env: production
taints: []  # taints uniquement avec politique de scheduling documentée
```

---

## Pattern IRSA

```text
ServiceAccount → OIDC provider → rôle IAM (moindre privilège)
Pas d'AWS_ACCESS_KEY_ID dans les pods. Jamais.
```

---

## Observabilité minimum

- [ ] Métriques : Prometheus ou AMP + dashboards Grafana
- [ ] Logs : Fluent Bit → CloudWatch/OpenSearch
- [ ] Alertes : API server 5xx, node NotReady, pod crash loop
- [ ] Traces : optionnel mais recommandé pour microservices

---

## Checklist sécurité

- [ ] `Pod Security` / admission policies appliquées
- [ ] NetworkPolicy default-deny par namespace
- [ ] Secrets via External Secrets Operator ou SSM
- [ ] Scan images en CI (Trivy/ECR scan)

---

## Points clés

- **Endpoint API privé** non négociable en production
- Démarrer avec 3 nodes multi-AZ — les clusters mono-AZ tombent mal
- IRSA bien configuré une fois bat la rotation mensuelle de clés d'accès