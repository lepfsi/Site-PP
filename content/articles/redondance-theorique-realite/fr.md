---
title: "Pourquoi la redondance « sur le papier » ne marche souvent pas en vrai"
excerpt: "Analyse des écarts entre la redondance théorique et la réalité opérationnelle : tests manquants, configurations obsolètes, points de défaillance cachés."
---

# Pourquoi la redondance « sur le papier » ne marche souvent pas en vrai

Beaucoup d’entreprises investissent dans la redondance. On déploie deux firewalls, deux liens internet, deux tunnels VPN, deux contrôleurs de domaine… Et sur le schéma, tout semble parfaitement solide.

Pourtant, lorsqu’un incident réel survient, on découvre trop souvent que **la redondance n’a pas joué son rôle** comme prévu.

Pourquoi ? Parce qu’en pratique, beaucoup de ces redondances restent **purement théoriques**. Elles existent sur le papier, mais pas dans les faits.

## Le problème le plus fréquent : la redondance jamais testée

C’est le cas de figure le plus répandu.

On configure une bascule automatique, on place deux équipements « en haute disponibilité », et on considère l’affaire réglée.

Sauf qu’on n’a **jamais validé** ce scénario dans des conditions réelles.

<Callout type="warning">
Une redondance non testée n’est pas une redondance. C’est une illusion de sécurité.
</Callout>

Résultat :
- La configuration de bascule est incomplète ou obsolète
- Les deux équipements n’exécutent pas la même version
- Les règles de firewall ne sont pas correctement synchronisées
- Personne ne maîtrise la procédure de bascule manuelle

## Les autres formes de redondance qui échouent

### 1. La redondance « à moitié faite »

On déploie deux firewalls, mais un seul traite effectivement le trafic critique.
On dispose de deux liens internet, mais le second est trop lent ou mal configuré pour assurer une reprise efficace.

### 2. La redondance qui masquent un autre single point of failure

On a deux firewalls en cluster… qui dépendent du même switch cœur.
On a deux tunnels VPN… qui transitent par le même opérateur.

Dans ces cas, on n’a pas éliminé le point de fragilité : on l’a simplement déplacé.

### 3. La redondance qui n’est plus à jour

Les environnements évoluent constamment. On ajoute des applications, on modifie des flux. Mais la configuration de redondance, elle, n’est pas mise à jour. Après quelques mois, la bascule théorique ne fonctionne plus.

### 4. La redondance qui repose sur des procédures non documentées

Même avec une infrastructure technique irréprochable, si aucune personne ne sait activer la bascule en urgence, la redondance reste vulnérable.

<Callout type="important">
La redondance ne se limite pas à une question d’équipements. C’est aussi une question de processus et de savoir-faire.
</Callout>

## Comment faire une redondance qui tient vraiment ?

Voici les éléments qui font la différence :

- Tester régulièrement les scénarios de bascule (même partiellement)
- Documenter clairement les procédures de bascule manuelle
- Vérifier que les deux côtés sont bien synchronisés (versions, configurations)
- Identifier les points de fragilité résiduels
- Former plusieurs personnes au fonctionnement de la redondance

<Callout type="tip">
La meilleure méthode pour vérifier que votre redondance fonctionne ? La tester **avant** d’en avoir besoin.
</Callout>

---

Beaucoup d’entreprises s’estiment bien protégées parce qu’elles ont « implémenté de la redondance ». Pourtant, la vraie question n’est pas « avons-nous déployé deux équipements ? », mais plutôt :

**En cas de problème réel, sommes-nous capables de basculer rapidement et sans impact majeur ?**

C’est souvent au moment critique qu’on réalise que la redondance n’était pas aussi robuste qu’on l’imaginait.
