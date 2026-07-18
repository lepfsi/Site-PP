---
title: "Pourquoi la redondance « sur le papier » ne marche souvent pas en vrai"
excerpt: "Analyse des écarts entre la redondance théorique et la réalité opérationnelle : tests manquants, configurations obsolètes, points de défaillance cachés."
---

# Pourquoi la redondance « sur le papier » ne marche souvent pas en vrai

Beaucoup d’entreprises investissent dans la redondance. On déploie deux firewalls, deux liens internet, deux tunnels VPN, deux contrôleurs de domaine… Et sur le schéma, tout semble solide.

Pourtant, lorsqu’un incident réel survient, on découvre souvent que **la redondance n’a pas fonctionné** comme prévu.

Pourquoi ? Parce qu’en pratique, beaucoup de ces redondances restent **théoriques**. Elles existent sur le papier, mais pas dans les faits.

## Le problème le plus fréquent : la redondance jamais testée

C’est le cas le plus courant.

On configure une bascule automatique, on place deux équipements « en haute disponibilité », et on considère le sujet réglé.

Sauf qu’on n’a **jamais validé** ce scénario en conditions réelles.

> [!warning]
> Une redondance qui n’a jamais été testée n’est pas de la redondance. C’est juste de la fausse sécurité.

Résultat :
- La configuration de bascule est incomplète ou obsolète
- Les deux équipements n’ont pas la même version logicielle
- Les règles de firewall ne sont pas correctement synchronisées
- Personne ne sait vraiment comment forcer la bascule manuellement en cas de besoin

## Les autres formes de redondance qui échouent

### 1. La redondance « à moitié faite »

On déploie deux firewalls, mais un seul gère vraiment le trafic critique.
On dispose de deux liens internet, mais l’un d’eux est trop lent ou mal configuré pour assurer le relais correctement.

### 2. La redondance qui cache un autre single point of failure

On a deux firewalls en cluster… mais ils dépendent du même switch cœur.
On a deux tunnels VPN… mais ils transitent par le même opérateur.

Dans ce cas, on n’a pas vraiment supprimé le point de fragilité : on l’a simplement déplacé.

### 3. La redondance qui n’est plus à jour

Les environnements évoluent constamment. On ajoute des applications, on modifie des flux. Mais la configuration de redondance, elle, n’est pas mise à jour. Après quelques mois, la bascule théorique ne fonctionne plus correctement.

### 4. La redondance qui repose sur des procédures non documentées

Même quand la technique est irréprochable, si personne ne maîtrise la procédure de bascule en urgence ou si celle-ci n’est pas formalisée, la redondance reste vulnérable.

> [!important]
> La redondance n’est pas seulement une question d’équipements. C’est aussi une question de processus et de connaissance.

## Comment faire une redondance qui tient vraiment la route ?

Voici ce qui fait la différence entre une redondance « sur le papier » et une redondance qui fonctionne vraiment :

- Tester régulièrement les scénarios de bascule (même partiellement)
- Documenter clairement les procédures de bascule manuelle
- Vérifier que les deux côtés sont bien synchronisés (versions, configurations, règles)
- Identifier les vrais points de fragilité restants (même s’ils sont moins évidents)
- Former plusieurs personnes au fonctionnement de la redondance

> [!tip]
> La meilleure façon de savoir si ta redondance fonctionne vraiment ? La tester **avant** d’en avoir besoin.

---

Beaucoup d’entreprises s’estiment bien protégées parce qu’elles ont « mis de la redondance ». Mais la vraie question n’est pas « est-ce qu’on a déployé deux équipements ? », mais plutôt :

**En cas de problème réel, sommes-nous capables de basculer rapidement et sans impact majeur ?**

C’est souvent au moment critique qu’on découvre que la redondance n’était pas aussi robuste qu’on l’imaginait.
