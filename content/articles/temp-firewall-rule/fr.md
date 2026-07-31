---
title: "Il n'y a rien de plus permanent qu'une règle firewall temporaire"
excerpt: "Cette règle firewall devait rester en place cinq minutes. Plusieurs mois plus tard, elle est toujours active… et elle élargit silencieusement votre surface d'attaque."
updated: "2026-07-31"
---

Vendredi soir.

Une application de production ne parvient plus à communiquer avec un service distant.

Les utilisateurs sont bloqués.

La direction attend un rétablissement rapide.

Un administrateur ouvre le firewall, ajoute une règle temporaire et annonce :

> *« On la supprimera après la fenêtre de maintenance. »*

Tout le monde acquiesce.

Personne ne le fait.

Quelques mois plus tard, la règle est toujours là.

Et plus personne ne se souvient pourquoi elle existe.

---

## Les changements temporaires ont une fâcheuse tendance à devenir permanents

Toutes les équipes d'exploitation ont déjà vécu cette situation.

Une urgence.

Une migration.

Une intervention d'un fournisseur.

Un incident de production.

La solution semble anodine :

- autoriser un flux **Any → Any** pendant quelques minutes ;
- ouvrir temporairement un port réseau ;
- désactiver l'inspection IPS le temps d'un test ;
- contourner une politique de sécurité pendant une maintenance.

L'intention est toujours la même :

> *« C'est seulement temporaire. »*

Mais les environnements de production ont une excellente mémoire.

Les règles firewall temporaires survivent souvent bien après que l'incident qui les a justifiées a été oublié.

> [!important]
> Une règle firewall temporaire devrait toujours avoir une date d'expiration avant même d'être créée.

---

## Le firewall n'est pas le problème

Les firewalls ne créent pas de mauvaises règles.

Les humains, oui.

Au fil du temps, les exceptions s'accumulent.

Une règle pour une migration.

Une autre pour un prestataire.

Une troisième pour un environnement de test.

Une quatrième parce que *« la supprimer pourrait casser quelque chose »*.

Progressivement, plus personne ne sait quelles règles sont encore réellement nécessaires.

Le firewall cesse alors d'être uniquement un mécanisme de sécurité.

Il devient un historique de décisions dont personne ne maîtrise plus le contexte.

---

## Le coût des règles oubliées

Une règle firewall oubliée provoque rarement un incident immédiat.

C'est précisément pour cette raison qu'elle reste en place.

Pourtant, chaque règle inutile augmente la surface d'attaque.

Elle peut notamment :

- exposer des services qui n'existent plus ;
- autoriser des communications devenues inutiles ;
- contourner les politiques de segmentation réseau ;
- affaiblir une architecture Zero Trust ;
- créer des chemins inattendus pour des mouvements latéraux.

Un attaquant ne s'intéresse pas au caractère temporaire d'une règle.

Si elle est toujours active, elle peut être exploitée.

---

## « Ne la supprimez pas… au cas où »

C'est probablement la phrase la plus dangereuse dans la gestion d'un firewall.

Personne n'ose supprimer une ancienne règle parce que personne ne sait réellement ce qu'elle protège.

La peur remplace la certitude.

Au lieu de vérifier son utilité, on préfère la laisser.

Les mois deviennent des années.

Et le firewall finit par contenir des centaines, voire des milliers de règles dont personne ne comprend réellement la raison d'être.

La sécurité se transforme progressivement en dette technique.

---

## Un firewall doit être régulièrement audité

Un firewall n'est pas un équipement que l'on configure une fois pour toutes.

C'est un contrôle de sécurité vivant.

Chaque revue de règles devrait permettre de répondre à des questions simples :

- Pourquoi cette règle existe-t-elle ?
- Qui l'a demandée ?
- Quand a-t-elle été créée ?
- L'application concernée est-elle toujours en production ?
- Cette règle est-elle encore utilisée ?
- Peut-elle être davantage restreinte ?
- Peut-elle être supprimée sans risque ?

Si personne ne peut répondre à ces questions, cette règle mérite d'être examinée.

> [!tip]
> La meilleure règle firewall est celle que vous n'avez jamais eu besoin de créer. La deuxième meilleure est celle que vous supprimez dès qu'elle n'est plus nécessaire.

---

## Toute exception doit avoir une stratégie de sortie

Les changements d'urgence sont parfois inévitables.

Mais chaque exception temporaire devrait inclure son propre plan de suppression.

Avant de créer une règle temporaire, définissez :

- pourquoi elle est nécessaire ;
- qui l'a approuvée ;
- quand elle devra être supprimée ;
- qui sera responsable de sa suppression ;
- comment sa suppression sera validée.

Sans stratégie de sortie, *« temporaire »* signifie simplement *« oublié plus tard »*.

---

## L'automatisation peut éviter les exceptions permanentes

Les firewalls modernes et les plateformes de gestion des changements proposent de plus en plus de fonctionnalités comme :

- des dates d'expiration automatiques des règles ;
- des notifications avant expiration ;
- la détection des règles inutilisées ;
- la recertification périodique des politiques ;
- des workflows d'approbation ;
- le versioning des configurations.

Ces fonctionnalités ne remplacent pas une bonne discipline opérationnelle.

Elles l'accompagnent.

La technologie doit aider les équipes à ne pas oublier ce que les humains finissent inévitablement par oublier.

---

## La sécurité consiste aussi à supprimer

Beaucoup d'organisations investissent leur énergie à ajouter de nouveaux mécanismes de sécurité.

Beaucoup moins consacrent du temps à supprimer ceux qui ne servent plus.

Pourtant, une politique firewall efficace ne se mesure pas au nombre de règles configurées.

Elle se mesure à leur pertinence.

Une politique propre est plus facile à :

- auditer ;
- comprendre ;
- dépanner ;
- optimiser ;
- sécuriser.

Supprimer une règle inutile est souvent aussi bénéfique que créer la bonne.

> [!warning]
> Chaque règle firewall devrait avoir une justification métier clairement identifiée. Si cette justification disparaît, la règle devrait disparaître avec elle.

---

## Une simple question qui change tout

Avant de clôturer toute demande de modification du firewall, posez une dernière question :

> **« Qui supprimera cette règle temporaire… et quand ? »**

Si personne n'a de réponse précise...

Il est probable que cette règle ne soit déjà plus vraiment temporaire.

---

:::takeaways
- Les règles firewall temporaires deviennent souvent permanentes faute de suivi.
- Chaque règle inutile augmente la surface d'attaque de l'organisation.
- Toute exception devrait inclure une date d'expiration et une procédure de suppression.
- Les revues régulières des règles firewall réduisent la dette technique et améliorent la sécurité.
- Une politique firewall simple et maîtrisée est plus efficace qu'une politique complexe et mal comprise.
:::

## Conclusion

Un firewall ne devient généralement pas vulnérable du jour au lendemain.

Il le devient progressivement.

Une exception oubliée.

Une règle jamais supprimée.

Un port laissé ouvert « provisoirement ».

Puis un autre.

Et encore un.

Au fil des années, la politique de sécurité devient plus complexe, plus permissive et plus difficile à maîtriser.

Car en cybersécurité…

Il n'y a rien de plus permanent qu'une règle firewall temporaire.

:::see-also
- [L'espoir n'est pas un plan de retour arrière](/articles/hope-is-not-a-rollback-strategy) : pourquoi chaque déploiement doit prévoir une stratégie de rollback.
- [Les silos de connaissances : le point de défaillance unique le plus dangereux en informatique](/articles/knowledge-silos-single-point-of-failure) : partager les connaissances est un enjeu de résilience.
- [La dérive de configuration : le tueur silencieux des infrastructures](/articles/configuration-drift-the-silent-infrastructure-killer) : comprendre comment les changements non documentés fragilisent progressivement un système.
:::

:::cta
title: Renforcez vos pratiques de sécurité réseau
body: Découvrez nos retours d'expérience, guides techniques et bonnes pratiques sur les firewalls, la sécurité réseau et l'exploitation des infrastructures en production.
href: /articles
label: Explorer les articles
:::