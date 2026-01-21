/* ════════════════════════════════════════
pages/auth/RegisterPage.jsx
════════════════════════════════════════ */

import {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, notificationStore }  from '../../store'
import { validateRegisterForm, getPasswordStrength } from '../../utils/validation'

function RegisterPage() {
    const navigate = useNavigate()
    const { register, error, clearError, isLoading } = useAuthStore()

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' })

    // Nettoie l'erreur du store quand la page est quittée
    useEffect(() => {
        return () => clearError()
    }, [clearError])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Mise a jour de la force du mot de passe
        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value))
        }

        // Effacer l'erreur du champ modifie
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Effacer l'erreur globale du store
        if (error) clearError()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        const validation = validateRegisterForm(formData)
        if (!validation.isValid) {
            setErrors(validation.errors)
            return
        }

        // Tentative d'inscription
        const result = await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
        })

        if (result.success) {
            notificationStore.success('Inscription réussie, bienvenue !')
            navigate('/')
        } else {
            notificationStore.error(result.message || 'Erreur lors de l\'inscription')
        }
    }

    // Couleur de la barre de force du mot de passe
    const getStrengthColor = () => {
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']
        return colors[Math.min(passwordStrength.score, colors.length - 1)]
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
                        Créer un compte
                    </h1>
                    <p className="text-gd-muted">
                        Rejoignez la communauté Green Dog
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="bg-gd-surface-dark rounded-2xl p-6 border border-gd-border">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gd-text mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`
                  w-full px-4 py-3 rounded-xl bg-gd-body border text-gd-text
                  placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50
                  ${errors.firstName ? 'border-red-500' : 'border-gd-border'}
                `}
                                placeholder="Prénom"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gd-text mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`
                  w-full px-4 py-3 rounded-xl bg-gd-body border text-gd-text
                  placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50
                  ${errors.lastName ? 'border-red-500' : 'border-gd-border'}
                `}
                                placeholder="Nom"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

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

                    <div className="mb-4">
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
                            placeholder="Minimum 6 caractères"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )}

                        {/* Indicateur de force */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded ${
                                                level <= passwordStrength.score ? getStrengthColor() : 'bg-gd-border'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gd-muted">
                                    Force : {passwordStrength.label}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gd-text mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`
                w-full px-4 py-3 rounded-xl bg-gd-body border text-gd-text
                placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50
                ${errors.confirmPassword ? 'border-red-500' : 'border-gd-border'}
              `}
                            placeholder="Confirmer votre mot de passe"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Bouton d'inscription */}
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
                        {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
                    </button>
                </form>

                {/* Lien vers connexion */}
                <p className="mt-6 text-center text-gd-muted">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-gd-green hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage