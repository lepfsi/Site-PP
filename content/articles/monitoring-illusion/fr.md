---
title: "Tout était au vert. Tout était en panne."
excerpt: "Les tableaux de bord indiquaient que tout fonctionnait. Pourtant, les utilisateurs étaient à l'arrêt. Pourquoi un monitoring 'vert' ne signifie pas toujours que vos services sont réellement disponibles."
updated: "2026-07-31"
---

Il est 9 h 02.

Le tableau de bord de supervision est rassurant.

Aucune alerte critique.

Les serveurs répondent au ping.

Le processeur est peu sollicité.

La mémoire est stable.

Les services sont tous marqués **Running**.

Tout est au vert.

Pendant ce temps, le téléphone du support ne cesse de sonner.

Les utilisateurs ne peuvent plus se connecter.

Les applications mettent plusieurs minutes à répondre.

Certaines transactions n'aboutissent plus.

Pour les équipes métiers, la production est tout simplement arrêtée.

Le monitoring ne s'est pas trompé.

Il surveillait simplement les mauvaises choses.

---

## Une infrastructure en bonne santé n'est pas forcément un service disponible

L'une des plus grandes illusions en exploitation informatique consiste à croire que la santé de l'infrastructure reflète automatiquement la santé du service.

Ce n'est pas le cas.

Un serveur peut être :

- allumé ;
- joignable sur le réseau ;
- peu chargé ;
- disposer de suffisamment de mémoire ;
- exécuter tous ses services normalement...

...tout en hébergeant une application totalement inutilisable.

Les métriques système indiquent que **les équipements fonctionnent**.

Les utilisateurs, eux, veulent savoir si **leur travail peut être effectué**.

> [!important]
> La disponibilité d'une infrastructure ne garantit jamais la disponibilité du service qu'elle héberge.

---

## Le tableau de bord était parfait…

Prenons un exemple courant.

Votre plateforme de supervision affiche :

- Ping : OK
- CPU : 22 %
- Mémoire : 48 %
- Disque : 64 %
- Base de données : active
- Serveur Web : actif

Tout semble parfaitement normal.

Pourtant, les utilisateurs signalent :

- impossible de s'authentifier ;
- les pages restent bloquées au chargement ;
- les commandes ne sont plus enregistrées ;
- les appels API expirent.

Le tableau de bord est entièrement vert.

L'entreprise, elle, est complètement paralysée.

---

## Nous surveillons souvent ce qui est facile à mesurer

La majorité des solutions de supervision historiques se concentrent sur les composants techniques.

Elles mesurent notamment :

- l'utilisation CPU ;
- la mémoire ;
- l'espace disque ;
- les interfaces réseau ;
- la latence ;
- l'état des services.

Ces indicateurs sont indispensables.

Mais ils répondent uniquement à une question :

> **Les systèmes fonctionnent-ils ?**

Ils ne répondent pas à la question la plus importante :

> **Les utilisateurs peuvent-ils réellement travailler ?**

---

## Les utilisateurs ne voient jamais vos serveurs

Aucun utilisateur n'appelle le support pour dire :

> *« Le processeur du serveur atteint 95 %. »*

En revanche, il dira :

> *« Je ne peux plus envoyer mes commandes. »*

Le service comptable ne dira jamais :

> *« Le processus SQL est actif. »*

Il dira plutôt :

> *« Impossible de générer les factures. »*

Les équipes d'exploitation tombent parfois dans le piège de superviser uniquement la technique.

Or ce qui compte réellement, c'est l'expérience utilisateur.

---

## Surveiller le mauvais niveau

De nombreux incidents majeurs passent inaperçus parce que le monitoring s'arrête trop tôt.

Quelques exemples :

| Ce que le monitoring indique | Ce qui se passe réellement |
|------------------------------|----------------------------|
| Le serveur répond au ping | Les utilisateurs ne peuvent plus se connecter |
| Le serveur Web fonctionne | Le service d'authentification est indisponible |
| La base de données est active | Toutes les requêtes expirent |
| Le VPN est connecté | Les applications restent inaccessibles |
| Le firewall est opérationnel | Le trafic métier est bloqué |

Tous les composants techniques peuvent sembler en parfaite santé.

Le service, lui, est déjà indisponible.

---

## Le monitoring synthétique change la perspective

Les équipes d'exploitation les plus matures ne surveillent plus uniquement les serveurs.

Elles surveillent les parcours utilisateurs.

Par exemple :

- un utilisateur peut-il ouvrir une session ?
- une commande peut-elle être enregistrée ?
- une facture peut-elle être générée ?
- une requête API peut-elle être exécutée ?
- un utilisateur VPN peut-il réellement accéder à son application métier ?

Ces tests reproduisent les actions réelles des utilisateurs.

S'ils échouent, alors le service est indisponible…

…même si tous les indicateurs techniques restent au vert.

> [!tip]
> Le meilleur monitoring est souvent celui qui se comporte comme un utilisateur, et non comme un serveur.

---

## Un tableau de bord doit raconter une histoire

Un bon tableau de bord ne cherche pas à afficher des centaines de graphiques.

Il doit répondre rapidement à quelques questions essentielles :

- Le service est-il disponible ?
- Les utilisateurs peuvent-ils accomplir leurs tâches ?
- Qu'est-ce qui a changé récemment ?
- Où se situe le blocage ?
- Quelle investigation faut-il lancer en priorité ?

Ajouter davantage de graphiques n'améliore pas forcément la visibilité.

Cela crée parfois simplement davantage de bruit.

---

## Mesurez ce qui compte vraiment

Une stratégie de supervision efficace combine plusieurs niveaux d'observation :

- la santé de l'infrastructure ;
- les performances applicatives ;
- la connectivité réseau ;
- l'expérience utilisateur ;
- les transactions métier ;
- les événements de sécurité.

Aucun de ces éléments ne suffit à lui seul.

C'est leur combinaison qui fournit une vision fidèle de la réalité.

Ignorer l'un de ces niveaux crée inévitablement des angles morts.

Et les angles morts finissent toujours par devenir des incidents.

> [!warning]
> Un tableau de bord entièrement vert ne devrait jamais vous conduire à ignorer ce que rapportent les utilisateurs.

---

:::takeaways
- Une infrastructure en bonne santé ne garantit pas qu'un service soit réellement disponible.
- Les métriques techniques doivent être complétées par une supervision de l'expérience utilisateur.
- Le monitoring synthétique permet de détecter des problèmes invisibles pour les indicateurs classiques.
- Un tableau de bord doit aider à comprendre l'état du service, pas uniquement celui des serveurs.
- Lorsque les utilisateurs signalent un problème, leurs observations doivent toujours être prises au sérieux, même si tous les voyants sont au vert.
:::

## Conclusion

Le véritable objectif du monitoring n'est pas de démontrer que les serveurs fonctionnent.

Il est de démontrer que l'entreprise peut continuer à fonctionner.

Les utilisateurs ne se préoccupent ni de l'utilisation CPU, ni de la mémoire disponible, ni du statut d'un service Windows.

Ils veulent simplement pouvoir travailler.

Et parfois…

Tout est au vert.

Mais tout est en panne.

:::see-also
- [L'espoir n'est pas un plan de retour arrière](/articles/hope-is-not-a-rollback-strategy) : pourquoi chaque déploiement doit prévoir une stratégie de rollback.
- [Les silos de connaissances : le point de défaillance unique le plus dangereux en informatique](/articles/knowledge-silos-single-point-of-failure) : partager les connaissances est essentiel à la résilience opérationnelle.
- [Il n'y a rien de plus permanent qu'une règle firewall temporaire](/articles/temporary-firewall-rule) : comment une exception provisoire peut devenir un risque durable.
:::

:::cta
title: Développez une supervision orientée métier
body: Découvrez nos retours d'expérience et nos bonnes pratiques sur le monitoring, l'observabilité, le dépannage et l'exploitation des infrastructures en production.
href: /articles
label: Explorer les articles
:::