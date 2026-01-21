/* ════════════════════════════════════════
pages/BreedDetailPage.jsx
════════════════════════════════════════ */

import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBreedsStore, useFavoritesStore, notificationStore } from '../store'
import { DOG_SIZES, ACTIVITY_LEVELS } from '../utils/constants'


/* useParam récupère l'ID depuis l'URL */
function BreedDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { selectedBreed, isLoading, error, fetchBreedById, clearSelectedBreed } = useBreedsStore()
    const { favoriteIds, fetchFavorites, toggleFavorite } = useFavoritesStore()

    /* Etat de chargement du bouton favoris */
    const [favLoading, setFavLoading] = useState(false)

    const isFavorite = useMemo(() => {
        return favoriteIds.has(id)
    }, [favoriteIds, id])

    /* Charge-les donnees de la race via l'API & Récupère la liste des favoris utilisateur */
    useEffect(() => {
        fetchBreedById(id)
        fetchFavorites()

        return () => {
            clearSelectedBreed()
        }
    }, [id, fetchBreedById, clearSelectedBreed, fetchFavorites])

    /* Etat de chargement */
    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-gd-muted">
                    Chargement...
                </p>
            </div>
        )
    }

    /* Gestion erreur */
    if (error || !selectedBreed) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <p className="text-red-500 mb-4">
                    {error || 'Race non trouvée'}
                </p>
                <button
                    onClick={() => navigate('/breeds')}
                    className="px-4 py-2 rounded-xl bg-gd-green text-gd-body"
                >
                    Retour aux races
                </button>
            </div>
        )
    }

    const breed = selectedBreed

/* Gestion d'ajout et de retraits des favoris */
    const handleToggleFavorite = async () => {
        setFavLoading(true)

        const result = await toggleFavorite(id)

        if (!result.ok && result.reason === 'NO_TOKEN') {
            notificationStore.error('Nécessite une connexion pour ajouter aux favoris.')
            setFavLoading(false)
            return
        }

        if (result.ok) {
            result.isFavorite
                ? notificationStore.success('Ajouté aux favoris')
                : notificationStore.info('Retiré des favoris')

            const delta = result.isFavorite ? 1 : -1
            breed.favoriteCount = Math.max(0, (breed.favoriteCount || 0) + delta)
        }

        setFavLoading(false)
    }

    return (
        <div className="py-8">
            <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="mb-6">
                    <Link to="/breeds" className="text-gd-muted hover:text-gd-green transition-colors">
                        Races
                    </Link>
                    <span className="text-gd-muted mx-2">/</span>
                    <span className="text-gd-text">{breed.name}</span>
                </nav>

                {/* Header */}
                <div className="bg-gd-surface-dark rounded-2xl border border-gd-border overflow-hidden mb-8">
                    <div className="md:flex">

                        {/* Image */}
                        <div className="md:w-1/3 h-64 md:h-auto bg-gd-body flex items-center justify-center overflow-hidden">
                            {breed.image?.url ? (
                                <img
                                    src={breed.image.url}
                                    alt={breed.image.alt || breed.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <svg className="w-24 h-24 text-gd-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>

                        {/* Infos principales */}
                        <div className="md:w-2/3 p-6">
                            <h1 className="text-3xl font-heading font-bold text-gd-text mb-4">
                                {breed.name}
                            </h1>

                            <p className="text-gd-muted mb-6">
                                {breed.description}
                            </p>

                            <div className="flex items-center gap-3 mb-6">
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={favLoading}
                                    className="px-4 py-2 rounded-xl border border-gd-border bg-gd-body hover:bg-gd-surface-dark transition-colors text-gd-text disabled:opacity-60"
                                >
                                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                </button>

                                <span className="text-gd-muted text-sm">
                                    {breed.favoriteCount || 0} favoris
                              </span>
                            </div>


                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {breed.origin && (
                                    <span className="px-3 py-1 rounded-full bg-gd-blue/20 text-gd-blue text-sm">
                    Origine : {breed.origin}
                  </span>
                                )}
                                {breed.characteristics?.size && (
                                    <span className="px-3 py-1 rounded-full bg-gd-green/20 text-gd-green text-sm">
                    Taille : {DOG_SIZES.find(s => s.value === breed.characteristics.size)?.label}
                  </span>
                                )}
                                {breed.characteristics?.activityLevel && (
                                    <span className="px-3 py-1 rounded-full bg-gd-cream/20 text-gd-cream text-sm">
                    Activité : {ACTIVITY_LEVELS.find(l => l.value === breed.characteristics.activityLevel)?.label}
                  </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Caractéristiques */}
                    {breed.characteristics && (
                        <div className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                            <h2 className="text-xl font-heading font-semibold text-gd-text mb-4">
                                Caractéristiques
                            </h2>

                            <dl className="space-y-3">
                                {breed.characteristics.weight && (
                                    <div className="flex justify-between">
                                        <dt className="text-gd-muted">Poids</dt>
                                        <dd className="text-gd-text">
                                            {breed.characteristics.weight.min} - {breed.characteristics.weight.max} kg
                                        </dd>
                                    </div>
                                )}
                                {breed.characteristics.height && (
                                    <div className="flex justify-between">
                                        <dt className="text-gd-muted">Taille</dt>
                                        <dd className="text-gd-text">
                                            {breed.characteristics.height.min} - {breed.characteristics.height.max} cm
                                        </dd>
                                    </div>
                                )}
                                {breed.characteristics.lifeExpectancy && (
                                    <div className="flex justify-between">
                                        <dt className="text-gd-muted">Esperance de vie</dt>
                                        <dd className="text-gd-text">
                                            {breed.characteristics.lifeExpectancy.min} - {breed.characteristics.lifeExpectancy.max} ans
                                        </dd>
                                    </div>
                                )}
                                {breed.characteristics.temperament && (
                                    <div>
                                        <dt className="text-gd-muted mb-2">Temperament</dt>
                                        <dd className="flex flex-wrap gap-1">
                                            {breed.characteristics.temperament.map((trait, index) => (
                                                <span key={index} className="px-2 py-1 text-xs rounded-full bg-gd-body text-gd-text">
                          {trait}
                        </span>
                                            ))}
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    )}

                    {/* Soins */}
                    {breed.care && (
                        <div className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                            <h2 className="text-xl font-heading font-semibold text-gd-text mb-4">
                                Soins
                            </h2>

                            <dl className="space-y-4">
                                {breed.care.grooming && (
                                    <div>
                                        <dt className="text-gd-green text-sm mb-1">
                                            Toilettage
                                            </dt>
                                        <dd className="text-gd-muted text-sm">{breed.care.grooming}</dd>
                                    </div>
                                )}
                                {breed.care.exercise && (
                                    <div>
                                        <dt className="text-gd-green text-sm mb-1">Exercice</dt>
                                        <dd className="text-gd-muted text-sm">{breed.care.exercise}</dd>
                                    </div>
                                )}
                                {breed.care.diet && (
                                    <div>
                                        <dt className="text-gd-green text-sm mb-1">Alimentation</dt>
                                        <dd className="text-gd-muted text-sm">{breed.care.diet}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    )}

                    {/* Santé */}
                    {breed.health && (
                        <div className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6 md:col-span-2">
                            <h2 className="text-xl font-heading font-semibold text-gd-text mb-4">
                                Santé
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {breed.health.commonIssues && breed.health.commonIssues.length > 0 && (
                                    <div>
                                        <h3 className="text-gd-muted text-sm mb-2">
                                            Problèmes courants
                                        </h3>
                                        <ul className="space-y-1">
                                            {breed.health.commonIssues.map((issue, index) => (
                                                <li key={index} className="text-gd-text text-sm flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {breed.health.preventiveCare && (
                                    <div>
                                        <h3 className="text-gd-muted text-sm mb-2">
                                            Soins préventifs
                                        </h3>
                                        <p className="text-gd-text text-sm">{breed.health.preventiveCare}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bouton retour */}
                <div className="mt-8">
                    <Link
                        to="/breeds"
                        className="inline-flex items-center gap-2 text-gd-muted hover:text-gd-green transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour aux races
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BreedDetailPage