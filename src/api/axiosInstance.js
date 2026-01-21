/* ════════════════════════════════════════
api/axiosInstance.js
════════════════════════════════════════ */

import axios from 'axios'

// URL du backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Instance Axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Ajoute le token JWT
api.interceptors.request.use(
    (config) => {
        const authStorage = localStorage.getItem('auth-storage')
        if (authStorage) {
            const { state } = JSON.parse(authStorage)
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


// Gestion des erreurs
api.interceptors.response.use(
    (response) => response,
    (error) => {

        // Token expire ou invalide
        if (error.response?.status === 401) {
            localStorage.removeItem('auth-storage')
        }
        return Promise.reject(error)
    }
)

export default api