/* ════════════════════════════════════════
pages/auth/LoginPage.jsx
════════════════════════════════════════ */

import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore, notificationStore } from '../../store'
import { validateLoginForm } from '../../utils/validation'

function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, error, clearError, isLoading, isAuthenticated } = useAuthStore()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({})

    // Redirection après connexion
    const from = location.state?.from?.pathname || '/'

    // Si déjà authentifié, rediriger immédiatement
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, from])

    // Nettoie l'erreur du store quand la page est quittée
    useEffect(() => {
        return () => clearError()
    }, [clearError])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        if (error) clearError()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        const validation = validateLoginForm(formData)
        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        // Tentative de connexion
        const result = await login(formData.email, formData.password)

        if (result.success) {
            notificationStore.success('Connexion réussie')
            navigate(from, { replace: true })
        } else {
            notificationStore.error(result.message || 'Erreur de connexion')
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md relative">

                {/* Bouton croix */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute -top-2 -right-2 p-2 text-gd-muted hover:text-gd-text transition-colors"
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

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gd-text mb-2">
                        Connexion
                    </h1>
                    <p className="text-gd-muted">
                        Connectez-vous pour accéder a votre compte
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="bg-gd-surface-dark rounded-2xl p-6 border border-gd-border">

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gd-text mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`
                                w-full px-4 py-3 rounded-xl bg-gd-body border text-gd-text
                                placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50
                                ${errors.email ? 'border-red-500' : 'border-gd-border'}
                            `}
                            placeholder="votre@email.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gd-text mb-2">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`
                                w-full px-4 py-3 rounded-xl bg-gd-body border text-gd-text
                                placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50
                                ${errors.password ? 'border-red-500' : 'border-gd-border'}
                            `}
                            placeholder="Votre mot de passe"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                            w-full py-3 rounded-xl font-medium text-gd-body transition-colors
                            ${isLoading
                            ? 'bg-gd-green/50 cursor-not-allowed'
                            : 'bg-gd-green hover:bg-gd-green/90'
                        }
                        `}
                    >

                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                {/* Lien vers inscription */}
                <p className="mt-6 text-center text-gd-muted">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-gd-green hover:underline">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage