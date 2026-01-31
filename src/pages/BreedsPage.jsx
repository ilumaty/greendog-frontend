/* ════════════════════════════════════════
pages/BreedsPage.jsx
════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreedsStore, useAuthStore, notificationStore } from '../store'
import { DOG_SIZES, ACTIVITY_LEVELS } from '../utils/constants'
import breedsAPI from '../api/Breeds'

function BreedsPage() {
    const { user } = useAuthStore()
    const { breeds, filters, isLoading, error, fetchBreeds, setFilters, resetFilters } = useBreedsStore()
    const [searchQuery, setSearchQuery] = useState('')

    // Admin, add race
    const [showAddForm, setShowAddForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newBreed, setNewBreed] = useState({
        name: '',
        description: '',
        origin: '',
        size: '',
        activityLevel: '',
        imageUrl: ''
    })

    // Charger les races au montage
    useEffect(() => {
        void fetchBreeds()
    }, [fetchBreeds])

    // Breeds avec une valeur par défaut
    const safeBreeds =
        Array.isArray(breeds) ? breeds
            : Array.isArray(breeds?.breeds) ? breeds.breeds
                : []


    // Filtrer par recherche locale
    const filteredBreeds = safeBreeds.filter(breed => {
        const matchesSearch = breed.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSize = !filters.size || breed.characteristics?.size === filters.size
        const matchesActivity = !filters.activityLevel || breed.characteristics?.activityLevel === filters.activityLevel
        return matchesSearch && matchesSize && matchesActivity
    })

    const handleFilterChange = (key, value) => {
        setFilters({ [key]: value })
    }

    const handleReset = () => {
        setSearchQuery('')
        resetFilters()
    }

    // Admin soumets une nouvelle race
    const handleSubmitBreed = async (e) => {
        e.preventDefault()

        if (!newBreed.name.trim() || !newBreed.description.trim() || !newBreed.size) {
            notificationStore.error('Nom, description et taille sont requis')
            return
        }

        setIsSubmitting(true)
        try {
            const breedData = {
                name: newBreed.name.trim(),
                description: newBreed.description.trim(),
                origin: newBreed.origin.trim() || null,
                characteristics: {
                    size: newBreed.size,
                    activityLevel: newBreed.activityLevel || null
                },
                image: newBreed.imageUrl ? {
                    url: newBreed.imageUrl,
                    alt: newBreed.name
                } : null
            }

            await breedsAPI.create(breedData)
            notificationStore.success('Race ajoutée')
            setNewBreed({ name: '', description: '', origin: '', size: '', activityLevel: '', imageUrl: '' })
            setShowAddForm(false)
            await fetchBreeds()

        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de l\'ajout'
            notificationStore.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="py-8">
            <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gd-text mb-2">
                        Explorer les races
                    </h1>
                    <p className="text-gd-muted">
                        Découvrez les caractéristiques de chaque race de chien
                    </p>
                </div>

                {/* Bouton admin */}
                {user?.role === 'admin' && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="mb-8 px-4 py-2 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors"
                    >
                        {showAddForm ? 'Annuler' : 'Ajouter une race'}
                    </button>
                )}

            {/* Formulaire admin */}
            {showAddForm && user?.role === 'admin' && (
                <form
                    onSubmit={handleSubmitBreed}
                    className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gd-text mb-4">
                        Ajouter une nouvelle race
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gd-muted mb-2">Nom *</label>
                            <input
                                type="text"
                                value={newBreed.name}
                                onChange={(e) => setNewBreed(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                placeholder="Golden Retriever"
                                maxLength={50}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gd-muted mb-2">Origine</label>
                            <input
                                type="text"
                                value={newBreed.origin}
                                onChange={(e) => setNewBreed(prev => ({ ...prev, origin: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                placeholder="Royaume-Uni"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gd-muted mb-2">Taille *</label>
                            <select
                                value={newBreed.size}
                                onChange={(e) => setNewBreed(prev => ({ ...prev, size: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                            >
                                <option value="">Sélectionner</option>
                                {DOG_SIZES.map(size => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gd-muted mb-2">Niveau d'activité</label>
                            <select
                                value={newBreed.activityLevel}
                                onChange={(e) => setNewBreed(prev => ({ ...prev, activityLevel: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                            >
                                <option value="">Sélectionner</option>
                                {ACTIVITY_LEVELS.map(level => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gd-muted mb-2">URL de l'image</label>
                            <input
                                type="url"
                                value={newBreed.imageUrl}
                                onChange={(e) => setNewBreed(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                placeholder="https://exemple.com/image.jpg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gd-muted mb-2">Description *</label>
                            <textarea
                                value={newBreed.description}
                                onChange={(e) => setNewBreed(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50 resize-none"
                                placeholder="Description de la race..."
                                rows={4}
                                maxLength={2000}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mt-4 px-6 py-3 rounded-xl font-medium text-gd-body transition-colors ${
                            isSubmitting ? 'bg-gd-green/50 cursor-not-allowed' : 'bg-gd-green hover:bg-gd-green/90'
                        }`}
                    >
                        {isSubmitting ? 'Ajout...' : 'Ajouter la race'}
                    </button>
                </form>
            )}

                {/* Filtres */}
                <div className="bg-gd-surface-dark rounded-2xl p-4 border border-gd-border mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Recherche */}
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher une race..."
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                            />
                        </div>

                        {/* Filtre taille */}
                        <div>
                            <select
                                value={filters.size}
                                onChange={(e) => handleFilterChange('size', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                            >
                                <option value="">
                                    Toutes les tailles
                                </option>
                                {DOG_SIZES.map(size => (
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre activité */}
                        <div>
                            <select
                                value={filters.activityLevel}
                                onChange={(e) => handleFilterChange('activityLevel', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                            >
                                <option value="">
                                    Tous niveaux d'activité
                                </option>
                                {ACTIVITY_LEVELS.map(level => (
                                    <option key={level.value} value={level.value}>{level.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Bouton reset */}
                    {(searchQuery || filters.size || filters.activityLevel) && (
                        <button
                            onClick={handleReset}
                            className="mt-4 text-sm text-gd-muted hover:text-gd-green transition-colors"
                        >
                            Reset les filtres
                        </button>
                    )}
                </div>

                {/* Etat de chargement */}
                {isLoading && (
                    <div className="text-center py-12">
                        <p className="text-gd-muted">
                            Chargement des races...
                        </p>
                    </div>
                )}

                {/* Erreur */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={() => fetchBreeds()}
                            className="mt-4 px-4 py-2 rounded-xl bg-gd-green text-gd-body"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {/* Liste des races */}
                {!isLoading && !error && (
                    <>
                        <p className="text-gd-muted mb-4">
                            {filteredBreeds.length} race(s) trouvée(s)
                        </p>

                        {filteredBreeds.length === 0 ? (
                            <div className="text-center py-12 bg-gd-surface-dark rounded-2xl border border-gd-border">
                                <p className="text-gd-muted">
                                    Aucune race ne correspond a vos critères
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredBreeds.map(breed => (
                                    <Link
                                        key={breed._id}
                                        to={`/breeds/${breed._id}`}
                                        className="bg-gd-surface-dark rounded-2xl border border-gd-border overflow-hidden hover:border-gd-green/50 transition-colors group"
                                    >
                                        {/* Image de la race */}
                                        <div className="h-48 bg-gd-body flex items-center justify-center overflow-hidden">
                                            {breed.image?.url ? (
                                                <img
                                                    src={breed.image.url}
                                                    alt={breed.image.alt || breed.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <img
                                                    src="/logo/green-dog-W.svg"
                                                    alt="Green Dog"
                                                    className="h-14 opacity-60"
                                                    style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.35))" }}
                                                />
                                            )}
                                        </div>

                                        {/* Contenu */}
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gd-text group-hover:text-gd-green transition-colors mb-2">
                                                {breed.name}
                                            </h3>

                                            <p className="text-sm text-gd-muted line-clamp-2 mb-3">
                                                {breed.description}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {breed.characteristics?.size && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gd-green/20 text-gd-green">
                            {DOG_SIZES.find(s => s.value === breed.characteristics.size)?.label}
                          </span>
                                                )}
                                                {breed.origin && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-gd-blue/20 text-gd-blue">
                            {breed.origin}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default BreedsPage