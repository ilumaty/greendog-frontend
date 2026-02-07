/* ════════════════════════════════════════
components/Layout/MainLayout.jsx
════════════════════════════════════════ */
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/**
 * Restaure le scroll en haut de page à chaque recharge de route.
 */
function ScrollRestoration() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, [pathname])

    return null
}

function MainLayout() {
    return (
        <div className="min-h-screen bg-gd-body flex flex-col">

            {/*
                Lien d'accessibilité visible uniquement au focus clavier TAB.
                */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
                           focus:z-60 focus:px-4 focus:py-2 focus:rounded-xl
                           focus:bg-gd-blue focus:text-white focus:outline-none
                           focus:ring-2 focus:ring-gd-green"
            >
                Aller au contenu principal
            </a>

            <ScrollRestoration />

            <Header />

            <main
                id="main-content"
                className="pt-16 flex-1"
                tabIndex={-1}
            >
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default MainLayout