# Validation · version 2.3 · 11 octobre 2026

107 tests automatisés passent : moteur, échanges, préparation, contrôles et parcours. Les tests d’interface exécutent les actions avec un DOM simulé ; ils ne vérifient pas la mise en page d’un navigateur réel.

## Refonte graphique

Les 107 tests fonctionnels existants sont conservés. L’ancienne assertion imposant dix accents de couleur différents a été retirée : le contrôle de l’ordre des activités et des onze couleurs de chasubles reste présent. Les illustrations et aperçus sont des SVG décoratifs ; les libellés et actions restent des boutons HTML.

Les styles de sélection ne modifient ni la police ni la taille du texte. Les roulettes conservent des lignes de 32 px et une fenêtre de 96 px. La disposition des terrains garde son calcul et ses minima ; les scores et la prochaine rencontre sont agrandis lorsque trois terrains ou moins sont affichés. Le service worker inclut les deux polices et utilise un nouveau cache.

Un contrôle de génération parcourt les neuf étapes pour les dix activités, sans erreur de rendu HTML dans le DOM simulé. Les 440 SVG produits par les dix illustrations et les aperçus de 1, 3, 7 et 24 terrains sont valides. Les glyphes français et les références locales CSS, HTML et cache ont été vérifiés. Ce contrôle ne mesure pas la mise en page dans un navigateur.

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
