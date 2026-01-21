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
}

export default breedsAPI