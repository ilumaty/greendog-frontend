<div align="center">
  <img src="public/logo/green-dog-W.svg" alt="Green Dog Logo" width="200"/>
  <h1>Green Dog - Frontend</h1>
</div>

Application React - Plateforme Wiki de partage sur les chiens


## Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 19.x    | Framework UI |
| Vite | 7.x     | Build tool |
| Zustand | 5.x     | State management |
| Axios | 1.x     | Client HTTP |
| React Router | 7.x     | Routing |
| Tailwind CSS | 4.x     | Styling |
| Lucide React | 0.5     | Icones |
| React Toastify | 11.x    | Notifications |
| Lottie React | 2.4     | Animations |


## Structure du projet

```
GreenDog-frontend/
```

| Dossier/Fichier | Description |
|-----------------|-------------|
| `public/` | Assets statiques (images, logo) |
| `src/api/` | Clients API (Auth, Breeds, Posts, Axios) |
| `src/assets/` | Animations Lottie, styles CSS |
| `src/components/` | Composants réutilisables |
| `src/pages/` | Pages de l'application |
| `src/store/` | Stores Zustand (auth, breeds, favorites, notifications) |
| `src/utils/` | Constantes et fonctions utilitaires |

### Détail des fichiers sources

| Fichier                              | Description |
|--------------------------------------|-------------|
| **api**                              ||
| `api/axiosInstance.js`               | Instance Axios avec intercepteurs JWT |
| `api/Auth.jsx`                       | Endpoints authentification |
| `api/Breeds.jsx`                     | Endpoints races de chiens |
| `api/Posts.jsx`                      | Endpoints publications communauté |
| **components**                       ||
| `components/Auth/ProtectedRoute.jsx` | HOC protection des routes privées |
| `components/Layout/Header.jsx`       | Navigation principale |
| `components/Layout/Footer.jsx`       | Pied de page |
| `components/Layout/MainLayout.jsx`   | Layout global de l'application |
| **pages**                            ||
| `pages/Home.jsx`                     | Page d'accueil |
| `pages/BreedsPage.jsx`               | Liste des races avec filtres |
| `pages/BreedDetailPage.jsx`          | Détail d'une race |
| `pages/CommunityPage.jsx`            | Publications de la communauté |
| `pages/ProfilePage.jsx`              | Profil utilisateur et favoris |
| `pages/AboutPage.jsx`                | Page à propos |
| `pages/NotFoundPage.jsx`             | Page 404 |
| `pages/auth/`                        | Pages connexion/inscription |
| **store**                            ||
| `store/index.jsx`                    | Export centralisé des stores |
| `store/authStore.jsx`                | État authentification utilisateur |
| `store/breedsStore.jsx`              | État et actions races |
| `store/favoritesStore.jsx`           | Gestion des favoris |
| `store/notificationStore.jsx`        | Système de notifications |
| **utils**                            ||
| `utils/constants.jsx`                | Constantes (tailles, niveaux activité) |
| `utils/validation.jsx`               | Fonctions de validation formulaires |

## Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
```bash
cp .env.example .env
```

Contenu du fichier `.env` :
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Démarrer le serveur de développement
```bash
npm run dev
```

L'application démarre sur `http://localhost:5173`

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run preview` | Preview du build |
| `npm run lint` | Vérification ESLint |

## Limitations connues en dévelopement future

- L'édition des données de santé (problèmes courants, soins préventifs) n'est pas disponible via l'interface admin. Ces données sont gérées directement en base de données.
- Système de commentaires non implémenté côté interface (API backend prête)

## License

MIT License

## Lien avec le Backend

Ce frontend communique avec l'API Green Dog Backend. Assurez-vous que le serveur backend est démarré sur le port configuré dans `VITE_API_URL`.

Repository Backend : [Green Dog Backend](https://github.com/ilumaty/greendog-backend)