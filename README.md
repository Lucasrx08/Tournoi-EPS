# Tournoi EPS · Le jeu d’abord

Une application de tournois pour les cours d’EPS au collège et au lycée. La version 2 adopte une identité d’affiche sportive : activités illustrées, couleurs franches, formules en pictogrammes et grands scores sur les terrains.

## Préparer une séance

L’accueil est le choix d’activité. La préparation se poursuit par écrans courts : terrains et nombre de joueurs ; effectif ; noms, couleurs et logos ; formule ; fin des matchs ; départ ; récapitulatif. Les commandes de progression restent visibles sur ordinateur. Les grandes listes d’identités et de formules sont paginées.

Deux chemins pour l’effectif :

- **Équipes déjà faites** : indiquer leur nombre, puis saisir leurs identités ou importer la liste.
- **Équipes à constituer** : indiquer le nombre d’élèves et choisir une proposition. Les alternatives comparent terrains utilisés, groupes en attente, remplaçants et terrains arbitrés. Chaque élève est affecté à un groupe ; les tailles diffèrent au maximum d’un élève.

En badminton et tennis de table, l’application parle de joueurs en simple et de duos en double. Les partenaires tournants nécessitent une liste de joueurs individuels et organisent de vrais doubles.

Les activités proposées sont basket, football, futsal, handball, volley, badminton, tennis de table, rugby, ultimate et activité personnalisée. Les anciens tournois de tennis et hockey restent lisibles dans les sauvegardes.

## Temps et règles

La formule, la fin et le départ se choisissent successivement par boutons. Trois règles de fin : au chrono, aux points, ou au signal de l’enseignant. Le mode hybride n’est plus proposé lors de la création.

Pour les matchs au temps, renseigner la durée totale du cours, l’installation / échauffement et le temps entre rotations pour noter les scores et se déplacer. L’application calcule le nombre de rotations, propose des durées compatibles et réserve les transitions. Elle conseille 5 minutes lorsque cette durée tient dans le cours. Une durée personnalisée reste possible ; un dépassement empêche le lancement.

Les formules évolutives affichent une estimation : le résultat des matchs, les exemptions et un départage peuvent modifier la durée réelle. La double élimination réserve aussi une éventuelle finale supplémentaire. Les départs restent déclenchés par l’enseignant ou par terrain ; le temps de transition est une réserve dans le budget de séance.

## Jouer et projeter

Chaque carte indique le terrain, les adversaires, les scores et la prochaine opposition. L’arbitre apparaît lorsqu’un groupe ou joueur disponible a été affecté. L’application indique « À désigner » lorsqu’il n’y a pas assez de participants disponibles pour arbitrer tous les terrains.

Un grand score ajoute un point ; le bouton − corrige. Lancer, pauser et passer à la rotation suivante se font directement depuis la vue des terrains. Les annonces françaises disent « Jouez ! », « Fin du match ! » ou « Fin des matchs ! ». Un signal doux et un audio personnalisé sont également disponibles.

Pour AirPlay, utiliser la recopie de l’écran de l’appareil. La même vue des terrains sert à jouer et à projeter, avec un bouton plein écran facultatif. Il n’y a plus de fenêtre TV séparée ni de recherche « Où je joue ».

Le mode élève est en lecture seule par défaut. Un arbitre ne saisit que les scores du terrain choisi. Un code enseignant facultatif protège les commandes de gestion de cet appareil ; il ne remplace pas une authentification serveur.

## Sauvegarder, importer et exporter

Les scores sont enregistrés immédiatement dans le stockage local, avec une copie IndexedDB et une sauvegarde précédente. Les sauvegardes de la version 1 restent compatibles. Exporter une copie JSON permet de retrouver les tournois sur un autre appareil.

Importer CSV, XLSX ou coller les cellules d’Excel / Google Sheets. Première ligne possible : NOM, Prénom, Classe, Sexe, Équipe, Couleur, Niveau. NOM ou Prénom suffit. Le premier onglet XLSX est importé. Les listes sans équipe sont réparties avec un équilibrage des effectifs et des niveaux renseignés. Aucun sexe n’est deviné.

Exports locaux : XLSX avec couleurs, CSV, PDF paginé et JSON de restauration. Les anciens événements multisports conservent leurs activités et leur export général.

## Installation

Sur iPad : Safari, Partager, Sur l’écran d’accueil. Sur les navigateurs compatibles, utiliser Installer. Les ressources doivent avoir été mises en cache une première fois en ligne ; le service worker nécessite HTTPS ou localhost.

La voix dépend des voix françaises installées et des autorisations audio du navigateur. Un appareil en veille peut retarder une annonce ; garder l’écran actif pendant les matchs. La projection AirPlay et le son restent à vérifier sur le matériel utilisé. Cette version conserve les données sur l’appareil ; les navigateurs d’appareils distincts ne synchronisent pas leurs scores par réseau.

## Développement

Site statique, sans téléchargement de dépendances à l’exécution. `dist/` est le dossier à héberger. L’interface (`app.js`), le moteur (`engine.js`), la préparation (`planning.js`) et les échanges (`exchange.js`) sont séparés. Pako est fourni localement avec sa licence.

Tests : `npm test` ou `node --test tests/*.test.mjs`.

La conception version 2 figure dans `docs/CONCEPTION.md`, la validation dans `docs/VALIDATION.md`. `dist/conception.html` est la maquette historique de la version 1.
