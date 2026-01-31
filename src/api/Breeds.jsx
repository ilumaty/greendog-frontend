/* ════════════════════════════════════════
api/Breeds.js
════════════════════════════════════════ */

import api from './axiosInstance'

const breedsAPI = {
    // Récupérer toutes les races
    getAll: (params = {}) => {
        return api.get('/dogs/breeds', { params })
    },

    // Récupérer une race par son ID
    getById: (id) => {
        return api.get(`/dogs/breeds/${id}`)
    },

    // Créer une race (ADMIN)
    create: (data) => {
        return api.post('/dogs/breeds', data)
    },
    // Modifier une race (ADMIN)
    update: (id, data) => {
        return api.put(`/dogs/breeds/${id}`, data)
    },

    // Supprimer une race (ADMIN)
    delete: (id) => {
        return api.delete(`/dogs/breeds/${id}`)
    }
}

export default breedsAPI