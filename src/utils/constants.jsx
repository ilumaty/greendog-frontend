/* ════════════════════════════════════════
utils/constants.js
════════════════════════════════════════ */

// Tailles de chiens
export const DOG_SIZES = [
    { value: 'small', label: 'Petit' },
    { value: 'medium', label: 'Moyen' },
    { value: 'large', label: 'Grand' }
]

// Niveaux d'activité
export const ACTIVITY_LEVELS = [
    { value: 'low', label: 'Faible' },
    { value: 'moderate', label: 'Modéré' },
    { value: 'high', label: 'Elevé' },
    { value: 'very-high', label: 'Très élevé' }
]

// Messages d'erreur
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
    NOT_FOUND: 'Ressource non trouvée',
    SERVER_ERROR: 'Erreur serveur, veuillez re-essayer',
    VALIDATION_ERROR: 'Données invalides'
}

// Messages de succès
export const SUCCESS_MESSAGES = {
    LOGIN: 'Connexion réussie',
    REGISTER: 'Inscription réussie',
    LOGOUT: 'Déconnexion réussie',
    POST_CREATED: 'Post publié avec succès',
    POST_UPDATED: 'Post modifié avec succès',
    POST_DELETED: 'Post supprimé avec succès',
    PROFILE_UPDATED: 'Profil mis a jour'
}

// Roles utilisateur
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
}

// Limites
export const LIMITS = {
    POST_TITLE_MAX: 100,
    POST_CONTENT_MAX: 5000,
    COMMENT_MAX: 1000,
    USERNAME_MIN: 2,
    USERNAME_MAX: 50,
    PASSWORD_MIN: 6
}

// Routes de l'application
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    BREEDS: '/breeds',
    BREED_DETAIL: '/breeds/:id',
    COMMUNITY: '/community',
    PROFILE: '/profile',
    ABOUT: '/about'
}