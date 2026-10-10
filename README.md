# Tournoi EPS

Gestion visuelle de tournois sportifs, conçue pour un appareil enseignant et un écran de projection. Les rencontres, les scores et les classements sont réels ; les exemples sont des tournois configurés et modifiables.

## Utilisation

1. Créer un tournoi : sport et variante, terrains, équipes, formule et règles.
2. Ouvrir les terrains. Toucher un grand score ajoute un point ; le bouton − corrige immédiatement.
3. Lancer les matchs, mettre en pause, ou laisser chaque terrain partir séparément.
4. À la fin de la rotation, préparer la suivante. Les formules évolutives calculent la suite à partir des résultats.
5. Consulter le classement et les exports depuis le mode enseignant.

Les réglages donnent accès aux noms des terrains, indisponibilités, présences, membres des équipes, sons et code enseignant. Une égalité éliminatoire, au King ou en montante-descendante se règle au point en or.

## Mode élève et arbitre

« Où je joue ? » trouve un terrain à partir du nom d’équipe ou d’un élève importé. Le mode élève est en lecture seule par défaut. Un arbitre gère uniquement le terrain sélectionné. Un code enseignant facultatif empêche le retour aux commandes de gestion par l’interface ; il ne remplace pas une authentification serveur.

## Affichage TV

Ouvrir une fenêtre TV dans le même navigateur, puis la placer sur le deuxième écran. Les mises à jour passent par le stockage local et BroadcastChannel. Une TV, une tablette ou un ordinateur avec un navigateur distinct ne reçoit pas les scores en direct. Cette version locale ne comporte pas de synchronisation réseau interappareils.

## Installation et sauvegarde

Sur iPad : ouvrir dans Safari, Partager, Sur l’écran d’accueil. Sur les navigateurs proposant l’installation, utiliser le bouton Installer. L’application doit avoir été ouverte et ses ressources mises en cache une première fois en ligne. Le service worker nécessite HTTPS ou localhost.

Les scores sont sauvegardés immédiatement dans le stockage local, avec une copie IndexedDB. Exporter régulièrement une sauvegarde JSON, notamment avant de changer d’appareil ou de supprimer les données du navigateur. La récupération du temps après une fermeture utilise une échéance absolue. Un navigateur ou un appareil en veille peut retarder un signal sonore ; garder l’écran actif pendant les rotations.

## Import et export

Importer CSV, XLSX ou coller les cellules d’Excel / Google Sheets. Première ligne : NOM, Prénom, Classe, Sexe, Équipe, Couleur, Niveau. NOM ou Prénom suffit. Le premier onglet XLSX est importé. Les équipes peuvent être équilibrées, aléatoires ou déjà constituées. Aucun sexe n’est deviné.

Les exports sont locaux : XLSX avec couleurs d’équipe, CSV, PDF paginé et JSON de restauration. En multisport, Excel et PDF comprennent les activités et le général ; seuls les sports terminés contribuent au général (points de rang N, N−1…). Les PDF utilisent un jeu de caractères occidental et raccourcissent les textes longs dans les colonnes.

## Développement

Site statique sans téléchargement de dépendances à l’exécution. Les fichiers `dist/` peuvent être hébergés sur un serveur HTTPS ou GitHub Pages. Le moteur et les échanges de fichiers sont séparés de l’interface. Le décompresseur Pako fourni localement conserve sa licence dans `dist/vendor/`.

Tests : `node --test tests/*.test.mjs`.

Conception initiale : `docs/CONCEPTION.md` et `dist/conception.html`. Contrôles : `docs/VALIDATION.md`.
