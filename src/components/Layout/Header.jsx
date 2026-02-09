/* ════════════════════════════════════════
components/Layout/Header.jsx
════════════════════════════════════════ */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPen } from "lucide-react"
import { useAuthStore, notificationStore } from '../../store'


function Header() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        notificationStore.success('Déconnexion avec succès')
        navigate('/login')
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gd-surface-dark border-b border-gd-border">
            <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="flex items-center rounded-lg hover:opacity-80 transition">
                        <img
                            src="/logo/green-dog-W.svg"
                            alt="Green Dog"
                            className="h-25 w-25 rounded-lg object-contain"
                        />
                    </Link>

                    {/* Navigation desktop */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            to="/breeds"
                            className="text-gd-text hover:text-gd-green transition-colors"
                        >
                            Races
                        </Link>

                        {isAuthenticated && (
                            <Link
                                to="/community"
                                className="text-gd-text hover:text-gd-green transition-colors"
                            >
                                Communauté
                            </Link>
                        )}

                        <Link
                            to="/about"
                            className="text-gd-text hover:text-gd-green transition-colors"
                        >
                            A propos
                        </Link>

                        {/* Actions Admin */}
                        {user?.role === 'admin' && (
                            <Link to="/admin/users" className="text-gd-muted hover:text-gd-green transition-colors">
                                Gestion utilisateurs
                            </Link>
                        )}

                    </nav>

                    {/* Actions utilisateur */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 text-gd-text hover:text-gd-green transition-colors"
                                >
                                    <UserPen className="w-5 h-6 text-gd-muted" />
                                    <span className="hidden sm:inline">{user?.firstName || 'Profil'}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-xl bg-gd-border text-gd-text hover:bg-gd-surface-dark transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-xl text-gd-text hover:text-gd-green transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Menu mobile */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 text-gd-text"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menu mobile ouvert */}
                {menuOpen && (
                    <div className="md:hidden py-4 border-t border-gd-border">
                        <nav className="flex flex-col gap-3">
                            <Link
                                to="/breeds"
                                className="text-gd-text hover:text-gd-green transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                Races
                            </Link>

                            {isAuthenticated && (
                                <Link
                                    to="/community"
                                    className="text-gd-text hover:text-gd-green transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Communauté
                                </Link>
                            )}

                            <Link
                                to="/about"
                                className="text-gd-text hover:text-gd-green transition-colors"
                                onClick={() => setMenuOpen(false)}
                            >
                                A propos
                            </Link>

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin/users"
                                    className="text-gd-muted hover:text-gd-green transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Gestion utilisateurs
                                </Link>
                            )}

                            <div className="pt-3 border-t border-gd-border">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 text-gd-text hover:text-gd-green mb-3"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <UserPen className="w-4 h-4 group-hover:text-gd-green transition-colors" />
                                            <span>{user?.firstName || 'Profil'}</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout()
                                                setMenuOpen(false)
                                            }}
                                            className="w-full px-4 py-2 rounded-xl bg-gd-border text-gd-text"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 rounded-xl text-center text-gd-text border border-gd-border"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="px-4 py-2 rounded-xl text-center bg-gd-green text-gd-body font-medium"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Inscription
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header