---
title: "L'espoir n'est pas une stratégie de rollback : chaque déploiement doit avoir un plan de sortie"
excerpt: "Un plan de déploiement vous fait entrer en production. Un plan de rollback vous en sort quand ça dérape. Pourquoi chaque changement doit inclure une stratégie de reprise testée."
updated: "2026-07-31"
---

L'infrastructure moderne a rendu les déploiements plus rapides que jamais. Pipelines CI/CD, Infrastructure as Code, GitOps et tests automatisés permettent de livrer plusieurs fois par jour.

Pourtant, malgré ces progrès, une erreur continue de provoquer des pannes évitables :

> **Les déploiements sont soigneusement planifiés. Les rollbacks, non.**

Trop de fenêtres de maintenance se terminent par la même phrase :

> *« Si quelque chose se passe mal, on s'en sortira. »*

Ce n'est pas une stratégie de rollback.

C'est de l'espoir.

Et l'espoir n'a jamais restauré un service de production.

---

## Chaque déploiement a deux plans

Un plan de déploiement répond à une question :

> **Comment introduire le changement ?**

Un plan de rollback en répond à une autre :

> **Comment récupérer si le changement échoue ?**

Les deux sont tout aussi importants.

Malheureusement, beaucoup d'organisations passent des heures à préparer le déploiement et quelques secondes à la reprise.

Le résultat est prévisible :

- Des procédures de déploiement qui fonctionnent
- Des procédures de reprise qui échouent
- Des indisponibilités prolongées
- Un stress opérationnel élevé

> [!important]
> Un déploiement n'est réussi que si le service peut être restauré rapidement si nécessaire.

---

## La stratégie de rollback la plus dangereuse

Demandez à un ingénieur pendant une maintenance :

*« Quelle est la procédure de rollback ? »*

Trop souvent, la réponse ressemble à :

- « On réinstallera la version précédente. »
- « On restaurera la sauvegarde si besoin. »
- « On redéploiera l'ancien conteneur. »
- « On a encore la config d'hier. »

Aucune de ces réponses n'est un plan de rollback.

Ce sont des suppositions.

Un vrai plan est documenté, testé, chronométré et validé avant la production.

---

## Pourquoi les rollbacks deviennent difficiles

Beaucoup d'incidents ne viennent pas du déploiement lui-même.

Ils viennent de l'impossibilité de revenir à l'état précédent.

Raisons fréquentes :

| Problème | Impact opérationnel |
|----------|---------------------|
| Changements de schéma BDD | L'ancienne version de l'application ne fonctionne plus |
| Configuration écrasée | Les réglages d'origine ne sont plus récupérables |
| Sauvegardes manquantes | Aucun point de reprise connu |
| Changements manuels en prod | L'état précédent est inconnu |
| Infrastructure recréée | Les ressources ne se restaurent pas vite |
| Propagation DNS | La reprise prend plus longtemps que prévu |

Dans ces cas, revenir en arrière devient bien plus compliqué que déployer.

---

## Le coût d'un rollback jamais testé

Imaginez une montée de version firmware sur un pare-feu.

La mise à jour s'installe correctement.

Cinq minutes plus tard :

- Les utilisateurs VPN ne se connectent plus.
- Le routage se comporte de façon inattendue.
- La supervision envoie des alertes.

La direction pose une question simple :

> **Peut-on revenir en arrière ?**

L'équipe réalise que :

- l'image firmware précédente est introuvable,
- la compatibilité de configuration est incertaine,
- personne ne se souvient de la procédure de downgrade,
- la doc de maintenance ne contient aucune section rollback.

Le déploiement a pris quinze minutes.

La reprise en prend trois heures.

La panne n'a pas été causée par la mise à jour.

Elle a été causée par une mauvaise gestion du changement.

> [!warning]
> Une procédure de rollback jamais testée doit être considérée comme peu fiable.

---

## Un bon plan de rollback, c'est plus qu'une sauvegarde

Beaucoup d'équipes pensent que les backups suffisent.

Ce n'est pas le cas.

Une stratégie complète doit définir :

- Le déclencheur exact de la reprise.
- La personne autorisée à lancer le rollback.
- La procédure de récupération.
- La durée de reprise attendue.
- Les étapes de validation après restauration.
- Le processus de communication pendant le rollback.
- Les critères de succès après reprise.

Sans ces éléments, la récupération devient de l'improvisation.

---

## Questions que tout comité de changement devrait poser

Avant d'approuver un déploiement en production, vérifiez que ces questions ont une réponse :

- [ ] Quelles conditions déclenchent un rollback ?
- [ ] L'ancienne version peut-elle encore tourner correctement ?
- [ ] La procédure de rollback a-t-elle été testée ?
- [ ] Combien de temps prendra la reprise ?
- [ ] Les sauvegardes sont-elles vérifiées ?
- [ ] Des snapshots de configuration sont-ils disponibles ?
- [ ] Le processus de reprise est-il documenté ?
- [ ] Qui prend la décision de rollback ?

Si une de ces questions n'a pas de réponse claire, le déploiement n'est peut-être pas prêt.

---

## Des déploiements rapides ne compensent pas une mauvaise gestion du changement

L'automatisation a réduit le temps de déploiement.

Elle ne compense pas une planification opérationnelle faible.

On célèbre souvent :

- des déploiements en trois minutes,
- des pipelines entièrement automatisés,
- des releases sans intervention.

Tout cela compte peu si la reprise demande des heures d'intervention manuelle.

La maturité opérationnelle ne se mesure pas à la vitesse de déploiement.

Elle se mesure à la vitesse de reprise.

---

## La reprise doit s'entraîner

Les pilotes répètent les procédures d'urgence.

Les pompiers répètent les secours.

Les équipes PRA font des exercices réguliers.

Les rollbacks en production méritent la même discipline.

Tester la reprise révèle les problèmes avant que les clients ne les subissent.

Exercices typiques :

- restauration de snapshots de configuration,
- downgrade firmware,
- récupération de machines virtuelles,
- restauration de base de données,
- rollback DNS,
- retour à une version applicative antérieure.

La reprise ne doit jamais être faite pour la première fois lors d'un vrai incident.

---

:::takeaways
- Chaque déploiement exige un plan de rollback documenté.
- Les procédures de reprise doivent être testées avant les changements en production.
- Les sauvegardes seules ne constituent pas une stratégie de rollback.
- Des déploiements rapides n'ont aucun sens si la reprise est lente.
- La maturité opérationnelle se mesure à la rapidité de restauration des services.
:::

## En conclusion

Tout ingénieur aime livrer de nouvelles fonctionnalités.

Peu aiment planifier comment les annuler.

Pourtant, les organisations les plus disponibles partagent une habitude :

Elles traitent le rollback comme partie intégrante du déploiement — pas comme une réflexion après coup.

En production, le succès ne se mesure pas à la vitesse à laquelle vous déployez.

Il se mesure à la vitesse à laquelle vous pouvez récupérer.

:::see-also
- [Déploiements blue-green](/articles/blue-green-deployments-explained) : réduire le risque avec des environnements parallèles.
- [Dérive de configuration](/articles/configuration-drift-the-silent-infrastructure-killer) : pourquoi les changements non documentés compliquent la reprise.
- [Tests de reprise après sinistre](/articles/disaster-recovery-testing-backups) : valider la récupération avant l'incident.
:::

:::cta
title: Renforcez votre confiance opérationnelle
body: Parcourez d'autres articles terrain, guides de dépannage et bonnes pratiques d'infrastructure issus de productions réelles.
href: /articles
label: Voir plus d'articles
:::
