/* ════════════════════════════════════════
store/authStore.js
════════════════════════════════════════ */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authAPI from '../api/Auth'

const useAuthStore = create(
    persist(
        (set, get) => ({
            // état de base
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,

            // Connexion
            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await authAPI.login(email, password)
                    const { user, token } = response.data.data

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    })

                    return { success: true }
                } catch (error) {
                    const message = error.response?.data?.message || 'Erreur de connexion'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            // Inscription
            register: async (userData) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await authAPI.register(userData)
                    const { user, token } = response.data.data

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    })

                    return { success: true }
                } catch (error) {
                    const message = error.response?.data?.message || 'Erreur d\'inscription'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            // Récupère le profil depuis le serveur (validation du token + sync données)
            fetchProfile: async () => {
                const token = get().token

                // pas de token stocké = pas de requête
                if (!token) {
                    set({ isLoading: false })
                    return { success: false }
                }

                set({ isLoading: true })
                try {
                    const response = await authAPI.getProfile()
                    const { user } = response.data.data

                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false
                    })

                    return { success: true }
                } catch (error) {
                    // Si Token invalide ou expiré = déconnexion forcée
                    if (error.response?.status === 401) {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false
                        })
                    } else {
                        set ({ isLoading: false })
                    }
                    return { success: false }
                }
            },

            // Déconnexion
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                })
            },

            // MàJ partiellement l'user (merge)
            updateUser: (partialData) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...partialData } : null
                }))
            },


            // Set loading false après hydratation
            setHydrated: () => {
                set({ isLoading: false })
            },

            // Effacer les erreurs
            clearError: () => set({ error: null })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Si l'user semble connecté, vérifie le token
                    if (state.isAuthenticated && state.token) {
                        void state.fetchProfile()
                    } else {
                    state.setHydrated()
                    }
                }
            }
        }
    )
)

export default useAuthStore