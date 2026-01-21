/* ════════════════════════════════════════
components/Auth/ProtectedRoute.jsx
════════════════════════════════════════ */

import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuthStore()
    const location = useLocation()

    // Affichage pendant le chargement
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gd-body flex items-center justify-center">
                <div className="text-gd-text text-lg">
                    Chargement...
                </div>
            </div>
        )
    }

    // Redirection vers login si non authentifie
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute