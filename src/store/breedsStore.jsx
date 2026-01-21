/* ════════════════════════════════════════
store/breedsStore.js
════════════════════════════════════════ */

import { create } from 'zustand'
import breedsAPI from '../api/Breeds'

const useBreedsStore = create((set) => ({
    // Premier état
    breeds: [],
    selectedBreed: null,
    pagination: null,
    filters: {
        size: '',
        activityLevel: '',
        search: ''
    },
    isLoading: false,
    error: null,

    // Récupérer toutes les races
    fetchBreeds: async (params = {}) => {
        set({ isLoading: true, error: null })
        try {
            const response = await breedsAPI.getAll(params)
            const breedsData = response.data?.data?.breeds || []
            set({
                breeds: Array.isArray(breedsData) ? breedsData : [],
                pagination: response.data.data.pagination,
                isLoading: false
            })
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors du chargement des races'
            set({ isLoading: false, error: message })
        }
    },

    // Récupérer une race par ID
    fetchBreedById: async (id) => {
        set({ isLoading: true, error: null })
        try {
            const response = await breedsAPI.getById(id)
            set({
                selectedBreed: response.data.data.breed,
                isLoading: false
            })
        } catch (error) {
            const message = error.response?.data?.message || 'Race non trouvée'
            set({ isLoading: false, error: message })
        }
    },

    // Mettre à jour les filtres
    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }))
    },

    // Réinitialiser les filtres
    resetFilters: () => {
        set({
            filters: {
                size: '',
                activityLevel: '',
                search: ''
            }
        })
    },

    // Effacer la selection
    clearSelectedBreed: () => {
        set({ selectedBreed: null })
    }
}))

export default useBreedsStore