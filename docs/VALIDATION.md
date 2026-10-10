# Validation du 10 octobre 2026

57 tests automatisés passent. Ils couvrent le moteur, la sérialisation, les fichiers d’échange et la logique des écrans. Les tests d’écran exécutent les fonctions avec un environnement DOM simulé ; ils ne constituent pas un contrôle visuel dans Safari ou Chrome.

| Scénario championnat | Rencontres vérifiées | Rotations vérifiées | Cartes vérifiées |
| --- | ---: | ---: | ---: |
| Basket 5×5 · 4 équipes · 1 terrain | 6 | 6 | 1 |
| Basket 3×3 · 8 équipes · 4 demi-terrains | 28 | 7 | 4 |
| Handball · 6 équipes · 3 terrains | 15 | 5 | 3 |
| Badminton · 18 joueurs · 9 terrains | 153 | 17 | 9 |
| Tennis de table · 24 joueurs · 12 tables | 276 | 23 | 12 |

Les vérifications du moteur comprennent les effectifs impairs, les terrains limités, l’unicité de l’affectation par rotation, les règles au temps, au score, hybrides et libres, le chrono indépendant, la pause / reprise, l’ajout de temps, les égalités, le point en or, les prolongations, les forfaits, les terrains indisponibles, les corrections et la réinitialisation des tours dépendants.

Les différentes formules sont simulées jusqu’à leur terme. La double élimination est vérifiée avec et sans réinitialisation de finale. L’Americano crédite les deux partenaires et le classement complet attribue des places uniques. Le général multisport exclut les activités inachevées.

Les fonctions d’écran vérifient les quatre étapes de création, les cartes 1 / 4 / 3 / 9 / 12, la sauvegarde d’un score, le refus des commandes enseignant en mode élève, la limitation de l’arbitre à son terrain, l’absence de commandes de gestion sur TV et les réponses de « Où je joue ? ».

Les exports XLSX sont ouverts indépendamment avec Openpyxl (lignes, accents et couleurs). Un PDF de 24 équipes est ouvert avec pypdf, rendu avec Poppler et inspecté visuellement : deux pages, accents lisibles, tableau sans chevauchement ni texte coupé sur l’exemple.

## Vérifications restantes sur appareil

L’environnement ne permet pas le contrôle du Site dans un vrai navigateur. L’installation PWA, le cache hors connexion sur le Site privé, les restrictions audio de Safari, les sons via une enceinte et les dimensions réelles sur iPad / smartphone restent à vérifier sur appareil. Aucune synchronisation réseau entre appareils distincts n’est annoncée.
