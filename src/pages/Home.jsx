/* ════════════════════════════════════════
pages/Home.jsx
════════════════════════════════════════ */

import { Link } from 'react-router-dom'
import { useAuthStore } from '../store'

function Home() {
    const { isAuthenticated } = useAuthStore()

    return (
        <div className="min-h-[calc(100vh-200px)]">

            {/* hero section */}
            <section className="py-16 md:py-24 relative overflow-hidden">

                <div className="absolute inset-0">
                    <img
                        src="/img/hero/hero_s.jpeg"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gd-body/62"></div>
                </div>

                <div className="relative z-10 max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gd-text mb-6">
                        <img
                            src="/logo/green-dog-W.svg"
                            alt="Green Dog logo"
                            className="inline-block h-39 mb-2" />
                    </h1>

                    <p className="text-lg md:text-xl text-gd-muted max-w-2xl mx-auto mb-8">
                        La plateforme pour découvrir, explorer et partager sur le monde canin.
                    </p>

                    {isAuthenticated ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/breeds"
                                className="px-6 py-3 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors"
                            >
                                Explorer les races
                            </Link>
                            <Link
                                to="/community"
                                className="px-6 py-3 rounded-xl bg-gd-blue text-white font-medium hover:bg-gd-blue/90 transition-colors"
                            >
                                Voir la communauté
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-6 py-3 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors"
                            >
                                Rejoindre la communauté
                            </Link>
                            <Link
                                to="/breeds"
                                className="px-6 py-3 rounded-xl border border-gd-border text-gd-text hover:bg-gd-surface-dark transition-colors"
                            >
                                Explorer les races
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Ft section */}
            <section className="py-16">
                <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Ft 1 */}
                        <div className="rounded-2xl border border-gd-border/50 p-6 transition hover:border-gd-border/80 hover:bg-gd-surface-dark/10">
                            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gd-border/50">
                                <svg className="h-5 w-5 text-gd-green/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <h3 className="text-base font-semibold text-gd-text">
                                Explorez les races
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-gd-muted">
                                Découvrez des informations détaillées de chiens avec filtres et recherche avancée.
                            </p>
                        </div>

                        {/* Ft 2 */}
                        <div className="rounded-2xl border border-gd-border/50 p-6 transition hover:border-gd-border/80 hover:bg-gd-surface-dark/10">

                            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gd-border/50">
                                <svg className="h-5 w-5 text-gd-blue/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>

                            <h3 className="text-base font-semibold text-gd-text">
                                Communauté active
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-gd-muted">
                                Partagez vos experiences, posez des questions et échangez avec d'autres passionnés.
                            </p>

                        </div>

                        {/* Ft 3 */}
                        <div className="rounded-2xl border border-gd-border/50 p-6 transition hover:border-gd-border/80 hover:bg-gd-surface-dark/10">

                            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gd-border/50">
                                <svg className="h-5 w-5 text-gd-cream/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>

                            <h3 className="text-base font-semibold text-gd-text">
                                Wiki collaboratif
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-gd-muted">
                                Contribuez à enrichir la base de connaissances sur les chiens de manière collaborative.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


            {/* CTA section pour utilisateurs non-connectés */}
            {!isAuthenticated && (
                <section className="py-16">
                    <div className="max-w-gd-page mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-gd-text mb-4">
                            Rejoindre la communauté ?
                        </h2>
                        <p className="text-gd-muted mb-8 max-w-xl mx-auto">
                            Créez votre compte gratuitement et commencez à partager vos connaissances sur les chiens.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-4 rounded-xl bg-gd-green text-gd-body font-medium text-lg hover:bg-gd-green/90 transition-colors"
                        >
                            Créer un compte
                        </Link>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Home