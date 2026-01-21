/* ════════════════════════════════════════
api/Posts.js
════════════════════════════════════════ */

import api from './axiosInstance'

const postsAPI = {
    // Récupérer tous les posts
    getAll: (params = {}) => {
        return api.get('/posts', { params })
    },

    // Récupérer un post par son ID
    getById: (id) => {
        return api.get(`/posts/${id}`)
    },

    // Créer un nouveau post
    create: (postData) => {
        return api.post('/posts', postData)
    },

    // Modifier un post
    update: (id, postData) => {
        return api.put(`/posts/${id}`, postData)
    },

    // Supprimer un post
    delete: (id) => {
        return api.delete(`/posts/${id}`)
    },

    // Ajouter un commentaire
    addComment: (postId, content) => {
        return api.post(`/posts/${postId}/comments`, { content })
    },

    // Supprimer un commentaire
    deleteComment: (postId, commentId) => {
        return api.delete(`/posts/${postId}/comments/${commentId}`)
    }
}

export default postsAPI