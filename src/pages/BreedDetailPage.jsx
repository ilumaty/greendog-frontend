/* ════════════════════════════════════════
pages/BreedDetailPage.jsx
════════════════════════════════════════ */

import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBreedsStore, useFavoritesStore, notificationStore, useAuthStore } from '../store'
import { DOG_SIZES, ACTIVITY_LEVELS } from '../utils/constants'
import breedsAPI from '../api/Breeds'


/* useParam récupère l'ID depuis l'URL */
function BreedDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { selectedBreed, isLoading, error, fetchBreedById, clearSelectedBreed } = useBreedsStore()
    const { favoriteIds, fetchFavorites, toggleFavorite } = useFavoritesStore()
    const { user } = useAuthStore()

    // Admin EDIT
    const [showEditModal, setShowEditModal] = useState(false)
    const [editLoading, setEditLoading] = useState(false)

    const [editBreed, setEditBreed] = useState({
        name: '',
        description: '',
        origin: '',
        size: '',
        activityLevel: '',
        imageUrl: '',
        weight_min: '',
        weight_max: '',
        height_min: '',
        height_max: '',
        lifeExpectancy_min: '',
        lifeExpectancy_max: '',
    })

    // Admin DELETE
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    /* Etat de chargement du bouton favoris */
    const [favLoading, setFavLoading] = useState(false)

    /* Etat de delete admin */
    const [deleteLoading, setDeleteLoading] = useState(false)

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

    /* Gestion EDIT via ADMIN */
    const handleOpenEdit = () => {
        if (user?.role !== 'admin') {
            notificationStore.error("Accès refusé.")
            return
        }

        setEditBreed({
            name: breed?.name || '',
            description: breed?.description || '',
            origin: breed?.origin || '',
            size: breed?.characteristics?.size || '',
            activityLevel: breed?.characteristics?.activityLevel || '',
            imageUrl: breed?.image?.url || '',

            weight_min: breed?.characteristics?.weight?.min || '',
            weight_max: breed?.characteristics?.weight?.max || '',
            height_min: breed?.characteristics?.height?.min || '',
            height_max: breed?.characteristics?.height?.max || '',
            lifeExpectancy_min: breed?.characteristics?.lifeExpectancy?.min || '',
            lifeExpectancy_max: breed?.characteristics?.lifeExpectancy?.max || '',
        })

        setShowEditModal(true)
    }

    const confirmEditBreed = async (e) => {
        e.preventDefault()

        if (!editBreed.name.trim() || !editBreed.description.trim() || !editBreed.size) {
            notificationStore.error('Nom, description et taille sont requis')
            return
        }

        setEditLoading(true)
        try {
            const payload = {
                name: editBreed.name.trim(),
                description: editBreed.description.trim(),

                ...(editBreed.origin.trim() ? { origin: editBreed.origin.trim() } : {}),

                characteristics: {
                    weight: {
                        min: parseFloat(editBreed.weight_min),
                        max: parseFloat(editBreed.weight_max)
                    },
                    height: {
                        min: parseFloat(editBreed.height_min),
                        max: parseFloat(editBreed.height_max)
                    },
                    lifeExpectancy: {
                        min: parseInt(editBreed.lifeExpectancy_min),
                        max: parseInt(editBreed.lifeExpectancy_max)
                    },
                    size: editBreed.size,
                    ...(editBreed.activityLevel ? { activityLevel: editBreed.activityLevel } : {}),
                },

                ...(editBreed.imageUrl.trim()
                        ? { image: { url: editBreed.imageUrl.trim(), alt: editBreed.name.trim() } }
                        : {}
                ),
            }

            await breedsAPI.update(id, payload)

            notificationStore.success('Race modifiée')
            setShowEditModal(false)

            await fetchBreedById(id)
        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de la modification'
            notificationStore.error(message)
        } finally {
            setEditLoading(false)
        }
    }

    /* Gestion DELETE via ADMIN */
    const handleDeleteBreed = async () => {
        // Sécurité UI
        if (user?.role !== 'admin') {
            notificationStore.error("Accès refusé.")
            return
        }
        setShowDeleteConfirm(true)
    }

    const confirmDeleteBreed = async () => {
        setDeleteLoading(true)
        try {
            await breedsAPI.delete(id)

            notificationStore.success('Race supprimée')
            navigate('/breeds')

        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de la suppression'
            notificationStore.error(message)

        } finally {
            setDeleteLoading(false)
            setShowDeleteConfirm(false)
        }
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
                                <img
                                    src="/logo/green-dog-W.svg"
                                    alt="Green Dog"
                                    className="h-14 opacity-60"
                                    style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.35))" }}
                                />
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

                                {user?.role === 'admin' && (
                                    <div className="ml-auto flex items-center gap-2">
                                        {/* Edit */}
                                        <button
                                            onClick={handleOpenEdit}
                                            title="Modifier la race"
                                            className="p-2 rounded-xl border border-gd-border bg-gd-body hover:bg-gd-surface-dark text-gd-text transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M11 4h-4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                                />
                                            </svg>
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={handleDeleteBreed}
                                            disabled={deleteLoading}
                                            title="Supprimer la race"
                                            className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-60"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a1 1 0 011-1h4a1 1 0 011 1v2"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                )}
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
                    {breed.care && (breed.care.grooming || breed.care.exercise || breed.care.diet) && (
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
                    {breed.care && (breed.care.grooming || breed.care.exercise || breed.care.diet) && (
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
                            {showEditModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                                    {/* overlay */}
                                    <div
                                        className="absolute inset-0 bg-black/60"
                                        onClick={() => !editLoading && setShowEditModal(false)}
                                    />

                                    {/* Edit modal */}
                                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gd-border bg-gd-surface-dark p-6 shadow-2xl">
                                        <h3 className="text-lg font-semibold text-gd-text mb-4">
                                            Modifier la race
                                        </h3>

                                        <form onSubmit={confirmEditBreed} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">Nom *</label>
                                                <input
                                                    type="text"
                                                    value={editBreed.name}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, name: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                    maxLength={50}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">Origine</label>
                                                <input
                                                    type="text"
                                                    value={editBreed.origin}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, origin: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">Taille *</label>
                                                <select
                                                    value={editBreed.size}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, size: e.target.value }))}
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
                                                    value={editBreed.activityLevel}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, activityLevel: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                >
                                                    <option value="">Sélectionner</option>
                                                    {ACTIVITY_LEVELS.map(level => (
                                                        <option key={level.value} value={level.value}>{level.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">
                                                    Poids (min) - kg
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={editBreed.weight_min}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, weight_min: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">
                                                    Poids (max) - kg
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={editBreed.weight_max}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, weight_max: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">
                                                    Taille (min) - cm
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={editBreed.height_min}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, height_min: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">
                                                    Taille (max) - cm
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={editBreed.height_max}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, height_max: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">
                                                    Espérance de vie (min) - ans
                                                </label>
                                                <input
                                                    type="number"
                                                    value={editBreed.lifeExpectancy_min}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, lifeExpectancy_min: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gd-muted mb-2">
                                                    Espérance de vie (max) - ans
                                                </label>
                                                <input
                                                    type="number"
                                                    value={editBreed.lifeExpectancy_max}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, lifeExpectancy_max: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gd-muted mb-2">URL de l'image</label>
                                                <input
                                                    type="text"
                                                    value={editBreed.imageUrl}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, imageUrl: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gd-muted mb-2">Description *</label>
                                                <textarea
                                                    value={editBreed.description}
                                                    onChange={(e) => setEditBreed(prev => ({ ...prev, description: e.target.value }))}
                                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text focus:outline-none focus:ring-2 focus:ring-gd-green/50 resize-none"
                                                    rows={5}
                                                    maxLength={2000}
                                                />
                                            </div>

                                            <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
                                                <button
                                                    type="button"
                                                    disabled={editLoading}
                                                    onClick={() => setShowEditModal(false)}
                                                    className="px-4 py-2 rounded-xl border border-gd-border bg-gd-body text-gd-text hover:bg-gd-surface-dark transition-colors disabled:opacity-60"
                                                >
                                                    Annuler
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={editLoading}
                                                    className="px-4 py-2 rounded-xl bg-gd-green text-gd-body hover:bg-gd-green/90 transition-colors disabled:opacity-60"
                                                >
                                                    {editLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* overlay */}
                        <div
                            className="absolute inset-0 bg-black/60"
                            onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
                        />

                        {/* Delete/Confirm ADMIN */}
                        <div className="relative w-full max-w-md rounded-2xl border border-gd-border bg-gd-surface-dark p-6 shadow-2xl">
                            <h3 className="text-lg font-semibold text-gd-text mb-2">
                                Supprimer cette race ?
                            </h3>

                            <p className="text-gd-muted text-sm mb-6">
                                Cette action est irréversible. La race <span className="text-gd-text font-medium">"{breed.name}"</span> sera supprimée définitivement.
                            </p>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 rounded-xl border border-gd-border bg-gd-body text-gd-text hover:bg-gd-surface-dark transition-colors disabled:opacity-60"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="button"
                                    disabled={deleteLoading}
                                    onClick={confirmDeleteBreed}
                                    className="px-4 py-2 rounded-xl bg-red-500/90 text-white hover:bg-red-500 transition-colors disabled:opacity-60"
                                >
                                    {deleteLoading ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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