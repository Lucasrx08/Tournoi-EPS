# Validation · version 2.1 · 10 octobre 2026

87 tests automatisés passent : moteur, échanges, préparation, contrôles et parcours. Les tests d’interface exécutent les actions avec un DOM simulé ; ils ne vérifient pas la mise en page d’un navigateur réel.

## Parcours et identités

- Dix activités ; tennis, hockey et les anciens raccourcis sont absents des nouveaux choix.
- Création complète : répartition de 28 élèves sur 3 terrains, identités, logo, durée, démarrage, score, pause, reprise et rotation suivante.
- Sports collectifs : noms de chasubles, total réparti par effectifs, aucune création ni affichage de listes individuelles ; les anciens noms individuels restent préservés dans les données.
- Noms automatiques distincts jusqu’à 64 équipes ; changement de couleur et conservation d’un nom personnalisé.
- Raquettes : joueurs et duos, imports réels et doubles avec partenaires tournants.
- Noms uniques et choix de répartition requis avant la validation.

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
