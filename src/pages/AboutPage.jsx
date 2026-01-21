/* ════════════════════════════════════════
pages/AboutPage.jsx
════════════════════════════════════════ */

function AboutPage() {
    return (
        <div className="py-8">

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <h1 className="text-3xl font-heading font-bold text-gd-text mb-8">
                    A propos de Green Dog
                </h1>

                <div className="space-y-8">

                    {/* Introduction */}
                    <section className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                        <h2 className="text-xl font-heading font-semibold text-gd-text mb-4">
                            Notre mission
                        </h2>
                        <p className="text-gd-muted leading-relaxed text-justify">
                            Green Dog est une plateforme collaborative dédiée aux passionnes de chiens.
                            L'objectif est de centraliser et partager des connaissances fiables sur
                            les races de chiens, tout en créant une communauté bienveillante ou chacun
                            peut apprendre et échanger.
                        </p>
                    </section>

                    {/* Public cible */}
                    <section className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                        <h2 className="text-xl font-heading font-semibold text-gd-text mb-4">
                            Pour qui?
                        </h2>
                        <ul className="space-y-3 text-gd-muted">

                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-gd-green mt-2"></span>
                                <span>
                                    Educateurs canins souhaitant partager leur experience
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-gd-green mt-2"></span>
                                <span>
                                    Associations et refuges cherchant à sensibiliser le public
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-gd-green mt-2"></span>
                                <span>
                                    Propriétaires de chiens désirant mieux comprendre leur compagnon
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-gd-green mt-2"></span>
                                <span>
                                    Curieux souhaitant découvrir le monde canin
                                </span>
                            </li>

                        </ul>
                    </section>

                    {/* Fonctionnalités */}
                    <section className="bg-gd-surface-dark rounded-2xl border border-gd-border p-6">
                        <h2 className="text-xl font-heading font-semibold text-gd-text mb-4">
                            Fonctionnalités
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gd-body">
                                <h3 className="font-semibold text-gd-text mb-2">
                                    Encyclopédie des races
                                </h3>
                                <p className="text-sm text-gd-muted">
                                    Fiches détaillées sur les caractéristiques, soins et santé de chaque race.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-gd-body">
                                <h3 className="font-semibold text-gd-text mb-2">
                                    Communauté
                                </h3>
                                <p className="text-sm text-gd-muted">
                                    Espace d'échange pour partager experiences et conseils.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-gd-body">
                                <h3 className="font-semibold text-gd-text mb-2">
                                    Recherche avancée
                                </h3>
                                <p className="text-sm text-gd-muted">
                                    Filtres par taille, niveau d'activité et autres critères.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-gd-body">
                                <h3 className="font-semibold text-gd-text mb-2">
                                    Profil personnalisé
                                </h3>
                                <p className="text-sm text-gd-muted">
                                    Gérez votre compte et vos contributions.
                                </p>
                            </div>

                        </div>
                    </section>

                </div>
            </div>
        </div>
    )
}

export default AboutPage