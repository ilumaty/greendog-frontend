/* ════════════════════════════════════════
pages/NotFoundPage.jsx
════════════════════════════════════════ */

import { Link } from 'react-router-dom'
import Lottie from 'lottie-react'
import dogAnimation from '/src/assets/animation/404_cat.json'

function NotFoundPage() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="text-center px-4">

                {/* Animation Lottie */}
                <div className="w-64 h-64 mx-auto mb-8">
                    <Lottie
                        animationData={dogAnimation}
                        loop={true}
                    />
                </div>

                <h2 className="text-2xl font-heading font-semibold text-gd-text mb-4">
                    Wouff... Le chemin est introuvable.
                </h2>

                <p className="text-gd-muted mb-8 max-w-md mx-auto">
                    Cette piste ne mène à nulle part. Retournons à la niche.
                </p>

                <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-xl bg-gd-green text-gd-body font-medium hover:bg-gd-green/90 transition-colors"
                >
                    Retour à la niche
                </Link>

            </div>
        </div>
    )
}

export default NotFoundPage