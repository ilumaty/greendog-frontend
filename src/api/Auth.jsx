/* ════════════════════════════════════════
api/Auth.js
════════════════════════════════════════ */

import api from './axiosInstance'

const authAPI = {
    // Connexion utilisateur
    login: (email, password) => {
        return api.post('/auth/login', { email, password })
    },

    // Inscription utilisateur
    register: (userData) => {
        return api.post('/auth/signup', userData)
    },

    // Déconnexion
    logout: () => {
        return api.post('/auth/logout')
    },

    // Récupérer le profil utilisateur
    getProfile: () => {
        return api.get('/auth/profile')
    },

    // Mettre à jour le profil
    updateProfile: (userData) => {
        return api.put('/auth/profile', userData)
    }
}

export default authAPI