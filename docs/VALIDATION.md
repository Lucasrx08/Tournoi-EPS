# Validation · version 2.11 · 11 octobre 2026

123 tests automatisés passent : moteur, échanges, préparation, contrôles et parcours. Les tests d’interface exécutent le JavaScript en mode strict dans un DOM simulé ; ils ne vérifient pas la mise en page d’un navigateur réel.

## Corrections à partir des captures du 12 octobre

Les captures montrent les cartes 5–6 plus larges que les cartes 1–4, les propositions de durées coupées et des noms passant devant les en-têtes de terrains. La page ordinateur utilise désormais une grille de hauteur 100dvh avec une zone centrale minmax(0,1fr). Les cartes d’identité conservent quatre colonnes, même sur la dernière page ; leur hauteur est intrinsèque. Les propositions de durée ont une composition verticale dans chaque carte.

De un à trois terrains, le calcul privilégie une seule rangée quand la largeur le permet. La taille des scores et des noms est calculée depuis la largeur et la hauteur de cellule, avec de la place réservée à l’en-tête, à la prochaine rotation, aux arbitres et au bonus. Les scores n’ont plus un minimum fixe de 110 pixels pour trois terrains. La surface de rencontre ne peut plus recouvrir l’en-tête. Le test supplémentaire parcourt les minima, le nombre de terrains, les tailles de fenêtre, l’arbitrage et les bonus.

Ces vérifications portent sur les calculs et règles de disposition, pas sur un rendu navigateur réel. Aucun navigateur de contrôle compatible n’est disponible.

## Mise en page sur ordinateur et signature

La couleur du bouton de marque masquait « TOURNOI » sur le bandeau anthracite. La marque utilise désormais explicitement du blanc ; « Créé par L. RIGAUX » apparaît dans le bandeau et le pied de page.

Sur ordinateur (largeur à partir de 900 px), la hauteur du cadre est bornée à celle de la fenêtre. Les éléments centraux gardent un minimum nul ; le pied de page et les commandes Retour / Continuer ne se rétrécissent pas. Sous 800 px de hauteur, les en-têtes, cartes et explications sont compacts. Les durées occupent quatre colonnes et les propositions sont côte à côte. Les identités affichent quatre cartes par page, sur une rangée sur ordinateur. Un nouveau test couvre les pages 1–4, 5–8 et 9, la conservation d’un nom saisi et le retour à une page valide après réduction d’effectif.

Les listes longues gardent un défilement interne. Les roulettes gardent leurs 32 px par ligne et leur fenêtre de 96 px. La grille des terrains conserve son minimum de lisibilité ; un grand nombre de terrains peut nécessiter un défilement du tableau.

Aucun navigateur de contrôle compatible n’est disponible : les règles CSS ont été contrôlées, mais les hauteurs réelles sur Safari et les appareils restent à vérifier.

## Pictogrammes et chasubles

123 tests passent après remplacement des icônes et chasubles. Les contours des équipements partagent une grille de 24 px et un trait de 1,65 px. Les 11 glyphes de matériel, listes et arbitrage, ainsi que les 11 couleurs de chasubles, ont été rendus avec librsvg et inspectés sur une planche à 24 et 80 pixels. Les 22 SVG sont valides. Le cadre crème, les grosses bordures et les ombres des chasubles ont été supprimés. Les logos et couleurs enregistrés restent inchangés.

Les figures de joueur de handball ont été remplacées par un ballon sur les terrains, l’aperçu et les listes de tournois. La palette et la disposition approuvées sont conservées. Cette inspection porte sur les glyphes vectoriels, pas sur une capture du navigateur.

## Correction des commandes

Le blocage de « Fin des matchs » a été reproduit dans le DOM simulé en faisant refuser la confirmation native du navigateur : trois matchs restaient en cours sans retour visible. Toutes les confirmations natives ont été remplacées par un dialogue intégré distinct des formulaires ouverts. Annulation, croix, Échap et clic extérieur ferment la confirmation sans modifier les scores. Une fermeture tardive d’une ancienne confirmation ne ferme pas la suivante.

Neuf tests supplémentaires couvrent la délégation d’un clic sur Fin des matchs, la validation, l’annulation, la conservation des scores, la rotation suivante, la fin individuelle, les départages, les messages d’erreur après fermeture d’un formulaire, la réinitialisation du chrono, les confirmations périmées, deux restaurations successives et le recalcul d’un tableau avec annulation préservant le formulaire. Les confirmations périmées ne terminent pas une nouvelle rotation. Le moteur du tournoi n’est pas modifié.

Le cache v211 inclut le document contenant le dialogue intégré. La syntaxe JavaScript, les identifiants HTML uniques et les 27 ressources locales ont été vérifiés.

## Direction graphique conservée

La palette bleu nuit / orange / menthe a été retirée des feuilles actives. Le fond est clair, les cartes et le chronomètre sont anthracite, l’accent est citron électrique. Les images d’activité sont affichées en niveaux de gris ; les couleurs de chasubles et logos restent intactes. Les cartes d’identité, écussons et affiches des prochaines oppositions utilisent les données du tournoi.

L’icône SVG et ses versions PNG de 192 et 512 pixels ont été mises à jour dans la nouvelle palette. Le manifeste PWA et le cache v211 sont cohérents avec cette version. Les 27 ressources du cache existent localement. Les délimiteurs CSS, couleurs hexadécimales et syntaxe JavaScript ont été vérifiés.

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
