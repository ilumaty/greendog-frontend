/* ════════════════════════════════════════
api/Users.js
════════════════════════════════════════ */

import api from './axiosInstance'

const usersAPI = {

    /* Récupère la liste de tous les utilisateurs (admin) */
    getAll: () => api.get('/admin/users'),

    /* Modifie le rôle d'un utilisateur (admin) */
    updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
}

export default usersAPI