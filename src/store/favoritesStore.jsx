/* ════════════════════════════════════════
store/favoritesStore.js
════════════════════════════════════════ */

import { create } from 'zustand'
import api from '../api/axiosInstance'

const useFavoritesStore = create((set, get) => ({ // Store favoris
    favoriteIds: new Set(),
    isLoading: false,
    error: null,

    fetchFavorites: async () => {
        try {
            set({ isLoading: true, error: null })
            const res = await api.get('/dogs/favorites')
            const ids = (res.data?.data?.favorites || []).map((b) => b._id)
            set({ favoriteIds: new Set(ids), isLoading: false })
        } catch (e) {

            set({ isLoading: false, error: 'Impossible de charger les favoris' })
        }
    },

    toggleFavorite: async (breedId) => {
        try {
            const isFav = get().favoriteIds.has(breedId)

            set((state) => {
                const next = new Set(state.favoriteIds)
                if (next.has(breedId)) next.delete(breedId)
                else next.add(breedId)
                return { favoriteIds: next }
            })

            if (isFav) {
                await api.delete(`/dogs/favorites/${breedId}`)
                return { ok: true, isFavorite: false }
            }

            await api.post(`/dogs/favorites/${breedId}`)
            return { ok: true, isFavorite: true }
        } catch (e) {

            set((state) => {
                const rollback = new Set(state.favoriteIds)
                if (rollback.has(breedId)) rollback.delete(breedId)
                else rollback.add(breedId)
                return { favoriteIds: rollback }
            })

            if (e.response?.status === 401) {
                return { ok: false, reason: 'NO_TOKEN' }
            }

            return { ok: false, reason: 'API_ERROR' }
        }
    },
}))

export default useFavoritesStore
