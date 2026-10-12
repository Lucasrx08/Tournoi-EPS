# Installer Tournoi EPS sur les tablettes

Le dépôt est https://github.com/Lucasrx08/Tournoi-EPS.

Au contrôle du 12 octobre 2026, GitHub Pages n’était pas activé. La branche `gh-pages` contient les fichiers de `dist/` directement à sa racine, avec `.nojekyll`, le manifeste, les icônes et le service worker. Aucun fichier `.openai` n’est copié sur cette branche.

## Activation par le propriétaire

1. Ouvrir https://github.com/Lucasrx08/Tournoi-EPS/settings/pages.
2. Dans **Build and deployment**, choisir **Deploy from a branch**.
3. Choisir la branche **gh-pages**, le dossier **/ (root)**, puis **Save**.
4. Attendre que GitHub affiche l’adresse publiée. L’URL prévue est https://lucasrx08.github.io/Tournoi-EPS/ ; elle n’est utilisable qu’après activation et déploiement réussi.

Le dépôt est privé. GitHub Pages sur un dépôt privé nécessite un abonnement compatible (Pro, Team ou Enterprise). Avec GitHub Free, il faudrait choisir de rendre le dépôt public ou utiliser un autre hébergement. Le dépôt reste privé dans cette mise à jour.

## iPad

Ouvrir l’adresse publiée dans Safari. Utiliser **Partager → Sur l’écran d’accueil**, activer **Ouvrir comme app web** si l’option est proposée, puis **Ajouter**. Répéter sur chaque tablette. La première ouverture et la préparation du cache nécessitent une connexion ; laisser l’application finir de charger avant de l’utiliser hors connexion.

Les tournois sont enregistrés sur chaque appareil. Ajouter l’application sur plusieurs tablettes ne synchronise pas automatiquement les scores entre elles. Une nouvelle adresse d’hébergement possède un stockage distinct ; exporter puis importer une sauvegarde JSON pour transférer un tournoi existant.

## Mises à jour

La branche `main` conserve le projet complet ; la branche `gh-pages` contient uniquement la version web installable. Lors des mises à jour, cette branche doit recevoir la nouvelle copie de `dist/`. Ne pas choisir `/docs` comme dossier de publication : il contient la documentation du projet.

Sources :
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://support.apple.com/fr-be/guide/ipad/ipad8f1f7a29/ipados
