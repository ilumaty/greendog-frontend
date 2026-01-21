/* ════════════════════════════════════════
pages/BreedsPage.jsx
════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreedsStore } from '../store'
import { DOG_SIZES, ACTIVITY_LEVELS } from '../utils/constants'

function BreedsPage() {
    const { breeds, filters, isLoading, error, fetchBreeds, setFilters, resetFilters } = useBreedsStore()
    const [searchQuery, setSearchQuery] = useState('')

    // Charger les races au montage
    useEffect(() => {
        void fetchBreeds()
    }, [fetchBreeds])

    // Breeds avec une valeur par défaut
    const safeBreeds = Array.isArray(breeds) ? breeds : []


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
                                                <svg className="w-16 h-16 text-gd-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
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