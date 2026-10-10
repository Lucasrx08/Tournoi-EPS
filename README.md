# Tournoi EPS · version 2.1

Application française pour organiser les rencontres en EPS, gérer les scores et anticiper les rotations sur une même vue des terrains.

## Préparer le tournoi

Choisir l’activité, puis renseigner les terrains et le nombre de joueurs par côté. Les étapes suivantes concernent l’effectif, les identités, la formule, la fin des rencontres, le départ et la validation. Les commandes de progression restent visibles sur ordinateur.

Pour les sports collectifs, les équipes sont identifiées par les couleurs de chasubles : Rouge, Bleu, Vert, Jaune… Un nom personnalisé et un logo restent possibles. Deux méthodes : équipes déjà constituées, ou effectif total à répartir. Les propositions comparent les terrains utilisés, les équipes en attente, les remplaçants et l’arbitrage. Aucun nom individuel ni liste d’élèves n’est demandé pour ces équipes ; seule leur taille est conservée lorsque la répartition est calculée.

En badminton et tennis de table, les inscriptions sont des joueurs en simple ou des duos en double. Les noms individuels et l’import de listes sont conservés. Les partenaires tournants utilisent une liste de joueurs individuels et organisent de vrais doubles.

Les activités proposées sont basket, football, futsal, handball, volley, badminton, tennis de table, rugby, ultimate et activité personnalisée. Tennis et hockey restent lisibles dans les anciennes sauvegardes.

## Régler les durées

Les rencontres peuvent s’arrêter au chronomètre, à un objectif de score ou au signal. La formule, la fin et le départ sont choisis successivement par boutons.

Les durées au chronomètre se règlent avec des roulettes : minutes et secondes pour les rencontres, l’installation / échauffement et les transitions ; heures, minutes et secondes pour le cours uniquement. Faire défiler, glisser, cliquer sur une valeur ou utiliser les flèches du clavier. Les secondes choisies sont conservées dans les calculs et les sauvegardes.

L’application réserve l’installation et le temps de noter les scores et de se déplacer entre rotations. Elle conseille 5 minutes lorsque cela tient dans le cours et affiche des alternatives. La durée choisie peut être ajustée librement ; un dépassement empêche le lancement. Les formules évolutives affichent une estimation car les résultats peuvent modifier le nombre de rotations. Les départs restent manuels.

## Gérer les terrains

Une seule interface donne accès à tous les terrains, aux scores et aux réglages. Les anciens rôles, restrictions de saisie et codes enseignant ne sont plus utilisés. Les codes d’anciennes sauvegardes ne bloquent pas leur reprise.

Chaque carte distingue la rencontre actuelle et une zone claire pour la prochaine rotation, avec les couleurs, noms et logos des prochains adversaires. L’arbitre affecté est indiqué lorsque l’arbitrage est activé. « À désigner » apparaît lorsqu’il manque un groupe ou joueur disponible.

Un grand score ajoute un point ; le bouton − corrige. Démarrer, pauser et passer à la rotation suivante se font depuis les terrains. Les annonces françaises disent « Jouez ! », « Fin du match ! » et « Fin des matchs ! ». Un signal doux et un son personnalisé sont également disponibles.

Pour AirPlay, utiliser la recopie de l’écran de l’appareil et, si utile, le bouton plein écran. La même vue sert à gérer et à projeter les rencontres.

## Sauvegarder et supprimer

Les scores sont enregistrés immédiatement sur l’appareil, avec une copie IndexedDB et une sauvegarde précédente. Les sauvegardes version 1 restent compatibles. Les identifiants, résultats, noms personnalisés et logos sont conservés. Les noms collectifs par défaut « Équipe N » deviennent des couleurs de chasubles.

Depuis l’accueil, la corbeille supprime directement un tournoi. « Annuler » restaure la dernière suppression pendant cette session, y compris ses résultats. Plusieurs suppressions peuvent être annulées successivement. Les tournois plus nombreux défilent dans leur liste, sans allonger toute la page sur ordinateur.

Les listes individuelles historiques des sports collectifs restent dans les sauvegardes JSON, pour éviter une perte de données ; elles ne sont plus affichées dans les équipes ni les exports de résultats.

Pour les raquettes : importer CSV, XLSX ou coller les cellules d’Excel / Google Sheets, avec les colonnes NOM et Prénom. Classe, Couleur et Niveau sont facultatifs. Le premier onglet XLSX est importé. Les effectifs et niveaux fournis peuvent servir à équilibrer les duos.

Exports locaux : XLSX avec couleurs, CSV, PDF paginé et JSON de restauration. Les anciens événements multisports gardent leurs activités et leur export général.

## Installation et fonctionnement local

Sur iPad : Safari, Partager, Sur l’écran d’accueil. Sur les navigateurs compatibles : Installer. Une première ouverture en ligne prépare les ressources hors connexion ; le service worker nécessite HTTPS ou localhost.

La voix dépend des voix françaises installées et du navigateur. La projection AirPlay, les roulettes tactiles et les annonces doivent être vérifiées sur le matériel utilisé. Les appareils distincts ne synchronisent pas leurs scores par réseau dans cette version.

## Développement

Site statique sans dépendances téléchargées à l’exécution. Héberger `dist/`. Modules : interface `app.js`, contrôles `controls.js`, moteur `engine.js`, préparation `planning.js` et échanges `exchange.js`. Pako est fourni localement avec sa licence.

Tests : `npm test` ou `node --test tests/*.test.mjs`.

Conception : `docs/CONCEPTION.md`. Validation : `docs/VALIDATION.md`. `dist/conception.html` présente la maquette historique de la version 1.
