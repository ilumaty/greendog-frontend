/* ════════════════════════════════════════
pages/CommunityPage.jsx
════════════════════════════════════════ */

import {useState, useEffect, useCallback} from 'react'
import {useAuthStore, notificationStore} from '../store'
import postsAPI from '../api/Posts'


function CommunityPage() {
    const { user } = useAuthStore()

    // Listes des posts
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Create posts
    const [showNewPostForm, setShowNewPostForm] = useState(false)
    const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)


    // Edit posts
    const [editingPost, setEditingPost] = useState(null) // post complet pour reprendre _id
    const [editForm, setEditForm] = useState({ title : '', content: '', tags: ''})
    const [isUpdating, setIsUpdating] = useState(false)

    // Load des posts
    const loadPosts = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await postsAPI.getAll()
            setPosts(response.data.data.posts || [])
        } catch (err) {
            notificationStore.error('Erreur lors du chargement des posts')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadPosts()
    }, [loadPosts])

    // Soumettre le nouveau post
    const handleSubmitPost = async (e) => {
        e.preventDefault()

        if (!newPost.title.trim() || !newPost.content.trim()) {
            notificationStore.error('Titre et contenu requis')
            return
        }

        if (newPost.content.trim().length < 10) {
            notificationStore.error('Le contenu doit contenir au moins 10 caractères')
            return
        }

        setIsSubmitting(true)
        try {
            const postData = {
                title: newPost.title,
                content: newPost.content,
                tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            }

            await postsAPI.create(postData)

            notificationStore.success('Post publié')
            setNewPost({ title: '', content: '', tags: '' })
            setShowNewPostForm(false)
            await loadPosts()

        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de la publication'
            notificationStore.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Ouvrir l'édition
    const handleEditClick = (post) => { // stock le post au complet pour avoir _id
        setEditingPost(post)
        // pré-remplit le form avec les données du post
        setEditForm({
            title: post.title,
            content: post.content,
            tags: post.tags.join(', ') // tableau en STRING converti
        })
    }

    // Fermer l'édition
    const handleCloseEditPost = () => {
        setEditingPost(null)
        setEditForm({ title: '', content: '', tags: '' })
    }

    // Soumet la modification
    const handleUpdatePost = async (e) => {
        e.preventDefault()

        if (!editForm.title.trim() || !editForm.content.trim()) {
            notificationStore.error('Titre et contenu requis')
            return
        }

        if (editForm.content.trim().length < 10 ) {
            notificationStore.error('Le contenu doit contenir au moins 10 caractères')
            return
        }

        setIsUpdating(true)
        try {
            const postData = {
                title: editForm.title,
                content: editForm.content,
                tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            }

            await postsAPI.update(editingPost._id, postData)
            notificationStore.success('Post modifié')
            handleCloseEditPost()
            await loadPosts()

        }  catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de la modification'
            notificationStore.error(message)
        } finally {
            setIsUpdating(false)
        }
    }

// stocke l'ID du post à supprimer
    const [deleteConfirm, setDeleteConfirm] = useState(null)


    // Delete
    const handleDeletePost = async () => {
        if (!deleteConfirm) return

        try {
            await postsAPI.delete(deleteConfirm)
            notificationStore.success('Post supprimé')
            setDeleteConfirm(null)
            await loadPosts()
        } catch {
            notificationStore.error('Erreur lors de la suppression')
        }
    }


    // Formate date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }


    // RENDER
    return (
        <div className="py-8">
            <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8">

                {/*
                    édition (overlay)
                 */}
                {editingPost && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">

                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleCloseEditPost}
                        />

                        <div className="relative z-10 w-full max-w-2xl mx-4 bg-gd-surface-dark rounded-2xl border border-gd-border p-6 max-h-[90vh] overflow-y-auto">

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gd-text">
                                    Modifier le post
                                </h2>
                                <button
                                    onClick={handleCloseEditPost}
                                    className="p-2 text-gd-muted hover:text-gd-text transition-colors"
                                    aria-label="Fermer"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Formulaire d'édition */}
                            <form onSubmit={handleUpdatePost} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gd-muted mb-2">Titre</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                        placeholder="Titre de votre post"
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gd-muted mb-2">
                                        Contenu
                                    </label>
                                    <textarea
                                        value={editForm.content}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50 resize-none"
                                        placeholder="Partagez votre expérience..."
                                        rows={5}
                                        maxLength={5000}
                                    />
                                    <p className="text-xs text-gd-muted mt-1">
                                        {editForm.content.length}/5000 caractères
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gd-muted mb-2">
                                        Tags (séparés par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                        placeholder="éducation, santé, comportement..."
                                    />
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex gap-3 pt-4 border-t border-gd-border">
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className={`px-6 py-3 rounded-xl font-medium text-gd-body transition-colors ${
                                            isUpdating ? 'bg-gd-green/50 cursor-not-allowed' : 'bg-gd-green hover:bg-gd-green/90'
                                        }`}
                                    >
                                        {isUpdating ? 'Modification...' : 'Enregistrer'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseEditPost}
                                        className="px-6 py-3 rounded-xl border border-gd-border text-gd-text hover:bg-gd-body transition-colors"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Confirmation de DELETE */}
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setDeleteConfirm(null)}
                        />
                        <div className="relative z-10 w-full max-w-md mx-4 bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                            <h2 className="text-xl font-semibold text-gd-text mb-2">
                                Supprimer le post
                            </h2>
                            <p className="text-gd-muted mb-6">
                                Voulez-vous vraiment supprimer ce post ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeletePost}
                                    className="px-6 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                                >
                                    Supprimer
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-6 py-3 rounded-xl border border-gd-border text-gd-text hover:bg-gd-body transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/*
                    HEADER
                 */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gd-text mb-2">
                            Communauté
                        </h1>
                        <p className="text-gd-muted">
                            Partagez vos expériences et échangez avec d'autres passionnés
                        </p>
                    </div>

                    <button
                        onClick={() => setShowNewPostForm(!showNewPostForm)}
                        className="px-4 py-2 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors"
                    >
                        {showNewPostForm ? 'Annuler' : 'Nouveau post'}
                    </button>
                </div>


                {showNewPostForm && (
                    <form onSubmit={handleSubmitPost} className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gd-text mb-4">
                            Créer un nouveau post
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                    placeholder="Titre de votre post"
                                    maxLength={100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Contenu
                                </label>
                                <textarea
                                    value={newPost.content}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50 resize-none"
                                    placeholder="Partagez votre expérience..."
                                    rows={5}
                                    maxLength={5000}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gd-muted mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={newPost.tags}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gd-body border border-gd-border text-gd-text placeholder-gd-muted focus:outline-none focus:ring-2 focus:ring-gd-green/50"
                                    placeholder="éducation, santé, comportement..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-3 rounded-xl font-medium text-gd-body transition-colors ${
                                    isSubmitting ? 'bg-gd-green/50 cursor-not-allowed' : 'bg-gd-green hover:bg-gd-green/90'
                                }`}
                            >
                                {isSubmitting ? 'Publication...' : 'Publier'}
                            </button>
                        </div>
                    </form>
                )}

                {/*
                    LISTE DES POSTS
                */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gd-muted">Chargement des posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-gd-surface-dark rounded-2xl border border-gd-border">
                        <p className="text-gd-muted mb-4">Aucun post pour le moment</p>
                        <p className="text-gd-muted text-sm">Soyez le premier à partager quelque chose !</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <article key={post._id} className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gd-text mb-1">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-gd-muted">
                                            Par {post.author?.firstName || 'Anonyme'} - {formatDate(post.createdAt)}
                                        </p>
                                    </div>

                                    {/*
                                        BOUTONS MODIFIER + SUPPRIMER
                                        (visibles uniquement pour l'auteur)
                                        */}
                                    {user && post.author?._id === user._id && (
                                        <div className="flex items-center gap-2">
                                            {/* Bouton Modifier (crayon) */}
                                            <button
                                                onClick={() => handleEditClick(post)}
                                                className="p-2 text-gd-muted hover:text-gd-blue transition-colors"
                                                title="Modifier"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>

                                            {/* Bouton Supprimer */}
                                            <button
                                                onClick={() => setDeleteConfirm(post._id)}
                                                className="p-2 text-gd-muted hover:text-red-500 transition-colors"
                                                title="Supprimer"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-gd-text whitespace-pre-wrap mb-4">
                                    {post.content}
                                </p>

                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-gd-blue/20 text-gd-blue">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommunityPage