# Validation · version 2 · 10 octobre 2026

76 tests automatisés passent : moteur, échanges, préparation et parcours de l’application. Les tests d’écran exécutent les fonctions et les actions avec un DOM simulé ; ils ne constituent pas un contrôle visuel dans un vrai navigateur.

## Nouveau parcours

- Dix activités à l’accueil ; tennis et hockey absents des choix de création.
- Préparation successivement par terrains, effectif, identités, formule, fin, départ et récapitulatif après le choix d’activité.
- Création complète de 28 élèves sur 3 terrains avec 4 joueurs par équipe, noms, couleur, logo, annonce de départ, score, pause, restauration et rotation suivante.
- Choix d’effectif obligatoire, proposition invalidée après changement de nombre, noms uniques avant de continuer.
- Bornes des paramètres et durée fractionnaire en minutes.
- Badminton / tennis de table : joueurs distincts en simple, duos en double, noms d’élèves importés ; partenaires tournants à deux joueurs par côté.
- Vues de 1, 3, 4, 9, 12 et 24 terrains avec leurs prochaines oppositions. Les raccourcis retirés ne sont plus proposés.

## Répartition, durée et arbitres

Les propositions sont contrôlées pour plusieurs effectifs, nombres de terrains, nombres de joueurs et choix d’arbitrage. Chaque proposition inclut tous les élèves, des tailles équilibrées, des groupes complets et des indicateurs cohérents. Un cas de 31 élèves vérifie les alternatives attente / remplaçants.

Le budget comprend installation, durée de chaque rotation et déplacements entre rotations. Les tests couvrent les 5 minutes conseillées sur 90 minutes de cours, une durée raccourcie pour un tournoi long, un cours trop court sans fausse proposition et le refus d’une durée personnalisée dépassant le cours.

Le nombre de rotations des douze formules est estimé sans muter le tournoi. Le prochain tour dynamique attend les résultats et sa prévisualisation ne change pas le tournoi en cours.

Un arbitre ne joue pas dans la rotation qu’il arbitre et n’est jamais affecté à deux terrains. Les disponibilités, absences, pénuries et la désactivation sont couvertes. L’affectation cherche à équilibrer les tâches entre les groupes disponibles, sans modifier un arbitre pendant ou après une rencontre. Une parfaite égalité peut être impossible selon les matchs et les groupes libres.

## Compatibilité et fonctionnalités conservées

Le moteur conserve les validations des rencontres, effectifs impairs, terrains limités, chronos partagés ou indépendants, pause / reprise, échéances après suspension, ajout de temps, objectifs de score, départages, forfaits, terrains indisponibles et corrections de résultats. Les formules sont simulées jusqu’à leur terme.

Le mode hybride reste testé dans le moteur pour lire les anciennes sauvegardes ; la création version 2 ne le propose plus. Les sauvegardes anciennes gardent leurs résultats et leur préférence silence, avec migration immédiate des annonces et des noms par défaut de joueurs. Le secours depuis la sauvegarde précédente est vérifié.

Les contrôles de rôle enseignant / élève / arbitre, la limitation de saisie par terrain, le multisport existant et son export général restent testés. Les imports CSV / XLSX et les fichiers XLSX / CSV / PDF sont validés par les tests d’échange.

## Contrôles sur appareil encore nécessaires

L’environnement ne fournit pas de navigateur de contrôle compatible pour ce Site. La mise en page réelle selon les dimensions d’écran, la projection AirPlay, la PWA, le cache hors connexion du Site privé et les annonces sur Safari / enceintes doivent être vérifiés sur appareil. Aucune vérification visuelle de la version 2 dans un navigateur réel n’est revendiquée.
