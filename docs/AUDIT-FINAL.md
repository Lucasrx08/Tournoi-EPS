# TOURNOI EPS — audit avant diffusion

Date : 6 novembre 2026. Base examinée : 2.33 ; corrections préparées : 2.34.

## Avis

L’application peut faire l’objet d’une recette finale, mais cet audit ne constitue pas une garantie d’absence de bugs. Les calculs et les parcours automatisés contrôlés passent. La validation sur de vrais appareils Apple, hors connexion et avec AirPlay reste nécessaire avant d’annoncer une version finale pour tous les usages.

Le périmètre réel est une application locale par appareil : elle ne synchronise pas les scores de plusieurs tablettes. Une recopie AirPlay affiche la tablette centrale. Un Wi-Fi commun ne suffit pas à partager les tournois entre appareils.

## Preuves et méthode

- 296 tests automatisés réussis après corrections.
- Un test supplémentaire parcourt 1 029 tournois complets : handball, badminton, tennis de table ; 2, 3, 4, 5, 6, 7, 8, 12 et 16 participants ; 1, 2 ou 4 terrains ; formules compatibles. Il contrôle la fin du tournoi, les collisions de participants et terrains, le bilan victoires/nuls/défaites et le cumul du barème.
- 60 configurations d’aller-retour : trois sports, cinq formules de poules, quatre effectifs. Chaque paire se rencontre exactement deux fois dans sa poule.
- Cas ciblé de bonus : ajout normal, ajout bonus, retrait et double correction du même résultat sans double cumul.
- Tests d’interface existants : saisie finale, confirmations, tableaux dynamiques, horaires, file d’attente, arbitres, déplacements et réutilisation des résultats.
- Contrôle réel dans Chrome distant avec pages encadrées à 390 × 844, 1024 × 768 et 1366 × 900. Ce sont des dimensions d’écran, pas une émulation matérielle Safari/iOS.
- Contrôle du glisser-déposer à la souris entre deux poules, des effectifs recalculés, de l’accès aux commandes et de l’absence de débordement horizontal dans les vues examinées.
- Les 45 ressources déclarées pour le mode hors connexion existent dans le dépôt. Ceci ne remplace pas un essai en mode avion.

## Anomalies confirmées et corrigées

| Priorité | Problème reproduit | Correction | Vérification |
|---|---|---|---|
| Haute | Restaurer deux tournois anciens pouvait restaurer le premier et laisser silencieusement la copie locale du second | Chaque tournoi accepté reçoit une date de restauration prioritaire avant la fusion des copies locales | Test en échec avant correction, réussi après |
| Haute | Une suppression antérieure pouvait empêcher le retour d’un tournoi importé | La restauration explicite retire la marque de suppression et donne priorité au fichier choisi | Test de restauration après suppression |
| Moyenne | Certaines sauvegardes avec scores négatifs ou sans moteur étaient acceptées par la validation | Refus des scores hors bornes, des identités dupliquées et des structures essentielles manquantes | Tests de rejet |
| Moyenne | Deux équipes pouvaient former une colonne étroite, avec beaucoup d’espace inutilisé | Choix des colonnes selon la hauteur réellement plafonnée des cartes, zone pleine largeur, centrage dans une largeur maximale de 1 100 px | Mesure navigateur : deux colonnes de 543 px, centrées |
| Moyenne | Grilles de faible effectif collées en haut | Centrage vertical lorsque toutes les cartes tiennent dans la zone | Deux et six équipes contrôlées |
| Moyenne | Rang du premier peu lisible sur fond noir hors projection | Rang en vert dans toutes les vues concernées | Règle commune aux classements |
| Basse | L’explication du championnat en raquettes parlait vaguement des points | Explication : victoires, points marqués puis bonus éventuels | Texte cohérent avec le comparateur de classement |
| Basse | Le PDF utilisait « Équipe » pour la rotation individuelle et « Joueur » pour les doubles | Libellés Joueur, Duo ou Équipe selon la formule et l’activité | Tests des trois variantes |

## Couverture fonctionnelle

| Domaine | Contrôles effectués | Résultat / limite |
|---|---|---|
| Championnat | Paires, effectifs impairs, terrains moins nombreux que les matchs, cumul et fin | Parcours contrôlés réussis |
| Poules et niveaux | Composition unique, tailles, classements locaux en raquettes, aller-retour | Contrôles réussis ; les résultats des poules n’utilisent pas les matchs de phase finale |
| Poules puis finales | Qualification, tableaux de titre et de places, progression, corrections de résultats | Parcours automatisés réussis ; le nombre total de matchs dépend aussi de l’effectif des poules |
| Tableau toutes les places | Vainqueurs et perdants poursuivent, exemptions, places finales | Parcours contrôlés réussis |
| Élimination et double élimination | Égalités décisives, poursuite des tableaux, fin | Contrôles réussis |
| Montante-descendante | Génération à partir des résultats, attente, classement final des terrains | Parcours contrôlés réussis |
| Montée/descente par poules | Promotion selon chaque poule, premiers/derniers, conservation des autres | Tests existants réussis ; réutilisation à la séance suivante |
| Rondes suisses | Nombre de tours, exemptions, barème, évitement des répétitions | Parcours contrôlés réussis ; l’algorithme cherche à éviter les répétitions, sans garantir une solution optimale globale |
| Americano et mêlée | Partenaires tournants, identités individuelles, groupes, points personnels | Parcours compatibles contrôlés ; mêlée réservée aux collectifs |
| Multisport | Terrains associés à leur sport, répartition, interdiction de déplacement vers un autre sport | Tests existants réussis ; équilibrage recherché, pas promesse d’une égalité mathématique avec toutes les capacités |
| Rencontres personnalisées | Saisie des oppositions, rejet des indices invalides | Tests existants ; saisie textuelle plus technique que les autres formules |
| Chronomètres | Durées, minutes/secondes, pause, reprise, fin au temps | Tests réussis ; le temps écoulé utilise une échéance, pas seulement des ticks d’affichage |
| Résultats | Saisie des deux scores, correction, validation, résultats au retour des arbitres | Tests réussis ; un résultat non validé n’est pas intégré au classement |
| Bonus | Conservation du détail et des totaux, anciennes données inconnues non inventées | Tests réussis ; détail absent laissé vide plutôt qu’estimé |
| Rotations décalées | Participants occupés exclus, terrain libre, suggestions distinctes, origine de rotation conservée | Tests existants réussis |
| Arbitrage | Arbitre disponible et non déjà engagé dans une rencontre simultanée | Tests existants réussis ; recette réelle recommandée avec de nombreux départs décalés |
| Absences / terrains fermés | Forfaits, réactivation, déplacement ou mise en attente | Tests existants réussis |
| Glisser-déposer | Poules, joueurs/terrains, équipes et première rotation ; annulation et cible finale | Tests Pointer Events réussis ; déplacement entre poules vérifié à la souris ; toucher matériel non certifié |
| Listes d’élèves | Import, identités stables, réutilisation et classements par poule | Tests réussis ; une liste est locale à l’appareil |
| Exports | iDoceo XLSX/CSV, PDF, JSON ; échappement CSV/XML ; bonus et statistiques | Tests réussis ; import effectif dans l’application iDoceo non testé sur iPad |
| Sauvegardes | Copies locales, IndexedDB, fusion, suppression et restauration | Tests réussis après correction ; aucun stockage de navigateur n’est une sauvegarde externe garantie |

## Affichage et harmonie

| Vue | Observations |
|---|---|
| Accueil | Contrôle à trois tailles ; aucune extension horizontale observée. Les sports retirés ne sont pas proposés dans l’accueil. |
| Deux équipes sur ordinateur | Deux cartes côte à côte, centrées horizontalement et verticalement. |
| Six équipes | Grille conservée ; pas de pagination ajoutée. Sur tablette contrôlée, trois colonnes. |
| Paramètres des poules | Sur 1024 × 768 : dialogue de 990 × 736, contenu défilable de 566 px ; commandes accessibles. |
| Terrains collectifs | Parcours de création à six équipes et trois terrains sur tablette contrôlé. Largeur de grille 984 px sans dépassement horizontal. |
| Douze tables / vingt-quatre joueurs | Ordinateur 1366 × 900 : quatre colonnes, trois rangées. Téléphone : une colonne et défilement vertical ; aucune prétention à montrer douze tables lisibles sans défiler sur un téléphone. |
| Classements par poule | Parcours tablette contrôlé ; deux poules côte à côte, sans extension horizontale. |
| Plein écran | Correction 2.33 conservée ; tests de fin de tournoi et de bascule vers le classement passent. Aucun essai matériel Apple TV pendant cet audit. |
| Noms longs | Les limites, troncatures et dispositions compactes existent. Tous les noms réels, toutes les langues et toutes les tailles de fenêtre n’ont pas été testés exhaustivement. |

Les libellés et exemples ont été relus dans les modules de formules, les vues principales et les exports. Les boutons de détails restent utiles pour expliquer les formules : ils ne sont pas supprimés au seul motif qu’un exemple répète un intitulé. La palette noire, verte et grise est conservée.

## Limites et réserves avant une « version finale »

1. **Sauvegarde externe nécessaire** : supprimer les données du site, utiliser la navigation privée ou subir une purge du navigateur peut enlever les tournois locaux. Exporter régulièrement le JSON. La demande de stockage persistant peut être refusée par le navigateur.
2. **Pas de synchronisation réseau entre appareils** : ne pas présenter l’application comme une solution de saisie simultanée multi-tablettes. Les échanges entre onglets du même navigateur ne sont pas un serveur Wi-Fi.
3. **Restauration JSON limitée à 20 Mo** : les gros historiques contenant des logos ou voix personnalisées doivent être surveillés. Le volume maximal réellement utilisable dépend du navigateur ; ce point mérite une évolution si de grosses archives sont prévues.
4. **Modifications simultanées du même tournoi dans plusieurs onglets** : la fusion choisit une version par tournoi, pas une fusion de chaque score. Utiliser un seul onglet de saisie.
5. **Validation matérielle restante** : Safari Mac ; iPad tactile et mode application web ; iPhone portrait/paysage ; AirPlay vidéo/audio ; verrouillage/réveil de l’iPad ; retour hors connexion après installation.
6. **Publication** : ne déclarer la mise à jour accessible qu’après réussite de GitHub Pages et contrôle des fichiers réellement servis. Un commit poussé n’est pas une preuve de mise en ligne.

## Recette finale recommandée — environ 20 minutes

- Créer un handball à six équipes, deux poules de trois, aller-retour ; changer une équipe de poule ; jouer, corriger un score et finir le tournoi en plein écran.
- Créer un badminton à douze demi-terrains et vingt-quatre élèves ; importer une liste ; déplacer un élève ; vérifier un grand score et les bonus.
- Utiliser des départs décalés : terminer un terrain pendant que les autres jouent ; vérifier le prochain match proposé et l’absence de participant occupé.
- Exporter XLSX/CSV et ouvrir dans iDoceo ; ouvrir le PDF ; exporter le JSON et le restaurer sur un appareil de test.
- Fermer complètement l’application puis la rouvrir hors connexion ; vérifier les deux tournois, les scores et les listes.
- Tester AirPlay et les annonces sonores avec le matériel du gymnase.

Conclusion : corrections ciblées apportées, contrôles automatisés réussis et vues contrôlées améliorées. Le statut proposé est **version de recette avant diffusion finale**, avec les limites ci-dessus explicites.
