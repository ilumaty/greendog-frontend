/* ════════════════════════════════════════
components/Layout/Footer.jsx
════════════════════════════════════════ */

import { Link } from 'react-router-dom'

function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gd-surface-dark border-t-0.3 border-gd-green/20 shadow-[0_-4px_20px_rgba(149,191,117,0.15)] mt-auto">
            <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Nav */}
                    <nav className="flex items-center gap-6">
                        <Link to="/breeds" className="text-gd-muted text-sm hover:text-gd-green transition-colors">
                            Races
                        </Link>
                        <Link to="/community" className="text-gd-muted text-sm hover:text-gd-green transition-colors">
                            Communauté
                        </Link>
                        <Link to="/about" className="text-gd-muted text-sm hover:text-gd-green transition-colors">
                            A propos
                        </Link>
                    </nav>

                    {/* Author */}
                    <p className="text-gd-muted text-sm">
                        © {currentYear} Green Dog - Léo Maxime Corfù
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer