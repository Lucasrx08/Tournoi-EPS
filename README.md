# Tournoi EPS · version 2.21

Application française pour organiser les rencontres en EPS, gérer les scores et anticiper les rotations sur une même vue des terrains.

## Préparer le tournoi

Après le choix de l’activité, quatre rubriques accompagnent la préparation : Terrains, Équipes ou Joueurs, Formule, Matchs. L’effectif et les identités se règlent ensemble. Les poules se configurent à côté des formules ; les effectifs détaillés restent modifiables à la demande. Le dernier écran réunit la durée, les points du classement, le départ et le nom du tournoi. Les rubriques déjà parcourues sont directement accessibles et conservent les valeurs saisies.

Pour les sports collectifs, les équipes sont identifiées par les couleurs de chasubles : Bleu clair, Bleu foncé, Vert clair, Vert foncé, Orange, Rouge, Jaune fluo, Jaune, Rose, Fuchsia et Blanc. Un nom personnalisé et un logo restent possibles. Deux méthodes : équipes déjà constituées, ou effectif total à répartir. Les propositions comparent les terrains utilisés, les équipes en attente, les remplaçants et l’arbitrage. Aucun nom individuel ni liste d’élèves n’est demandé pour ces équipes ; seule leur taille est conservée lorsque la répartition est calculée.

En badminton et tennis de table, les inscriptions sont des joueurs en simple ou des duos en double. Le bouton « Modèle élèves » télécharge un XLSX avec deux colonnes : **Nom et prénom** et **Numéro de terrain**. Remplir les noms sans les découper et, si souhaité, indiquer le terrain de départ. Un numéro supérieur aux terrains disponibles est refusé. Les anciens imports NOM / Prénom sont acceptés. Les duos importés sont constitués entre joueurs affectés au même terrain ; un effectif impair dans un groupe est signalé. Les partenaires tournants utilisent une liste de joueurs individuels et organisent de vrais doubles.

L’ordre des activités est : handball, badminton, ultimate, basket, volley, futsal, tennis de table, rugby, football, activité personnalisée. Tennis et hockey restent lisibles dans les anciennes sauvegardes.

## Régler les durées

Les rencontres peuvent s’arrêter au chronomètre, à un objectif de score ou au signal. La fin, le comptage et le départ se règlent sur la même vue Matchs. Le temps total du cours, l’installation et les transitions sont accessibles avec « Modifier le temps du cours ».

Les durées au chronomètre se règlent avec des roulettes : minutes et secondes pour les rencontres, l’installation / échauffement et les transitions ; heures, minutes et secondes pour le cours uniquement. Faire défiler, glisser, cliquer sur une valeur ou utiliser les flèches du clavier. Les secondes choisies sont conservées dans les calculs et les sauvegardes.

L’application réserve l’installation et le temps de noter les scores et de se déplacer entre rotations. Elle conseille 5 minutes lorsque cela tient dans le cours et affiche des alternatives. La durée choisie peut être ajustée librement ; un dépassement empêche le lancement. Les formules évolutives affichent une estimation car les résultats peuvent modifier le nombre de rotations. Les départs restent manuels.

## Gérer les terrains

Une seule interface donne accès à tous les terrains, aux scores et aux réglages. Les anciens rôles, restrictions de saisie et codes enseignant ne sont plus utilisés. Les codes d’anciennes sauvegardes ne bloquent pas leur reprise.

Chaque carte distingue la rencontre actuelle et une zone claire pour la prochaine rotation, avec les couleurs, noms et logos des prochains adversaires. L’arbitre affecté est indiqué lorsque l’arbitrage est activé. « À désigner » apparaît lorsqu’il manque un groupe ou joueur disponible.

Toucher un grand score ouvre la saisie numérique du résultat ; les boutons +1 et − permettent de suivre le score point par point. Après la formule, les sports de raquettes proposent **Point normal** ou **Point bonus**. Le bonus vaut 3 points par défaut et se règle entre 2 et 20 ; il ajoute cette valeur au score, sans ajouter un point normal en plus. Les boutons +1 et bonus restent disponibles. Le critère de réussite est défini avec les élèves. Les sports collectifs proposent les points de classement pour une victoire, un nul et une défaite, avec 3 / 1 / 0 par défaut. Démarrer, pauser et passer à la rotation suivante se font depuis les terrains. Les annonces françaises disent « Jouez ! », « Fin du match ! » et « Fin des matchs ! ». Un signal doux et un son personnalisé sont également disponibles.

**Menu → Répartir les joueurs** ouvre la répartition par terrain en raquettes. Déposer une carte de joueur / duo sur un terrain déplace sa rencontre avec son adversaire ; si un match est prévu sur le terrain visé, les deux rencontres échangent leurs terrains. Avant un départ, le déplacement est immédiat. Pendant une rencontre, il concerne la prochaine rencontre programmée ou est conservé jusqu’au calcul du prochain tour. Les adversaires, identifiants, résultats et chronos déjà commencés restent inchangés. La poignée accepte les gestes tactiles ; sélectionner un joueur puis « Déplacer ici » offre une alternative au clavier.

La version 2.11 adopte une direction « jeu de sport + cartes de compétition » : fond clair, cartes anthracite, accent citron électrique et équipements en niveaux de gris. Les identités d’équipe sont présentées dans des écussons avec leur chasuble ou leur logo ; les prochaines rencontres utilisent des cartes face à face. Les surfaces sportives restent visibles derrière les grands scores. Barlow Condensed signe les titres et les scores ; Outfit reste la police des noms et des commandes. Les images, polices et licences sont locales ; aucun téléchargement externe n’est nécessaire à l’exécution. Les prompts des dix visuels ImageGen et leurs chemins sont dans `docs/IMAGE_PROMPTS.json`.

Les deux vues principales sont **Terrains** et **Classement** ; **Menu** rassemble rencontres, répartition, exports, réglages et annonces. Sur chaque terrain, un tableau de score aux couleurs des adversaires se superpose au tracé sportif. La prochaine rencontre est séparée par une bande menthe très contrastée. Les surfaces évoquent le parquet, le gazon, un revêtement synthétique ou une table.

Un ajout de point déclenche un anneau lumineux et un bref +N, correspondant exactement à l’ajout demandé. Ces effets respectent les mouvements réduits. La progression vers un objectif, le vainqueur après la fin de la rencontre et les premières places du classement utilisent les résultats réels. Le calcul de la grille et les minima lisibles restent conservés ; les grands nombres de terrains défilent dans la grille.

Pour AirPlay, utiliser la recopie de l’écran de l’appareil et, si utile, le bouton plein écran. La même vue sert à gérer et à projeter les rencontres.

## Sauvegarder et supprimer

Les scores sont enregistrés immédiatement sur l’appareil, avec une copie IndexedDB et une sauvegarde précédente. Les sauvegardes version 1 restent compatibles. Les identifiants, résultats, noms personnalisés et logos sont conservés. Les noms collectifs par défaut « Équipe N » deviennent des couleurs de chasubles.

Depuis l’accueil, la corbeille supprime directement un tournoi. « Annuler » restaure la dernière suppression pendant cette session, y compris ses résultats. Plusieurs suppressions peuvent être annulées successivement. L’accueil présente les trois tournois récents. « Rechercher / tous les tournois » ouvre les archives par pages de huit, avec recherche par nom.

Les listes individuelles historiques des sports collectifs restent dans les sauvegardes JSON, pour éviter une perte de données ; elles ne sont plus affichées dans les équipes ni les exports de résultats.

Pour les raquettes : importer CSV, XLSX ou coller les cellules d’Excel / Google Sheets, avec les colonnes Nom et prénom / Numéro de terrain, ou NOM / Prénom. Classe, Couleur et Niveau sont facultatifs. Le premier onglet XLSX est importé. Les effectifs et niveaux fournis peuvent servir à équilibrer les duos.

Exports locaux : XLSX avec couleurs, CSV, PDF paginé et JSON de restauration. Les anciens événements multisports gardent leurs activités et leur export général.

## Installation et fonctionnement local

Sur iPad : Safari, Partager, Sur l’écran d’accueil. Sur les navigateurs compatibles : Installer. Une première ouverture en ligne prépare les ressources hors connexion ; le service worker nécessite HTTPS ou localhost.

Les annonces intégrées sont des fichiers MP3 locaux et passent par un lecteur HTML audio persistant. Le bouton « Sortie AirPlay » ouvre le sélecteur natif de Safari lorsqu’il existe ; sinon, utiliser le centre de contrôle. Les fichiers de départ et de fin peuvent être remplacés par des enregistrements importés (512 Ko maximum chacun). Le routage Apple TV, le verrouillage des gestes dans la web app iPad et les roulettes tactiles doivent être vérifiés sur le matériel utilisé. Les appareils distincts ne synchronisent pas leurs scores par réseau dans cette version.

## Développement

Site statique sans dépendances téléchargées à l’exécution. Héberger `dist/`. Modules : interface `app.js`, contrôles `controls.js`, habillage `gaming.css`, moteur `engine.js`, préparation `planning.js`, affectations `rackets.js` et échanges `exchange.js`. Pako est fourni localement avec sa licence.

Tests : `npm test` ou `node --test tests/*.test.mjs`.

Conception : `docs/CONCEPTION.md`. Validation : `docs/VALIDATION.md`. `dist/conception.html` présente la maquette historique de la version 1.

La version 2.11 corrige les commandes de fin des matchs : confirmations internes, message de départage en cas d’égalité et erreurs visibles même après fermeture d’un formulaire. Les confirmations du chrono, du recalcul de tableau et de la restauration utilisent la même fenêtre interne.

La version 2.11 remplace les figurines sportives par des pictogrammes vectoriels de matériel : ballons, raquettes, disque, ballon ovale et sifflet. Les chasubles sont redessinées avec des contours fins, sans cadre crème ni ombre. La palette approuvée et les commandes restent les mêmes.

La version 2.11 corrige la lisibilité du titre, ajoute « Créé par L. RIGAUX » et compacte les écrans de préparation sur ordinateur. Les identités sont paginées par quatre. Voir [l’installation sur tablette](docs/INSTALLATION.md) pour activer GitHub Pages à partir de la branche `gh-pages`.

La version 2.11 corrige les dimensions repérées sur les captures : cartes d’identité stables, propositions de durée compactes, scores calculés par cellule et en-têtes de terrain protégés. GitHub Pages est activé : https://lucasrx08.github.io/Tournoi-EPS/. Les mises à jour doivent être publiées sur `main` et `gh-pages`.

La version 2.12 répartit le réglage du temps sur deux écrans courts, ajoute la saisie directe des deux résultats dans les sports de raquettes et limite la hauteur des terrains. À partir de huit terrains, les noms et scores sont présentés en lignes compactes ; douze tables peuvent être réparties en six colonnes et deux rangées lorsque la largeur disponible le permet. Les tracés conservent leurs proportions.

Version 2.13 : synthèse de répartition horizontale sur ordinateur, retrait des mentions inutiles en simple, grille dense utilisant la hauteur disponible et textes réduits. La vérification visuelle Safari reste à réaliser.

Version 2.14 : classement compact paginé par huit participants, total et plage de rangs visibles, zone de défilement bornée sur ordinateur. Test du parcours des 18 rangs et des limites de pages. Rendu Safari non contrôlé.

Version 2.15 : typographie fluide et retours à la ligne sur accueil, préparation, terrains, classement et réglages. Les très petites hauteurs autorisent le défilement de la page. Les terrains denses réservent des rangées distinctes aux scores, commandes et arbitres, y compris après la fin du match. Le minimum de hauteur prévaut sur le nombre de cartes visibles. Le rendu Safari reste à contrôler.

Version 2.16 : un tournoi multisport permet de choisir un sport collectif sur chaque terrain. Le nombre de rotations est fixé avant le lancement. Un calcul déterministe répartit les matchs et optimise les passages par sport, les répétitions consécutives et les adversaires. La répartition tient compte du nombre de terrains par sport et reste consultable avant le lancement et dans Statistiques. Les terrains du plan restent fixés après la création ; seuls les déplacements vers un terrain du même sport sont autorisés. Le classement utilise victoire/nul/défaite, puis victoires, défaites et nom ; les buts de sports différents ne départagent pas les équipes. Le sport est conservé par rencontre et exporté dans les feuilles de résultats.

Les cas six équipes / trois sports / six rotations (2–2–2), cinq rotations (2–2–1), les effectifs impairs, les attentes, les capacités inégales, la progression, la correction, les sauvegardes et le parcours de préparation sont testés. Le calcul cherche l’équilibre ; il ne garantit pas l’optimum pour chaque combinaison de contraintes. Le rendu sur Safari et les commandes tactiles restent à vérifier sur appareil.

Version 2.17 : le multisport se trouve dans Activité personnalisée. Le badminton distingue terrains entiers et demi-terrains ; les joueurs de raquettes n’ont plus de logos. Une nouvelle séance peut recommencer un tournoi ou réutiliser son classement pour choisir une autre formule, sans modifier l’original. Les poules proposent des répartitions et des effectifs modifiables dont la somme est validée ; les niveaux proches et poules équilibrées sont distingués.

Le classement collectif utilise les points de victoire/nul/défaite, puis les points marqués, la différence et les points d’une mini-ligue des confrontations entre participants encore ex æquo. Les raquettes utilisent victoires, points marqués et points bonus. Les places imposées par les formules à élimination ou la montante-descendante restent prioritaires. Les points normaux et bonus sont suivis séparément, avec correction explicite et annulation du dernier point. Les anciens bonus sans détail restent non renseignés.

L’export iDoceo propose XLSX et CSV : une ligne par élève ou membre d’un duo en raquettes (nom, prénom, classe, classement, niveau de poule, victoires, points normaux, points bonus), une ligne par équipe en sports collectifs (classement, victoires, nuls, défaites). Aucune identité d’élève n’est inventée pour les équipes collectives. Les niveaux sont renseignés pour les groupes de niveau et la montante-descendante terminée ; les poules équilibrées ne sont pas hiérarchisées.

Pour iDoceo, ouvrir le fichier XLSX ou CSV dans iDoceo et associer les colonnes de noms dans l’assistant d’import : https://www.idoceo.net/index.php/en/component/content/article/idoceoimportdata?Itemid=246&catid=17. Le schéma exporté et la génération du fichier sont vérifiés ; l’import dans une installation réelle d’iDoceo reste à tester.

Version 2.18 : Activité personnalisée garde son libellé sur deux lignes sans couper le dernier mot. Le demi-terrain de badminton possède un seul couloir. Utiliser le classement ouvre le choix des formules avant la configuration. Les nouvelles formules Poules avec montée/descente et Poules de niveau avec montée/descente sont accessibles sur la troisième page des formules.

Après un tournoi de poules terminé, le premier de chaque poule monte d’un niveau et le dernier descend ; tous les autres restent. Le premier de la poule supérieure et le dernier de l’inférieure restent à leur niveau. La même règle s’applique aux poules de tailles différentes, en conservant leurs effectifs. La préparation de la séance suivante remappe ces affectations vers de nouveaux identifiants et affiche les groupes proposés. Choisir une autre taille ou un autre nombre de poules réinitialise cette affectation au profit d’une nouvelle répartition. L’ancien tournoi reste conservé.


## Version 2.19 · 29 octobre 2026

- Identité : écusson de compétition avec trophée et ballon, icônes d’installation harmonisées. Le plein écran réserve la fenêtre aux terrains et au chrono ; une commande permet d’en sortir.
- Chrono : sonner signifie « score à saisir ». Aucun 0–0 n’est compté avant validation. Toucher les grands chiffres ou « Fin du match » ouvre la saisie ; les champs sélectionnent leur contenu pour le remplacer directement. « Corriger » reste disponible. Le départage prévu s’applique après le rapport du score.
- Objectif / signal : arrêt individuel sur le terrain. « Enchaîner les disponibles » lance une rencontre prévue sur un terrain libéré, en vérifiant les joueurs et arbitres encore occupés. Les autres rencontres continuent. Le programme conserve ses identifiants et saute les rotations vidées.
- Championnat, poules et poules puis finales : option de première rotation manuelle, sans perdre les autres oppositions. Les formules disposent d’une fiche Organisation / Progression / Classement.
- Poules puis finales : tous les participants continuent pour les places de classement. Les perdants poursuivent aussi ; des rencontres complémentaires égalisent le nombre de matchs de la phase finale. Avec des effectifs impairs, cela peut ajouter des rotations ; les places déjà obtenues sont conservées pendant ces compléments.
- Activité personnalisée → Rotation individuelle : formule « À la mêlée / Mexicain », en trois contre trois. Les modèles de 6, 7 et 8 élèves par terrain suivent la fiche fournie (5 / 7 / 7 rotations). Avec d’autres effectifs, le calcul équilibre le temps de jeu et limite les partenaires répétés. Les points sont personnels : victoire 3, nul 2, défaite 1 par défaut ; différence de buts facultative. Les élèves non engagés arbitrent si l’option est activée. L’export iDoceo distingue les points personnels, V/N/D, buts et différence.
- Raquettes : résultats intermédiaires par poule ou terrain ; le classement général n’apparaît qu’à la fin. Points normaux, bonus et total sont séparés lorsque le bonus est activé.
- Audio : annonces synthétisées localement et incluses dans le cache hors connexion. Aucun service de génération n’est appelé à l’utilisation. Les signaux doux utilisent aussi le lecteur média.
- iPad installé : prévention du pincement et du double toucher sur l’interface ; le défilement à un doigt reste disponible.


## Version 2.20 · 29 octobre 2026

Le logo devient un monogramme sportif incliné, avec deux traits de progression de tableau. Les couleurs anthracite, citron et blanc sont conservées. Les icônes, le favicon et la signature de l’interface utilisent ce même dessin ; les URL d’icônes sont versionnées pour renouveler leur cache.

L’identification affiche toutes les équipes ou tous les joueurs, jusqu’à 64 inscriptions, dans une grille ajustée à la largeur et à la hauteur disponibles. Les pages de quatre cartes sont supprimées. Les noms se modifient directement ; toucher la chasuble ouvre une palette commune, qui se ferme après le choix. Un logo reste importable pour chaque équipe collective. Les cartes deviennent plus compactes pour les grands effectifs ; sur les très petites surfaces, la grille conserve un défilement interne pour garder les commandes utilisables.

Le classement en poules ouvre directement les poules côte à côte, sans grand tableau général ni podium au-dessus. Le choix du nombre de colonnes privilégie les grilles complètes : quatre poules sur quatre colonnes en paysage, deux colonnes lorsque la largeur l’exige. Chaque carte présente tous ses rangs, noms, matchs joués, victoires et points ; le bouton dans son en-tête donne les statistiques complètes. En raquettes, victoires, points marqués et bonus restent distincts ; le détail des points normaux est disponible dans les statistiques. Les résultats de poules restent séparés des phases finales. Le général est une grille de tous les rangs, sans pages de huit.

Sur les terrains, les boutons − et +1 sont réunis sous le score ; dans les vues denses, leur bloc occupe une colonne propre. Les commandes mesurent 44 px de haut sur la vue classique et 40 px sur les douze tables. Les boutons bonus ont aussi leur emplacement. Toucher les grands chiffres conserve la saisie directe du résultat, et Corriger reste disponible après validation.


## Version 2.21 · 29 octobre 2026

- Signature : « Créé par L. RIGAUX · Le Bon Sauveur » dans la marque et le pied de page.
- Quatre rubriques explicites remplacent les sept étapes et les écrans supplémentaires de durée. Les chasubles et les noms sont sur la même vue que l’effectif. Le comptage, le chrono et les départs sont réunis.
- Toutes les formules possèdent un exemple visuel et une explication du parcours, du classement et des limites. « Classement complet » devient « Tableau · toutes les places ». L’exemple de huit participants distingue les sept matchs d’un championnat des trois matchs du tableau de classement. Le nombre réel de matchs du championnat est affiché pour l’effectif saisi.
- Un aperçu de 18 demi-terrains tient dans son panneau. Les noms des terrains et des prochaines rencontres restent sur une ligne ; les noms longs utilisent une ellipse et leur intitulé complet reste disponible dans le détail de la rencontre.
- La saisie du résultat demande le score final rapporté par les joueurs ou l’arbitre. Le déplacement possède son bouton « Déplacer », séparé : seuls les terrains libres compatibles sont proposés, avec conservation du score et du chrono.
- Les roulettes ignorent les déplacements de défilement provoqués par leur insertion dans une fenêtre. Une modification du budget du cours actualise les durées proposées. Les réglages avancés sont conservés après fermeture.

Validation : 208 tests passent, complétés par des contrôles Chrome aux formats ordinateur, tablette paysage et téléphone. Les limites matérielles iPad, Safari et AirPlay restent celles décrites plus haut.
