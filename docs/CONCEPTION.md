# Tournoi EPS · conception version 2

La version 2 remplace l’interface initiale par un univers d’affiche sportive : papier crème, vert terrain, jaune et corail, titres expressifs, activités dessinées et formules en pictogrammes. Les identités des équipes se retrouvent directement sur le tableau des terrains.

## Parcours

Le choix d’activité constitue le premier écran. Suivent terrains / nombre de joueurs, effectif, noms / couleurs / logos, formule, fin des matchs, départ puis lancement. Les listes d’identités et de formules sont paginées ; les commandes de progression restent visibles sur ordinateur. Les variantes chiffrées sont remplacées par un paramètre nombre de joueurs.

L’effectif offre deux chemins : groupes déjà faits ou groupes à constituer. Les propositions comparent les terrains utilisés, les remplaçants et les groupes en attente, en tenant compte d’une éventuelle tâche d’arbitrage. La répartition des personnes conserve un écart maximal d’un élève entre groupes.

La préparation au chrono réserve installation et transitions. Les formules à progression dynamique annoncent une estimation. La vue des terrains affiche maintenant la prochaine rotation à la place d’un bandeau de repos ; les arbitres disponibles y sont nommés. La projection est la recopie AirPlay de cette même vue.

Badminton et tennis de table utilisent joueurs ou duos. Les partenaires tournants utilisent des joueurs individuels. Les exemples prêts à jouer, la recherche du terrain, la fenêtre TV distincte, le mode de fin hybride et les activités tennis / hockey sont retirés des nouveaux choix.

## Modules

| Fichier | Responsabilité |
| --- | --- |
| `dist/app.js` | Parcours, terrains, scores, rôles, logos, annonces, import / export et sauvegardes |
| `dist/style.css` | Identité visuelle, écrans fixes sur ordinateur, adaptation mobile et projection |
| `dist/planning.js` | Propositions d’effectifs, budget du cours, estimation des rotations et arbitres |
| `dist/engine.js` | Rencontres, formules, chronos, résultats et classements |
| `dist/exchange.js` | Échanges CSV, XLSX, PDF et téléchargements |
| `dist/sw.js` | Cache hors connexion et mise à jour des ressources |

Les sauvegardes version 1 restent lisibles. Le moteur conserve les anciens sports et règles pour cette compatibilité, même lorsqu’ils ne sont plus proposés dans la création. Aucune migration ne supprime les scores.

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
