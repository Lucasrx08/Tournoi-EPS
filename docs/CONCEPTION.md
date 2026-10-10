# Tournoi EPS · conception version 2.3

L’identité graphique suit un tableau sportif contemporain : bleu nuit #142338, orange #f47745, menthe #9adacf et fond clair #f3f5f7. Les couleurs des chasubles décrivent les équipes indépendamment de la palette de l’interface. Les dix activités utilisent des illustrations vectorielles propres à leurs équipements, avec un dessin et une palette partagés.

Barlow Condensed Bold donne leur caractère aux titres, numéros et scores. Outfit reste la police des noms, explications et contrôles. Les deux polices et leurs licences SIL OFL sont locales, sans requête externe à l’exécution. La typographie d’un choix ne varie pas selon son état de sélection. Les boutons principaux orange portent un texte bleu nuit.

L’accueil présente un titre éditorial, une grille régulière de dix activités et une liste compacte des tournois enregistrés. La préparation utilise un rail latéral avec l’activité et les neuf étapes ; sur mobile, il devient un repère compact de l’étape courante. L’aperçu des espaces de pratique dessine le nombre de terrains choisi. Chaque terrain associe une zone sombre pour la rencontre actuelle et une bande claire pour la prochaine rotation, sans doubler celle-ci ailleurs sur l’écran. Les tracés sont propres au sport.

## Parcours et identités

Activité → terrains et joueurs par côté → effectif → identités → formule → points → fin des rencontres → départ → validation. Les identités et les formules sont paginées lorsque nécessaire ; Retour et Continuer restent visibles sur ordinateur. Les listes longues ont leur propre zone de défilement.

Les sports collectifs disposent de chasubles nommées et dessinées. Un nom personnalisé peut remplacer le nom de couleur ; les changements de couleur ne l’écrasent pas. Les propositions répartissent le total en effectifs équilibrés, avec un écart maximal d’un élève. Elles ne créent aucun élève fictif dans les équipes. Les sports de raquettes conservent joueurs, duos, noms et imports individuels.

Le nom, le logo et l’identifiant stable sont indépendants. Les anciennes équipes nommées par défaut sont migrées vers des couleurs ; les noms personnalisés, scores et logos sont conservés. Les listes individuelles historiques ne sont plus exposées pour les sports collectifs mais restent dans le JSON de sauvegarde.

## Raquettes et points

Le modèle XLSX utilise « Nom et prénom » et « Numéro de terrain ». Les noms complets restent intacts et les colonnes NOM / Prénom sont encore acceptées. Les numéros sont validés (entiers, de 1 à 24, et dans la limite des terrains configurés). Les lignes sans nom sont ignorées. Les duos sont constitués au sein de leur groupe de terrain.

La répartition concerne les terrains de départ. Pour le championnat, les poules et les niveaux, une première rotation est choisie parmi les oppositions déjà générées, puis les oppositions restantes sont programmées ; aucun match ni identifiant n’est supprimé. Les autres formules conservent leur tableau et placent ses rencontres sur les terrains disponibles. Un déplacement manuel dans le brouillon est prioritaire pour la première rencontre lorsqu’une opposition existe dans la formule.

Après création, un déplacement échange le terrain de la prochaine rencontre du joueur avec celui de la rencontre déjà affectée à la cible. Il ne change pas les adversaires, les scores ou les chronos commencés. Les demandes pour un tour encore à générer sont sauvegardées et appliquées après sa génération, y compris dans la prévision sans mutation de l’état réel. Le glisser-déposer natif, une poignée tactile et une alternative par sélection puis bouton utilisent la même opération.

Les raquettes proposent un comptage normal ou un bonus de 2 à 20 points, avec +1 toujours disponible. Le bonus vaut le nombre choisi au total ; les scores alimentent les règles de fin habituelles. Le barème victoire / nul / défaite des sports collectifs est configurable après la formule.

## Durées et projection

Les roulettes proposent minutes / secondes, et heures uniquement pour la durée totale du cours. Elles acceptent défilement, gestes tactiles, clics et clavier. Le budget est calculé à la seconde : installation + toutes les rencontres + transitions entre rotations. Une durée dépassant le cours bloque la validation. Les tours dynamiques restent annoncés comme estimés.

La grille utilise une hauteur minimale de 230 px, 250 px avec arbitre, et 24 px supplémentaires avec les commandes de bonus. Les cartes séparent une surface de rencontre et un panneau clair « Prochaine rotation ». Les identités des adversaires, leurs couleurs et les arbitres sont associés au terrain concerné. Les formules évolutives attendent les résultats nécessaires avant d’annoncer les adversaires. AirPlay recopie cette même vue.

## Gestion unique

Il n’y a plus de sélection de rôle, de restriction par profil, de code enseignant ni de verrouillage des commandes. Un ancien code est ignoré. L’affectation d’un arbitre à une rencontre est conservée : elle décrit une tâche sportive et ne définit plus un profil d’accès.

La corbeille sur chaque tournoi enregistré permet une suppression directe. Une pile en mémoire conserve les suppressions de la session pour une annulation immédiate, dans l’ordre inverse. Le stockage local est mis à jour lors de la suppression et de la restauration.

## Modules

| Fichier | Responsabilité |
| --- | --- |
| `dist/app.js` | Parcours, terrains, scores, logos, annonces, import / export et sauvegardes |
| `dist/controls.js` | Chasubles, roulettes, calcul de la grille et gestes tactiles |
| `dist/rackets.js` | Noms complets, duos importés, terrains de départ et déplacements de rencontres |
| `dist/style.css` | Grilles adaptées, typographie, terrains, affichage ordinateur / mobile |
| `dist/planning.js` | Répartition des effectifs, budget exact, estimation des rotations et arbitres |
| `dist/engine.js` | Rencontres, formules, chronos, résultats et classements |
| `dist/exchange.js` | CSV, XLSX, PDF et téléchargements |
| `dist/sw.js` | Cache hors connexion et mise à jour des ressources |

Le schéma des sauvegardes et les anciennes règles sont conservés. Les nouvelles données d’effectif et d’identité utilisent des propriétés supplémentaires compatibles. Aucun serveur de synchronisation entre appareils n’est ajouté.

---

## Archive : conception de la version 1

Le texte ci-dessous et `dist/conception.html` décrivent la maquette initiale, remplacée par le parcours version 2.

## Parcours et architecture fonctionnelle

L’application montre le gymnase. La page de jeu contient autant de cartes que de terrains, y compris les terrains momentanément libres. Trois vues suffisent : Terrains, Rotations, Classement. Les réglages, imports et exports sont dans un panneau enseignant.

La création regroupe les neuf décisions demandées en quatre écrans : Sport et espaces de jeu ; Participants ; Formule et règles ; Récapitulatif. Tous les réglages restent personnalisables.

Les maquettes de l’accueil, des quatre demi-terrains de basket, des trois terrains de handball, des neuf terrains de badminton et de la TV sont réunies dans `dist/conception.html`. Elles précèdent le code de l’application.

### Modules

| Module | Responsabilité |
| --- | --- |
| Catalogue | Sports, variantes, effectifs conseillés, tracés des terrains, suggestions de score |
| Moteur | Rencontres, tours, terrains, repos, poules, tableaux, formules évolutives |
| Règles | Temps, points, hybride, libre, égalités, forfaits, arrêt individuel / collectif |
| Chronométrage | Échéances absolues, pause, reprise, prolongations, alertes, audio |
| Interface | Création, gymnase, recherche d’équipe, arbitre, élèves, affichage TV |
| Données | Sauvegarde immédiate, copie de secours, restauration JSON, synchronisation des fenêtres du même appareil |
| Échanges | Import CSV / XLSX / collage ; exports CSV / XLSX / PDF / sauvegarde JSON |

### Modèle de données

- `Event` : identifiant, titre, date de création, activités, activité sélectionnée, paramètres audio et contrôle du mode enseignant.
- `Tournament` : identifiant, sport, variante, formule, participants, équipes, terrains, règles, rotations, étape courante et état du moteur évolutif.
- `Participant` : identifiant, nom, prénom, classe, sexe fourni, niveau fourni, équipe.
- `Team` : identifiant stable, nom, couleur, membres, niveau et présence. En Americano, chaque entité est un joueur et les partenaires sont associés pour un match seulement.
- `Court` : identifiant, nom, disponibilité. Le nombre de cartes reste égal au nombre d’espaces physiques.
- `Match` : identifiant, groupes A / B, terrain, rotation, phase, scores, état, motif de fin, horloge individuelle, éventuelle règle de départage.
- `Clock` : état, temps restant à la pause, échéance absolue, alertes déjà déclenchées.
- `Rotation` : identifiant, numéro, rencontres, phase, durée prévue, repos déduit des participants non engagés.
- `Audit` : date et type de changement important. Le modèle est versionné pour les sauvegardes.

## Moteur des rotations

1. Constituer les rencontres selon la formule.
2. Pour le championnat avec assez de terrains, utiliser la méthode du cercle : une rencontre de chaque paire, aucune double affectation, une exemption par tour si l’effectif est impair.
3. Avec moins de terrains, chercher des groupes de rencontres disjointes, privilégier les équipes qui attendent depuis le plus longtemps, puis équilibrer l’utilisation des terrains.
4. Les poules sont identifiées explicitement. Les phases finales sont générées après les résultats des poules.
5. L’élimination, la double élimination, la ronde suisse, la montante-descendante, le King et l’Americano génèrent les étapes suivantes à partir des résultats réels. Leurs futures oppositions sont donc annoncées comme « à déterminer » jusqu’à la fin de l’étape.
6. Les exemptions ne sont jamais comptées comme des matchs joués. Un forfait est identifié comme tel.
7. Une correction qui affecte un tableau déjà généré nécessite de supprimer et recalculer les étapes suivantes ; aucun résultat dépendant ne doit être conservé silencieusement.

Le critère absolu est l’absence de double programmation. L’optimisation du repos et du remplissage est heuristique pour les cas à terrains limités ; aucune optimalité universelle n’est annoncée.

## Chrono général

Le chrono se calcule par `échéance - heure actuelle`, pas en soustrayant une seconde à chaque intervalle. Après une suspension de l’onglet ou une fermeture, le temps écoulé est retrouvé. Pause conserve le temps restant, reprise construit une nouvelle échéance. Ajouter 30 secondes modifie les échéances des matchs concernés.

En fonctionnement commun, Démarrer lance la rotation ; Pause et Reprendre agissent sur les matchs actifs. En fonctionnement indépendant, un terrain possède son horloge et peut partir seul. Un arrêt individuel ne touche pas ses voisins. Le signal sonore est initialisé par un geste utilisateur. Un navigateur suspendu peut retarder le son ; l’état des matchs est réconcilié au retour de l’application. Aucun site web ne peut promettre un buzzer à l’heure exacte lorsque l’appareil dort.

## Score et égalités

Au score, l’atteinte de la cible termine le match. En hybride, la première condition atteinte entre temps et score termine le match. La fin générale au premier match terminé est une option explicite. Une égalité peut rester un nul, se jouer au prochain point ou déclencher une prolongation. Un tableau éliminatoire impose un vainqueur ; une égalité n’y désigne jamais aléatoirement un gagnant.

Les scores terminés restent corrigibles en mode enseignant. Le classement utilise les résultats terminés seulement. Les critères habituels sont points de classement, différence, points marqués puis nom ; la règle est visible. En Americano, les points marqués sont cumulés par joueur. Le général multisport additionne des points de rang (N au premier, N−1 au suivant), pour éviter d’additionner les buts et les points de sports différents.

## Contrôle des modes et données

Les données de participants et les scores restent dans le navigateur. Aucun compte élève ni serveur de stockage n’est nécessaire. Le mode élève masque les commandes de gestion ; le mode arbitre limite les commandes au terrain choisi. Un code enseignant peut verrouiller le retour à la gestion, mais un contrôle local ne constitue pas une authentification serveur.

Une fenêtre TV du même navigateur reçoit les mises à jour du stockage local. Des appareils distincts ont des bases distinctes : la synchronisation réseau interappareils est une extension, elle n’est pas simulée. La sauvegarde JSON permet un transfert et une reprise manuels.

## Scénarios et résultats attendus avant implémentation

| Scénario championnat | Rencontres | Rotations attendues | Cartes |
| --- | ---: | ---: | ---: |
| Basket 5×5, 4 équipes, 1 terrain | 6 | 6 | 1 |
| Basket 3×3, 8 équipes, 4 demi-terrains | 28 | 7 | 4 |
| Handball, 6 équipes, 3 terrains | 15 | 5 | 3 |
| Badminton, 18 joueurs, 9 terrains | 153 | 17 | 9 |
| Tennis de table, 24 joueurs, 12 tables | 276 | 23 | 12 |

Les vérifications portent ensuite sur la complétude des rencontres, l’unicité des participants par rotation, les terrains disponibles, les forfaits, chaque mode de fin, les pauses, les prolongations, les corrections, les exports et la restauration. Ces attentes sont une spécification, pas une preuve de tests déjà exécutés.

## Choix techniques

PWA statique à modules JavaScript, sans dépendance réseau à l’exécution. Les fichiers du moteur sont distincts des écrans. Un service worker conserve les ressources ; la sauvegarde des tournois reste indépendante de son cache. Les imports XLSX utilisent les fichiers OpenXML et un décompresseur local ; les exports XLSX conservent les couleurs. Les PDF sont générés localement.
