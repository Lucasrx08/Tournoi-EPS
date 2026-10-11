# Validation · version 2.7 · 11 octobre 2026

111 tests automatisés passent : moteur, échanges, préparation, contrôles et parcours. Les tests d’interface exécutent le JavaScript en mode strict dans un DOM simulé ; ils ne vérifient pas la mise en page d’un navigateur réel.

## Nouvelle direction graphique

La palette bleu nuit / orange / menthe a été retirée des feuilles actives. Le fond est clair, les cartes et le chronomètre sont anthracite, l’accent est citron électrique. Les images d’activité sont affichées en niveaux de gris ; les couleurs de chasubles et logos restent intactes. Les cartes d’identité, écussons et affiches des prochaines oppositions utilisent les données du tournoi.

L’icône SVG et ses versions PNG de 192 et 512 pixels ont été mises à jour dans la nouvelle palette. Le manifeste PWA et le cache v27 sont cohérents avec cette version. Les 27 ressources du cache existent localement. Les délimiteurs CSS, couleurs hexadécimales et syntaxe JavaScript ont été vérifiés.

Les contrastes calculés sont de 13,88:1 pour le texte anthracite sur le fond clair, 13,58:1 sur l’accent citron, 7,01:1 pour le texte secondaire sur les panneaux blancs et 16,26:1 pour le blanc sur anthracite. Les initiales des joueurs restent blanches sur anthracite, avec une bordure de leur couleur individuelle.

## Vérifications fonctionnelles

Le parcours complet, les scores, pauses, rotations, imports et déplacements passent les tests existants. La grille garde ses minima et son calcul de colonnes ; les roulettes conservent les lignes de 32 px et la fenêtre de 96 px. Les données et sauvegardes ne sont pas migrées pour un changement de charte.

La génération couvre les sept écrans des dix activités et 40 vues de 1, 3, 7 et 24 terrains, plus l’accueil. Les 111 pages se génèrent sans erreur et leurs 3 219 SVG sont valides. Ces contrôles ne mesurent pas la mise en page.

Aucun navigateur de contrôle compatible n’est disponible dans cet environnement. Le rendu sur navigateur, téléphone, télévision et AirPlay reste à vérifier sur les appareils réels.

## Parcours et identités

- Dix activités ; tennis, hockey et les anciens raccourcis sont absents des nouveaux choix.
- Création complète : répartition de 28 élèves sur 3 terrains, identités, logo, durée, démarrage, score, pause, reprise et rotation suivante.
- Sports collectifs : noms de chasubles, total réparti par effectifs, aucune création ni affichage de listes individuelles ; les anciens noms individuels restent préservés dans les données.
- Noms automatiques distincts jusqu’à 64 équipes ; changement de couleur et conservation d’un nom personnalisé.
- Raquettes : joueurs et duos, imports réels et doubles avec partenaires tournants.
- Noms uniques et choix de répartition requis avant la validation.

## Imports, déplacements et points

- Modèle XLSX réel à deux colonnes, largeurs adaptées, lignes vides ignorées et noms complets conservés ; ancien format NOM / Prénom compatible.
- Numéros invalides et terrains hors configuration refusés avec message de ligne ou nom. Un import refusé conserve le brouillon précédent.
- Duos constitués au sein du terrain et changement simple → double après import.
- Première rotation du championnat conforme aux terrains importés ; toutes les oppositions et tous les identifiants conservés.
- Déplacement manuel prioritaire avant le départ, sans modifier les adversaires du tableau.
- Échange de terrains avant le départ ; pendant une rencontre, déplacement de la prochaine opposition sans modification des scores ni des chronos courants.
- Demande différée dans une formule évolutive appliquée à la prévision puis à la rotation réelle. Absence, terrain indisponible et tournoi terminé refusés.
- Parcours de glisser-déposer natif avec DOM simulé, seuil et annulation de la poignée tactile, alternative par sélection et bouton. Ces tests ne valident pas les gestes sur un appareil réel.
- Étape Points immédiatement après la formule, bonus configurable et sauvegardé, ajout au score et atteinte de l’objectif, barème collectif appliqué au classement.
- Calcul de la grille : sept terrains sur deux rangées dans l’espace simulé d’un ordinateur ; largeur minimale, hauteur lisible, arbitres et bonus pris en compte.

## Durées et roulettes

Les tests couvrent la composition heures / minutes / secondes, les bornes, la sélection au clic et au clavier, l’arrondi du défilement et l’ignorance d’une ancienne roue retirée de l’écran.

Les heures sont proposées pour le cours seulement. Une création avec cours de 5 427 secondes, installation de 619 secondes, transitions de 73 secondes et matchs de 157 secondes conserve ces valeurs après sauvegarde et reprise. Le calcul du budget inclut exactement les transitions entre rotations. Les propositions de durée ne dépassent pas ce budget ; une durée personnalisée trop longue bloque le départ.

Les douze formules sont estimées sans modifier le tournoi. Les prévisions dynamiques attendent les résultats et ne mutent pas l’état courant.

## Vue unique et prochaines rotations

Les vues de 1, 3, 4, 9, 12 et 24 terrains produisent une zone de prochaine rencontre par terrain. Les adversaires, leurs couleurs et les arbitres correspondent à la rotation suivante.

Les anciens profils élève et arbitre, les codes et même un ancien stockage de profils invalide n’empêchent plus l’accès aux commandes. Tous les terrains permettent la saisie. Aucun sélecteur de rôle ni code n’est présenté.

L’arbitrage reste sans double affectation ni rencontre jouée par l’arbitre au même tour. Les absences, pénuries et la désactivation sont couvertes. La répartition cherche à équilibrer les tâches parmi les groupes disponibles.

## Sauvegardes et suppression

La suppression depuis l’accueil, plusieurs suppressions consécutives, leurs annulations et la restauration des scores sont vérifiées. Les anciennes sauvegardes conservent identifiants, noms personnalisés, logos, résultats et préférence silence. La sauvegarde précédente, la restauration JSON et le multisport existant restent couverts.

Le moteur conserve ses tests de planification, effectifs impairs, terrains limités, chronométrage, objectifs de score, départages, forfaits, terrains indisponibles et corrections. Les échanges CSV / XLSX / PDF gardent leurs validations.

## Vérifications restantes sur appareil

Aucun navigateur de contrôle compatible n’est disponible dans cet environnement. La mise en page réelle, le défilement tactile sur iPad, la projection AirPlay, le cache PWA du Site privé et les annonces sur Safari / enceintes nécessitent un contrôle matériel. Ces contrôles ne sont pas présentés comme validés.
