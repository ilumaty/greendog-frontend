/* ════════════════════════════════════════
pages/ProfilePage.jsx
════════════════════════════════════════ */

import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useAuthStore, notificationStore  } from '../store'
import authAPI from '../api/Auth'

function ProfilePage() {
    const { user, updateUser } = useAuthStore()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        bio: user?.bio || ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {

            const response = await authAPI.updateProfile(formData)

            if (response.data?.data?.user) {
                updateUser(response.data.data.user)
            }
            notificationStore.success('Profil enregistré avec succès')
        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de la mise à jour'
            notificationStore.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            bio: user?.bio || ''
        })

        notificationStore.success('Formulaire bien remis à niveau initial!')
    }

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* Bouton croix */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-0 right-0 p-2 text-gd-muted hover:text-gd-text transition-colors"
                    aria-label="Fermer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h1 className="text-3xl font-heading font-bold text-gd-text mb-8">
                    Mon profil
                </h1>

                <div className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gd-border">
                        <div className="w-16 h-16 rounded-full bg-gd-green/20 flex items-center justify-center">
                            <span className="text-2xl font-semibold text-gd-green">
                                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gd-text">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <p className="text-gd-muted">{user?.email}</p>
                        </div>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gd-muted mb-2">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gd-muted mb-2">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Parlez de vous et de votre passion pour les chiens..."
                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50 resize-none"
                                />
                                <p className="text-xs text-gd-muted mt-1">
                                    {formData.bio.length}/500 caractères
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Rôle
                                </label>
                                <p className="px-4 py-3 rounded-xl bg-gd-body/50 text-gd-text capitalize">
                                    {user?.role || 'Utilisateur'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Membre depuis
                                </label>

                                <p className="px-4 py-3 rounded-xl bg-gd-body/50 text-gd-text">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 'Non disponible'}
                                </p>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-6 border-t border-gd-border flex justify-center gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 rounded-xl border border-gd-border text-gd-text hover:bg-gd-body transition-colors"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage