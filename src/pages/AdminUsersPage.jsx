/* ════════════════════════════════════════
pages/AdminUsersPage.jsx
════════════════════════════════════════ */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, notificationStore } from '../store'
import usersAPI from '../api/Users'

const roles = [
    { value: 'user', label: 'Utilisateur' },
    { value: 'moderator', label: 'Modérateur' },
    { value: 'admin', label: 'Administrateur' },
]

function AdminUsersPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)

    /* Sécurité : redirige si non-admin */
    useEffect(() => {
        console.log('AdminUsersPage effect', { userRole: user?.role })

        if (!user) return

        if (user.role !== 'admin') {
            navigate('/')
            return
        }

        loadUsers()
    }, [user, navigate])

    /* Charge la liste des utilisateurs */
    const loadUsers = async () => {
        setIsLoading(true)
        try {
            const res  = await usersAPI.getAll()
            setUsers(res.data.users ?? [])
        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors du chargement'
            notificationStore.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    /* Modifie le rôle d'un utilisateur */
    const handleRoleChange = async (targetUserId, newRole) => {
        if (targetUserId === user._id) {
            notificationStore.error('Impossible de modifier votre propre rôle')
            return
        }

        setUpdatingId(targetUserId)
        try {
            const { data } = await usersAPI.updateRole(targetUserId, newRole)

            setUsers(prev =>
                prev.map(u => u._id === targetUserId ? data.user : u)
            )

            notificationStore.success('Rôle modifié')
        } catch (err) {
            const message = err.response?.data?.message || 'Erreur lors de la modification'
            notificationStore.error(message)
        } finally {
            setUpdatingId(null)
        }
    }

    /* Formatage date */
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-CH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-gd-muted">Chargement...</p>
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-heading font-bold text-gd-text mb-2">
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-gd-muted">
                        {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
                    </p>
                </div>

                {/* Tableau */}
                <div className="bg-gd-surface-dark rounded-2xl border border-gd-border overflow-hidden">

                    {/* En-tête desktop */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 border-b border-gd-border text-gd-muted text-sm">
                        <span className="col-span-3">Utilisateur</span>
                        <span className="col-span-3">Email</span>
                        <span className="col-span-2">Inscription</span>
                        <span className="col-span-2">Dernière connexion</span>
                        <span className="col-span-2">Rôle</span>
                    </div>

                    {/* Liste des utilisateurs */}
                    {users.map((u) => (
                        <div
                            key={u._id}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gd-border last:border-b-0 items-center"
                        >
                            {/* Nom */}
                            <div className="md:col-span-3 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gd-green/20 flex items-center justify-center text-gd-green text-sm font-semibold shrink-0">
                                    {u.firstName?.[0]}{u.lastName?.[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-gd-text text-sm font-medium truncate">
                                        {u.firstName} {u.lastName}
                                    </p>
                                    {u._id === user._id && (
                                        <span className="text-gd-green text-xs">Vous</span>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-3">
                                <span className="md:hidden text-gd-muted text-xs">Email : </span>
                                <span className="text-gd-muted text-sm truncate">{u.email}</span>
                            </div>

                            {/* Date inscription */}
                            <div className="md:col-span-2">
                                <span className="md:hidden text-gd-muted text-xs">Inscrit le : </span>
                                <span className="text-gd-muted text-sm">{formatDate(u.createdAt)}</span>
                            </div>

                            {/* Dernière connexion */}
                            <div className="md:col-span-2">
                                <span className="md:hidden text-gd-muted text-xs">Dernière connexion : </span>
                                <span className="text-gd-muted text-sm">
                                    {u.lastLogin ? formatDate(u.lastLogin) : 'Jamais'}
                                </span>
                            </div>

                            {/* Sélecteur de rôle */}
                            <div className="md:col-span-2">
                                {u._id === user._id ? (
                                    <span className="px-3 py-1.5 rounded-lg bg-gd-green/20 text-gd-green text-sm">
                                        {roles.find(r => r.value === u.role)?.label}
                                    </span>
                                ) : (
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                        disabled={updatingId === u._id}
                                        className="w-full px-3 py-1.5 rounded-lg bg-gd-body border border-gd-border text-gd-text text-sm focus:outline-none focus:ring-2 focus:ring-gd-green/50 disabled:opacity-60"
                                    >
                                        {roles.map(role => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* État vide */}
                    {users.length === 0 && (
                        <div className="px-6 py-12 text-center text-gd-muted">
                            Aucun utilisateur trouvé
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminUsersPage