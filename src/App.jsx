/* ════════════════════════════════════════
App.jsx
════════════════════════════════════════ */
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Notif Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layout
import MainLayout from './components/Layout/MainLayout'

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Pages
import Home from './pages/Home'
import BreedsPage from './pages/BreedsPage'
import BreedDetailPage from './pages/BreedDetailPage'
import CommunityPage from './pages/CommunityPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'


function App() {

    return (
        <BrowserRouter>

            {/* Notif Toast */}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            <Routes>
                {/* Routes public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Routes avec layout */}
                <Route element={<MainLayout />}>

                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/breeds" element={<BreedsPage />} />
                    <Route path="/breeds/:id" element={<BreedDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />

                    {/* Routes privées */}
                    <Route path="/community" element={
                        <ProtectedRoute>
                            <CommunityPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App